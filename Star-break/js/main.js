/*
*    main.js
*   Project 1 - Star Break Coffee
*/
var margin  = {left : 50, right : 10, top : 10, bottom : 50};
var width  = 700 - margin.left - margin.right;
var height = 700 - (margin.top + margin. bottom);
var t = d3.transition().duration(750); // D3 transition
var flag = 0;
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height",height + margin.top+margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xAxisGroup =  g.append("g")
    .attr("class", "x axis")
    .attr("transform","translate(0," + height +")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
.text("Month");

// Y Label
var ylabel = g.append("text")
    .attr("y", -40)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");



var x = d3.scaleBand()
    .range([0,width])
    .paddingInner(0.3)
    .paddingOuter(0.3);
var y = d3.scaleLinear()
    .range([height, 0]);


d3.json("data/revenues.json").then(function(data){
    console.log(data);
    // var sum = 0;
    // var avg = 0;
    // data.forEach(d => {
    //     d.revenue = +d.revenue;
    //     sum = sum + d.revenue;
    //     avg = sum / 7;
    // });
    

    d3.interval(function(){
        // console.log("hello world");
        var newdata = flag ? data : data.slice(1);

        update(newdata);
        flag = !flag;
    }, 1000);
});

function update(data){

    var value = flag ? "revenue" : "profit";
    ylabel.text(value);
    var sum =0;
    var avg = 0;
    data.forEach(d => {
        d[value] = +d[value];
        sum = sum + d[value];
        avg = sum / 7;
    });

    x.domain(data.map(function(d){
        return d.month;
    }))

    y.domain([0, d3.max(data, function(d){
        return d[value];
    })])

    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);

  
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){
            return "$" +d;
        });
    
    yAxisGroup.transition(t).call(yAxisCall);

    var rects = g.selectAll("rect").data(data, function(d){
        return d.month;
    }); //JOIN new data with old elements
    
    rects.exit()
    .transition(t)
        .attr("y",y(0))
        .attr("height",0)
        .remove(); //EXIT old elements not present in new data
    
    rects.transition(t)                           // UPDATE old elements present in new data
        .attr("x", function(d,i){
            return x(d.month);
        })
        .attr("y", function(d){
            return y(d[value]);
        })
        .attr("width", x.bandwidth)
        .attr("height", function(d){
            return(height - y(d[value]));
        })
        
    rects.enter()                   //ENTER new elements presene in new data
        .append("rect")
            .attr("x", function(d,i){
                return x(d.month);
            })
            .attr("y", y(0))
            .attr("width", x.bandwidth)
            .attr("height",0)
            .attr("fill", function(d){
                if(d[value] <  avg){
                    return "red";
                }
                else{
                    return "blue";
                }
            })
        .transition(t)
            .attr("y", function(d){
                return y(d[value]);
            })
            .attr("height", function(d){
                return(height - y(d[value]));
            });
};
