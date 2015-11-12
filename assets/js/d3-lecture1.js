
var VisualAnalytics = {}

var data = [
    {x: 10.0, y: 9.14},
    {x: 15.0, y: 18.14},
    {x: 13.0, y: 28.74},
    {x: 49.0, y: 35.77},
    {x: 11.0, y: 9.26},
    {x: 23.0, y: 18.10},
    {x: 43.0, y: 16.13},
    {x: 65.0, y: 13.10},
    {x: 12.0, y: 19.13},
    {x: 30.0, y: 70.26},
    {x: 25.0, y: 40.74}
];

VisualAnalytics.charts = {

    plotDotPlot1: function (placement, width, height) {

        d3.select(placement).html("");
        var svg = d3.select(placement).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        svg.append("circle")
            .style("fill", "#1abc9c")
            .attr("cx", 40)
            .attr("cy", 200)
            .attr("r", 15);

        svg.append("path")
            .attr("d", d3.svg.symbol()
                .size(200)
                .type("cross"))
            .style("fill", "#1abc9c")
            .attr("transform", "translate(90,200)");

        svg.append("path")
            .attr("d", d3.svg.symbol()
                .size(220)
                .type("square"))
            .style("fill", "#1abc9c")
            .attr("transform", "translate(240,200)");

        svg.append("path")
            .attr("d", d3.svg.symbol()
                .size(200)
                .type("triangle-up"))
            .style("fill", "#1abc9c")
            .attr("transform", "translate(140,200)");

        svg.append("path")
            .attr("d", d3.svg.symbol()
                .size(200)
                .type("triangle-down"))
            .style("fill", "#1abc9c")
            .attr("transform", "translate(190,200)");


        svg.append("path")
            .attr("d", d3.svg.symbol()
                .size(220)
                .type("diamond"))
            .style("fill", "#1abc9c")
            .attr("transform", "translate(290,200)");

    },

    plotDotPlot2: function (placement, width, height) {
        var margin = {top: 20, right: 20, bottom: 20, left: 30};

        d3.select(placement).html("");
        var svg = d3.select(placement).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return height - margin.top - d.y;
            })
            .attr("r", 5);
    },

    plotDotPlot3: function (placement, width, height) {
        d3.select(placement).html("");
        var margin = {top: 20, right: 20, bottom: 20, left: 30};

        var x = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.x;
            }))
            .range([0, width - margin.left - margin.right]);

        var y = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.y;
            }))
            .range([height - margin.top - margin.bottom, 0]);

        var svg = d3.select(placement).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d) {
                return x(d.x);
            })
            .attr("cy", function (d) {
                return y(d.y);
            })
            .attr("r", 5);

    },

    plotDotPlot4: function (placement, width, height) {
        d3.select(placement).html("");
        var margin = {top: 20, right: 20, bottom: 20, left: 30};

        var x = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.x;
            }))
            .range([0, width - margin.left - margin.right]);

        var y = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.y;
            }))
            .range([height - margin.top - margin.bottom, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickPadding(4);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickPadding(10);

        var svg = d3.select(placement).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d) {
                return x(d.x);
            })
            .attr("cy", function (d) {
                return y(d.y);
            })
            .attr("r", 5);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y.range()[0] + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    },

    plotDotPlot5: function (placement, width, height) {
        d3.select(placement).html("");
        var margin = {top: 20, right: 20, bottom: 20, left: 30};

        var x = VisualAnalytics.functions.pad(d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.x;
            }))
            .range([0, width - margin.left - margin.right]), 10);

        var y = VisualAnalytics.functions.pad(d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.y;
            }))
            .range([height - margin.top - margin.bottom, 0]), 10);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickPadding(4);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickPadding(10);

        var svg = d3.select(placement).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d) {
                return x(d.x);
            })
            .attr("cy", function (d) {
                return y(d.y);
            })
            .attr("r", 5);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y.range()[0] + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    }
}

var enter_svg;

VisualAnalytics.enter = {
    showCircles : function(placement, width, height) {
        d3.select(placement).html("");
        enter_svg = d3.select(placement).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        this.update([{x:30, y:60}]);
    },

    update: function(data) {
        var rect = enter_svg.selectAll("rect")
            .data(data);

        rect.enter().append("rect")
            .style("fill", "#fff")
            .attr("height", 20)
            .attr("width", 0)
            .transition()
            .attr("width", 25);

        rect
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });

        rect.exit().attr("width", 25).transition()
            .attr("width", 0)
            .remove();
    }
}

VisualAnalytics.functions = {
    pad: function (scale, k) {
        var range = scale.range();
        if (range[0] > range[1]) k *= -1;
        return scale.domain([range[0] - k, range[1] + k].map(scale.invert)).nice();
    }
}

