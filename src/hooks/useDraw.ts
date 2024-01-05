import { useEffect, useRef } from "react";
import { addGraphVisualizer } from "@/draw/draw_graph";

import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";
import { addPQVisualizer } from "@/draw/draw_pq";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pqRef = useRef<HTMLCanvasElement>(null);
    const startRef = useRef<HTMLButtonElement>(null);

    var count = 0;

    var vertices = new Array<Vertex>();
    var edges = new Array<Edge>();
    var pq = new PriorityQueue();

    useEffect(() => {
        console.log('Entered useEffect');
        if (count) { count--; return; } else count++;
        addGraphVisualizer(canvasRef, startRef, vertices, edges, pq);
        addPQVisualizer(pqRef, startRef, pq);
    }, [])

    return { canvasRef, pqRef, startRef };
}