/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20,
    gameCircleRadius = 3;

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

aggregateColorScale = aggregateColorScale.domain([0, maxGames]);

d3.select("#goalHeader").append("svg")
    .attr("height", cellHeight + cellBuffer)
    .attr("width", 2 * cellWidth)
    .append("g")
    .attr("height", cellHeight + cellBuffer)
    .attr("width", 2 * cellWidth)
    .attr("transform", "translate(0, " + cellHeight + ")")
    .call(d3.axisTop(goalScale));

tableElements = teamData;

// ******* TODO: PART V (Extra Credit) *******

}

function createAndUpdateRows() {
  // Create and assign a row for each data point in table elements
  var tableRows = d3.select("#matchTable").select("tbody")
      .selectAll("tr")
      .data(tableElements);
  tableRows.exit().remove();
  tableRows = tableRows.enter()
      .append("tr")
      .merge(tableRows);
  tableRows.on("click", function(d, i) {
    updateList(i);
  });
  tableRows.on("mouseover", function(d, i) {
    clearTree();
    updateTree(d);
  })
  return tableRows;
}

function createAndUpdateColumns(tableRows) {
  // For each row, pick out and create an array that will serve as data for each
  // column that we'll add. Select all columns for each data point.
  var tableColumns = tableRows.selectAll("td").data(function(d, i) {
    var columnData = [];
    columnData.push({"type":d["value"]["type"], "vis":"text", "value":d["key"], "is_country": true});
    columnData.push({"type":d["value"]["type"], "vis":"goals", "value": d["value"]});
    columnData.push({"type":d["value"]["type"], "vis":"text", "value":d["value"]["Result"]["label"]});
    columnData.push({"type":d["value"]["type"], "vis":"bar", "value":d["value"]["Wins"]});
    columnData.push({"type":d["value"]["type"], "vis":"bar", "value":d["value"]["Losses"]});
    columnData.push({"type":d["value"]["type"], "vis":"bar", "value":d["value"]["TotalGames"]});
    return columnData;
  });
  tableColumns.exit().remove();

  // create new td elements for new columns
  var newColumns = tableColumns.enter().append("td");

  var svg;
  // filter new columns for ones with a bar
  var newBarColumns = newColumns.filter(function(d) {
    return d.vis == "bar";
  });
  // create new svg elements for all new bar columns
  svg = newBarColumns.append("svg")
    .attr("height", cellHeight)
    .attr("width", cellWidth);
  svg.append("rect");
  svg.append("text");

  // filter new columns for ones with a goal
  var newGoalColumns = newColumns.filter(function(d) {
      return d.vis == "goals";
  });

  // create new svg elements for all new goal columns
  svg = newGoalColumns.append("svg")
    .attr("height", cellHeight)
    .attr("width", 2 * cellWidth)
  svg.append("rect");
  svg.append("circle");
  svg.append("circle");

  // merge new columns with existing columns
  tableColumns = tableColumns.merge(newColumns);
  return tableColumns;
}

function updateTextColumns(tableColumns) {
  // Update all text columns
  var textColumns = tableColumns.filter(function(d) {
      return d.vis == "text";
    });

  textColumns.classed("aggregate", function(d) {
    return d["type"] == "aggregate" && d["is_country"] != undefined && d["is_country"] == true;
  })
  .classed("game", function(d) {
    return d["type"] == "game" && d["is_country"] != undefined && d["is_country"] == true;
  })
  .text(function(d) {
    return (d["type"] == "game" && d["is_country"] != undefined && d["is_country"] ? "x" : "") + d.value;
  });
}

function updateBarColumns(tableColumns) {
  // Update all bar columns
  var barColumns = tableColumns.filter(function(d) {
    return d.vis == "bar";
  });

  var svg = barColumns.select("svg");

  svg.selectAll("rect")
    .data(function(d) {
      return [d];
    })
    .attr("height", cellHeight)
    .attr("width", function(d) {
      return gameScale(d.value);
    })
    .attr("fill", function(d){
      return aggregateColorScale(d.value);
    });

  svg.selectAll("text")
    .data(function(d) {
      return [d];
    })
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
}

