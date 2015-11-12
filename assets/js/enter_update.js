/**
 * Created by eamonnmaguire on 11/11/15.
 */

var utils = (function () {
    return {
        create_svg: function (placement, width, height) {
            var svg = d3.select(placement).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

            return svg;
        }
    }

})();

var enter_update_basic = (function () {

    return {
        create_update_canvas: function (placement, width, height) {
            d3.select(placement).html("");
            utils.create_svg(placement, width, height);
            var data = [{x: 160, y: 190}, {x: 30, y: 200}, {x: 200, y: 100}];
            enter_update_basic.update_canvas(placement, data)
        },

        update_canvas: function (placement,data) {
            var svg = d3.select(placement + " svg g");
            var rect = svg.selectAll("rect")
                .data(data);

            rect.enter().append("rect")
                .style("fill", "#fff")
                .attr("height", 20)
                .attr("width", 0)
                .transition()
                .attr("width", 25);

            rect.attr("x", function (d) {
                return d.x;
            })
                .attr("y", function (d) {
                    return d.y;
                });

            rect.exit().attr("width", 25).transition()
                .attr("width", 0)
                .remove();
        }
    }
})();


var enter_update_keys = (function () {

    return {
        create_update_canvas: function (placement, width, height) {
            d3.select(placement).html("");
            utils.create_svg(placement, width, height);
            var data = [{id: 1, x: 160, y: 190}, {id: 2, x: 30, y: 200}, {id: 3, x: 200, y: 100}];
            enter_update_keys.update_canvas(placement, data)
        },

        update_canvas: function (placement,data) {
            var svg = d3.select(placement + " svg g");
            var rect = svg.selectAll("rect")
                .data(data, function(d) {
                    return d.id;
                });

            rect.enter().append("rect")
                .style("fill", "#fff")
                .attr("height", 20)
                .attr("width", 0)
                .transition()
                .attr("width", 25);

            rect.attr("x", function (d) {
                return d.x;
            })
                .attr("y", function (d) {
                    return d.y;
                });

            rect.exit().attr("width", 25).transition()
                .attr("width", 0)
                .remove();
        }
    }
})();