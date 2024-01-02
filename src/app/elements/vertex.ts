const vertexRadius = 40;

class Vertex {
    x: number;
    y: number;
    label: string;

    constructor(x: number, y: number, label: string) {
        this.x = x;
        this.y = y;
        this.label = label;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, vertexRadius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    containsPoint(x: number, y: number) {
        return vertexRadius*vertexRadius > (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y);
    }
}

export default Vertex;