import Vertex from "./vertex";

class TempEdge {
    // the x and y coordinates of the mouse endpoint
    px: number;
    py: number;

    // the x and y coordinates of the vertex endpoint
    vx: number;
    vy: number;
    vertex: Vertex;
    
    constructor(vertex: Vertex, px: number, py: number) {
        this.vertex = vertex;
        // find closest point on attached vertex for one endpoint
        var endpoint = this.vertex.computeClosestPoint(px, py); 
        this.vx = endpoint.px;
        this.vy = endpoint.py;
        this.px = px;
        this.py = py;
        
    }

    // Draws the temp edge on the canvas using the vertex as one endpoint and the mouse as another
    draw(ctx: CanvasRenderingContext2D) {
        this.setClosestPoint(this.px, this.py);
        ctx.beginPath();
        ctx.moveTo(this.vx, this.vy);
        ctx.lineTo(this.px, this.py);
        ctx.stroke();
    }

    // Resets the vertex endpoint based on the new position of the mouse
    setClosestPoint(px: number, py: number) {
        var endpoint = this.vertex.computeClosestPoint(px, py);
        this.vx = endpoint.px;
        this.vy = endpoint.py;
    }

}

export default TempEdge