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

// angles
var dataYear1 = [];
var dataYear2 = [];
var dataYear3 = [];
var dataYear4 = [];

dataYear1[0] = -0.08;

var maxVariance = 0.05;

for (x = 1; x < 13; x++) {
  dataYear1[x] = dataYear1[x - 1] + (Math.random() * maxVariance);
}

dataYear2[0] = dataYear1[12];

for (x = 1; x < 13; x++) {
  dataYear2[x] = dataYear2[x - 1] + (Math.random() * maxVariance);
}

dataYear3[0] = dataYear2[12];

for (x = 1; x < 13; x++) {
  dataYear3[x] = dataYear3[x - 1] + (Math.random() * maxVariance);
}

dataYear4[0] = dataYear3[12];

for (x = 1; x < 16; x++) {
  dataYear4[x] = dataYear4[x - 1] + (Math.random() * maxVariance);
}

// var prediction = [0.95, 0.96, 0.98, 1.1, 1.2, 1.22, 1.24, 1.26, 1.3, 1.31, 1.3, 1.28, 1.27];


// Height and Width of the whole temperature section
var tempHeight = 530;
var tempWidth = 530;

// Radii of graph's circles
var baselineRadius = 60;
var levelOneRadius = baselineRadius + baselineRadius;
var levelTwoRadius = levelOneRadius + baselineRadius;

// Size of graph with padding for text labels
var graphSize = (levelTwoRadius * 2) + 100;

// A group for the radial temperature graph
temp = svg.append('g')
  .attr('id', 'temperature')
  .attr('height', tempHeight)
  .attr('width', tempWidth)
  .attr('transform', 'translate(' + (svgWidth/2 - tempWidth/2) + ',' + (svgHeight/2 - tempHeight/2 ) + ')');

// Background color
temp.append('rect')
  .attr('height',  tempHeight)
  .attr('width',  tempWidth)
  .attr('class', 'bounding-box')

// Graph's circles
temp.append('circle')
  .attr('cx', graphSize/2)
  .attr('cy', graphSize/2)
  .attr('r', levelTwoRadius)
  .attr('stroke', 'none')
  .attr('fill', graphCircleOuter);

temp.append('circle')
  .attr('cx', graphSize/2)
  .attr('cy', graphSize/2)
  .attr('r', levelOneRadius)
  .attr('stroke', 'none')
  .attr('fill', graphCircleMiddle);

temp.append('circle')
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

// scale for the radial chart line color
colorScale = d3.scaleLinear()
  .interpolate(d3.interpolateCubehelix)
  .domain([0, 3])
  .range(['#E24F59', '#F5E074']);

// create pie chart for month boudaries to divide the circles
pieGenerator = d3.pie()
  .sort(null)
  .value(function () {
    return 1;
  });

// create an arc generator for text labels
labelArc = d3.arc()
  .outerRadius(levelTwoRadius + 50)
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

// draw paths for each year
year1Path = temp.append('path')
  .attr('id', 'year-1')
  .datum(dataYear1)
  .attr('d', radialLineGenerator)
  .attr('class', 'pie-line')
  .attr('stroke', colorScale(0))
  .attr('transform', 'translate(' + (graphSize/2) +','+ (graphSize/2) +')');

year2Path = temp.append('path')
  .attr('id', 'year-2')
  .datum(dataYear2)
  .attr('d', radialLineGenerator)
  .attr('class', 'pie-line')
  .attr('stroke', colorScale(1))
  .attr('transform', 'translate(' + (graphSize/2) +','+ (graphSize/2) +')');

year3Path = temp.append('path')
  .attr('id', 'year-3')
  .datum(dataYear3)
  .attr('d', radialLineGenerator)
  .attr('class', 'pie-line')
  .attr('stroke', colorScale(2))
  .attr('transform', 'translate(' + (graphSize/2) +','+ (graphSize/2) +')');

year4Path = temp.append('path')
    .attr('id', 'year-4')
    .datum(dataYear4)
    .attr('d', radialLineGenerator)
    .attr('class', 'pie-line')
    .attr('stroke', colorScale(3))
    .attr('transform', 'translate(' + (graphSize/2) +','+ (graphSize/2) +')');

// predictionPath = temp.append('path')
//     .datum(prediction)
//     .attr('id', 'prediction')
//     .attr('d', radialLineGenerator)
//     .attr('class', 'pie-line')
//     .attr('stroke', '#fc9272')
//     .attr('stroke-dasharray', '20, 5')
//     .attr('transform', 'translate(' + (graphSize/2) +','+ (graphSize/2) +')');


// create an arc generator for pie chart (spits out the path d commands)
arcGenerator = d3.arc()
  .outerRadius(levelTwoRadius)
  .innerRadius(0);

// append a group for the pie viz
pie = temp.selectAll('.arc')
  .data(pieGenerator(months))
  .enter().append('g')
  .attr('class', 'arc');

var offset = 2; //we're on Apr

var radarColorScale = d3.scalePow()
  .exponent(2.25)
  .domain([0 , 12])
  .range([0.05, 0.7 ]);

// draw the boundaries
pie.append('path')
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

temp.append('g')
    .attr('transform', 'translate(0, ' + graphSize + ') scale (1 -1)')
  .append('rect')
    .attr('id', 'temperature-bar')
    .attr('x', graphSize)
    .attr('width', tempBarWidth)
    .attr('y', 0)
    .attr('fill', tempBarColor)
    .attr('height', tempLengthScale(1));

temp.append('text')
  .attr('id', 'temp-reading')
  .attr('x', graphSize + tempBarWidth/2)
  .attr('text-anchor', 'middle')
  .attr('y', graphSize - 8);

var counter = 0;

setInterval(increment, 1000);

function increment(){
  counter = (counter + 1) % 10;

  newTemp = 1 + Math.random() * 0.5;

  d3.select('#temp-reading')
    .text(parseFloat(Math.round((10 + newTemp) * 100) / 100).toFixed(2) + "°C")

  // update temperature
  d3.select('#temperature-bar')
    .transition()
    .attr('height', tempLengthScale(newTemp));

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
