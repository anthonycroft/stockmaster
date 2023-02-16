const startDate = '2023-01-01';
const endDate = '2023-01-31';

const width = 30;
const height = Math.ceil(stocks.length / width);

const colorScale = {
  "-1.0": "#FFD3D3", 
  "-0.05": "#FF8D8D", 
  "0.0": "#FFFFFF",  
  "0.05": "#B4F7B4", 
  "1.0": "#4EC64E"   
};

const promises = [];
stocks.forEach(symbol => {
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?apiKey=7p8pLHEtbHWAcDB5wPeMpcoNiHTQw4Am`;
  promises.push($.get(url));
});

let stockData; 

Promise.all(promises)
  .then(responses => {
    stockData = responses.map(response => response.results); 
    const prices = stockData.map(data => data.map(d => d.c));
    const maxPrice = Math.max(...prices.flat());
    const minPrice = Math.min(...prices.flat());

    const heatmapTable = document.querySelector('.heat-map');
    for (let i = 0; i < height; i++) {
      const row = heatmapTable.insertRow();
      for (let j = 0; j < width; j++) {
        const index = i * width + j;
        if (index >= stocks.length) {
          break;
        }
        const cell = row.insertCell();
        const priceData = stockData[index].map(d => d.c);
        const firstPrice = priceData[0];
        const lastPrice = priceData[priceData.length - 1];
        const percentChange = (lastPrice - firstPrice) / firstPrice;
        let colorIndex;
        if (percentChange <= -0.05) {
          colorIndex = "-0.05";
        } else if (percentChange <= -0.01) {
          colorIndex = "-1.0";
        } else if (percentChange <= 0.01) {
          colorIndex = "0.0";
        } else if (percentChange <= 0.05) {
          colorIndex = "0.05";
        } else {
          colorIndex = "1.0";
        }
        cell.style.backgroundColor = colorScale[colorIndex];
      }
    }
  })
  .catch(error => console.error(error));

function callHeatmap() {
  const heatmap = document.querySelector('.heat-map');
  const rows = heatmap.querySelectorAll('tr');
  const cells = heatmap.querySelectorAll('td');

  const cellWidth = heatmap.offsetWidth / width;
  const cellHeight = heatmap.offsetHeight / height;

 cells.forEach((cell, index) => {
    const stockSymbol = stocks[index];
   
    const stockSymbolElement = document.createElement('div');
    stockSymbolElement.textContent = stockSymbol;
    stockSymbolElement.style.fontSize = '10px';
    stockSymbolElement.style.margin = 'auto';
    stockSymbolElement.style.textAlign = 'center';
    if (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }
    cell.appendChild(stockSymbolElement);
    cell.setAttribute('title', stockSymbol);
    cell.addEventListener('click', () => {
      const yahooFinanceUrl = `https://finance.yahoo.com/quote/${stockSymbol}`;
      window.open(yahooFinanceUrl, '_blank');
    });
    
    cell.style.width = `${cellWidth * 2}px`;
    cell.style.height = `${cellHeight}px`;
    
    });
    
    rows.forEach(row => {
    row.style.height = `${cellHeight}px`;
    });
    }

    window.removeEventListener('load', callHeatmap);
    window.removeEventListener('resize', callHeatmap);


    window.addEventListener('load', callHeatmap);
    window.addEventListener('resize', callHeatmap);
