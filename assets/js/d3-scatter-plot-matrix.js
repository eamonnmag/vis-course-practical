/**
 * Created by eamonnmaguire on 12/11/15.
 * Usage: scatter_plot_matrix.render_from_file("#scatter-matrix-canvas", "assets/data/patients-1.csv",
 ["Blood Glucose","Cholesterol", "HDL Ratio", "LDL Ratio"], "patient", {"width": 1280, "height": 500});
 */

var scatter_plot_matrix = (function () {


    var x = {}, y = {};
    var size = 140, padding = 5;
    var data;
    var svg;
    var cell;
    var key;


    var brushstart = function (p) {
        if (brush.data !== p) {
            cell.call(brush.clear());
            brush.x(x[p.x]).y(y[p.y]).data = p;
        }
    };

    // Highlight the selected circles.
    var dobrush = function (p) {
        var e = brush.extent();
        svg.selectAll(".cell circle").attr("class", function (d) {
            return e[0][0] <= d[p.x] && d[p.x] <= e[1][0]
            && e[0][1] <= d[p.y] && d[p.y] <= e[1][1]
                ? d[key] : null;
        });
    };

    // If the brush is empty, select all circles.
    var brushend = function () {
        if (brush.empty()) svg.selectAll(".cell circle").attr("class", function (d) {
            return d[key];
        });
    };

    var cross = function (a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
    };

    // Brush.
    var brush = d3.svg.brush()
        .on("brushstart", brushstart)
        .on("brush", dobrush)
        .on("brushend", brushend);

    var plot = function (p) {
        var cell = d3.select(this);

        // Plot frame.
        cell.append("svg:rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        // Plot dots.
        cell.selectAll("circle")
            .data(data)
            .enter().append("svg:circle")
            .attr("class", function (d) {
                return d[key];
            })
            .attr("cx", function (d) {
                return x[p.x](d[p.x]);
            })
            .attr("cy", function (d) {
                return y[p.y](d[p.y]);
            })
            .attr("r", 3);

        // Plot brush.
        cell.call(brush.x(x[p.x]).y(y[p.y]));
    };

    return {
        render_from_file: function (placement, url, traits, key_name, options) {
            d3.csv(url, function (result) {
                data = result;
                key = key_name;
                size = (options.height/+traits.length);
                var axis = d3.svg.axis()
                    .ticks(5)
                    .tickSize(size * traits.length);

                var keys = d3.set(result.map(function (d) {
                    return d[key];
                })).values();



                traits.forEach(function (trait) {
                    // Coerce values to numbers.
                    data.forEach(function (d) {
                        d[trait] = +d[trait];
                    });

                    var value = function (d) {
                            return d[trait];
                        },
                        domain = [d3.min(data, value), d3.max(data, value)],
                        range = [padding / 2, size - padding / 2];
                    x[trait] = d3.scale.linear().domain(domain).range(range);
                    y[trait] = d3.scale.linear().domain(domain).range(range.reverse());
                });

                svg = d3.select(placement).append("svg")
                    .attr("width", options.width)
                    .attr("height", options.height)
                    .append("svg:g")
                    .attr("transform", "translate(100,30) scale(0.9)");

                var legend = svg.selectAll("g.legend")
                    .data(keys)
                    .enter().append("svg:g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(" + (options.width-300)+"," + i*30+ ")";
                    });

                legend.append("svg:circle")
                    .attr("class", String)
                    .attr("r", 3);

                legend.append("svg:text")
                    .attr("x", 12)
                    .attr("dy", ".31em")
                    .text(function (d) {
                        return d;
                    });


                // X-axis.
                var x_axis = svg.selectAll("g.x.axis")
                    .data(traits)
                    .enter().append("svg:g")
                    .attr("class", "x axis")
                    .attr("transform", function (d, i) {
                        return "translate(" + i * size + ",0)";
                    })
                    .each(function (d) {
                        d3.select(this).call(axis.scale(x[d]).orient("bottom"));
                    });

                x_axis.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "start")
                    .attr("x", 2)
                    .attr("y", -5)
                    .text(String);

                // Y-axis.
                var y_axis = svg.selectAll("g.y.axis")
                    .data(traits)
                    .enter().append("svg:g")
                    .attr("class", "y axis")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * size + ")";
                    })
                    .each(function (d) {
                        d3.select(this).call(axis.scale(y[d]).orient("right"));
                    });

                y_axis.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", -10)
                    .attr("y", 70)
                    .text(String);

                // Cell and plot.
                cell = svg.selectAll("g.cell")
                    .data(cross(traits, traits))
                    .enter().append("svg:g")
                    .attr("class", "cell")
                    .attr("transform", function (d) {
                        return "translate(" + d.i * size + "," + d.j * size + ")";
                    })
                    .each(plot);
            })
        }


    }
})
();