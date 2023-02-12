var apiKey = "7p8pLHEtbHWAcDB5wPeMpcoNiHTQw4Am";

const stocks = ["MSFT","AAPL","AMZN","GOOGL","JNJ","JPM","PG","V","GOLD","META","SGHLW","SAMAW","GFAIW","CELZ","PGRWW",
  "DOCU","DDD", "NIU","ARKF","NVDA","SKLZ","PCAR","MASS","PSTI","SPFR","TREE","PHR","IRDM","BEAM","ARKW","ARKK","ARKG",
  "PSTG","SQ","IONS","SYRS"];
const startDate = "2023-01-01";
const endDate = "2023-01-31";

async function getData(stock) {
    const url = `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${startDate}/${endDate}?apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const filteredData = data.map(d => ({ c: d.c, t: d.t }));
      return filteredData;
    } catch (error) {
      console.error(error);
    }
  }

  async function main() {
    const data = [];
    for (const stock of stocks) {
      const stockData = await getData(stock);
      data.push(stockData);
    }
    console.log(data);
  }
  
  main();

  const width = 800;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  
  const svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  const x = d3.scaleBand()
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);
  
  const y = d3.scaleLinear()
    .rangeRound([height - margin.bottom, margin.top]);
  
  const color = d3.scaleLinear()
    .range(["white", "red"])
    .interpolate(d3.interpolateHcl);
  
  async function main() {
    const data = [];
    for (const stock of stocks) {
      const stockData = await getData(stock);
      data.push(stockData);
    }
  
    x.domain(stocks);
    y.domain([
      d3.min(data, d => d3.min(d, dd => dd.c)),
      d3.max(data, d => d3.max(d, dd => dd.c))
    ]);
  
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => x(stocks[i]))
      .attr("y", d => y(d.c))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.c))
      .style("fill", d => color(d.c));
  }
  
  main();
  