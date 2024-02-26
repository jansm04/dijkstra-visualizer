import Vertex from "./vertex";


// margin of error used to check if a mouse click was close enough to select an edge 
const percentageError = 1.005; 


// a distance multiplier used to calculate the positon of the edge weight in relation to the center of the edge 
const factor = 15;

class Edge {
    // x and y coordinates for the edge's endpoints
    ax: number;
    ay: number;
    bx: number;
    by: number;

    weight: number; // the weight of the edge 

    // the two vertices that the edge is connected to
    va: Vertex;
    vb: Vertex;

    isCursorVisible: boolean; // to pulse cursor
    
    constructor(va: Vertex, vb: Vertex, weight: number, isCursorVisible: boolean) {
        this.weight = weight;
        this.va = va;
        this.vb = vb;

        this.va.addEdge(this);
        this.vb.addEdge(this);

        var endpoints = this.computeEndPoints(); // find endpoints on vertices
        this.ax = endpoints.ax;
        this.ay = endpoints.ay;
        this.bx = endpoints.bx;
        this.by = endpoints.by;
        this.isCursorVisible = isCursorVisible;
    }

    /*
    Draws the cursor of the label. Since the cursor has intervals where it is visible and where it isn't 
    via the variable isCursorVisible, the function checks that variable and only draw the cursor when isCursorVisible 
    = true, effectively making the cursor 'pulse'. 
    
    As opposed to the vertex, this function also takes a point parameter as we need to perform extra calculations to find
    the position of the edge weight
    */
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

    /*
    Draws the weight of the edge, if there is one. Uses a smart position helper function to calculate where
    to place the weight in accordance to the orientation of the edge
    */
    drawWeight(ctx: CanvasRenderingContext2D, colour: string) {
        var point = this.smartPosition(ctx);
        this.drawCursor(ctx, point);

        if (!this.weight) return;
        ctx.font = "14px Arial";
        ctx.fillStyle = colour;
        ctx.fillText(this.weight.toString(), point.x, point.y);
    }

    /* 
    Draws the edge on the canvas in the given colour, using the endpoints calculated from the edge's two vertices. 
    The drawing includes the edge label and the 'pulsing' cursor
    */
    draw(ctx: CanvasRenderingContext2D, colour: string) {
        ctx.strokeStyle = colour;
        ctx.beginPath();
        ctx.moveTo(this.ax, this.ay);
        ctx.lineTo(this.bx, this.by);
        ctx.stroke();
        this.drawWeight(ctx, colour);
    }

    /* 
    Returns true if the given point can select the edge. This is determined by computing the point's distances to 
    each endpoint, adding the two distances, and then checking to see if the distance calculated is within the 
    margin of error
    */
    containsPoint(x: number, y: number) {
        var totalDist = this.computeDistance(this.ax, this.ay, this.bx, this.by);
        var halfDist1 = this.computeDistance(x, y, this.ax, this.ay);
        var halfDist2 = this.computeDistance(x, y, this.bx, this.by);
        return (halfDist1 + halfDist2) < (totalDist * percentageError);
    }

    // Computes the distance between two points
    computeDistance(ax: number, ay: number, bx: number, by: number) {
        var distX = bx - ax;
        var distY = by - ay;
        return Math.sqrt(distX*distX + distY*distY);
    }

    /*
    Computes the endpoints of the edge, using the edge's two vertices. Works by finding the center of 
    the edge, and then using each vertex's closest point function to calculate the endpoints
    */
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

    /* 
    Calculates the position where to draw the edge weight. Works by first finding the bottom left corner of the 
    text and the using trigonometry to offset the corner in relation the center of the edge
    */
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