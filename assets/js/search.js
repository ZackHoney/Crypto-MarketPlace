const coinsList = document.getElementById('coins-list');
const exchangesList = document.getElementById('exchanges-list');
const nftsList = document.getElementById('nfts-list');

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    if(query) {
        fetchSearchResult(query, [coinsList, exchangesList, nftsList]);
    }else{
        const searchHeading = document.getElementById('searchHeading');
        const searchContainer = document.querySelector('.search-container');
        searchContainer.innerHTML = `<p style="color: red; text-align: center; margin-bottom: 8px">Nothing To Show...</p>`;
        searchHeading.innerText = 'Please search something...';
    }
});

function fetchSearchResult(param, idsToToggle){

    const searchHeading = document.getElementById('searchHeading');

    idsToToggle.forEach(id => {
        const errorElement = document.getElementById(`${id}-error`);

        if(errorElement){
            errorElement.style.display = 'none';
        }
        toggleSpinner(id, `${id}-spinner`, true);
    });

    coinsList.innerHTML = '';
    exchangesList.innerHTML = '';
    nftsList.innerHTML = '';

    searchHeading.innerText = `Search results for "${param}"`;

    const url = `https://api.coingecko.com/api/v3/search?query=${param}`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(url, options)
        .then(response => {
            if(!response.ok){
                throw new Error('Network response was not ok ' + response.statusText);
            }
            idsToToggle.forEach(id => toggleSpinner(id, `${id}-spinner`, false));
            return response.json();
        })
        .then(data => {
            let coins = (data.coins || []).filter(coin => coin.thumb !== 'missing_thumb.png');
            let exchanges = (data.exchanges || []).filter(exchange => exchange.thumb !== 'missing_thumb.png');
            let nfts = (data.nfts || []).filter(nft => nft.thumb !== 'missing_thumb.png');

            const coinsCount = coins.length;
            const exhcangesCount = exchanges.length;
            const nftsCount = nfts.length;

            let minCount = Math.min(coinsCount, exhcangesCount, nftsCount);

            if(coinsCount > 0 && exchangesCount > 0 && nftsCount > 0){
                coins = coins.slice(0, minCount);
                exchanges = exchanges.slice(0, minCount);
                nfts = nfts.slice(0, minCount);
            }

            coinsResult(coins);
            exchangesResult(exchanges);
            nftsResult(nfts);

            if(coins.length === 0){
                coinsList.innerHTML = '<p style="color: red; text-align: center;">No results found for coins.</p>';
            }

            if(exchanges.length === 0){
                exchangesList.innerHTML = '<p style="color: red; text-align: center;">No results found for exchanges.</p>';
            }

            if(nfts.length === 0){
                nftsList.innerHTML = '<p style="color: red; text-align: center;">No results found for nfts.</p>';
            }

        })
        .catch(error => {
            idsToToggle.forEach(id => {
                toggleSpinner(id, `${id}-spinner`, false);
                document.getElementById(`${id}-error`).style.display = 'block';
            });
            console.error('Error fetching data:', error);
        });
}

function coinsResult(coins){
    coinsList.innerHTML = '';

    const table = createTable([
        
    ])
}