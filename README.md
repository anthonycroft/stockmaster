## Stockmaster
This project was part of our Front-End Development Bootcamp. 
This was a group project, where we learnt how to use gitHub and Git for projects and collaborate as a team. 

## Brief
We had the following requirements:

- Use Bootstrap.
- Be deployed to GitHub Pages.
- Be interactive (in other words, accept and respond to user input).
- Use at least two server-side APIs and/or links to external sites.
- Does not use alerts, confirms, or prompts (use modals).
- Use client-side storage to store persistent data.
- Be responsive.
- Have a polished UI.
- Have a clean repository that meets quality coding standards (file structure, naming conventions, best practices for class/id naming conventions, indentation, quality comments, and so on).
- Have a quality README (including a unique name, description, technologies used, screenshot, and link to the deployed application).

We used the Agile development's principles in trying to achieve the above. 

## Description
Our project is called Stockmaster. This is an application which makes it possibe for a user to:

- build multiple portfolios either real or for modelling purposes;
- persist those portfolios for later retrieval;
- keep up to date with the current day's stock leaders and laggards and general market news;
- visualise their portfolio through various charts and figures including a heatmap;
- understand their equity curve as well see a detailed breakdown of a portfolio's performance at the stock level.


## Resources
In building the app We used the following resources:

https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2022-01-09/2023-12-31?apiKey=7p8pLHEtbHWAcDB5wPeMpcoNiHTQw4Am
https://www.image-charts.com/
https://d3js.org/
https://www.morningstar.co.uk/uk/Market/heatmap.aspx
https://sweetalert2.github.io/
https://www.figma.com/team_invite/redeem/GIsc01QpROEvqnBswlj54B
https://supportcenter.devexpress.com/ticket/details/t1036926/how-to-create-a-heatmap-chart-based-on-a-data-source

Although we exceeded wiht our initial vision for this app which was to allow a user to actively manage a SINGLE portfolio using multiple tools, there are some obvious enhancements that we would consider for future development, namely:

- validating a stock ticker entered against the data feed (api) from our chosen vendor to avoid a non-valid ticker from being entered.
- some additional visualisation tools such as:
    - a sector analysis of the investor's holdings e.g. through a doughnut or pie chart or similar;
- provide the capability for editing the transactions in a portfolio (e.g to correct an entry error) or to delete the portfolio entirely (can only be done manually at present via the console);
- provide a set of radio buttons to allow the user the ability to analyse stock performance over a range of periods e.g. 1mth, 3mths, 6mths, 1yr and 5 yrs. This would only require a small change to the existing code.

Images of the working app:
![image](https://user-images.githubusercontent.com/21089692/219475235-3d474e30-501b-4f7b-ba62-d7180692eab1.png)
![image](https://user-images.githubusercontent.com/21089692/219475292-58a8852a-bffe-42e6-9790-778fa3ceb62b.png)


## Deployed Link:

![stockmaster]https://anthonycroft.github.io/stockmaster/

## Repo Link:

![repository]https://github.com/anthonycroft/stockmaster
