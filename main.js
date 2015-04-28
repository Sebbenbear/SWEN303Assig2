      var data;
      var distanceCoveredKilometers = 0;
      var distanceCoveredMeters = 0;
      var distancePerStep = 0.5;  
      var timePerStep = 0.85;  
      var totalDistanceToSummit = 6265.913535472343;
      var totalTime = 2.98;
      var oneStepTime = 0.4;
      var currentElevation = 298.00;
      var currentEta = 2.98;

      function update(num) {
        "use strict";
        updateElevation();
        updateEta(num);
        $("#steps").text(num);
        $("#distance").text((num * distancePerStep)/1000 + " km");
        $("#eta").text(parseFloat(Math.round(currentEta * 100) / 100).toFixed(2) + " hours"); 
        $("#elevation").text(parseFloat(Math.round(currentElevation * 100) / 100).toFixed(2) + " m"); 
        
        if(distanceCoveredMeters > totalDistanceToSummit){
	    alert("You reached the end!");
        }
        distanceCoveredKilometers = (num * distancePerStep)/1000;
        distanceCoveredMeters = (num * distancePerStep);
      }

      //Updates the steps on the screen
      function add(num) {
        "use strict";
        update($("#steps").text()*1 + num);
      }
      
      //Checks if you've gone past the goal, and updates ETA in hours.
      function updateEta(num){
	if(currentEta <= 0){
	  currentEta = 0;
	}
	else {
	  currentEta = totalTime - (num * (timePerStep/60)/60);
	}
      }
      
      //Goes through json object, picks out the elevation estimate to display on screen
      function updateElevation(){
	var prevElevation; 
	for(var i=1;i<data.length;i++){
            if(distanceCoveredMeters > data[i].distance){
	      currentElevation = data[i].elevation;
            }
	    prevElevation = (data[i].elevation);
        }
      }

      //Construct the svg and displays the data
      //Reference: http://bl.ocks.org/mbostock/3883195
      function visualize(data) {
        "use strict";
        var h = $("#bottomRow > div:first-child").height();
        var w = $("#bottomRow > div:first-child").width();

        var margin = {top: 20, right: 10, bottom: 30, left: 50},
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom
        var x = d3.scale.linear()    
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var area = d3.svg.area()
            .x(function(d) { return x(d.distance); })
            .y0(height)  
            .y1(function(d) { return y(d.elevation); });

        var svg = d3.select("#bottomRow > div:first-child").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           
        x.domain(d3.extent(data, function(d) { return d.distance; }));
        y.domain([0, d3.max(data, function(d) { return d.elevation; })]);

        //Create a sharp gradient to differentiate where you have walked, and where you are walking to.
        var grad = svg.append("defs")
                 .append("linearGradient")
                 .attr("id","grad");

        grad.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "orange");

        grad.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#1c8d51");

        svg.append("path")
            .datum(data)      
            .attr("class", "area")
            .attr("d", area)
            .attr("fill", "url(#grad)");  

            //x axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
              .attr("fill", "white");

            //y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .attr("fill", "white")
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Elevation (m)");
      }

      //Update the map
      function updateData() {
        //compute percentage
        var percent = (100 * distanceCoveredMeters/totalDistanceToSummit) + "%";
        d3.select("#grad")
        .selectAll("stop")
        .transition()
        .duration(300)
        .attr("offset", percent);
      }

      //JQuery - clicking
      $(document).ready(function () {  
          $("#take1step").click(function () {
              add(1);
              updateData();
          });

      $("#take50steps").click(function () {
              add(50);
              updateData();
          });

      $("#take1000steps").click(function () {
              add(1000);
              updateData();
          });

          d3.json("powellhutt.json", function(error, json) {
            if (error) return console.warn(error);
            data = json.data;
            spacing = data[1].distance;
            visualize(json.data);
          });
      }); 
