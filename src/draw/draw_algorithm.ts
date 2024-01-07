import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";

import { addPQVisualizer, updatePQVisualizer } from "@/draw/draw_pq";

import { RefObject } from "react"

export const addAlgorithmVisualizer = (
    canvasRef: RefObject<HTMLCanvasElement>,
    pqRef: RefObject<HTMLTableElement>,
    visPromptRef: RefObject<HTMLParagraphElement>,
    editRef: RefObject<HTMLButtonElement>,
    vertices: Array<Vertex>,
    edges: Array<Edge>,
    pq: PriorityQueue
) => {

    var visited = new Array<Vertex>();
    var usedEdges = new Array<Edge>();
    var currVertex: Vertex | undefined | null;
    var currEdge: Edge | undefined | null;
    var isFinished = false;

    // speed
    const ms: number = 3000;

    const ctx = canvasRef.current?.getContext("2d");
    const rect = canvasRef.current?.getBoundingClientRect();

    var colourScheme = { 
        unvisisted: 'gray', // unvisited vertices or edge
        used: 'green', // used edge or visited vertex
        current: 'yellow', // current vertex
        finished: 'lightgreen' // final colour
    };

    function updatePQ() {
        updatePQVisualizer(pqRef, pq, visited);
    }

    function drawState() {
        if (!ctx || !rect) return;
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.lineWidth = 2;
        var strokeStyle: string;
        for (let i = 0; i < edges.length; i++) {
            if (isFinished && usedEdges.includes(edges[i])) strokeStyle = colourScheme.finished;
            else if (edges[i] == currEdge) strokeStyle = colourScheme.current;
            else if (usedEdges.includes(edges[i])) strokeStyle = colourScheme.used;
            else strokeStyle = colourScheme.unvisisted;
            edges[i].draw(ctx, strokeStyle);
        }
        for (let i = 0; i < vertices.length; i++) {
            if (isFinished) strokeStyle = colourScheme.finished;
            else if (vertices[i] == currVertex) strokeStyle = colourScheme.current;
            else if (visited.includes(vertices[i])) strokeStyle = colourScheme.used;
            else strokeStyle = colourScheme.unvisisted;
            vertices[i].draw(ctx, strokeStyle);
        }
    }

    function sleep() {
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
        while (!pq.empty()) {
            currEdge = null;
            currVertex = pq.front();
            pq.dequeue();
            await sleep(); drawState();
            if (currVertex) {
                visited.push(currVertex);
                await sleep(); updatePQ();   
                for (let i = 0; i < currVertex.edges.length; i++) {
                    currEdge = currVertex.edges[i];
                    var neighbor: Vertex = currEdge.va == currVertex ? currEdge.vb : currEdge.va;
                    if (!visited.includes(neighbor)) {
                        await sleep(); drawState();
                        if (currVertex.dist + currEdge.weight < neighbor.dist) {
                            neighbor.dist = currVertex.dist + currEdge.weight;
                            addUsedEdge(neighbor, currEdge);  
                            pq.heapifyUp(neighbor.idx);
                            await sleep(); updatePQ();   
                        } 
                    }        
                }
            }
        }
        currVertex = null;
        currEdge = null;
        await sleep(); drawState();
        await sleep(); updatePQ();
        isFinished = true;
        if (visPromptRef.current) visPromptRef.current.innerHTML = "Visualization Complete.";
        if (editRef.current) editRef.current.hidden = false;
        drawState();
    }

    function reset() {
        var table = pqRef.current;
        if (!table) return;
        var n = table.rows.length;
        for (let i = 1; i < n; i++)
            table.deleteRow(1);

        n = visited.length;
        for (let i = 0; i < n; i++)
            visited[i].dist = Infinity;
        visited.splice(0, n);
        
        if (!ctx || !rect) return;
        ctx.clearRect(0, 0, rect.width, rect.height);
        addPQVisualizer(pqRef, pq);
    }

    addPQVisualizer(pqRef, pq);
    dijkstras();

    editRef.current?.addEventListener('click', reset);
}