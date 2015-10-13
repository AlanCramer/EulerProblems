
(function()  {
    
    var bdy = d3.select("body");

    var title = bdy.append("text");

    title
        .text("Monopoly Simulator")
        .attr("class", "title");
    
    var infoArea = bdy.append("div")
        .attr("id", "infoArea");
    
    var throwCtLbl = infoArea.append("label")
        .attr("class", "throw-ct");
    
    var dieLable = infoArea.append("label")
        .attr("class", "die-label");
    
    throwCtLbl.text("Throw Number: 0");
    dieLable.text("Die 1: 0 Die 2: 0");
    
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
        .domain([0, 0.08 ]) 
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
            .attr("class", "bar")
            .attr("x", function(d, i) { 
                return x(spaces[i]); })
            .attr("y", function(d) { 
                return y(d/total) ; })
            .attr("height", function(d) { 
                return height - y(d/total); })
            .attr("width", x.rangeBand()); 
    };
            
            
    // input obj contains tokenIdx, d1, d2, curDblCt
    // ri stands for rollInfo
    var doMonopolyRules = function(ri) {
    
        // three doubles?
        ri.curDblCt = (ri.d1 === ri.d2) ? (ri.curDblCt+1) : 0;
        if (ri.curDblCt === 3) {
            
            ri.tokenIdx = spaces.indexOf("JAIL");
            return;
        }
        
        if (ri.tokenIdx === spaces.indexOf("G2J")) {
            
            ri.tokenIdx = spaces.indexOf("JAIL");
            return;
        }    
        
        ri.tokenIdx = (ri.tokenIdx + ri.d1 + ri.d2) % spaces.length;
    
        // pull Chance, Community Chest cards
        // static
        var ccSpaces = [spaces.indexOf("CC1"), spaces.indexOf("CC2"), spaces.indexOf("CC3")];
        var chSpaces = [spaces.indexOf("CH1"), spaces.indexOf("CH2"), spaces.indexOf("CH3")];

        // we do chance first since move back three can happen only here
        if (chSpaces.indexOf(ri.tokenIdx) != -1) {
            
            ri.tokenIdx = chCards[topChCard](ri.tokenIdx);
            topChCard = (topChCard+ 1)% chCards.length;
        }
        
        if (ccSpaces.indexOf(ri.tokenIdx) != -1) {
            
            ri.tokenIdx = ccCards[topCcCard](ri.tokenIdx);
            topCcCard = (topCcCard+ 1)% ccCards.length;
        }
        
        
        
    };    

    var initCards = function(ccCards, chCards) {
      
        // community chest
        d3.range(16).forEach(function(i) { ccCards[i] = (function(tokenIdx){ return tokenIdx; }); }); // no op function
        ccCards[0] = (function(tokenIdx) { return spaces.indexOf("GO");}); 
        ccCards[1] = (function(tokenIdx) { return spaces.indexOf("JAIL");});

        d3.range(16).forEach(function(i) { chCards[i] = (function(tokenIdx){ return tokenIdx; }); }); // no op function
        chCards[0] = (function(tokenIdx) { return spaces.indexOf("GO"); });
        chCards[1] = (function(tokenIdx) { return spaces.indexOf("JAIL"); });
        chCards[2] = (function(tokenIdx) { return spaces.indexOf("C1"); });
        chCards[3] = (function(tokenIdx) { return spaces.indexOf("E3"); });
        chCards[4] = (function(tokenIdx) { return spaces.indexOf("H2"); });
        chCards[5] = (function(tokenIdx) { return spaces.indexOf("R1"); });
        // chCards[6] = (function(tokenIdx) { 
        // chCards[7] = 
        // chCards[8] = 
        chCards[9] = (function(tokenIdx) { return tokenIdx-3; });
        
    };
    
            
    var beginSimulation = function() {
        
        var rollCt = 1000000;
        var rollNum = 0;
        var tokenIdx = 0 ; // start at "GO"
        var curDblCt = 0; // watch for 3 in a row
        
        d3.range(rollCt).forEach(function (i) {
                   
            rollNum++;
//            var rn = Math.floor(Math.random()*landCts.length);
//            landCts[rn]++;

            var d1 = Math.floor(Math.random()*6) + 1;
            var d2 = Math.floor(Math.random()*6) + 1;  
            
            // d3.select("#infoArea .throw-ct")
                // .text("Throw Number: " + rollNum);
            // d3.select("#infoArea .die-label")
                // .text("Die 1: " + d1 + " Die 2: " + d2);
                
            var rollInfo = {tokenIdx: tokenIdx, d1:d1, d2:d2, curDblCt:curDblCt};
            doMonopolyRules(rollInfo);
            tokenIdx = rollInfo.tokenIdx;
            curDblCt = rollInfo.curDblCt;
            
            landCts[tokenIdx]++;
                     
        });
        
        updateHistogram(landCts, rollCt);           

    };
    
    setupHistogram();
    
    var topCcCard = 0;
    var topChCard = 0;
    
    var ccCards = [];
    var chCards = [];

    initCards(ccCards, chCards);
    
    beginSimulation();
    
    landCts.forEach(function(lc, i) { console.log (spaces[i] + " " + lc) ;});
    
})();

