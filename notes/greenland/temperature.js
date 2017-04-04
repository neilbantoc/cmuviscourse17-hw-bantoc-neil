// colors
var red1 = '#D0AA9D';
var red2 = '#B16B72';
var red3 = '#B4675D';
var red4 = '#CD6B5A';
var red5 = '#CE6A59';

var blue1 = '#2F4858';
var blue2 = '#435761';
var blue3 = '#33658A';
var blue4 = '#BBD8E2';
var blue5 = '#86BBD8';

var mocha = '#CEBB96';
var yellow1 = '#E8E4BE';

var graphCircleInner = '#929088';
var graphCircleMiddle = '#A5A49D';
var graphCircleOuter = '#D5D3CE';

var tempBarColor = '#F5E074';


// Height and Width of the whole temperature section
var xOffset = 72;
var yOffset = 36;
var tempHeight = 854;
var tempWidth = 460 + xOffset;

// Radii of graph's circles
var baselineRadius = 72;
var levelOneRadius = baselineRadius + baselineRadius;
var levelTwoRadius = levelOneRadius + baselineRadius;

// Size of graph with padding for text labels
var graphSize = (levelTwoRadius * 2) + 100;

// A group for the radial temperature graph
temp = svg.select('#temperature')
  .attr('height', tempHeight)
  .attr('width', tempWidth)
  .attr('transform', 'translate(' + ((svgWidth/2 - tempWidth/2) + (xOffset/2)) + ',' + ((svgHeight/2 - tempHeight/2) + (yOffset)) + ')');

// Background color
tempBackground = temp.append('rect')
  .attr('height',  tempHeight)
  .attr('width',  tempWidth)
  .attr('class', 'bounding-box')

// title
var titleHeight = 140;

// Radial Graph
radialGraph = temp.append('g').attr('id', 'radial-graph')
  .attr('transform', 'translate(0, ' + titleHeight + ')');

// Graph's circles
radialGraph.append('circle')
  .attr('cx', graphSize/2)
  .attr('cy', graphSize/2)
  .attr('r', levelTwoRadius)
  .attr('stroke', 'none')
  .attr('fill', graphCircleOuter);

radialGraph.append('circle')
  .attr('cx', graphSize/2)
  .attr('cy', graphSize/2)
  .attr('r', levelOneRadius)
  .attr('stroke', 'none')
  .attr('fill', graphCircleMiddle);

radialGraph.append('circle')
  .attr('cx', graphSize/2)
  .attr('cy', graphSize/2)
  .attr('r', baselineRadius)
  .attr('stroke', 'none')
  .attr('fill', graphCircleInner);

var pieRadius = levelTwoRadius;
var months = [
  { name: 'Jan' },
  { name: 'Feb' },
  { name: 'Mar' },
  { name: 'Apr' },
  { name: 'May' },
  { name: 'Jun' },
  { name: 'Jul' },
  { name: 'Aug' },
  { name: 'Sep' },
  { name: 'Oct' },
  { name: 'Nov' },
  { name: 'Dec' }
];

// scale for the radial chart
radialScale = d3.scaleLinear()
  .domain([-1, 0, 1, 2])
  .range([0, baselineRadius]);

// create pie chart for month boudaries to divide the circles
pieGenerator = d3.pie()
  .sort(null)
  .value(function () {
    return 1;
  });

// create an arc generator for text labels
labelArc = d3.arc()
  .outerRadius(levelTwoRadius + 45)
  .startAngle(function(d) {
    return d.startAngle - (15 * (Math.PI/180));
  })
  .endAngle(function(d) {
    return d.endAngle - (15 * (Math.PI/180));
  })
  .innerRadius(levelTwoRadius);


// create temperature line graph
radialLineGenerator = d3.radialLine()
  .curve(d3.curveNatural)
  .radius(function(d, i){ return radialScale(d); })
  .angle(function(d, i){ return (i * 30 % 360) * (Math.PI/180) ; });

currentYearLineGenerator = d3.radialLine()
  .curve(d3.curveNatural)
  .radius(function(d, i){ return radialScale(d); })
  .angle(function(d, i){ return (i * 1 % 360) * (Math.PI/180) ; });

// angles
var dataYears = [];
var currentYear = [];

