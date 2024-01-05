import { useEffect, useRef } from "react";
import { addGraphVisualizer } from "@/draw/draw_graph";

import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";
import { addPQVisualizer } from "@/draw/draw_pq";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pqRef = useRef<HTMLCanvasElement>(null);
    const selectModeRef = useRef<HTMLButtonElement>(null);
    const startPromptRef = useRef<HTMLParagraphElement>(null);
    const endPromptRef = useRef<HTMLParagraphElement>(null);
    const startVisRef = useRef<HTMLButtonElement>(null);

    var count = 0;

    var vertices = new Array<Vertex>();
    var edges = new Array<Edge>();
    var pq = new PriorityQueue();

    useEffect(() => {
        console.log('Entered useEffect');
        if (count) { count--; return; } else count++;

        addGraphVisualizer(canvasRef, selectModeRef, startPromptRef, endPromptRef, startVisRef, vertices, edges, pq);
        addPQVisualizer(pqRef, selectModeRef, pq);
    }, [])

    return { canvasRef, pqRef, selectModeRef, startPromptRef, endPromptRef, startVisRef };
}