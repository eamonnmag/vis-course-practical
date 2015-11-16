/**
 * Created by eamonnmaguire on 05/01/2014.
 */

var graph = (function () {
    var fill = d3.scale.category20();
    var svg, cursor, nodes, links, node, link, force, placement, zoom;

    var tick = function () {

        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    };


    var restart = function () {
        link = link.data(links);

        node = node.data(nodes);

        node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);


        node.append("path")
            .attr("d", d3.svg.symbol()
                .size(function (d) {
                    return d.count ? d.count : 50;
                })
                .type(function (d) {
                    return d.nodetype ? d.nodetype : "circle";
                }))
            .style("fill", function (d) {
                return d.color ? d.color : "#1abc9c";
            });

        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) {
                if (d.showLabel) return d.name;
            })
            .style("fill", "#67686B")
            .style("stroke", "none");


        link.enter().insert("line", ".node")
            .attr("class", "link");

        force.start();
    };


    return {
        createNetworkVisualization: function (url, place, width, height) {
            placement = place;
            d3.select(placement).html("");

            d3.json(url, function (json) {
                force = d3.layout.force()
                    .size([width, height])
                    .nodes(json.nodes)
                    .links(json.links)
                    .gravity(0.2)
                    .linkDistance(30)
                    .charge(-60)
                    .on("tick", tick);

                svg = d3.select(placement).append("svg")
                    .attr("width", width)
                    .attr("height", height);


                nodes = force.nodes();
                links = force.links();
                node = svg.selectAll(".node");
                link = svg.selectAll(".link");

                cursor = svg.append("circle")
                    .attr("r", 30)
                    .attr("transform", "translate(-100,-100)")
                    .attr("class", "cursor");

                restart();
            });
        },

        removeNode: function (nodeId) {

            var nodeObject;
            for (var nodeIndex in nodes) {
                if (nodes[nodeIndex].id == nodeId) {
                    nodeObject = nodes[nodeIndex];
                    delete nodes[nodeIndex];
                    break;
                }
            }

            for (var linkIndex in links) {
                if (links[linkIndex].source.id == nodeId || links[linkIndex].target.id == nodeId) {
                    delete links[linkIndex];
                }
            }

            restart();
        },

        addNode: function (newNode, nodeLinks) {
            nodes.push(newNode);
            for (var linkIndex in nodeLinks) {
                links.push(nodeLinks[linkIndex]);
            }

            restart();
        },

        create_hive_visualization: function(placement, data,  width, height) {

            var innerRadius = 40,
                outerRadius = 240;

            var angle = d3.scale.ordinal().domain(d3.range(4)).rangePoints([0, 2 * Math.PI]),
                radius = d3.scale.linear().range([innerRadius, outerRadius]),
                color = d3.scale.ordinal().range(["#1abc9c", "#f39c12", "#e67e22"]);

            var nodes = [
                {x: 0, y: .1},
                {x: 0, y: .9},
                {x: 1, y: .2},
                {x: 1, y: .3},
                {x: 2, y: .1},
                {x: 2, y: .8}
            ];

            var links = [
                {source: nodes[0], target: nodes[2]},
                {source: nodes[1], target: nodes[3]},
                {source: nodes[2], target: nodes[4]},
                {source: nodes[2], target: nodes[5]},
                {source: nodes[3], target: nodes[5]},
                {source: nodes[4], target: nodes[0]},
                {source: nodes[5], target: nodes[1]}
            ];

            var svg = d3.select(placement).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            svg.selectAll(".axis")
                .data(d3.range(3))
                .enter().append("line")
                .attr("class", "hive-axis")
                .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; })
                .attr("x1", radius.range()[0])
                .attr("x2", radius.range()[1]);

            svg.selectAll("text")
                .data(d3.range(3))
                .enter().append("text").attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; }).text(function(d) {
                    return 'Axis '+d;
                }).attr('x', radius.range()[1]-20).attr('y', 20);

            svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", d3.hive.link()
                    .angle(function(d) { return angle(d.x); })
                    .radius(function(d) { return radius(d.y); }))
                .style("stroke", function(d) { return color(d.source.x); });

            svg.selectAll(".node")
                .data(nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("transform", function(d) { return "rotate(" + degrees(angle(d.x)) + ")"; })
                .attr("cx", function(d) { return radius(d.y); })
                .attr("r", 5)
                .style("fill", function(d) { return color(d.x); });

            function degrees(radians) {
                return radians / Math.PI * 180 - 90;
            }

        }
    }
})();

