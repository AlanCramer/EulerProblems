
var body = d3.select("body");

body
    .style("margin", "30px")
    ;

body    
    .append("label")
    .style("font", "30px sans-serif")
    .style("display", "block")
    .text("154 Sum Inverse Squares Equals a Half")
    ;

body
    .append("p")
    .text("Multiply both sides by all denominators to get a new equation involving only integers.")
    ;
    
body
    .append("p")
    .text("For example:")
    ;    

body
    .append("p")
    .text("1/2 = 1/a + 1/b + 1/c")
    ;    
body
    .append("p")
    .text("abc = 2(bc + ac + ab)")
    ;    
    
    
  
    
var maxDenom = 10;
var ints = d3.range(2, maxDenom); 
var termCt = 1;   

// build arrays
// [2,3], [2,4], ... [2,n]
// [3,4], [3,5], ... [3, n]
// [n-1, n]


// from rosettacode.org, this might be handy ... but 2 to the 45 (let alone 80)
// is too big
function powerset(ary) {
    var ps = [[]];
    for (var i=0; i < ary.length; i++) {
        for (var j = 0, len = ps.length; j < len; j++) {
            ps.push(ps[j].concat(ary[i]));
        }
    }
    return ps;
}

var sample = d3.range(2,10);
var psSample = powerset(sample);

body.append("p")
    .text("Here's the powerset for " + JSON.stringify(sample));

body.append("p")
    .text(JSON.stringify(psSample));

body.append("p")
    .text("But the powerset of 45 elements is too big, let alone 80.  I think one trick will be to filter once n terms is greater than a half." );
    

    
    
    
    
    
    
    