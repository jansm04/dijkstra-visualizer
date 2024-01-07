import PriorityQueue from "@/app/elements/priority_queue";
import Vertex from "@/app/elements/vertex";

import { RefObject } from "react";

var rowStyleUnvisited = "h-10 text-center border text-[14px] bg-none";
var rowStyleVisited = "h-10 text-center border text-gray-400 text-[14px] bg-none";
var rowStyleHighlighted = "h-10 relative text-center text-[14px] bg-[#fffb002c]";
var rowStyleCurrent = "h-10 relative text-center text-[14px] bg-sky-950"
var cellStyle = "border border-gray-500";

export const addPQVisualizer = (
    pqRef: RefObject<HTMLTableElement>,
    pq: PriorityQueue
) => {

    if (!pqRef.current) return;
    for (let i = 0; i < pq.vertices.length; i++) {
        var row = pqRef.current.insertRow();
        row.className = rowStyleUnvisited;
        var c0 = row.insertCell();
        c0.textContent = pq.vertices[i].label;
        c0.className = cellStyle;

        var c1 = row.insertCell();
        if (pq.vertices[i].dist == Infinity)
            c1.textContent = "Inf";
        else 
            c1.textContent = pq.vertices[i].dist.toString();
        c1.className = cellStyle;
    }
}

export const updatePQVisualizer = (
    pqRef: RefObject<HTMLTableElement>,
    pq: PriorityQueue,
    visited: Array<Vertex>,
    current: Vertex | null,
    highlight: Vertex | null
) => {

    let idx = 1;
    visited.forEach((vertex) => {
        if (!pqRef.current) return;
        var row = pqRef.current.rows[idx];
        row.className = vertex == current ? rowStyleCurrent : rowStyleVisited;
        row.cells[0].textContent = vertex.label;
        if (vertex.dist == Infinity)
            row.cells[1].textContent = "Inf";
        else 
            row.cells[1].textContent = vertex.dist.toString();
        idx++;
    })

    pq.vertices.forEach((vertex) => {
        if (!pqRef.current) return;
        var row = pqRef.current.rows[idx];
        row.className = vertex == highlight ? rowStyleHighlighted :  rowStyleUnvisited;
        row.cells[0].textContent = vertex.label;
        if (vertex.dist == Infinity)
            row.cells[1].textContent = "Inf";
        else 
            row.cells[1].textContent = vertex.dist.toString();
        idx++;
    })

}