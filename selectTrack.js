var clickedPlace;
var clickedDifficulty;

var h = $("#leftSide").height();
var w = $("#rightSide").width();

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,  
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.place; }));
  y.domain([0, d3.max(data, function(d) { return d.difficulty; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

  svg.append("g")
      .attr("class", "y axis");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.place);})
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.difficulty); })
      .attr("height", function(d) { return height - y(d.difficulty);})
      .on("click", function(d){
	      clickedPlace = d.place; 
	      clickedDifficulty = d.difficulty;
	      alert("You have picked " + (clickedPlace) + "!");});

      });

function type(d) {
  d.difficulty = +d.difficulty;
  return d;
}