
var chord = (function() {
    var width=400, height=400,outerRadius = Math.min(width, height) / 2 - 10,
        innerRadius = outerRadius - 24;

    var formatPercent = d3.format(".1%");

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var layout = d3.layout.chord()
        .padding(.04)
        .sortSubgroups(d3.descending)
        .sortChords(d3.ascending);

    var path = d3.svg.chord()
        .radius(innerRadius);


    return {
        render_plot: function(placement){
            d3.select(placement).html("");
            var svg = d3.select(placement).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("id", "circle")
                .style("fill", "transparent")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            svg.append("circle")
                .attr("r", outerRadius);

            d3.csv('assets/data/cities.csv', function(context) {
                d3.json("assets/data/matrix.json", function(interaction_matrix) {
                    context = context.slice(0,22);
                    matrix = interaction_matrix.slice(0,22);
                    // Compute the chord layout.
                    layout.matrix(matrix);

                    // Add a group per neighborhood.
                    var group = svg.selectAll(".group")
                        .data(layout.groups)
                        .enter().append("g")
                        .attr("class", "group")
                        .on("mouseover", mouseover);

                    // Add a mouseover title.
                    group.append("title").text(function(d, i) {
                        return context[i].name + ": " + formatPercent(d.value) + " of origins";
                    });

                    // Add the group arc.
                    var groupPath = group.append("path")
                        .attr("id", function(d, i) { return "group" + i; })
                        .attr("d", arc)
                        .style("cursor", "pointer")
                        .style("fill", function(d, i) { return context[i].color; });

                    // Add a text label.
                    var groupText = group.append("text")
                        .attr("x", 6)
                        .attr("dy", 15);

                    groupText.append("textPath")
                        .attr("xlink:href", function(d, i) { return "#group" + i; })
                        .text(function(d, i) { return context[i].name; });

                    // Remove the labels that don't fit. :(
                    groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
                        .remove();

                    // Add the chords.
                    var chord = svg.selectAll(".chord")
                        .data(layout.chords)
                        .enter().append("path")
                        .attr("class", "chord")
                        .style("fill", function(d) { return context[d.source.index].color; })
                        .attr("d", path);

                    // Add an elaborate mouseover title for each chord.
                    chord.append("title").text(function(d) {
                        return context[d.source.index].name
                            + " → " + context[d.target.index].name
                            + ": " + formatPercent(d.source.value)
                            + "\n" + context[d.target.index].name
                            + " → " + context[d.source.index].name
                            + ": " + formatPercent(d.target.value);
                    });

                    function mouseover(d, i) {

                        chord.classed("fade", function(p) {
                            console.log(p);
                            return p.source.index != i
                                && p.target.index != i;
                        });
                    }


                });
            });
        }
    };


})();
