// Global var for FIFA world cup data
var allWorldCupData;

var selectedBar = null;

var DIMENSION_ATTENDANCE = 'attendance';
var DIMENSION_TEAMS = 'teams';
var DIMENSION_MATCHES = 'matches';
var DIMENSION_GOALS = 'goals';
var DIMENSION_YEARS = 'years';
var DIMENSION_HOST = 'host';
var DIMENSION_HOST_ISO = 'host_iso';
var DIMENSION_TITLE = 'edition';
var DIMENSION_WINNER = 'winner';
var DIMENSION_SILVER = 'silver';
var DIMENSION_TEAM_NAMES = 'team_names';
var DIMENSION_TEAM_ISO = "team_iso";

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

  worldCupData = allWorldCupData[i];
  console.log(worldCupData);
  updateInfo(worldCupData);
  updateMap(worldCupData);
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

  // Handle exiting bars
  bars.exit()
    .transition()
    .duration(1000)
    .remove();

  // Handle creating new bars for new data + pre-style
  bars = bars.enter()
    .append("rect")
    .style("fill", function (d) {
      return colorScale(d);
    })
    .merge(bars);

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
    case DIMENSION_HOST:
      return dataEntry.host;
    case DIMENSION_HOST_ISO:
        return dataEntry.host_country_code;
    case DIMENSION_WINNER:
      return dataEntry.winner;
    case DIMENSION_SILVER:
      return dataEntry.runner_up;
    case DIMENSION_TEAM_NAMES:
      return dataEntry.teams_names;
    case DIMENSION_TEAM_ISO:
      return worldCupData.teams_iso;
    case DIMENSION_TITLE:
      return worldCupData.EDITION;
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

/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    d3.select("#edition").text(retrieveDataForDimension(oneWorldCup, DIMENSION_TITLE));
    d3.select("#host").text(retrieveDataForDimension(oneWorldCup, DIMENSION_HOST));
    d3.select("#winner").text(retrieveDataForDimension(oneWorldCup, DIMENSION_WINNER));
    d3.select("#silver").text(retrieveDataForDimension(oneWorldCup, DIMENSION_SILVER));

    var teams = retrieveDataForDimension(oneWorldCup, DIMENSION_TEAM_NAMES);
    var teamList = d3.select("#teams").selectAll("li").data(teams);

    teamList.exit().remove();

    teamList = teamList.enter()
      .append("li")
      .merge(teamList);

    teamList.sort().text(function(d, i) {
      return d;
    });
}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    var path = d3.geoPath().projection(projection);
    var map = d3.select("#map");

    //Bind data and create one path per GeoJSON feature
    map.selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter()
      .append("path")
      .attr("id", function(d, i){
        return d.id;
      })
      .attr("class", "countries")
      .attr("d", path);

    var graticule = d3.geoGraticule().step([10,10]);
    map.append("path").datum(graticule).attr("class", "grat").attr("d", path);
}

/**
 * Clears the map
 */
function clearMap() {
    var svg = d3.select("#map")
      .selectAll(".countries")
      .attr("class", "countries");
}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldCupData) {

    //Clear any previous selections;
    clearMap();

    // console.log("BEFORE");
    // printDebug();

    var participantIsos = retrieveDataForDimension(worldCupData, DIMENSION_TEAM_ISO);
    var participantNames = retrieveDataForDimension(worldCupData, DIMENSION_TEAM_NAMES);

    for (var x = 0; x < participantIsos.length; x++) {
        var participantIso = participantIsos[x];
        setCountryClass(participantIso, "countries team");
    }

    var hostIso = retrieveDataForDimension(worldCupData, DIMENSION_HOST_ISO);
    setCountryClass(hostIso, "countries host");

    var winnerJson = {"class": "gold", "coordinates": worldCupData.win_pos};
    var silverJson = {"class": "silver", "coordinates": worldCupData.ru_pos};

    var circles = d3.select("#points").selectAll("circle")
      .data([winnerJson, silverJson]);

    circles.exit().remove();

    circles = circles.enter().append("circle")
      .attr("cx", function (d, i) {
          return projection([d.coordinates[0], d.coordinates[1]])[0];
      })
      .attr("cy", function (d, i) {
          return projection([d.coordinates[0], d.coordinates[1]])[1];
      })
      .merge(circles);

    circles
      .attr("class", function (d, i) {
        return d.class;
      })
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr("cx", function (d, i) {
          return projection([d.coordinates[0], d.coordinates[1]])[0];
      })
      .attr("cy", function (d, i) {
          return projection([d.coordinates[0], d.coordinates[1]])[1];
      })
      .attr("r", function (d, i) {
          return 5;
      })
      .style("opacity", 0.8);

      // console.log("AFTER");
      // printDebug();
}

function setCountryClass(countryIso, countryIsoClass) {
  d3.select("#" + countryIso)
    .attr("class", countryIsoClass);
}

function printDebug() {
  var hostPaths = d3.selectAll(".countries").filter(".host").size();
  var teamPaths = d3.selectAll(".countries").filter(".team").size();
  var winnerCircles = d3.selectAll(".gold").size();
  var silverCircles = d3.selectAll(".silver").size();

  console.log("Hosts: ");
  console.log(hostPaths);
  console.log("Teams: ");
  console.log(teamPaths);
  console.log("Winners: ");
  console.log(winnerCircles);
  console.log("Silvers: ");
  console.log(silverCircles);
}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

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
    updateBarChart('attendance');
});
