import Edge from "./edge";

const vertexRadius = 25;
const offset = 5;

class Vertex {
    // center of the vertex on the canvas
    x: number;
    y: number;

    label: string; // vertex label
    edges: Array<Edge>; // all edges that are connected to the vertex
    dist: number; // distance to start vertex
    isCursorVisible: boolean; // to pulse cursor
    idx: number; // idx in priority queue (allows us to run algorithm in O(V*log(E)) time)

    constructor(x: number, y: number, label: string, isCursorVisible: boolean) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.edges = new Array<Edge>();
        this.dist = Infinity; // dijkstras algorithm initializes all distances to infinity
        this.isCursorVisible = isCursorVisible;
        this.idx = -1;
    }

    /*
    Draws the cursor of the label. Since the cursor has intervals where it is visible and where it isn't 
    via the variable isCursorVisible, the function checks that variable and only draw the cursor when isCursorVisible 
    = true, effectively making the cursor 'pulse'
    */
    drawCursor(ctx: CanvasRenderingContext2D) {
        if (!this.isCursorVisible) return;
        var width = this.label ? ctx.measureText(this.label).width : 0;
        var x = this.x + width / 2;
        ctx.beginPath();
        ctx.lineWidth -= 1; // make cursor slightly thinner
        ctx.moveTo(x, this.y + 8);
        ctx.lineTo(x, this.y - 8);
        ctx.stroke();
        ctx.lineWidth += 1;
    }

    /*
    Draws the label of the vertex, if there is one. Uses an offset for the y because the label starts at the bottom 
    left corner of the text so the function needs to add a few pixels to make it center
    */
    drawLabel(ctx: CanvasRenderingContext2D, colour: string) {
        this.drawCursor(ctx);

        if (!this.label) return;
        ctx.font = "14px Arial";
        ctx.fillStyle = colour;
        var width = ctx.measureText(this.label).width;
        var x = this.x - width / 2; // used to center text
        ctx.fillText(this.label, x, this.y + offset);
    }

    /*
    Draws the vertex on the canvas with the vertex's x and y being the center. The drawing of the element includes 
    the circle itself, the label of the vertex and the cursor
    */
    draw(ctx: CanvasRenderingContext2D, colour: string) {
        ctx.strokeStyle = colour;
        ctx.beginPath();
        ctx.arc(this.x, this.y, vertexRadius, 0, 2 * Math.PI);
        ctx.stroke();
        this.drawLabel(ctx, colour);
    }
    
    // Adds an edge to the vertex, which also 'adds' an edge to the graph and later lets us traverse it
    addEdge(edge: Edge) {
        this.edges.push(edge);
    }

    // Removes an edge from the vertex
    removeEdge(edge: Edge) {
        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i] == edge) {
                this.edges.splice(i, 1);
                return;
            }
        }
    }

    /*
    Computes the closest point on the circle to the given {x, y}. 
    
    The function does this by first computing the x-distance, y-distance, and total distance to the center 
    of the vertex, then adding the ratio of each coordinate distance over the total distance times the vertex 
    radius to the center of the vertex, resulting in a point on the circle itself
    */
    computeClosestPoint(x: number, y: number) {
        var distX = x - this.x;
        var distY = y - this.y;
        var dist = Math.sqrt(distX * distX + distY * distY);
        
        var px = this.x + distX * vertexRadius / dist;
        var py = this.y + distY * vertexRadius / dist;
        return {px, py};
    }


    // Returns true if the vertex contains the given x and y coordinates 
    containsPoint(x: number, y: number) {
        return vertexRadius*vertexRadius > (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y);
    }
}

export default Vertex;