import PriorityQueue from "@/app/elements/priority_queue";
import Vertex from "@/app/elements/vertex";

import { RefObject } from "react";

var rowStyle = "h-10 text-center border text-[14px]";
var cellStyle = "border border-gray-500";

export const addPQVisualizer = (
    pqRef: RefObject<HTMLTableElement>,
    pq: PriorityQueue
) => {

    if (!pqRef.current) return;
    for (let i = 0; i < pq.vertices.length; i++) {
        var row = pqRef.current.insertRow();
        row.className = rowStyle;
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
    visited: Array<Vertex>
) => {

    let idx = 1;
    visited.forEach((vertex) => {
        if (!pqRef.current) return;
        var row = pqRef.current.rows[idx];
        row.className = rowStyle + " text-gray-400";
        row.cells[0].textContent = vertex.label;
        row.cells[0].className = cellStyle;
        if (vertex.dist == Infinity)
            row.cells[1].textContent = "Inf";
        else 
            row.cells[1].textContent = vertex.dist.toString();
        row.cells[1].className = cellStyle;
        idx++;
    })

    pq.vertices.forEach((vertex) => {
        if (!pqRef.current) return;
        var row = pqRef.current.rows[idx];
        row.className = rowStyle;
        row.cells[0].textContent = vertex.label;
        row.cells[0].className = cellStyle;
        if (vertex.dist == Infinity)
            row.cells[1].textContent = "Inf";
        else 
            row.cells[1].textContent = vertex.dist.toString();
        row.cells[1].className = cellStyle;
        idx++;
    })

}