var startingReading = 0;
var maxVariance = 0.0075;
var totalYears = 20;

temperatureColorRange = ['#4B6374', '#CDE9FF'];

// scale for the radial chart line color
colorScale = d3.scaleLinear()
  .interpolate(d3.interpolateCubehelix)
  .domain([0, totalYears])
  .range(temperatureColorRange);

for (x = 0; x < totalYears; x++) {
  dataYears[x] = [];
  dataYears[x][0] = startingReading;
  for (y = 1; y < 13; y++) {
    dataYears[x][y] = dataYears[x][y - 1] + (Math.random() * maxVariance);
  }
  radialGraph.append('path')
    .datum(dataYears[x])
    .attr('d', radialLineGenerator)
    .attr('class', 'pie-line')
    .attr('stroke', colorScale(x))
    .attr('transform', 'translate(' + (graphSize/2) +','+ (graphSize/2) +')');
  startingReading = dataYears[x][12];
}

currentYear[0] = dataYears[totalYears-1][12];


// create an arc generator for pie chart (spits out the path d commands)
arcGenerator = d3.arc()
  .outerRadius(levelTwoRadius)
  .innerRadius(0);

// append a group for the pie viz
pie = radialGraph.selectAll('.arc')
  .data(pieGenerator(months))
  .enter().append('g')
  .attr('class', 'arc');

var offset = 11; //we're on Apr

var radarColorScale = d3.scalePow()
  .exponent(2.25)
  .domain([0 , 12])
  .range([0.05, 0.9 ]);

pie.filter(function (d, i) {
  return 1;
})

// draw the boundaries
radarPie = pie.append('path')
  .attr('transform', 'translate(' + (graphSize/2) +','+ (graphSize/2) +')')
  .attr('d', arcGenerator)
  .attr('fill', '#000000')
  .attr('stroke', '#000000')
  .attr('fill-opacity',  function (d, i) {
    i = ((12 - i + offset) % 12);
    return radarColorScale(i);
  })
  .attr('class', 'pie-divider');

// draw the month text labels
pie.append('text')
  .attr('transform', function(d) { return 'translate(' + (graphSize/2) + ',' + (graphSize/2) +') translate(' + labelArc.centroid(d) + ')'; })
  .attr('class', 'pie-label')
  .attr("dy", ".35em")
  .text(function(d) { return d.data.name; });

tempBarWidth = 60;
tempBarHeight = levelTwoRadius * 2;

tempLengthScale = d3.scaleLinear()
  .domain([0, 2])
  .range([0, tempBarHeight]);

// temp.append('g')
//     .attr('transform', 'translate(0, ' + graphSize + ') scale (1 -1)')
//   .append('rect')
//     .attr('id', 'temperature-bar')
//     .attr('x', graphSize)
//     .attr('width', tempBarWidth)
//     .attr('y', 0)
//     .attr('fill', tempBarColor)
//     .attr('height', tempLengthScale(1));

var degrees = ['-1°', '0°', '+1°', '+2°']

degreesAxis = radialGraph.selectAll('.circle-graph-labels')
  .data(degrees)
  .enter()
  .append('g');

degreesAxis.append('text')
  .attr('id', '')
  .attr('class', 'circle-graph-labels')
  .attr('x', graphSize/2 - 10)
  .attr('text-anchor', 'end')
  .attr('alignment-baseline', 'central')
  .attr('y', function (d, i) {
    return graphSize/2 - (baselineRadius * i);
  })
  .text(function(d, i) {
    return d;
  });

degreesAxis.append('line')
  .attr('x1', function (d, i) {
    return graphSize/2 - 6;
  })
  .attr('x2', function (d, i) {
    return graphSize/2;
  })
  .attr('y1', function (d, i) {
    return graphSize/2 - (baselineRadius * i);
  })
  .attr('y2', function (d, i) {
    return graphSize/2 - (baselineRadius * i);
  })
  .attr('stroke', '#000000');

radialGraph.append('line')
  .attr('x1', graphSize/2)
  .attr('x2', graphSize/2)
  .attr('y1', graphSize/2)
  .attr('y2', graphSize/2 - levelTwoRadius)
  .attr('stroke', '#000000');

