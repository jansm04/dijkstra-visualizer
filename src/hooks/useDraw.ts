import { useEffect, useRef } from "react";
import { addGraphVisualizer } from "@/draw/draw_graph";
import { addAlgorithmVisualizer } from "@/draw/draw_algorithm";

import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pqRef = useRef<HTMLTableElement>(null);
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

        addGraphVisualizer(canvasRef, selectModeRef, startPromptRef, startVisRef, vertices, edges, pq);

        function startAlgorithm() {
            addAlgorithmVisualizer(canvasRef, pqRef, vertices, edges, pq);
        }
        
        startVisRef.current?.addEventListener('click', startAlgorithm);
    }, [])

    return { canvasRef, pqRef, selectModeRef, startPromptRef, startVisRef };
}