import PriorityQueue from "@/app/elements/priority_queue";
import Vertex from "@/app/elements/vertex";

import { RefObject } from "react";

const styleRow = (row: HTMLTableRowElement) => {
    row.style.height = '30px';
    row.style.textAlign = 'center';
    row.style.borderWidth = '1px';
    row.style.fontSize = '14px';
}

const styleVisitedRow = (row: HTMLTableRowElement) => {
    styleRow(row);
    row.style.color = 'gray';
    row.style.fontWeight = '400';
    row.style.background = 'none';
}

const styleUnvisitedRow = (row: HTMLTableRowElement) => {
    styleRow(row);
    row.style.color = 'black';
    row.style.fontWeight = '700';
    row.style.background = 'none';
}

const styleHighlightRow = (row: HTMLTableRowElement) => {
    styleRow(row);
    row.style.color = 'black';
    row.style.fontWeight = '700';
    row.style.background = '#fcd34d';
}

const styleCell = (cell: HTMLTableCellElement) => {
    cell.style.borderWidth = '1px';
    cell.style.borderColor = 'gray';
}

/* 
Adds rows to the priority queue table to visualize each vertex in the priority queue. Each row the 
vertex's label and its distance to the start vertex. If a vertex's distance is Infinity, its 
label is simply shortened to "Inf"
*/
export const addPQVisualizer = (
    pqRef: RefObject<HTMLTableElement>,
    pq: PriorityQueue
) => {

    if (!pqRef.current) return;
    for (let i = 0; i < pq.vertices.length; i++) {
        var row = pqRef.current.insertRow();
        styleUnvisitedRow(row);
        var c0 = row.insertCell();
        c0.textContent = pq.vertices[i].label;
        styleCell(c0);

        var c1 = row.insertCell();
        if (pq.vertices[i].dist == Infinity)
            c1.textContent = "Inf";
        else 
            c1.textContent = pq.vertices[i].dist.toString();
        styleCell(c1);
    }
}

/* 
Updates the rows in the priority queue table and styles the rows depending on if the vertices have
been visited or not.

A highlighted row corresponds to a 'current' vertex in the graph traversal.
*/
export const updatePQVisualizer = (
    pqRef: RefObject<HTMLTableElement>,
    pq: PriorityQueue,
    visited: Array<Vertex>,
    highlight: Vertex | null,
    isFinished: boolean
) => {

    let idx = 1;
    visited.forEach((vertex) => {
        if (!pqRef.current) return;
        var row = pqRef.current.rows[idx];

        // automatically style as 'unvisited' is the visualization is finished
        if (isFinished) styleUnvisitedRow(row); 
        else styleVisitedRow(row);

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

        // if current vertex in traversal
        if (vertex == highlight) styleHighlightRow(row);
        else styleUnvisitedRow(row);
        
        row.cells[0].textContent = vertex.label;
        if (vertex.dist == Infinity)
            row.cells[1].textContent = "Inf";
        else 
            row.cells[1].textContent = vertex.dist.toString();
        idx++;
    })

}