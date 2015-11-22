/**
 * Created by eamonnmaguire on 20/11/15.
 */

var gene_glyphs = (function () {

    var cleanup_value = function (string) {
        // force to be a string so we can use string functions.
        string += '';
        string = string.replace(/^[[\-|\+]*[\*\s]+/gi, "");
        return string.replace(/[^a-zA-Z0-9]+/gi, "");
    };

    var legend_toggle = function(scope, class_name) {
        if (d3.select(scope).style('opacity') == 0.5) {
            d3.select(scope).transition('elastic').duration(300).style('opacity', 1)
            d3.selectAll(class_name).transition('elastic').duration(300).style('opacity', 0.5);
        } else {
            d3.select(scope).transition('elastic').duration(300).style('opacity', 0.5)
            d3.selectAll(class_name).transition('elastic').duration(300).style('opacity', 0);
        }
    };

    return {

        create_glyph_visualization: function (placement, data_url, options) {

            d3.select(placement).html("");

            var svg = d3.select(placement).append("svg").attr("width", options.width).attr("height", options.height).append("g");

            d3.csv(data_url, function (error, data) {

                var genes = d3.nest().key(function (d) {
                    return d.gene;
                }).entries(data);

                var yScoreScale = d3.scale.linear().domain(d3.extent(data, function (d) {
                    return +d.score;
                })).range([90, 10]);

                var xGeneScale = d3.scale.ordinal().domain(["GENE_1", "GENE_2", "GENE_3", "GENE_4", "GENE_5"])
                    .rangePoints([40, options.width - 100]);

                var xDrugScale = d3.scale.ordinal().domain(["DRUG_1", "DRUG_2", "DRUG_3", "DRUG_4", "DRUG_5"])
                    .rangePoints([10, 90]);

                var cellColorScale = d3.scale.ordinal().range(["#26b99a", "#d25627", "#3b97d3"]);

                var doseScale = d3.scale.log().domain(d3.extent(data, function (d) {
                    return +d.dose;
                })).range([3, 10]);

                // add just one axis for all glyphs.
                var yAxis = d3.svg.axis()
                    .scale(yScoreScale)
                    .orient("left")
                    .tickPadding(5);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis).attr('transform', 'translate(35,25)');

                var gene_glyph = svg.selectAll(".gene").data(genes).enter().append('g')
                    .attr("transform", function (d) {
                        return 'translate(' + xGeneScale(d.key) + ',25)';
                    }).attr('class', 'gene');


                gene_glyph.append("text").attr('x', 35).attr('y', -5).text(function (d) {
                    return d.key;
                });
                gene_glyph.append("rect").attr({'width': 100, 'height': 100}).style("fill", "#35495e");


                gene_glyph.selectAll("circle").data(function (d) {
                    return d.values;
                }).enter().append("circle").attr('r', function (d) {
                    return doseScale(+d.dose);
                })
                    .attr('class', function (d) {
                        return "d" + cleanup_value(d.dose) + " " + d.cell + " " + d.drug;
                    })
                    .attr('cx', function (d) {
                        return xDrugScale(d.drug);
                    }).attr('cy', function (d) {
                        return yScoreScale(+d.score)
                    })
                    .style("fill", function (d) {
                        return cellColorScale(d.cell);
                    }).style("opacity", 0.5);

                // create the legend..

                // cell type and dosage
                var legend = svg.append("g").attr('class', 'legend').attr('transform', 'translate(35,170)');
                legend.append('text').text('Dose Levels').style('font-size', '12px');
                legend.append('text').text('Cell Types').style('font-size', '12px').attr({'x': 220, 'y': 0});

                var doses = ['0.04', '0.12', '0.37', '1.11', '3.33', '10.0'];
                var dose_legend_group = legend.selectAll("g.doseLegenditem").data(doses)
                    .enter().append("g").attr("class", "doseLegenditem");


                dose_legend_group.append('circle').attr('r', function (d) {
                    return doseScale(+d)
                }).attr('cx', function (d, i) {
                    return i * 30
                }).attr('cy', 30).style('fill', 'white')
                    .on('click', function (d) {
                        legend_toggle(this, '.d' + cleanup_value(d));
                    }).style('cursor', 'pointer');

                dose_legend_group.append("text").text(function (d) {
                    return d
                }).attr('x', function (d, i) {
                    return i * 30
                }).attr('y', 52).attr('text-anchor', 'middle')

                var cells = ['CELL_1', 'CELL_2', 'A375'];
                var cell_legend_group = legend.selectAll("g.cellLegenditem").data(cells)
                    .enter().append("g").attr("class", "cellLegenditem");


                cell_legend_group.append('circle').attr('r', 10).attr('cx', function (d, i) {
                    return 230 + (i * 50);
                }).attr('cy', 30).style("fill", function (d) {
                    return cellColorScale(d);
                }).on('click', function (d) {
                    legend_toggle(this, '.' + d);
                }).style('cursor', 'pointer');

                cell_legend_group.append("text").text(function (d) {
                    return d
                }).attr('x', function (d, i) {
                    return 230 + (i * 50);
                }).attr('y', 52).attr('text-anchor', 'middle');
            });
        }
    }

})();