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
    createWidget('mini-chart-widget', widgetConfig2, 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js')
}

function displayCoinInfo(coin){
    const coinInfo = document.querySelector('.coin-info');
    const rightSec = document.querySelector('.coin-container .right-section');
    const coinDesc = document.getElementById('coin-desc-p');

    coinInfo.innerHTML = `
                    <div class="logo">
                        <img src="${coin.image.thumb}" alt="${coin.name}">
                        <h4>${coin.name} <span>(${coin.symbol.toUpperCase()})</span></h4>
                        <p>#${coin.market_cap_rank}</p>
                    </div>

                    <div class="status">

                        <div class="item">
                            <p class="str">Market Cap</p>
                            <p class="num">$${coin.market_data.market_cap.usd != null ? coin.market_data.market_cap.usd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : "N/A"}</p>
                        </div>
                        <div class="item">
                            <p class="str">Current Price</p>
                            <p class="num">$${coin.market_data.current_price.usd != null ? coin.market_data.current_price.usd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : "N/A"}</p>
                        </div>
                        <div class="item">
                            <p class="str">All Time High</p>
                            <p class="num">$${coin.market_data.ath.usd != null ? coin.market_data.ath.usd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3}) : "N/A"}</p>
                        </div>
                        <div class="item">
                            <p class="str">All Time Low</p>
                            <p class="num">$${coin.market_data.atl.usd != null ? coin.market_data.atl.usd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3}) : "N/A"}</p>
                        </div>
                        <div class="item">
                            <p class="str">Total Volume</p>
                            <p class="num">$${coin.market_data.total_volume.usd != null ? coin.market_data.total_volume.usd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3}) : "N/A"}</p>
                        </div>
                        <div class="item">
                            <p class="str">Total Supply</p>
                            <p class="num">$${coin.market_data.total_supply != null ? coin.market_data.total_supply.toLocaleString(undefined, {
                            minimumFractionDigits: 3, maximumFractionDigits: 3}) : "N/A"}</p>
                        </div>
                        <div class="item">
                            <p class="str">Max Supply</p>
                            <p class="num">$${coin.market_data.max_supply != null ? coin.market_data.max_supply.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }): "N/A"}</p>
                        </div>
                        <div class="item">
                            <p class="str">Cirulating Supply</p>
                            <p class="num">$${coin.market_data.circulating_supply != null ? coin.market_data.circulating_supply.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : "N/A"}</p>
                        </div>
                    </div>
    `;

    rightSec.innerHTML = `
                <div class="status">
                    <h3>Historical Info</h3>
                    <div class="container">
                        <div class="item">
                            <p class="str">ATH</p>
                            <p class="num">$73,738.000</p>
                        </div>
                        <div class="item">
                            <p class="str">ATL</p>
                            <p class="num">$67.810</p>
                        </div>
                        <div class="item">
                            <p class="str">24H High</p>
                            <p class="num">$65,505.000</p>
                        </div>
                        <div class="item">
                            <p class="str">24H Low</p>
                            <p class="num">$65,505.000</p>
                        </div>
                    </div>
                </div>

                <div class="status">
                    <h3>Markets</h3>
                    <div class="container">
                        <div class="item">
                            <p class="str">Binance</p>
                            <div class="links">
                                <a href="https://www.binance.com/en/trade/BTC_USDT">Trade</a>
                                <p style="background-color: green">Trust: green</p>
                            </div>
                        </div>
                        <div class="item">
                            <p class="str">Coinbase</p>
                            <div class="links">
                                <a href="https://www.coinbase.com/advanced-trade/spot/BTC-USD">Trade</a>
                                <p style="background-color: green;">Trust: green</p>
                            </div>
                        </div>
                        <div class="item">
                            <p class="str">Kraken</p>
                            <div class="links">
                                <a href="https://pro.kraken.com/app/trade/BTC-USD">Trade</a>
                                <p style="background-color: green;">Trust: green</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="status">
                    <h3>Info</h3>
                    <div class="container">
                        <div class="item">
                            <p class="str">Website</p>
                            <div class="links">
                                <a target="_blank" href="http://www.bitcoin.org">Visit</a>
                                <a target="_blank" href="https://bitcoin.org/bitcoin.pdf">Whitepaper</a>
                            </div>
                        </div>
                        <div class="item">
                            <p class="str">Community</p>
                            <div class="links">
                                <a target="_blank" href="https://x.com/bitcoin">Twitter</a>
                                <a target="_blank" href="https://facebook.com/bitcoins">Facebook</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        
    `
}