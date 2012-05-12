var model = {}

window.onload = function() {
    //initializeCanvas();

    model = new Model();
    model.addNode();
    model.addNode();
    model.addNode();

    model.simulate();
};

function Model() {
    this.stage = new Kinetic.Stage({
        container: "board",
        width: 500,
        height: 600
    });
    this.layer = new Kinetic.Layer();
    this.nodes = [];
    this.edges = [];
}

Model.prototype = {

    addNode: function() {
        var node = new Node();
        this.nodes.push(node);
    },

    addEdge: function(node1, node2) {
        var edge = new Edge(node1, node2);
        this.edges.push(edge);
    },

    simulate: function() {
        // todo
    },

    draw: function() {
        stage.draw();
    }
};


function Node() {
    this.neighbors = [];
    this.x = 0;                 // set randomly during simulation
    this.y = 0;                 // set randomly during simulation
}

Node.prototype = {

    addNeighbor: function(node) {
        if (this == node) {
            console.log("Attempted to add node as it's own neighbor");
        }
        else {
            this.neighbors.push(node);
        }
    }
};

function Edge(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;

    this.node1.addNeighbor(node2);
    this.node2.addNeighbor(node1);
}
