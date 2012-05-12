var NODE_RADIUS = 5;
var NODE_COLOR = "red";
var NODE_STROKE_COLOR = "black";
var NODE_STROKE_WIDTH = 2

var EDGE_STROKE_COLOR = "black";
var EDGE_STROKE_WIDTH = 3;


var model = {}

window.onload = function() {
    //initializeCanvas();

    model = new Model();
    model.addNode();
    model.addNode();
    model.addNode();

    model.simulate();
    model.draw();
};

function Model() {
    this.stage = new Kinetic.Stage({
        container: "board",
        width: 1000,
        height: 500
    });
    this.layer = new Kinetic.Layer();
    this.stage.add(this.layer);
    this.nodes = [];
    this.edges = [];
}

Model.prototype = {

    addNode: function() {
        var node = new Node(this);
        this.nodes.push(node);
    },

    addEdge: function(node1, node2) {
        var edge = new Edge(this, node1, node2);
        this.edges.push(edge);
    },

    simulate: function() {
        // todo
    },

    draw: function() {
        for (e in this.edges) {
            this.edges[e].draw();
        }

        for (n in this.nodes) {
            this.nodes[n].draw();
        }
        this.stage.draw();
    }
};


function Node(model) {
    this.model = model
    this.neighbors = [];
    // set random x,y coords. small chance of error if we get the same
    // coords for multiple nodes.
    this.x = Math.floor(Math.random() * this.model.stage.width);
    this.y = Math.floor(Math.random() * this.model.stage.height);
    this.shape = {}             // stores the kinetic.js shape
}

Node.prototype = {

    addNeighbor: function(node) {
        if (this == node) {
            console.log("Attempted to add node as it's own neighbor");
        }
        else {
            this.neighbors.push(node);
        }
    },

    draw: function() {
        this.shape = new Kinetic.Circle({
            x: this.x,
            y: this.y,
            radius: NODE_RADIUS,
            fill: NODE_COLOR,
            stroke: NODE_STROKE_COLOR,
            strokeWidth: NODE_STROKE_WIDTH
        });

        this.model.layer.add(this.shape);
    }
};

function Edge(model, node1, node2) {
    this.model = model;
    this.node1 = node1;
    this.node2 = node2;

    this.node1.addNeighbor(node2);
    this.node2.addNeighbor(node1);
}

Edge.prototype = {

    draw: function() {
        var points = [{
            x: this.node1.x,
            y: this.node1.y
        }, {
            x: this.node2.x,
            y: this.node2.y
        }];

        this.line = new Kinetic.Line({
            points: points,
            stroke: EDGE_STROKE_COLOR,
            strokeWidth: EDGE_STROKE_WIDTH
        });

        this.layer.add(this.line);
    }
};
