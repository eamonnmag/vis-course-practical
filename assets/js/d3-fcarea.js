

var savedYScale = null;
var savedSVG = null;
var savedArea = null;
var savedFocus = null;
var savedPath = null;

function createFCAreaChart(placement, reqwidth, reqheight, opts) { 
    var margin = {top: 10, right: 10, bottom: 100, left: 60},
        margin2 = {top: reqheight-60, right: 10, bottom: 20, left: 60},
        width = reqwidth - margin.left - margin.right,
        height = reqheight - margin.top - margin.bottom,
        height2 = reqheight - margin2.top - margin2.bottom;

    var parseDate = d3.time.format("%d/%m/%Y").parse;

    var yscale = typeof opts.scale !== 'undefined' ? opts.scale : d3.scale.linear();
    var show_context = typeof opts.context !== 'undefined' ? opts.context : false;
    var zooming = typeof opts.zoom !== 'undefined' ? opts.zoom : false;

    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = yscale.range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);


    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left");

    savedYAxis = yAxis;

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    var area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.price); });

    savedArea = area;

    d3.select(placement).select("svg").remove();
    var svg = d3.select(placement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    savedSVG = svg;

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    
    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    savedFocus = focus;

    if(show_context) {
        var area2 = d3.svg.area()
            .interpolate("monotone")
            .x(function(d) { return x2(d.date); })
            .y0(height2)
            .y1(function(d) { return y2(d.price); });
        
        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    }

    d3.csv("assets/data/apple.csv", type, function(error, data) {
        x.domain(d3.extent(data.map(function(d) { return d.date; })));
        // notice we start from 1! log(0) = -inf
        y.domain([1, d3.max(data.map(function(d) { return d.price; }))]);
        x2.domain(x.domain());
        y2.domain(y.domain());
    
        savedYScale = y;

        savedPath = focus.append("path")
            .datum(data)
            .attr("class", "fc area")
            .attr("d", area);

        focus.append("g")
            .attr("class", "fc x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "fc x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", margin.bottom - 60)
            .text("Year");

        focus.append("g")
            .attr("class", "fc y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("class", "fc x label")
            .attr("text-anchor", "middle")
            .attr("x", - height / 2)
            .attr("y", - margin.left / 2)
            .text("Price ($)");

        if(show_context) {
            context.append("path")
                .datum(data)
                .attr("class", "fc area")
                .attr("d", area2);

            context.append("g")
                .attr("class", "fc x axis")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "fc x brush")
                .call(brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", height2 + 7);
        }

        if(zooming) {
            var zoom = d3.behavior.zoom() // we first define our zoom behaviour
                .x(x) // assign our x scale
                .y(y) // assign our y scale
                .scaleExtent([1, 5]) // how far we can scale in or out
                .on("zoom", function() { // what happens when we zoom
                    area.x(function(d) { return x(d.date) * d3.event.scale; })
                        .y1(function(d) { return y(d.price) * d3.event.scale; });
                    savedPath.attr("d", area);
                    savedFocus.select('.fc.y.axis').call(yAxis);
                    savedFocus.select('.fc.x.axis').call(xAxis);
                });
            savedSVG.call(zoom);
        }

    });

    function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select(".area").attr("d", area);
        focus.select(".x.axis").call(xAxis);
    }

    function type(d) {
        d.date = parseDate(d.date);
        d.price = +d.close;
        return d;
    }
}
