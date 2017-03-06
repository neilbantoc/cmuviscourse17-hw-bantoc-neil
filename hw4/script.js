/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .range([cellBuffer, 2 * cellWidth - cellBuffer]);

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};

d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    console.log("Team Data");
    console.log(teamData);
    createTable();
    updateTable();
})

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});

/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable() {

var maxGoals = d3.max(teamData, function(d) {
  return d["value"]["Goals Made"];
});

// Set Domains for previously defined scales
goalScale = goalScale.domain([0, maxGoals]);

var maxGames = d3.max(teamData, function(d) {
  return d["value"]["TotalGames"];
});

gameScale = gameScale.domain([0, maxGames]);

console.log("Graph Length");
console.log(gameScale(1));

aggregateColorScale = aggregateColorScale.domain([0, maxGames]);

d3.select("#goalHeader").append("svg")
    .attr("height", cellHeight + cellBuffer).attr("width", 2 * cellWidth)
    .append("g")
    .attr("height", cellHeight + cellBuffer).attr("width", 2 * cellWidth)
    .attr("transform", "translate(0, " + cellHeight + ")")
    .call(d3.axisTop(goalScale));

tableElements = teamData;

// ******* TODO: PART V (Extra Credit) *******

}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// Select all rows for each corresponding table element
var tableRows = d3.select("#matchTable").select("tbody")
    .selectAll("tr")
    .data(tableElements);

// Create a row for new elements
tableRows = tableRows.enter()
    .append("tr")
    .merge(tableRows);

// Remove rows for deleted elements
tableRows.exit().remove();



// For each row, pick out and create an array that will serve as data for each
// column that we'll add. Select all columns for each data point.
var tableColumns = tableRows.selectAll("td").data(function(d, i) {
  var columnData = [];
  columnData.push({"type":d["value"]["type"], "vis":"text", "value":d["key"]});
  columnData.push({"type":d["value"]["type"], "vis":"goals", "value":d["value"]});
  columnData.push({"type":d["value"]["type"], "vis":"text", "value":d["value"]["Result"]["label"]});
  columnData.push({"type":d["value"]["type"], "vis":"bar", "value":d["value"]["Wins"]});
  columnData.push({"type":d["value"]["type"], "vis":"bar", "value":d["value"]["Losses"]});
  columnData.push({"type":d["value"]["type"], "vis":"bar", "value":d["value"]["TotalGames"]});
  return columnData;
});

// Create new columns for each new column
tableColumns = tableColumns.enter()
    .append("td")
    .merge(tableColumns);

// Remove columns for deleted columns
tableColumns.exit().remove();



// Update all text columns
var textColumns = tableColumns.filter(function(d) {
  return d.vis == "text";
});

textColumns.text(function(d) {
  return d.value;
});



// Update all bar columns
var barColumns = tableColumns.filter(function(d) {
  return d.vis == "bar";
});

var svg = barColumns.append("svg")
  .attr("height", cellHeight)
  .attr("width", cellWidth);

svg.append("rect")
  .attr("height", cellHeight)
  .attr("width", function(d) {
    return gameScale(d.value);
  })
  .attr("fill", function(d){
    return aggregateColorScale(d.value);
  });

svg.append("text")
  .attr("x", function(d) {
    return gameScale(d.value) + (d.value < 2 ? 2 : -2);
  })
  .attr("y", "50%")
  .attr("alignment-baseline", "middle")
  .attr("text-anchor", function(d) {
    return d.value < 2 ? "start" : "end";
  })
  .attr("fill", function(d) {
    return d.value < 2 ? "#000000" : "#ffffff";
  })
  .text(function(d){
    return d.value + "";
  });


// Update all goal columns
var goalColumns = tableColumns.filter(function(d) {
  return d.vis == "goals";
});

};


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******


}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // tableElements =


}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******


};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******


}
