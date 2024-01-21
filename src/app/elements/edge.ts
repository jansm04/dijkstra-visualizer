import Vertex from "./vertex";

const percentageError = 1.005;
const factor = 15;

class Edge {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    weight: number;
    va: Vertex;
    vb: Vertex;
    isCursorVisible: boolean;
    
    constructor(va: Vertex, vb: Vertex, weight: number) {
        this.weight = weight;
        this.va = va;
        this.vb = vb;

        this.va.addEdge(this);
        this.vb.addEdge(this);

        var endpoints = this.computeEndPoints();
        this.ax = endpoints.ax;
        this.ay = endpoints.ay;
        this.bx = endpoints.bx;
        this.by = endpoints.by;
        this.isCursorVisible = true;
    }

    drawCursor(ctx: CanvasRenderingContext2D, point: {x: number, y: number}) {
        if (!this.isCursorVisible) return;
        var width = ctx.measureText(this.weight?(this.weight).toString():"").width
        var x = point.x + width;
        ctx.beginPath();
        ctx.lineWidth -= 1;
        ctx.moveTo(x, point.y - 12);
        ctx.lineTo(x, point.y + 4);
        ctx.stroke();
        ctx.lineWidth += 1;
    }

    drawWeight(ctx: CanvasRenderingContext2D, colour: string) {
        var point = this.smartPosition(ctx);
        this.drawCursor(ctx, point);

        if (!this.weight) return;
        ctx.font = "14px Arial";
        ctx.fillStyle = colour;
        ctx.fillText(this.weight.toString(), point.x, point.y);
    }

    draw(ctx: CanvasRenderingContext2D, colour: string) {
        ctx.strokeStyle = colour;
        ctx.beginPath();
        ctx.moveTo(this.ax, this.ay);
        ctx.lineTo(this.bx, this.by);
        ctx.stroke();
        this.drawWeight(ctx, colour);
    }

    containsPoint(x: number, y: number) {
        var totalDist = this.computeDistance(this.ax, this.ay, this.bx, this.by);
        var halfDist1 = this.computeDistance(x, y, this.ax, this.ay);
        var halfDist2 = this.computeDistance(x, y, this.bx, this.by);
        return (halfDist1 + halfDist2) < (totalDist * percentageError);
    }

    computeDistance(ax: number, ay: number, bx: number, by: number) {
        var distX = bx - ax;
        var distY = by - ay;
        return Math.sqrt(distX*distX + distY*distY);
    }

    computeEndPoints() {
        var midX = (this.va.x + this.vb.x) / 2;
        var midY = (this.va.y + this.vb.y) / 2;

        var a = this.va.computeClosestPoint(midX, midY);
        var b = this.vb.computeClosestPoint(midX, midY);

        var ax = a.px;
        var ay = a.py;
        var bx = b.px;
        var by = b.py;

        return {ax, ay, bx, by};
    }

    smartPosition(ctx: CanvasRenderingContext2D) {
        var offsetX = ctx.measureText(this.weight?(this.weight).toString():"").width / 2;
        var offsetY = 3;
        var midX = (this.ax + this.bx) / 2 - offsetX;
        var midY = (this.ay + this.by) / 2 + offsetY;
        var angle = Math.atan2(this.ay - this.by, this.bx - this.ax);
        var x = midX - Math.sin(angle) * factor;
        var y = midY - Math.cos(angle) * factor;
        return {x, y};
    }
}

export default Edge