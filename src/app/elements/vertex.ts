import Edge from "./edge";

const vertexRadius = 25;
const offset = 5;

class Vertex {
    x: number;
    y: number;
    label: string;
    edges: Array<Edge>;
    dist: number;
    isCursorVisible: boolean;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.label = "";
        this.edges = new Array<Edge>();
        this.dist = Infinity;
        this.isCursorVisible = true;
    }

    drawCursor(ctx: CanvasRenderingContext2D) {
        if (!this.isCursorVisible) return;
        var width = this.label ? ctx.measureText(this.label).width : 0;
        var x = this.x + width / 2;
        ctx.beginPath();
        ctx.lineWidth -= 1;
        ctx.moveTo(x, this.y + 8);
        ctx.lineTo(x, this.y - 8);
        ctx.stroke();
        ctx.lineWidth += 1;
    }

    drawLabel(ctx: CanvasRenderingContext2D, colour: string) {
        this.drawCursor(ctx);

        if (!this.label) return;
        ctx.font = "14px Arial";
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

    removeEdge(edge: Edge) {
        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i] == edge) {
                this.edges.splice(i, 1);
                return;
            }
        }
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