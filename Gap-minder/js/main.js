/*
*    main.js
*    Project 2 - Gapminder Clone
*/
var margin  = {left : 50, right : 10, top : 10, bottom : 50};
var width  = 700 - margin.left - margin.right;
var height = 700 - (margin.top + margin. bottom);
var t = d3.transition().duration(100); // D3 transition
var flag = 0;
var time = 0;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height",height + margin.top+margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleLog()
    .base(10)
    .range([0,width])
    .domain([142,150000]);

var y = d3.scaleLinear()
    .range([height,0])
    .domain([0,90]);

var area = d3.scaleLinear()
    .range([25*Math.PI,1500*Math.PI])
    .domain([2000, 1400000000]);
    
var continentColor = d3.scaleOrdinal(d3.schemeCategory10);
// var xAxisGroup =  g.append("g")
//     .attr("class", "x axis")
//     .attr("transform","translate(0," + height +")");
    // .call(xAxisCall);

// var yAxisGroup = g.append("g")
//     .attr("class", "y axis");
    // .call(yAxisCall);

var xLabel = g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
	.text("GDP");

// Y Label
var yLabel = g.append("text")
    .attr("y", -40)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life Expectancy");

var timeLabel = g.append("text")
    .attr("y", height -10)
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("1800");

var xAxisCall = d3.axisBottom(x)
	.tickValues([400,4000,40000])
    .tickFormat(d3.format("$"));
g.append("g")
    .attr("class", "x axis")
    .attr("transform","translate(0," + height +")")
    .call(xAxisCall);

var yAxisCall = d3.axisLeft(y)
	.tickFormat(function(d){
		return +d;
    });
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);




d3.json("data/data.json").then(function(data){
    console.log(data);

	//Clean data
	const formattedData = data.map(function(year){
		return year["countries"].filter(function(country){
            var Dataexists = (country.income && country.life_exp);
            return Dataexists;
        }).map(function(country){
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            return country;
        })
    });
    d3.interval(function(){
        time = (time <214) ? time +1 : 0;
        update(formattedData[time]);
    }, 100);
    update(formattedData[time]);
})

function update(data){
    
    var circles = g.selectAll("circle").data(data, function(d){
        return d.country;
    });

    // xAxisGroup.transition(t).call(xAxisCall);
    // yAxisGroup.transition(t).call(yAxisCall);

    circles.exit()
    .transition(t)
        .attr("y",y(0))
        .attr("r",0)
        .remove();
    
    circles.transition(t)
        .attr("cx", function(d,i){
            return (x(d.income));
        })
        .attr("cy", function(d){
            return y(d.life_exp);
        })
        .attr("r", function(d){
            return(Math.sqrt((area(d.population))/3.14));
            // return(height - y(d[value]));
        });
    circles.enter()               //ENTER new elements presene in new data
        .append("circle")
            .attr("cx", function(d,i){
                return (x(d.income));
            })
            .attr("cy", y(0))
            .attr("r",0)
            .attr("fill", function(d){
                return continentColor(d.continent);
            })
        .transition(t)
            .attr("cx", function(d,i){
                return(x(d.income));
            })
            .attr("cy", function(d){
                return(y(d.life_exp));
            })
            .attr("r", function(d){  // change radius to area
                return(Math.sqrt((area(d.population))/3.14));
                // return(height - y(d[value]));
            });
        timeLabel.text(+(time+1800));
}
