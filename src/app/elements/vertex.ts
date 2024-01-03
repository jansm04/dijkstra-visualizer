import Edge from "./edge";

const vertexRadius = 20;
const offset = 5;

class Vertex {
    x: number;
    y: number;
    label: string | null;
    edges: Array<Edge>;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.label = null;
        this.edges = new Array<Edge>();
    }

    drawLabel(ctx: CanvasRenderingContext2D, colour: string) {
        if (!this.label) return;
        ctx.font = "12px Arial";
        ctx.fillStyle = colour;
        var width = ctx.measureText(this.label).width;
        var x = this.x - width / 2;
        ctx.fillText(this.label, x, this.y + offset);
    }

    draw(ctx: CanvasRenderingContext2D, colour: string) {
        ctx.strokeStyle = colour;
        ctx.beginPath();
        ctx.arc(this.x, this.y, vertexRadius, 0, 2 * Math.PI);
        ctx.stroke();
        this.drawLabel(ctx, colour);
    }
    
    addEdge(edge: Edge) {
        this.edges.push(edge);
    }

    computeClosestPoint(x: number, y: number) {
        var distX = x - this.x;
        var distY = y - this.y;
        var dist = Math.sqrt(distX * distX + distY * distY);
        
        var px = this.x + distX * vertexRadius / dist;
        var py = this.y + distY * vertexRadius / dist;
        return {px, py};
    }

    containsPoint(x: number, y: number) {
        return vertexRadius*vertexRadius > (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y);
    }
}

export default Vertex;