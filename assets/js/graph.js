
/**
 * Created by eamonnmaguire on 05/01/2014.
 */
var fill = d3.scale.category20();

var svg, cursor, nodes, links, node, link, force, placement, zoom;

function createNetworkVisualization(url, place, width, height) {

    placement = place;
    d3.select(placement).html("");

    d3.json(url, function (json) {
        force = d3.layout.force()
            .size([width, height])
            .nodes(json.nodes)
            .links(json.links)
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

    function tick() {


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


    }


}

function restart() {
    link = link.data(links);

    node = node.data(nodes);


    node.enter().append("g")
        .attr("class", "node")
        .call(force.drag);;

    node.append("path")
        .attr("d", d3.svg.symbol()
            .size(function (d) {
                return d.count ? d.count : 50;
            })
            .type(function (d) {
                return d.nodetype ? d.nodetype : "circle";
            }))
        .style("fill", function (d) {
            return d.color ? d.color : "#27AAE1";
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
}

function addNode(newNode, nodeLinks) {
    nodes.push(newNode);
    for (var linkIndex in nodeLinks) {
        links.push(nodeLinks[linkIndex]);
    }

    restart();
}

function removeNode(nodeId) {

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
}



createNetworkVisualization('assets/data/sample-network.json','#slide1_graph', 500, 270);