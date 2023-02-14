// const { right } = require("inquirer/lib/utils/readline");

var apiKey = "7p8pLHEtbHWAcDB5wPeMpcoNiHTQw4Am";
var stocks;

function getURL(ticker) {

  // get stock prices for user's portfolio for the last 30 days for thumbnail image charts
  var dateEnd = moment().subtract(1, 'days').format('YYYY-MM-DD')
  var dateStart = moment(dateEnd).subtract(30, 'days').format('YYYY-MM-DD')

  var queryURL = "https://api.polygon.io/v2/aggs/ticker/" + `${ticker}/range/1/day/${dateStart}/${dateEnd}?apiKey=${apiKey}`;

  return queryURL;
}

function sendRequest_orig(ticker) {

    $.each(stocks, function(index, value) {
    sendRequest(index, value);
  })   

  return new Promise((resolve, reject) => {
    // Build the query URL for the ajax request to the polygon.io site

    var stockURL = getURL(ticker);

    fetch(stockURL)
      .then(response => response.json())
      .then(data => {
        const prices = data.results.map(result => ({
          timestamp: result.t,
          closingPrice: result.c,
        }));

        // add the current stock prices to timeSeriesData 
        // this is in a more convenient format for valuation and other purposes

        data.results.forEach(result => {
          let dataPoint = {
            stock: data.ticker,
            date: new Date(result.t),
            price: result.c
          };

          timeSeriesData.push(dataPoint);
        });

        resolve(timeSeriesData);
      })
      .catch(error => reject(error));
  });
}

async function sendRequest (index, ticker, timeSeriesData) {
  // Build the query URL for the ajax request to the polygon.io site

  var stockURL = getURL(ticker);

  var response = await fetch(stockURL)
    var data = await response.json()

  const prices = data.results.map(result => ({
    timestamp: result.t,
    closingPrice: result.c,
  }));
  
  // add the current stock prices to timeSeriesData 
  // this is in a more convenient format for valuation and other purposes

  data.results.forEach(result => {
    let dataPoint = {
      stock: data.ticker,
      date: new Date(result.t),
      price: result.c
    };

    timeSeriesData.push(dataPoint);
  });

  // const timestamps = prices.map(price => moment(price.timestamp).format("MM/DD/YYYY"));
  const timestamps = prices.map(price => price.timestamp);
  const closingPrices = prices.map(price => price.closingPrice);

  // call function to create the thumbnails
  createImage(timestamps, closingPrices, index);
    return timeSeriesData;
}

function createImage(timestamps,closingPrices, index ) {

  // convert unix style dates to standard display format
  const formattedTimestamps = timestamps.map(timestamp => moment(timestamp).format('DD/MM/YYYY'));

  objJSON = JSON.stringify({
    type:'line',
    data:{
      labels: formattedTimestamps,
      datasets:[
        {
          backgroundColor:'rgba(255,150,150,0.5)',
          borderColor:'rgb(255,150,150)',
          data: closingPrices,
          label:'Dataset',
          fill:'origin'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: false
        }
      }
    }
  });

  // send the API request to image-charts.com for the thumbnail image
  imgURL = "https://image-charts.com/chart.js/2.8.0?bkg=white&c=" + objJSON;

  $("<img>", {
    src: imgURL,
    width: "200",
    height: "100",
    id: "chtThumb" + index + 1,
    class: "image",
    title: stocks[index]
 }).appendTo(".thumbnail");

}

function drawEquityCurve (valuations) {
  // draws a D3.js chart representin investor's equity curve

  const data = Object.entries(valuations).map(([date, value]) => {
    return {date: new Date(date), equity: value};
  });

  let dim = {
    "width": 850,
    "height": 450,
    "margin": 50
  }

  let svg = d3.select('#viz')
    .append('svg')
      .attr("width", dim.width)
      .attr("height", dim.height)
      .attr("margin", dim.margin)

  draw(data);

  function draw(data) {
      
    let scaleX = d3.scaleTime()
    .domain(d3.extent(data, function(d) {
      return d.date;
    }))
    // .nice()
    .range([dim.margin, dim.width-dim.margin]);

    let axisX = d3.axisBottom(scaleX);

    svg.append("g")
      .attr("transform", `translate(0,${dim.height-dim.margin})`)
      .call(axisX);
    
    let minVal = d3.min(data, d => d.equity);

    let scaleY = d3.scaleLinear()
    
    .domain([minVal, d3.max(data, function(d) {
      return d.equity;
    })])
    // .nice()
    .range([dim.height - dim.margin, dim.margin]);

    let axisY = d3.axisLeft(scaleY);

    svg.append("g")
      .attr("transform", `translate(${dim.margin},0)`)
      .call(axisY);

    let area = d3.area()
      .x(d => scaleX(d.date))
      .y0(d => scaleY(minVal))
      .y1(d => scaleY(d.equity));;

    svg.append("path")
    .attr("fill", 'rgba(255,150,150,0.5)')
    .attr("stroke", 'none')
    .attr("stroke-width", '1px')
    .attr("d", area(data));

  }
}