currentYearPath = radialGraph.append('path')
    .datum(currentYear)
    .attr('d', currentYearLineGenerator)
    .attr('id', 'prediction')
    .attr('class', 'pie-line')
    .attr('stroke', colorScale(totalYears))
    .attr('transform', 'translate(' + (graphSize/2) +','+ (graphSize/2) +')');

yearsAgo = [20, 0];

var scale = d3.scaleLinear()
  .domain(yearsAgo)
  .range(temperatureColorRange);

radialGraph.append("g")
  .attr("class", "legendLinear")
  .attr("transform", function () {
    return "translate(" + 10 + "," + (graphSize + 20) + ")";
  });

var legendLinear = d3.legendColor()
  .shapeWidth(30)
  .orient('horizontal')
  .cells(3)
  .shapeWidth((graphSize - 20)/3)
  .shapePadding(0)
  .scale(scale);

radialGraph.select(".legendLinear")
  .call(legendLinear);


radialGraph.append('text')
  .attr('x', 10)
  .attr('text-anchor', 'start')
  .attr('alignment-baseline', 'hanging')
  .attr('y', graphSize)
  .text('Years In The Past');

// var counter = 0;

// setInterval(increment, 1000);

animationFunctions.push(increment);

function increment(x){

  // newTemp = 1 + Math.random() * 0.5;

  // d3.select('#temp-reading')
  //   .text(parseFloat(Math.round((10 + newTemp) * 100) / 100).toFixed(2) + "°C")
  //
  // // update temperature
  // d3.select('#temperature-bar')
  //   .transition()
  //   .attr('height', tempLengthScale(newTemp));

  duration = x == 0 ? 300 : 1000

  radarPie.transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr('transform', 'translate(' + (graphSize/2) + ',' + (graphSize/2) +') rotate(' + (1 * x) + ') ');

  var starting = dataYears[totalYears - 1][12];
  newReading = starting + ((1 - starting) * (x/(Math.floor(animationDuration * .8))));

  if (x == 0) {
    currentYear = [];
    currentYear[0] = starting;
  } else {
    currentYear[x] = newReading;
  }

  tempBackground.classed('alerting', newReading >= 1.0);

  currentYearPath
    .datum(currentYear)
    .attr('d', currentYearLineGenerator);

  // d3.select('#prediction')
  //   .datum(function() {
  //     var newPrediction = [];
  //
  //     for (x = 0; x < prediction.length; x++) {
  //       newPrediction[x] = prediction[x] + (x > 4 ? (Math.random() * 0.15) : 0);
  //     }
  //     return newPrediction;
  //   })
  //   .transition()
  //   .attr('d', radialLineGenerator);

  // if (counter == 1) {
    // animateLines();
  // }

  updateTempReading(true, duration, newReading);
}


// function animateLines() {
//   for (var x = 1; x < 5; x++) {
//     var path = d3.select('#year-' + x);
//
//     var totalLength = path.node().getTotalLength();
//
//     path.attr("stroke-dasharray", totalLength + " " + totalLength)
//       .attr("stroke-dashoffset", totalLength)
//       .transition()
//         .delay(1000 * (x - 1))
//         .duration(1000)
//         .attr("stroke-dashoffset", 0);
//   }
// }

var readingSize = 40;

tempReading = radialGraph.append('g')
  .attr('height', readingSize)
  .attr('width', readingSize);

tempReading.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', readingSize/2)
  // .attr('stroke', '#000000')
  .attr('fill', colorScale(totalYears));

tempReadingText = tempReading.append('text')
  .attr('id', 'temperature-reading')
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'central')
  .attr('font-size', '12');

updateTempReading(false, 0, currentYear[0]);

function updateTempReading(transition, duration, reading) {
  length = currentYearPath.node().getTotalLength();
  pos = currentYearPath.node().getPointAtLength(length);
  x = graphSize/2 + pos.x;
  y = graphSize/2 + pos.y;

  updateTemp = transition ? tempReading.transition().duration(duration).ease(d3.easeLinear) : tempReading;
  updateTemp.attr('transform', 'translate(' + x + ', ' + y+')');

  tempReadingText.text(parseFloat(Math.round((reading) * 100) / 100).toFixed(2) + "°");
}
