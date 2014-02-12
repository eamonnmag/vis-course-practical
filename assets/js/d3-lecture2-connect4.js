/**
 * Created by eamonnmaguire on 27/01/2014.
 */
var connect4_svg;
var width, height;
var margin;
var Connect4 = {};
var lastRow = 0;
var grid = {};

Connect4.utils = {

    draw: function (placement, w, h) {
        d3.select(placement).html("");
        margin = 40;
        width = w;
        height = h;
        connect4_svg = d3.select(placement).append("svg").attr("width", 500).attr("height", 500).append("g");
        connect4_svg.append("rect").attr("x", 0).attr("y", 0).attr("width", width).attr("height", height).style("fill", "#2980b9");

        Connect4.utils.drawGrid(7, 6);

        var tokens = 7 * 6;
        var red = true;
        for (var tokenCount = 0; tokenCount < tokens; tokenCount++) {

            var item = Connect4.utils.getNextPosition();
            var circle = connect4_svg.append("circle").attr("class", "row-" + lastRow + " token-" + tokenCount).attr("r", 25).style("fill", function () {
                return red ? "#e74c3c" : "#f1c40f"
            }).attr("cx", 0).attr("cy", -100);

            // find position to put token
            d3.select("circle.token-" + tokenCount).transition().duration(100).delay((tokenCount + 1) * 500).attr("cx", item.x);
            d3.select("circle.token-" + tokenCount).transition().duration(1000).delay((tokenCount + 2) * 500).ease("elastic").attr("cy", item.y);
            red = !red;
        }
        this.emptyGrid();
    },

    emptyGrid: function () {
        for (var rowIndex = 5; rowIndex >= 0; rowIndex--) {
            d3.selectAll("circle.row-" + rowIndex).transition().duration(1000).delay(25000 - (rowIndex * 50)).ease("elastic").attr("cy", 600);
        }
    },

    drawGrid: function (columns, rows) {
        var colWidth = Math.round(width / columns);
        var rowHeight = height / rows;
        for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
            grid[rowIndex] = []
            var yPosition = margin + (rowIndex * rowHeight);
            for (var colIndex = 0; colIndex <= columns; colIndex++) {
                var xPosition = margin + (colIndex * colWidth);
                Connect4.utils.drawContainerCircle(xPosition, yPosition);
                grid[rowIndex].push({
                    "x": xPosition,
                    "y": yPosition,
                    "full": false
                });
            }
        }
        console.log(grid);
    },

    drawContainerCircle: function (x, y) {
        connect4_svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 30)
            .style("fill", "#fff");
    },

    getNextPosition: function () {
        var circleCol = Connect4.utils.getRandomInt(0, 7);

        for (var rowIndex = 5; rowIndex >= 0; rowIndex--) {
            if (!grid[rowIndex][circleCol].full) {
                // check if this is the next empty row.
                grid[rowIndex][circleCol].full = true;
                lastRow = rowIndex;
                return grid[rowIndex][circleCol];
            }
        }
        // keep going until we find a position...
        return this.getNextPosition();
    },

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}