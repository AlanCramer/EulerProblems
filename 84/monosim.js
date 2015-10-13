
(function()  {
    
    var bdy = d3.select("body");

    var title = bdy.append("text");

    title
        .text("Monopoly Simulator")
        .attr("class", "title");
        
    var svg = bdy.append("svg")
        .attr("class", "chart");
        
    var spaces = [
        "GO",   "A1", "CC1", "A2",  "T1", "R1", "B1",  "CH1", "B2", "B3", 
        "JAIL", "C1", "U1",  "C2",  "C3", "R2", "D1",  "CC2", "D2", "D3", 
        "FP",   "E1", "CH2", "E2",  "E3", "R3", "F1",  "F2",  "U2", "F3", 
        "G2J",  "G1", "G2",  "CC3", "G3", "R4", "CH3", "H1",  "T2", "H2"
    ];
    
    // the data ... how many times we landed on each space
    var landCts = [];
    spaces.forEach(function(spc) { landCts.push(0); });
    
    
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .domain(spaces)
        .rangeRoundBands([0, width], .1)
        ;

    var y = d3.scale.linear()
        .domain([0, 0.15 ]) 
        .range([height, 0]);
    
    
    var setupHistogram = function() {

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var chart = d3.select(".chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis);
            
        chart.selectAll(".bar")
            .data(landCts)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d, i) { 
                return x(spaces[i]); })
          .attr("y", function(d) { 
                return y(d) ; })
          .attr("height", function(d) { 
                return height - y(d); })
          .attr("width", x.rangeBand());    
    };
    
    var updateHistogram = function(landCts, total) {
        
        var chart = d3.select(".chart");
        var bars = chart.selectAll(".bar")
            .data(landCts);

        bars
            .transition()
            .attr("class", "bar")
            .attr("x", function(d, i) { 
                return x(spaces[i]); })
            .attr("y", function(d) { 
                return y(d/total) ; })
            .attr("height", function(d) { 
                return height - y(d/total); })
            .attr("width", x.rangeBand()); 
    };
            
    var beginSimulation = function() {
        
        var rollCt = 1000;
        
        d3.range(rollCt).forEach(function (i) {
            var rn = Math.floor(Math.random()*landCts.length);
            landCts[rn]++;
         
            updateHistogram(landCts, rollCt);           
            
        });
        

        
    };
    
    setupHistogram();
    beginSimulation();
    
})();

