import Vertex from "./vertex";

class TempEdge {
    px: number;
    py: number;
    vx: number;
    vy: number;
    vertex: Vertex;
    
    constructor(vertex: Vertex, px: number, py: number) {
        this.vertex = vertex;
        var endpoint = this.vertex.computeClosestPoint(px, py);
        this.vx = endpoint.px;
        this.vy = endpoint.py;
        this.px = px;
        this.py = py;
        
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.setClosestPoint(this.px, this.py);
        ctx.beginPath();
        ctx.moveTo(this.vx, this.vy);
        ctx.lineTo(this.px, this.py);
        ctx.stroke();
    }

    setClosestPoint(px: number, py: number) {
        var endpoint = this.vertex.computeClosestPoint(px, py);
        this.vx = endpoint.px;
        this.vy = endpoint.py;
    }

}

export default TempEdge