function updateGoalColumns(tableColumns) {
    goalColumns = tableColumns.filter(function(d) {
        return d.vis == "goals";
    });

    svg = goalColumns.select("svg");

    // create bar
    var bar = svg
      .selectAll("rect")
      .data(function(d) {
        var goalData = [];

        var type = d["value"]["type"];
        var offset = type == "game" ? gameCircleRadius : 0;
        var barStart = goalScale(Math.min(d["value"]["Goals Made"], d["value"]["Goals Conceded"])) + offset;
        var barWidth = goalScale(Math.max(d["value"]["Goals Made"], d["value"]["Goals Conceded"])) - barStart - offset;
        var color = d["value"]["Delta Goals"] > 0 ? "#004174" : "#DE0001";

        goalData.push({"type": type, "start": barStart, "width": barWidth, "color": color});
        return goalData;
      });

    bar.attr("x", function(d) {
      return d["start"];
      })
      .attr("y", function(d) {
        return d["type"] == "aggregate" ? 0 : cellBuffer/2;
      })
      .attr("width", function(d) {
        return d["width"];
      })
      .attr("fill", function(d) {
        return d["color"];
      })
      .classed("aggregateBar", function(d) {
          return d["type"] == "aggregate";
      })
      .classed("goalBar", function(d) {
          return d["type"] == "goal";
      })
      .attr("height", function(d) {
        return d["type"] == "aggregate" ? cellHeight : cellHeight - cellBuffer;
      });

    // create circles
    var circles = svg
      .selectAll("circle")
      .data(function(d) {
        var goalData = [];
        goalData.push({"type": d["type"], "value": d["value"]["Goals Conceded"], "color": "#DE0001"});
        goalData.push({"type": d["type"], "value": d["value"]["Goals Made"], "color": "#004174"});
        return goalData;
      });

    circles.exit().remove();

    circles = circles.enter()
      .append("circle")
      .merge(circles);

    circles.attr("cx", function(d) {
        return goalScale(d["value"]);
      })
      .attr("cy", cellHeight/2)
      .attr("stroke-width", function(d) {
        return d["type"] == "aggregate" ? "0px" : gameCircleRadius + "px";
      })
      .attr("r", function(d) {
        return d["type"] == "aggregate" ? cellHeight/2 : cellHeight - cellBuffer;
      })
      .attr("fill", function(d) {
        return d["type"] == "aggregate" ? d["color"] : "none";
      })
      .attr("stroke", function(d) {
        return d["type"] == "game" ? d["color"] : "none";
      })
      ;
}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {
  var tableRows = createAndUpdateRows();
  var tableColumns = createAndUpdateColumns(tableRows);

  updateTextColumns(tableColumns);
  updateBarColumns(tableColumns);
  updateGoalColumns(tableColumns);
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
  var objectClicked = tableElements[i];

  if (isAggregate(objectClicked)) {
    var games = objectClicked["value"]["games"];
    if (i + 1 < tableElements.length && isGame(tableElements[i + 1])) {
      tableElements.splice(i + 1, games.length);
      // remove games
    } else {
      var args = [i + 1, 0].concat(games);
      Array.prototype.splice.apply(tableElements, args);
      // add games
    }
  }
  updateTable();
}

function isAggregate(objectClicked) {
  return objectClicked["value"] != undefined && objectClicked["value"]["type"] != undefined && objectClicked["value"]["type"] == "aggregate";
}

function isGame(objectClicked) {
  return objectClicked["value"] != undefined && objectClicked["value"]["type"] != undefined && objectClicked["value"]["type"] == "game";
}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {
  var g = d3.select("#tree").attr("transform", "translate(100, 0)");
  var width = 300;
  var height = 900;
  var padding = 10;

  var treeData = d3.stratify()
    .id(function(d) {
      var id = d.id;
      id = id.replace(d["Opponent"], "");
      id = id.replace(d["Team"], "");
      return id;
    })
    .parentId(function(d) {
      return d.ParentGame;
    })
    (treeData);

  // declares a tree layout and assigns the size
  var treemap = d3.tree()
      .size([height-padding, width-padding]);

  //  assigns the data to a hierarchy using parent-child relationships
  var nodes = d3.hierarchy(treeData, function(d) {
    return d.children;
  });

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  var link = g.selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .style("stroke", function(d) { return d.data.level; })
    .attr("d", function(d) {
       return "M" + d.y + "," + d.x
         + "C" + (d.y + d.parent.y) / 2 + "," + d.x
         + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
         + " " + d.parent.y + "," + d.parent.x;
     });

   // adds each node as a group
   var node = g.selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .classed("node", true)
    .classed("winner", function(d) {
        return d["data"]["data"]["Wins"] > 0;
    })
    .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
    });

  // adds symbols as nodes
  node.append("circle")
      .attr("r", 5);

  node.append("text")
    .attr("dy", ".35em")
    .attr("x", function(d) {
        return d.children ? -5 : 5;
    })
    .style("text-anchor", function(d) {
        return d.children ? "end" : "start"; })
    .text(function(d) {
        return d["data"]["data"]["Team"]; });
    };

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {
  d3.selectAll(".link")
    .classed("selected", function(d) {
      var classed = false;
      if (row["value"]["type"] == "aggregate") {
        classed = d["data"]["data"]["Team"] == row["key"] && d["data"]["data"]["Wins"] > 0;
      } else {
        console.log(d["data"]["data"]["Opponent"] + " | " + row["value"]["Opponent"]);
        classed = d["data"]["data"]["Team"] == row["key"] && d["data"]["data"]["Opponent"] == row["value"]["Opponent"];
      }
      return classed;
    });

  d3.selectAll(".node")
    .select("text")
      .classed("selectedLabel", function(d) {
        var classed = false;
        if (row["value"]["type"] == "aggregate") {
          classed = d["data"]["data"]["Team"] == row["key"] && d["data"]["data"];
        } else {
          classed = d["data"]["data"]["Team"] == row["key"] && d["data"]["data"]["Opponent"] == row["value"]["Opponent"];
        }
        return classed;
      });
}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {
  d3.selectAll(".selected")
    .classed("selected", false);

  d3.selectAll(".selectedLabel")
    .classed("selectedLabel", false);
}
