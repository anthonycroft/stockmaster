// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
var portfolio = document.querySelector("#portfolio");
var stockName = document.querySelector("#stock");
var stockAmount = document.querySelector("#stock-amount");
var priceStock = document.querySelector("#price");
var date = document.querySelector("#date");
var submit = document.querySelector("#submit")

$(document).ready(function() {
          
  $(function() {
      $( "#my_date_picker" ).datepicker();
  });
});


var apiKey = "7p8pLHEtbHWAcDB5wPeMpcoNiHTQw4Am";

function getURL(ticker) {

  dateStart = '2023-01-01'
  dateEnd = '2023-01-31'

  const div = d3.selectAll("div");

  // https://api.polygon.io/v1/open-close/AAPL/2023-01-09?adjusted=true&apiKey=7p8pLHEtbHWAcDB5wPeMpcoNiHTQw4Am - end point for open/close prices
  // queryURL is the url we'll use to query the API
  var queryURL = "https://api.polygon.io/v2/aggs/ticker/" + `${ticker}/range/1/day/${dateStart}/${dateEnd}?apiKey=${apiKey}`;

  // console.log(queryURL)
  return queryURL;
}

function sendRequest (index, ticker) {
  // Build the query URL for the ajax request to the polygon.io site
  // const ticker = 'AAPL';
  var stockURL = getURL(ticker);

  // stockURL = "https://image-charts.com/chart.js/2.8.0?bkg=white&c={type:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],datasets:[{backgroundColor:'rgba(255,150,150,0.5)',borderColor:'rgb(255,150,150)',data:[-23,64,21,53,-39,-30,28,-10],label:'Dataset',fill:'origin'}]}}"

  // console.log("ticker is " + stockURL)

  // const ctx = document.getElementById('myChart').getContext('2d');

  fetch(stockURL)
    .then(response => response.json())
    .then(data => {
      const prices = data.results.map(result => ({
        timestamp: result.t,
        closingPrice: result.c
      }));

      const timestamps = prices.map(price => price.timestamp);
      const closingPrices = prices.map(price => price.closingPrice);

      console.log("timestamps: " + timestamps);
      console.log("closingPrices: " + closingPrices);

      pasteData(timestamps, closingPrices, index);
      
    })
    .catch(error => console.error(error));
}

function pasteData(timestamps,closingPrices, index ) {

  objJSON = "{" +
    "type:'line'," +
    "data:{" +
      "labels:[" + timestamps + "]," +
      "datasets:[" +
        "{" +
          "backgroundColor:'rgba(255,150,150,0.5)'," +
          "borderColor:'rgb(255,150,150)'," +
          "data:[" + closingPrices + "]," +
          "label:'Dataset'," +
          "fill:'origin'" +
        "}" +
      "]" +
    "}," +
    "options: {" +
      "indexAxis: 'y'," +
      "scales: {" +
        "x: {" +
          "beginAtZero: true" +
        "}" +
      "}" +
    "}" +
  "}";

  console.log("obJSON is: ")  + objJSON

  imgURL = "https://image-charts.com/chart.js/2.8.0?bkg=white&c=" + objJSON;

  $("<img>", {
    src: imgURL,
    width: "200",
    height: "100",
    id: "chtThumb" + index + 1,
    class: "image"
 }).appendTo(".container");

  console.log(imgURL);
}


// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/area-chart
function AreaChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  defined, // given d in data, returns true if defined (for gaps)
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  color = "currentColor" // fill color of area
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(X.length);

  // Compute which data points are considered defined.
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  // Construct an area generator.
  const area = d3.area()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y0(yScale(0))
      .y1(i => yScale(Y[i]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  svg.append("path")
      .attr("fill", color)
      .attr("d", area(I));

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  return svg.node();
}

init();

function init() {

  // stocks = ['MSFT']

  stocks = ['MSFT','AAPL','AMZN','GOOGL','JNJ','JPM','PG','V', 'GOLD', 'META','SGHLW', 'SAMAW', 'GFAIW', 'CELZ', 'PGRWW',
  "DOCU",
  "DDD",
  "NIU",
  "ARKF",
  "NVDA",
  "SKLZ",
  "PCAR",
  "MASS",
  "PSTI",
  "SPFR",
  "TREE",
  "PHR",
  "IRDM",
  "BEAM",
  "ARKW",
  "ARKK",
  "ARKG",
  "PSTG",
  "SQ",
  "IONS",
  "SYRS"]

  $.each(stocks, function(index, value) {
    sendRequest(index, value);
 });

}