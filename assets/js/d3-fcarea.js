var area_chart = (function () {

    var focus, x, x2, y, y2, area, brush, xAxis, yAxis, xAxis_context;

    var parseDate = d3.time.format("%d/%m/%Y").parse;

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

    return {
        createFCAreaChart: function (placement, reqwidth, reqheight, opts) {
            var margin = {top: 10, right: 10, bottom: 100, left: 60},
                margin_context = {top: reqheight - 60, right: 10, bottom: 20, left: 60},
                width = reqwidth - margin.left - margin.right,
                height = reqheight - margin.top - margin.bottom,
                height_context = reqheight - margin_context.top - margin_context.bottom;


            var yscale = typeof opts.scale !== 'undefined' ? opts.scale : d3.scale.linear();
            var show_context = typeof opts.context !== 'undefined' ? opts.context : false;
            var zooming = typeof opts.zoom !== 'undefined' ? opts.zoom : false;

            // we create 2 scales, one for the main plot, and one for the 'context'
            x = d3.time.scale().range([0, width]),
                x2 = d3.time.scale().range([0, width]),
                y = yscale.range([height, 0]),
                y2 = d3.scale.linear().range([height_context, 0]);


            xAxis = d3.svg.axis().scale(x).orient("bottom"),
                xAxis_context = d3.svg.axis().scale(x2).orient("bottom"),
                yAxis = d3.svg.axis().scale(y).orient("left");


            brush = d3.svg.brush()
                .x(x2)
                .on("brush", brushed);

            area = d3.svg.area()
                .interpolate("monotone")
                .x(function (d) {
                    return x(d.date);
                })
                .y0(height)
                .y1(function (d) {
                    return y(d.price);
                });


            d3.select(placement).select("svg").remove();
            var svg = d3.select(placement).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);


            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            focus = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            if (show_context) {
                var area2 = d3.svg.area()
                    .interpolate("monotone")
                    .x(function (d) {
                        return x2(d.date);
                    })
                    .y0(height_context)
                    .y1(function (d) {
                        return y2(d.price);
                    });

                var context = svg.append("g")
                    .attr("class", "context")
                    .attr("transform", "translate(" + margin_context.left + "," + margin_context.top + ")");
            }

            d3.csv("assets/data/apple.csv", type, function (error, data) {
                x.domain(d3.extent(data.map(function (d) {
                    return d.date;
                })));
                // notice we start from 1! log(0) = -inf
                y.domain([1, d3.max(data.map(function (d) {
                    return d.price;
                }))]);
                x2.domain(x.domain());
                y2.domain(y.domain());


                var path = focus.append("path")
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
                    .attr("x", -height / 2)
                    .attr("y", -margin.left / 2)
                    .text("Price ($)");

                if (show_context) {
                    context.append("path")
                        .datum(data)
                        .attr("class", "fc area")
                        .attr("d", area2);

                    context.append("g")
                        .attr("class", "fc x axis")
                        .attr("transform", "translate(0," + height_context + ")")
                        .call(xAxis_context);

                    context.append("g")
                        .attr("class", "fc x brush")
                        .call(brush)
                        .selectAll("rect")
                        .attr("y", -6)
                        .attr("height", height_context + 7);
                }

                if (zooming) {
                    var zoom = d3.behavior.zoom() // we first define our zoom behaviour
                        .x(x) // assign our x scale
                        .y(y) // assign our y scale
                        .scaleExtent([1, 5]) // how far we can scale in or out
                        .on("zoom", function () { // what happens when we zoom
                            area.x(function (d) {
                                return x(d.date) * d3.event.scale;
                            })
                                .y1(function (d) {
                                    return y(d.price) * d3.event.scale;
                                });
                            path.attr("d", area);
                            focus.select('.fc.y.axis').call(yAxis);
                            focus.select('.fc.x.axis').call(xAxis);
                        });
                    svg.call(zoom);
                }

            });
        }
    }
})();
