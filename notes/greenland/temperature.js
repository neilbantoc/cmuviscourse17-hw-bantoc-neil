// angles
var dataYear1 = [0, -0.1, -0.15, -0.11, 0, 0.2, 0.22, 0.2, 0.11, 0.2, 0.3, 0.2, 0.1];
var dataYear2 = [0.1, 0.12, 0.13, 0.2, 0.22, 0.24, 0.25, 0.3, 0.28, 0.25, 0.3, 0.33, 0.3];
var dataYear3 = [0.3, 0.34, 0.35, 0.4, 0.44, 0.4, 0.38, 0.4, 0.44, 0.5, 0.56, 0.6, 0.55];
var dataYear4 = [0.55, 0.56, 0.6, 0.66, 0.7, 0.74, 0.78, 0.8, 0.85, 0.89, 0.9, 0.92, 0.95, 0.96, 0.98, 1.1];
var prediction = [0.95, 0.96, 0.98, 1.1, 1.2, 1.22, 1.24, 1.26, 1.3, 1.31, 1.3, 1.28, 1.27];
var prediction2 = [0.95, 0.96, 0.98, 1.1, 1.22, 1.24, 1.26, 1.28, 1.32, 1.33, 1.32, 1.3, 1.29];

var temperatures = [1.0, 1.2, 1.3, 1.0, 0.9, 0.8, 0.6, 0.8, 1, 1.12, 1.1, 1.12, 1.3];


var tempHeight = 600;
var tempWidth = 500;
var baselineRadius = 60;

var levelOneRadius = baselineRadius + baselineRadius;
var levelTwoRadius = levelOneRadius + baselineRadius;

temp = svg.append('g')
  .attr('id', 'temperature')
  .attr('height', tempHeight)
  .attr('width', tempWidth)
  .attr('background-color', '#ff0000');

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

temp.append('circle')
  .attr('cx', tempWidth/2)
  .attr('cy', tempWidth/2)
  .attr('r', levelTwoRadius)
  .attr('stroke', 'none')
  .attr('fill', blue5);

temp.append('circle')
  .attr('cx', tempWidth/2)
  .attr('cy', tempWidth/2)
  .attr('r', levelOneRadius)
  .attr('stroke', 'none')
  .attr('fill', blue3);

temp.append('circle')
  .attr('cx', tempWidth/2)
  .attr('cy', tempWidth/2)
  .attr('r', baselineRadius)
  .attr('stroke', 'none')
  .attr('fill', blue1);

temp.append('path')
  .attr('fill', 'none')
  .attr('d');

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

// create pie for month boudaries
pieGenerator = d3.pie()
  .sort(null)
  .value(function () {
    return 1;
  });

// create an arc generator for pie chart (spits out the path d commands)
arcGenerator = d3.arc()
  .outerRadius(levelTwoRadius)
  .innerRadius(0);

// create an arc generator for text labels
labelArc = d3.arc()
  .outerRadius(levelTwoRadius + 40)
  .startAngle(function(d) {
    return d.startAngle - (15 * (Math.PI/180));
  })
  .endAngle(function(d) {
    return d.endAngle - (15 * (Math.PI/180));
  })
  .innerRadius(levelTwoRadius);

// append a group for the pie viz
pie = temp.selectAll('.arc')
  .data(pieGenerator(months))
  .enter().append('g')
  .attr('class', 'arc');

pie.append('path')
  .attr('transform', 'translate(' + tempWidth/2 +','+ tempWidth/2 +')')
  .attr('d', arcGenerator)
  .attr('class', 'pie-divider');

pie.append('text')
  .attr('transform', function(d) { return 'translate(' + tempWidth/2 + ',' + tempWidth/2 +') translate(' + labelArc.centroid(d) + ')'; })
  .attr('class', 'pie-label')
  .attr("dy", ".35em")
  .text(function(d) { return d.data.name; });


// create temperature line graph
radialLineGenerator = d3.radialLine()
  .radius(function(d, i){ return radialScale(d); })
  .angle(function(d, i){ return (i * 30 % 360) * (Math.PI/180) ; });

year1Path = temp.append('path')
  .datum(dataYear1)
  .attr('d', radialLineGenerator)
  .attr('class', 'pie-line')
  .attr('stroke', '#a50f15')
  .attr('transform', 'translate(' + tempWidth/2 +','+ tempWidth/2 +')');

year2Path = temp.append('path')
  .datum(dataYear2)
  .attr('d', radialLineGenerator)
  .attr('class', 'pie-line')
  .attr('stroke', '#de2d26')
  .attr('transform', 'translate(' + tempWidth/2 +','+ tempWidth/2 +')');

year3Path = temp.append('path')
  .datum(dataYear3)
  .attr('d', radialLineGenerator)
  .attr('class', 'pie-line')
  .attr('stroke', '#fb6a4a')
  .attr('transform', 'translate(' + tempWidth/2 +','+ tempWidth/2 +')');

year4Path = temp.append('path')
    .datum(dataYear4)
    .attr('d', radialLineGenerator)
    .attr('class', 'pie-line')
    .attr('stroke', '#fc9272')
    .attr('transform', 'translate(' + tempWidth/2 +','+ tempWidth/2 +')');

predictionPath = temp.append('path')
    .datum(prediction)
    .attr('id', 'prediction')
    .attr('d', radialLineGenerator)
    .attr('class', 'pie-line')
    .attr('stroke', '#fc9272')
    .attr('stroke-dasharray', '20, 5')
    .attr('transform', 'translate(' + tempWidth/2 +','+ tempWidth/2 +')');

tempBarHeight = levelTwoRadius * 2;

tempLengthScale = d3.scaleLinear()
  .domain([0, 2])
  .range([0, tempBarHeight]);

temp.append('g')
    .attr('transform', 'translate(0, ' + (tempWidth/2 - levelTwoRadius) + ')')
  .append('rect')
    .attr('id', 'temperature-bar')
    .attr('x', tempWidth/2 + levelTwoRadius + 60)
    .attr('width', 10)
    .attr('y', tempBarHeight - tempLengthScale(temperatures[0]))
    .attr('fill', blue5)
    .attr('height', tempLengthScale(temperatures[0]));

var counter = 0;

setInterval(increment, 1000);

function increment(){
  counter = (counter + 1) % 10;

  // update temperature
  d3.select('#temperature-bar')
    .transition()
    .attr('y', tempBarHeight - tempLengthScale(temperatures[counter]))
    .attr('height', tempLengthScale(temperatures[counter]));

  // update radial graph
  if (counter > 5) {
    d3.select('#prediction')
      .datum(prediction2)
      .transition()
      .duration(300)
      .attr('d', radialLineGenerator);
  } else {
    d3.select('#prediction')
      .datum(prediction)
      .transition()
      .duration(300)
      .attr('d', radialLineGenerator);
  }
}

var labelMargin = 20;
var labelHeight = tempHeight - (levelTwoRadius * 2) - baselineRadius - (labelMargin * 2);

// create labels for radial graph
temp.append('g')
  .attr('id', 'pie-legends')
  .attr('width', tempWidth)
  .attr('height', 50)
  .attr('transform', 'translate(' + 0 + ', ' + (tempHeight - labelHeight) + ')')
  .append('image')
  .attr('height', labelHeight)
  .attr('width', tempWidth)
  .attr('xlink:href', 'pie-legends.png');
