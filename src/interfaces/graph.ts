import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";

interface Graph {
    vertices: Array<Vertex>,
    edges: Array<Edge>,
    pq: PriorityQueue
}

export default Graph;