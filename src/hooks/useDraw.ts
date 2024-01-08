import { useEffect, useRef } from "react";
import { addGraphVisualizer } from "@/draw/draw_graph";
import { addAlgorithmVisualizer } from "@/draw/draw_algorithm";

import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";

export const useDraw = () => {
    // canvas and table
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pqRef = useRef<HTMLTableElement>(null);
    // bottom elements
    const selectModeRef = useRef<HTMLButtonElement>(null);
    const startPromptRef = useRef<HTMLParagraphElement>(null);
    const retryPromptRef = useRef<HTMLParagraphElement>(null);
    const emptyPromptRef = useRef<HTMLParagraphElement>(null);
    const startVisRef = useRef<HTMLButtonElement>(null);
    const visPromptRef = useRef<HTMLParagraphElement>(null);
    // right elements
    const resetRef = useRef<HTMLButtonElement>(null);
    const editRef = useRef<HTMLButtonElement>(null);

    var count = 0;

    useEffect(() => {
        var vertices = new Array<Vertex>();
        var edges = new Array<Edge>();
        var pq = new PriorityQueue();
    
        console.log('Entered useEffect');
        if (count) { count--; return; } else count++;

        addGraphVisualizer(canvasRef, selectModeRef, startPromptRef, retryPromptRef, emptyPromptRef, startVisRef, visPromptRef, editRef, vertices, edges, pq);

        startVisRef.current?.addEventListener('click', () => {
            addAlgorithmVisualizer(canvasRef, pqRef, visPromptRef, editRef, vertices, edges, pq);
        });
        
        resetRef.current?.addEventListener('click', () => {
            location.reload();
        });
    }, [count]);

    return { canvasRef, pqRef, selectModeRef, startPromptRef, retryPromptRef, emptyPromptRef, startVisRef, visPromptRef, resetRef, editRef };
}