function getValuation(timeSeriesData) {
  // here we want to create a valuation of the portfolio over the last 12mths for each day
  // NB This function will change when we have stored data we can retrieve, sample data 
  // included below for testing purposes
  var portfolio = {};


  // issue: for each stock in the portfolio, was it owned at the valuation date ?
  var transactions = [  
    { "date": "2022-01-01",    "qty": 100,    "ticker": "AAPL" },
    { "date": "2022-01-02",    "qty": 150,    "ticker": "GOOGL" },
    { "date": "2022-01-02",    "qty": 300,    "ticker": "JNJ" },
    { "date": "2022-01-02",    "qty": 60,     "ticker": "PHR" },
    { "date": "2022-01-02",    "qty": 450,    "ticker": "ARKW" },
    { "date": "2022-01-02",    "qty": 256,    "ticker": "MASS" },
    { "date": "2022-01-02",    "qty": 325,    "ticker": "NVDA" },
    { "date": "2022-01-02",    "qty": 25,     "ticker": "ARKF" },
    { "date": "2022-01-02",    "qty": 2000,   "ticker": "CELZ" },
    { "date": "2022-01-02",    "qty": 1250,   "ticker": "SKLZ" },
    { "date": "2022-01-02",    "qty": -20,    "ticker": "AAPL" },
    { "date": "2022-01-02",    "qty": 320,    "ticker": "IRDM" },
    { "date": "2022-01-02",    "qty": 40,     "ticker": "PCAR" },
    { "date": "2022-01-02",    "qty": 862,    "ticker": "NIU" },
    { "date": "2022-01-02",    "qty": 245,    "ticker": "PHR" },
    { "date": "2022-01-02",    "qty": 653,    "ticker": "CELZ" },
    { "date": "2022-01-02",    "qty": 652,    "ticker": "BEAM" },
    { "date": "2022-01-02",    "qty": 326,    "ticker": "ARKF" },
    { "date": "2022-01-02",    "qty": 562,    "ticker": "GFAIW" },
    { "date": "2022-01-02",    "qty": 254,    "ticker": "PGRWW" },
    { "date": "2022-01-02",    "qty": 100,    "ticker": "AAPL" },
    { "date": "2022-01-02",    "qty": 100,    "ticker": "AAPL" }
  ]

  // Get the current date and the date 12 months ago
  var now = new Date();
  var oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // Create an object to store the portfolio value for each date

  // Set the start date to the date 12 months ago
  var startDate = oneYearAgo;

  // Loop through each day and update the portfolio value
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  while (startDate < yesterday) {

    if (isWeekend(startDate)) { 
      startDate.setDate(startDate.getDate() + 1);
      continue
    }
    
    // Loop through the transactions and update the portfolio value for the current date
    for (var i = 0; i < transactions.length; i++) {
      var transaction = transactions[i];
      var transactionDate = new Date(transaction.date);

      // Only consider transactions that were made on or before the current date
      if (transactionDate <= startDate) {

        // Get the current value of the stock for the transaction date
        var stockValue = getPrice(startDate, transaction.ticker);
        // if price is null assume exchange was closed, so dont add a vluation for this date.
        if (stockValue !== null) {
          // Update the portfolio value for the current date
          if (portfolio[startDate.toISOString().substring(0, 10)] === undefined) {
            // Initialize the portfolio value for the current date
            portfolio[startDate.toISOString().substring(0, 10)] = 0;
          }
          portfolio[startDate.toISOString().substring(0, 10)] += transaction.qty * stockValue;
        }
      }
    }

    // Increment the start date by one day
    startDate.setDate(startDate.getDate() + 1);
  }

  function getPrice(date, ticker) {

    var valuationDate = moment(date).format("YYYY-MM-DD")

    let filteredData = timeSeriesData.filter(dataPoint => {
      return moment(dataPoint.date).format("YYYY-MM-DD") === valuationDate &&
             dataPoint.stock === ticker;
    });

    if (filteredData.length > 0) {
      return filteredData[0].price;
    } else {
      return null;
    }
  }

  // Log the portfolio value for each date
  for (var date in portfolio) {
    console.log(date + ": $" + portfolio[date]);
  }

  return portfolio;
}

