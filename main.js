"use strict";

var NODE_RADIUS = 5;
var NODE_COLOR = "red";
var NODE_STROKE_COLOR = "black";
var NODE_STROKE_WIDTH = 2

var EDGE_STROKE_COLOR = "black";
var EDGE_STROKE_WIDTH = 3;

// The threshold for stopping our node layout
var K_THRESH = 1;
// Coulomb's constant (or close enough...)
var KE = 8.988 * Math.pow(10,6.5);
// Some constant Q for Coulomb's law.
var Q_CONST = 1;
// spring constant for Hooke's Law
var K_SPRING = 3;
// damping factor for our force-based layout algorithm
var DAMPING = .5;
var TIMESTEP = .1;

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

    // Here we use a force-directed layout algorithm to compute
    // an optimal layout for our existing nodes. We move towards
    // the solution with timestep TIMESTEP.
    simulate: function() {
        for (var n in this.nodes) {
            this.nodes[n].velocity = 0;
        }

        var kEnergy = 100;

        // loop until we reach our threshold of kinetic energy
        while (kEnergy >= K_THRESH) {
            var kEnergy = 0;

            for (var i in this.nodes) {
                // net force on node
                var netForce = 0;

                // for each other node:
                for (var j in this.nodes) {
                    // check that they aren't the same node
                    if (i != j) {
                        // they aren't the same node
                        netForce += this.nodeRepulsion(this.nodes[i], this.nodes[j]);
                    }
                }

                for (var k in this.nodes.neighbors) {
                    netForce += this.nodeAttraction(this.nodes[i],
                                                    this.nodes.neighbors[k]);
                }

                this.nodes[i].velocity = (this.nodes[i].velocity + TIMESTEP * netForce)
                    * DAMPING;
                this.nodes[i].x = this.nodes[i].x + TIMESTEP * this.nodes[i].velocity;
                this.nodes[i].y = this.nodes[i].y + TIMESTEP * this.nodes[i].velocity;

                // not sure if this is really necessary...
                if  (this.nodes[i].x > this.stage.width) {
                    this.nodes[i].x = this.stage.width;
                }
                if  (this.nodes[i].y > this.stage.height) {
                    this.nodes[i].y = this.stage.height;
                }

                kEnergy += Math.pow(this.nodes[i].velocity, 2);
            }
        }
    },

    nodeRepulsion: function(node1, node2) {

        var r = Math.sqrt(Math.pow(node1.x - node2.x, 2)
                          + Math.pow(node1.y - node2.y, 2));

        var force = KE * Math.pow(node1.nodeDegree - 2, 1.5)
            * Math.pow(Q_CONST, 2) / Math.pow(r,2);

        return force
    },

    nodeAttraction: function(node1, node2) {
        var r = Math.sqrt(Math.pow(node1.x - node2.x, 2)
                          + Math.pow(node1.y - node2.y, 2));

        var force = - K_SPRING * r;
        return force;
    },

    // This will create a new shape object each time it is called
    // and does not get rid of the previous shape object from the
    // stage. ONLY call this method on stage initialization.
    draw: function() {
        for (var e in this.edges) {
            this.edges[e].draw();
        }

        for (var n in this.nodes) {
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
    this.velocity = 0;
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

    // This will create a new shape object each time it is called
    // and does not get rid of the previous shape object from the
    // stage. ONLY call this method on stage initialization.
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

    // This will create a new shape object each time it is called
    // and does not get rid of the previous shape object from the
    // stage. ONLY call this method on stage initialization.
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
