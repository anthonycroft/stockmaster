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

Promise.all(promises)
  .then(responses => {
    const stockData = responses.map(response => response.results);
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
