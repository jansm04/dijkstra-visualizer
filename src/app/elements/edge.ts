import Vertex from "./vertex";

class Edge {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    weight: number;
    va: Vertex;
    vb: Vertex;
    
    constructor(weight: number, va: Vertex, vb: Vertex) {
        this.weight = weight;
        this.va = va;
        this.vb = vb;

        var endpoints = this.computeEndPoints();
        this.ax = endpoints.ax;
        this.ay = endpoints.ay;
        this.bx = endpoints.bx;
        this.by = endpoints.by;
    }

    computeEndPoints() {
        var midX = (this.va.x + this.vb.x) / 2;
        var midY = (this.vb.x + this.vb.y) / 2;

        var a = this.va.computeClosestPoint(midX, midY);
        var b = this.vb.computeClosestPoint(midX, midY);

        var ax = a.px;
        var ay = a.py;
        var bx = b.px;
        var by = b.py;

        return {ax, ay, bx, by};
    }


}

export default Edge