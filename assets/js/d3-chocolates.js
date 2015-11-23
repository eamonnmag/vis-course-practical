/**
 * Created by eamonnmaguire on 23/01/2014.
 */



var d3_chocolates = (function () {

    var svg;
    var margins = {"left": 40, "right": 30, "top": 30, "bottom": 30};
    var step = 0;
    var width;
    var height;
    var colors = d3.scale.category10();
    var x, y;
    var xAxis, yAxis;
    var chocolates;
    var zoom;
    var brush;
    var selected = {};


    var brushed = function () {

        var extent = brush.extent();
        d3.selectAll("g.chocolatenode").select("circle").style("fill", function (d) {
            d.selected = (d.x > x(extent[0][0]) && d.x < x(extent[1][0]))
                && (d.y < y(extent[0][1]) && d.y > y(extent[1][1]));

            if (d.selected) {
                selected[d.name] = d;
            }
            return d.selected ? "#F15D2F" : colors(d.manufacturer);


        });

    };

    var zoomed = function () {
        d3.selectAll("g.x.axis").call(xAxis);
        d3.selectAll("g.y.axis").call(yAxis);
        svg.selectAll("g.chocolatenode").attr("transform", function (d) {
            return "translate(" + x(d.price) + "," + y(d.rating) + ")scale(" + d3.event.scale + ")"
        });
    };

    var calculateXScale = function (data, width) {
        var x = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.price;
            }))
            .range([0, width - margins.left - margins.right]);
        return x;
    };


    var calculateYScale = function (data, height) {
        var y = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.rating;
            }))
            .range([height - margins.top - margins.bottom, 0]);
        return y;
    };


    return {
        loadAndDisplay: function
            (placement, w, h, addMouse, addZoom, addRect, brushingOn, addLinking) {
            width = w;
            height = h;

            d3.select(placement).html("");

            d3.json("assets/data/chocolate.json", function (data) {
                data = data.chocolates;

                x = calculateXScale(data, width);
                y = calculateYScale(data, height);

                xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
                yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

                var zoom = d3.behavior.zoom()
                    .x(x)
                    .y(y)
                    .scaleExtent([1, 5])
                    .on("zoom", zoomed);


                svg = d3.select(placement).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");


                if (addZoom) {
                    svg.call(zoom);
                }

                if (addRect) {
                    svg.append('rect')
                        .attr('width', width)
                        .attr('height', height)
                        .attr('fill', 'rgba(1,1,1,0)');
                }

                svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")").call(xAxis);
                svg.append("g").attr("class", "y axis").call(yAxis);

                svg.append("text")
                    .attr("fill", "#414241")
                    .attr("text-anchor", "end")
                    .attr("x", width / 2)
                    .attr("y", height - 35)
                    .text("Price in pence (£)");

                var chocolate = svg.selectAll("g.chocolatenode").data(data, function (d) {
                    return d.name;
                });

                var chocolateEnter = chocolate.enter().append("g").attr("class", "chocolatenode")
                    .attr('transform', function (d) {
                        d.x = parseInt(x(d.price));
                        d.y = parseInt(y(d.rating));
                        return "translate(" + x(d.price) + "," + y(d.rating) + ")";
                    });

                chocolateEnter.append("circle")
                    .attr("r", 5)
                    .attr("class", "dot")
                    .style("fill", function (d) {
                        return colors(d.manufacturer);
                    });

                chocolateEnter
                    .append("text")
                    .style("text-anchor", "middle")
                    .attr("dy", -10)
                    .text(function (d) {
                        return d.name;
                    });

                if (brushingOn) {
                    brush = d3.svg.brush()
                        .x(x)
                        .y(y)
                        .on("brushstart", function () {
                            console.log("Resetting selected var");
                            selected = {};
                        })
                        .on("brush", function () {

                            var extent = brush.extent();
                            d3.selectAll("g.chocolatenode").select("circle").style("fill", function (d) {
                                d.selected = (d.x > x(extent[0][0]) && d.x < x(extent[1][0]))
                                    && (d.y < y(extent[0][1]) && d.y > y(extent[1][1]));

                                if (d.selected) {
                                    selected[d.name] = d;
                                }
                                return d.selected ? "#F15D2F" : colors(d.manufacturer);


                            });

                        })
                        .on("brushend", function () {
                            if (addLinking) {
                                d3_chocolates.plot_detailed(placement, selected, 300, 60);
                            }
                        });

                    svg.append("g")
                        .attr("class", "brush")
                        .call(brush);
                }

                if (addMouse) {

                    chocolateEnter.on("mouseover", function (d) {
                        d3.select(this).style("stroke-width", "1px").style("stroke", "white");
                    }).on("mouseout", function (d) {
                        d3.select(this).style("stroke", "none");
                    }).on("click", function (d) {
                        alert("Hi, you clicked on " + d.name);
                    })
                }


            });
        },

        plot_detailed: function (placement, selection, width, height) {
            d3.selectAll(".link_detail_plot").remove();
            for (var selected_idx in selection) {

                var svg = d3.select(placement).append("svg").attr({
                    "width": width + 30,
                    "height": height + 20,
                    "id": "detail-" + selected_idx,
                    "class": "link_detail_plot"
                }).append("g").attr('transform', 'translate(20,0)');


                var dataset = [];
                for (var i = 0; i < 12; i++) {
                    var newNumber = Math.random() * 60;
                    dataset.push({x: i, y: newNumber});
                }

                var x = d3.scale.linear()
                    .domain(d3.extent(dataset, function (d) {
                        return d.x
                    }))
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([0, d3.max(dataset, function (d) {
                        return d.y
                    })])
                    .range([height, 0]);

                svg.selectAll("rect").data(dataset).enter().append("rect").style("fill", colors(selected_idx)).attr('x', 0).transition().attr('height', function (d, i) {
                    return height - y(d.y);
                }).attr('width', 10).attr('x', function (d, i) {
                    return x(d.x);
                }).attr('y', function (d) {
                    return y(d.y)
                });

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .tickPadding(4);

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickPadding(2).ticks(3);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + y.range()[0] + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                svg.append("text").text(selected_idx).attr({'x': 5, y: 10})

            }
        },

        animateScatterPlot: function (placement, w, h) {

            width = w;
            height = h;

            d3.select(placement).html("");

            d3.json("assets/data/chocolate.json", function (data) {
                chocolates = data.chocolates;

                svg = d3.select(placement).append("svg").attr("width", width).attr("height", height).append("g")
                    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

                var x = calculateXScale(data.chocolates, width);
                var y = calculateYScale(data.chocolates, height);

                svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
                svg.append("g").attr("class", "y axis");

                svg.append("text")
                    .attr("fill", "#414241")
                    .attr("text-anchor", "end")
                    .attr("x", width / 2)
                    .attr("y", height - 35)
                    .text("Price in pence (£)");

                d3_chocolates.update(data.chocolates);
            });
        },


        update: function (data) {
            var x = calculateXScale(data, width);
            var y = calculateYScale(data, height);

            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
            var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

            svg.selectAll("g.y.axis").transition().duration(500).call(yAxis);
            svg.selectAll("g.x.axis").transition().duration(500).call(xAxis);

            var chocolate = svg.selectAll("g.node").data(data, function (d) {
                return d.name;
            });

            var chocolateEnter = chocolate.enter().append("g").attr("class", "node")
                .attr('transform', function (d) {
                    return "translate(" + x(d.price) + "," + (height + 100) + ")";
                });

            chocolateEnter.append("circle")
                .attr("r", 5)
                .attr("class", "dot")
                .style("fill", function (d) {
                    return colors(d.manufacturer);
                });

            chocolateEnter
                .append("text")
                .style("text-anchor", "middle")
                .attr("dy", -10)
                .text(function (d) {
                    return d.name;
                });

            chocolateEnter.on("mouseover", function (d) {
                d3.select(this).style("stroke-width", "1px").style("stroke", "white");
            }).on("mouseout", function (d) {
                d3.select(this).style("stroke", "none");
            });

            chocolate.transition().duration(500)
                .attr('transform', function (d) {
                    return "translate(" + x(d.price) + "," + y(d.rating + step) + ")";
                });


            var chocolateExit = chocolate.exit().remove();
            chocolateExit.selectAll('circle')
                .attr('r', 0);
        },

        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getChocolates: function() {
            return chocolates;
        }

    }
})
();