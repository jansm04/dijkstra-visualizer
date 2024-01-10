import { useEffect, useRef } from "react";
import { addGraphVisualizer } from "@/draw/draw_graph";
import { addAlgorithmVisualizer } from "@/draw/draw_algorithm";

import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";

import Refs from "@/interfaces/refs";

export const useDraw = () => {

    const refs: Refs = {
        // canvas and table
        canvasRef: useRef<HTMLCanvasElement>(null), 
        pqRef: useRef<HTMLTableElement>(null),
        // buttons
        selectModeRef: useRef<HTMLButtonElement>(null), 
        startVisRef: useRef<HTMLButtonElement>(null),
        resetRef: useRef<HTMLButtonElement>(null),
        editRef: useRef<HTMLButtonElement>(null),
        // prompts
        startPromptRef: useRef<HTMLParagraphElement>(null),
        retryPromptRef: useRef<HTMLParagraphElement>(null),
        emptyPromptRef: useRef<HTMLParagraphElement>(null),
        visPromptRef: useRef<HTMLParagraphElement>(null)
    }
    
    var count = 0;

    useEffect(() => {
        var vertices = new Array<Vertex>();
        var edges = new Array<Edge>();
        var pq = new PriorityQueue();
    
        console.log('Entered useEffect');
        if (count) { count--; return; } else count++;

        addGraphVisualizer(refs, vertices, edges, pq);

        refs.startVisRef.current?.addEventListener('click', () => {
            addAlgorithmVisualizer(refs, vertices, edges, pq);
        });
        
        refs.resetRef.current?.addEventListener('click', () => {
            location.reload();
        });
    }, [count]);

    return { refs };
}