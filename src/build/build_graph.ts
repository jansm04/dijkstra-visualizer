// elements
import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";

/* 
Builds a graph and returns it as an array of vertices and edges
*/
export const buildGraph = () => {
    
    var vertices = new Array<Vertex>();
    var edges = new Array<Edge>();

    // create a bunch of vertices from labels "A" through "L", and store as variables so we can create edges
    var a = new Vertex(89, 78, "A", false);
    var b = new Vertex(331, 48, "B", false);
    var c = new Vertex(564, 80, "C", false);
    var d = new Vertex(59, 227, "D", false);
    var e = new Vertex(230, 190, "E", false);
    var f = new Vertex(422, 175, "F", false);
    var g = new Vertex(590, 241, "G", false);
    var h = new Vertex(234, 313, "H", false);
    var i = new Vertex(420, 325, "I", false);
    var j = new Vertex(88, 404, "J", false);
    var k = new Vertex(331, 442, "K", false);
    var l = new Vertex(566, 417, "L", false);

    // add all vertices to array
    vertices.push(a);
    vertices.push(b);
    vertices.push(c);
    vertices.push(d);
    vertices.push(e);
    vertices.push(f);
    vertices.push(g);
    vertices.push(h);
    vertices.push(i);
    vertices.push(j);
    vertices.push(k);
    vertices.push(l);

    
    // create edges using vertices above and add them to edges array
    edges.push(new Edge(a, b, 14, false));
    edges.push(new Edge(d, a, 9, false));
    edges.push(new Edge(b, c, 13, false));
    edges.push(new Edge(c, g, 19, false));
    edges.push(new Edge(g, l, 15, false));
    edges.push(new Edge(l, k, 7, false));
    edges.push(new Edge(k, j, 8, false));
    edges.push(new Edge(j, d, 16, false));
    edges.push(new Edge(d, e, 7, false));
    edges.push(new Edge(e, b, 2, false));
    edges.push(new Edge(b, f, 7, false));
    edges.push(new Edge(f, g, 6, false));
    edges.push(new Edge(g, i, 12, false));
    edges.push(new Edge(i, l, 3, false));
    edges.push(new Edge(k, h, 4, false));
    edges.push(new Edge(h, j, 11, false));
    edges.push(new Edge(h, d, 3, false));
    edges.push(new Edge(e, h, 6, false));
    edges.push(new Edge(e, f, 11, false));
    edges.push(new Edge(f, i, 15, false));
    edges.push(new Edge(i, h, 12, false));
    edges.push(new Edge(e, i, 21, false));
    edges.push(new Edge(f, c, 14, false));
    edges.push(new Edge(e, a, 12, false));
    edges.push(new Edge(i, k, 11, false));

    return { vertices, edges };
}