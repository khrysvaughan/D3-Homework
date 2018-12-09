// @TODO: YOUR CODE HERE!

// Load data from data.csv
// d3.csv("./data.csv", function (error, statedata) {
//     if (error) return console.warn(error);
//     console.log(statedata);

//     // log a list of names
//     //var state = statedata.map(data => data.state);
//     //console.log("State", state);
// });

// Set up our chart
//var svgWidth = parseInt(d3.select("#scatter").style("width"));
//var svgHeight = svgWidth - (svgWidth / 4);

var svgWidth = 900;
var svgHeight = 500;

var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//SVG
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var scatter = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv", function (error, data) {

    if (error) throw error;
    //console.log(data)

    // format the data
    data.forEach(function (d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // Scales. They need to increase a bit to fit!
    var povertymin = d3.min(data, d => d.poverty) * 0.9
    var povertymax = d3.max(data, d => d.poverty) * 1.1
    var healthcaremin = d3.min(data, d => d.healthcare) * 0.9
    var healthcaremax = d3.max(data, d => d.healthcare) * 1.1

    var xScale = d3.scaleLinear()
        .domain([povertymin, povertymax])
        .range([0, width])
    var yScale = d3.scaleLinear()
        .domain([healthcaremin, healthcaremax])
        .range([height, 0])


    // X-axis
    var xAxis = d3.axisBottom(xScale)
    // Y-axis
    var yAxis = d3.axisLeft(yScale)


    // Circles
    scatter.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr('r', '10')
        .attr('fill', "lightblue")
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r', 20)
                .attr('stroke-width', 3)
        })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r', 10)
                .attr('stroke-width', 1)
        })

    scatter.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            return d.abbr
        })
        .attr("x", function (data) {
            return xScale(data["poverty"]);
        })
        .attr("y", function (data) {
            return yScale(data["healthcare"]);
        })
        .attr("font-size", "9px")
        .attr("text-anchor", "middle")
        .style("fill", "white");


    // X-axis
    scatter.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    scatter.append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 10) + ")")
        .text("In Poverty (%)");

    // Y-axis
    scatter.append('g')
        .call(yAxis)
        .attr("class", "axis-text")

    scatter.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Lacks Healthcare (%)");


})