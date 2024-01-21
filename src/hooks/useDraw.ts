import { useEffect, useRef } from "react";
import { addGraphVisualizer } from "@/draw/draw_graph";
import { addAlgorithmVisualizer } from "@/draw/draw_algorithm";

import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import PriorityQueue from "@/app/elements/priority_queue";

import Refs from "@/interfaces/refs";
import Graph from "@/interfaces/graph";
import { addSlider } from "@/draw/draw_slider";

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
        buildRef: useRef<HTMLButtonElement>(null),
        restartRef: useRef<HTMLButtonElement>(null),
        pauseRef: useRef<HTMLButtonElement>(null),
        // prompts
        startPromptRef: useRef<HTMLParagraphElement>(null),
        retryPromptRef: useRef<HTMLParagraphElement>(null),
        emptyPromptRef: useRef<HTMLParagraphElement>(null),
        visPromptRef: useRef<HTMLParagraphElement>(null),
        // slider
        sliderRef: useRef<HTMLDivElement>(null),
        thumbRef: useRef<HTMLDivElement>(null)
    }

    useEffect(() => {
        var graph: Graph = {
            vertices: new Array<Vertex>(),
            edges: new Array<Edge>(),
            pq: new PriorityQueue()
        }
        addGraphVisualizer(refs, graph);
        addSlider(refs);
        refs.startVisRef.current?.addEventListener('click', () => {
            addAlgorithmVisualizer(refs, graph);
        });
        refs.resetRef.current?.addEventListener('click', () => {
            location.reload();
        });        
    });

    return { refs };
}