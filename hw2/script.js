// Global var for FIFA world cup data
var allWorldCupData;

var selectedBar = null;

var DIMENSION_ATTENDANCE = 'attendance';
var DIMENSION_TEAMS = 'teams';
var DIMENSION_MATCHES = 'matches';
var DIMENSION_GOALS = 'goals';
var DIMENSION_YEARS = 'years';

var SELECTED_ID = "selected";

var PADDING = 1;

var colorScale;

var selectBar = function (d, i) {
  if (selectedBar != null) {
    selectedBar.style("fill", function (d) {
      return colorScale(d);
    })
    .attr("id", null);
  }

  selectedBar = d3.select(this);
  selectedBar.style("fill", "#A4303F")
    .attr("id", SELECTED_ID);

  console.log(allWorldCupData[i]);
}

/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension) {

    var svg = d3.select("#barChart");

    var svgBounds = d3.select("#barChart").node().getBoundingClientRect();
    var xAxisWidth = 100;
    var yAxisHeight = 70;

    var graphHeight = svgBounds.height - yAxisHeight;
    var graphWidth = svgBounds.width - xAxisWidth;

    // Get working data based on dimension
    var workingData = retrieveDimension(selectedDimension);
    var years = retrieveDimension(DIMENSION_YEARS);

    // To make life easier, let's flip the graph vertically and horizontally
    // Let's also translate the graph a bit so that we have space for the y axis
    svg.select("#bars")
      .attr("transform", "translate(" + (graphWidth + xAxisWidth + 1) + ", " + graphHeight + ") scale(-1, -1)");

    // ##### Create scales for  #####

    var xScale = d3.scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([0, graphWidth]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(workingData)])
        .range([0, graphHeight]);

    colorScale = d3.scaleLinear()
        .domain([d3.min(workingData), d3.max(workingData)])
        .range([d3.rgb("#A4C2A5"),d3.rgb("#566246")]);

    // ##### Create Bars #####

    // Get all existing bars
    var bars = svg.select("#bars").selectAll("rect")
      .data(workingData);

    // Handle creating new bars for new data + pre-style
    bars = bars.enter()
      .append("rect")
      .style("fill", function (d) {
        return colorScale(d);
      })
      .merge(bars);

    // Handle exiting bars
    bars.exit()
      .transition()
      .duration(1000)
      .remove();

    // Style bars according to data
    bars.attr("class", "graph-bar")
      .on('click', selectBar)
      .on('mouseover', function(d) {
        d3.select(this).style("fill", "#DB5461");
      })
      .on('mouseout', function(d) {
        d3.select(this).style("fill", function (d) {
          return colorScale(d);
        });
        if (selectedBar != null) {
            selectedBar.style("fill", "#A4303F");
        }
      })
      .attr("x", function(d, i) {
        return (graphWidth/workingData.length * i) + PADDING;
      })
      .attr("y", function(d, i) {
        return PADDING;
      })
      .attr("width", function (d, i) {
        return (graphWidth/workingData.length) - (PADDING * 2);
      })
      .transition()
      .duration(1000)
      .attr("height", function (d, i) {
        return yScale(d);
      })
      .style("fill", function (d) {
        console.log("This");
        console.log(d3.select(this));
        console.log("Selected");
        console.log(selectedBar);
        if (d3.select(this).attr("id") == SELECTED_ID) {
          return "#A4303F";
        } else {
          return colorScale(d);
        }
      });

    // ##### Create Labels #####

    var yScaleReverse = d3.scaleLinear()
        .domain([0, d3.max(workingData)])
        .range([graphHeight, 0]);

    var yAxis = d3.axisLeft(yScaleReverse);

    var xScaleAxis = d3.scaleBand()
        .domain(years)
        .range([graphWidth, 0]);

    var xAxis = d3.axisLeft(xScaleAxis);

    svg.select("#yAxis").attr("transform", "translate(" + xAxisWidth + ", 0)").transition().duration(1000).call(yAxis);
    svg.select("#xAxis").attr("transform", "translate(" + xAxisWidth+ ", " + (graphHeight + 1) + ") rotate(-90)").transition().duration(1000).call(xAxis);

    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // Output the selected bar to the console using console.log()

}

function retrieveDimension(dimension) {
  var dataPoints = [];

  for (var i = 0; i < allWorldCupData.length; i++) {
    dataPoints.push(retrieveDataForDimension(allWorldCupData[i], dimension));
  }

  return dataPoints;
}

function retrieveDataForDimension(dataEntry, dimension) {
  switch (dimension) {
    case DIMENSION_ATTENDANCE:
      return dataEntry.attendance;
    case DIMENSION_GOALS:
      return dataEntry.goals;
    case DIMENSION_TEAMS:
      return dataEntry.teams;
    case DIMENSION_MATCHES:
      return dataEntry.matches;
    case DIMENSION_YEARS:
      return dataEntry.year;
  }
}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
    var dimension = d3.select("#dataset").node().value;
    updateBarChart(dimension);
}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

    });

    // Store csv data in a global variable
    allWorldCupData = csv;
    // Draw the Bar chart for the first time
    updateBarChart(DIMENSION_ATTENDANCE);
});