function isWeekend(date) {
  let day = date.getDay();
  return day === 0 || day === 6;
}

function getPortfolioStocks() {
  // get the last portfolio loaded by the user and return unique stocks

  // code here to find last portfolio loaded
  lastViewedPortfolio = '401k'
  // get the constituent stocks

  const portfolio = JSON.parse(localStorage.getItem(lastViewedPortfolio));1111

  const stockList = portfolio.map(stock => `${stock.stock}`);

  const uniqueStockList = [...new Set(stockList)];

  return uniqueStockList;
}

async function init() {
  //////////////////////////////////////////////////////////
  // main program - all key functions are called from here /
  //////////////////////////////////////////////////////////

  // the below are used for testing as we dont have the user inputs yet
  // stocks = ['MSFT','AAPL','AMZN','GOOGL','JNJ','JPM','PG','V', 'GOLD', 'META','SGHLW', 'SAMAW', 'GFAIW', 'CELZ', 'PGRWW',
  // "DOCU","DDD", "NIU","ARKF","NVDA","SKLZ","PCAR","MASS","TREE","PHR","IRDM","BEAM","ARKW","ARKK","ARKG",
  // "PSTG","SQ","IONS","SYRS"]

  // Get the last portfolio loaded by the user - and load that 

  stocks = getPortfolioStocks();

  var answer;
  var timeSeriesData = [];
  var portfolio = {};

  await Promise.all(stocks.map(async function(value, index) {
    answer = await sendRequest(index, value, timeSeriesData);
    }));
    
    portfolio = await getValuation(timeSeriesData);
    const labels = Object.keys(portfolio);
    const values = Object.values(portfolio);

    // function call to draw equity curve
    drawEquityCurve(portfolio);

    // function call to create heat map
    createHeatMap(timeSeriesData);

}

  $(document).ready(function() {
    $("#submit-transaction").click(function() {
      // check that all inputs are complete
      // did user enter portfolio name ?

      let errorsFound = false;

      if ($.trim($("#portfolio").val()) === "") {
       alert("You must enter a value in the portfolio field!")
       errorsFound = true;
      } else if ($.trim($("#stock").val()) === "") {
        alert("You must enter a value in the stock field!")
        errorsFound = true;
      } else if ($("#stock-amount").val() === 0) {
        alert("You must enter a value in the stock amount field!")
        errorsFound = true;
      } else if ($("#price").val() === 0) {
        alert("You must enter a value in the price field!")
        errorsFound = true;
      }

      if (errorsFound) {
        return;
      }

      const portfolioName = $.trim($("#portfolio").val());
      const stock = $.trim($("#stock").val());
      const quantity = $.trim($("#stock-amount").val());
      const price = $("#price").val();
      const date = $("#date_picker").val();

       // If all  checks complete we need to store the data
       // See if portfolio exists in local storage

      // let transactions = JSON.parse($.jStorage.get(portfolioName));
      let transactions =JSON.parse(localStorage.getItem(portfolioName));
      
      if (!transactions) {
        transactions = [];
      }

      // call function to add new transaction to 
      addTransaction(stock, quantity, date, price)

      clearInputFields();

      function addTransaction(stockName, qty, date, cost) {

        transactions.push({
          stock: stockName,
          quantity: qty,
          date: date,
          price: cost
        });

        localStorage.setItem(portfolioName, JSON.stringify(transactions)); 
      }

      function clearInputFields () {
        // clears the portfolio input fields
        
        $("#portfolio").val('');
        $("#stock").val('');
        $("#stock-amount").val('');
        $("#price").val('');
        $("#date_picker").val('');

      }
        
  })
});


init();
