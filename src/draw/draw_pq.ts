import PriorityQueue from "@/app/elements/priority_queue";
import Vertex from "@/app/elements/vertex";

import { RefObject } from "react";

const regular = "h-12 text-center border border-gray-300 text-[14px]";
const min = "h-12 text-center border border-yellow-500 text-[14px]"

export const addPQVisualizer = (
    pqRef: RefObject<HTMLTableElement>,
    pq: PriorityQueue,
    visited: Array<Vertex>
) => {

    if (!pqRef.current) return;
    for (let i = 0; i < pq.vertices.length; i++) {
        var row = pqRef.current.insertRow();
        row.className = regular;
        row.insertCell().textContent = pq.vertices[i].label;
        if (pq.vertices[i].dist == Infinity)
            row.insertCell().textContent = "Inf";
        else 
            row.insertCell().textContent = pq.vertices[i].dist.toString();
        row.insertCell().textContent = pq.vertices[i].pred;
    }
}

export const updatePQVisualizer = (
    pqRef: RefObject<HTMLTableElement>,
    pq: PriorityQueue,
    visited: Array<Vertex>
) => {

    let idx = 1;
    visited.forEach((vertex) => {
        if (!pqRef.current) return;
        var row = pqRef.current.rows[idx];
        row.className = regular + " text-gray-400";
        row.cells[0].textContent = vertex.label;
        if (vertex.dist == Infinity)
            row.cells[1].textContent = "Inf";
        else 
            row.cells[1].textContent = vertex.dist.toString();
        row.cells[2].textContent = vertex.pred;
        idx++;
    })

    pq.vertices.forEach((vertex) => {
        if (!pqRef.current) return;
        var row = pqRef.current.rows[idx];
        row.className = vertex == pq.front() ? min : regular;
        row.cells[0].textContent = vertex.label;
        if (vertex.dist == Infinity)
            row.cells[1].textContent = "Inf";
        else 
            row.cells[1].textContent = vertex.dist.toString();
        row.cells[2].textContent = vertex.pred;
        idx++;
    })

}