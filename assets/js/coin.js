const widgetConfig1 = {
    'symbol': 'BINANCE:BTCUSDT',
    'width': '100%',
    'isTransparent': true,
    'colorTheme': "dark",
    'locale': 'en'
}

const widgetConfig2 = {
    'symbols' : [
        [
            "BINANCE:BTCUSDT|1D"
        ]
    ],
    'chartOnly': false,
    'width': '100%',
    'height': '100%',
    'locale': 'en',
    'colorTheme': 'dark',
    'autosize': true,
    'showVolume': false,
    'showMA': false,
    'hideDateRanges': false,
    'hideMarketStatus': false,
    'hideSymbolLogo': true,
    'scalePosition': 'right',
    'scaleMode': 'Normal',
    'fontFamily': '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
    'fontSize': '10',
    'noTimeScale': false,
    'valuesTracking': '1',
    'changeMode': 'price-and-percent',
    'chartType': 'area',
    'maLineColor': '#2962FF',
    'maLineWidth': 1,
    'maLength': 9,
    'headerFontSize': 'medium',
    'backgroundColor': 'rgba(14, 18, 24, 1)',
    'gridLineColor': 'rgba(76, 175, 80, 0.06)',
    'lineWidth': 2,
    'lineType': 0,
    'dateRanges': [
        '1d|15',
        '1m|30',
        '3m|60',
        '12m|1D',
        '60m|1W',
        'all|1M'
    ],
    'dateFormat': 'yyyy-MM-dd'
}

document.addEventListener('DOMContentLoaded', () => {
    
    const params = new URLSearchParams(window.location.search);
    const query = params.get('coin');

    if(query){
        fetchCoinInfo(query);
    }else{
        window.location.href = '/../../index.html';
    }
});

async function fetchCoinInfo(query){
    const coinInfoError = document.getElementById('coin-info-error');
    coinInfoError.style.display = 'none';
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${query}`;

    try{
        const response = await fetch(apiUrl);
        if(!response.ok) throw new Error('API limit reached.');
        const data = await response.json();
        widgetConfig1.symbol = `MEXC:${data.symbol.toUpperCase()}USDT`;

        widgetConfig2.symbols = [
            [`MEXC:${data.symbol.toUpperCase()}USDT|1D`]
        ];

        initializeWidget();
        displayCoinInfo(data);
    } catch(error){
        coinInfoError.style.display = 'flex';
        console.log(error);
    }
}

function initializeWidget(){
    const themeConfig = getThemeConfig();
    widgetConfig1.colorTheme = themeConfig.theme;
    widgetConfig2.colorTheme = themeConfig.theme;
    widgetConfig2.backgroundColor = themeConfig.backgroundColor;
    widgetConfig2.gridLineColor = themeConfig.gridLineColor;

    createWidget('ticker-widget', widgetConfig1,'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js');
    
}