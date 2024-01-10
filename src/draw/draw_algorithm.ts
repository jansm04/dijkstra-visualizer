import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";

import { addPQVisualizer, updatePQVisualizer } from "@/draw/draw_pq";

import Refs from "@/interfaces/refs";

export const addAlgorithmVisualizer = (
    refs: Refs,
    vertices: Array<Vertex>,
    edges: Array<Edge>,
    pq: PriorityQueue
) => {

    var visited = new Array<Vertex>();
    var usedEdges = new Array<Edge>();
    var currVertex: Vertex | undefined | null;
    var currEdge: Edge | undefined | null;
    var isFinished = false;
    var count = 1;

    // speed
    const ms: number = 1000;

    const ctx = refs.canvasRef.current?.getContext("2d");
    const rect = refs.canvasRef.current?.getBoundingClientRect();

    var colourScheme = { 
        unvisisted: 'lightgray', // unvisited vertices or edge
        used: 'green', // used edge or visited vertex
        currentVertex: 'gold', 
        currentEdge: 'gold',
        finished1: 'lightgray',
        finished2: 'green'
    };

    function updatePQ(highlight: Vertex | null, isFinished: boolean) {
        updatePQVisualizer(refs.pqRef, pq, visited, highlight, isFinished);
    }

    function drawState() {
        if (!ctx || !rect) return;
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.lineWidth = 2;
        var strokeStyle: string;
        for (let i = 0; i < edges.length; i++) {
            if (isFinished && usedEdges.includes(edges[i]))
                strokeStyle = count ? colourScheme.finished1 : colourScheme.finished2;
            else if (edges[i] == currEdge) strokeStyle = colourScheme.currentEdge;
            else if (usedEdges.includes(edges[i])) strokeStyle = colourScheme.used;
            else strokeStyle = colourScheme.unvisisted;
            edges[i].draw(ctx, strokeStyle);
        }
        for (let i = 0; i < vertices.length; i++) {
            if (isFinished) 
                strokeStyle = count ? colourScheme.finished1 : colourScheme.finished2;
            else if (vertices[i] == currVertex) strokeStyle = colourScheme.currentVertex;
            else if (visited.includes(vertices[i])) strokeStyle = colourScheme.used;
            else strokeStyle = colourScheme.unvisisted;
            vertices[i].draw(ctx, strokeStyle);
        }
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function addUsedEdge(vertex: Vertex, edge: Edge) {
        for (let i = 0; i < vertex.edges.length; i++) {
            var idx = usedEdges.indexOf(vertex.edges[i]);
            if (idx != -1) usedEdges.splice(idx, 1);
        }
        usedEdges.push(edge);
    }

    // DIJKSTRAS ALGORITHM
    async function dijkstras() {
        var start = currVertex = pq.front();
        drawState();

        while (!pq.empty()) {
            currEdge = null;
            currVertex = pq.front();
            if (currVertex != start) { 
                await sleep(ms); drawState(); updatePQ(null, false);
            }
            pq.dequeue();
            if (currVertex) {
                visited.push(currVertex);
                await sleep(ms); updatePQ(null, false);
                for (let i = 0; i < currVertex.edges.length; i++) {
                    currEdge = currVertex.edges[i];
                    var neighbor: Vertex = currEdge.va == currVertex ? currEdge.vb : currEdge.va;
                    if (!visited.includes(neighbor)) {
                        await sleep(ms); drawState(); updatePQ(neighbor, false);
                        if (currVertex.dist + currEdge.weight < neighbor.dist) {
                            neighbor.dist = currVertex.dist + currEdge.weight;
                            addUsedEdge(neighbor, currEdge);  
                            pq.heapifyUp(neighbor.idx);
                            await sleep(ms); updatePQ(neighbor, false);   
                        } 
                    }        
                }
            }
        }
        currVertex = null;
        currEdge = null;
        await sleep(ms); drawState();
        await sleep(ms); updatePQ(null, true);
        isFinished = true;
        if (refs.visPromptRef.current) refs.visPromptRef.current.innerHTML = "Visualization Complete.";
        if (refs.editRef.current) refs.editRef.current.hidden = false;
        drawState();
        count--;
        await sleep(200); drawState();
    }

    function reset() {
        var table = refs.pqRef.current;
        if (!table) return;
        var n = table.rows.length;
        for (let i = 1; i < n; i++)
            table.deleteRow(1);

        n = visited.length;
        for (let i = 0; i < n; i++)
            visited[i].dist = Infinity;
        visited.splice(0, n);
    }

    addPQVisualizer(refs.pqRef, pq);
    dijkstras();

    refs.editRef.current?.addEventListener('click', reset);
}