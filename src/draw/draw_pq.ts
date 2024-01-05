import PriorityQueue from "@/app/elements/priority_queue";

import { RefObject } from "react";

export const addPQVisualizer = (
        pqRef: RefObject<HTMLCanvasElement>,
        submitRef: RefObject<HTMLButtonElement>,
        pq: PriorityQueue
    ) => {
        
        function onSubmitStart(e: MouseEvent) {
            console.log("In draw PQ: ")
            console.log(pq.edges);
        }
    
        if (!submitRef.current) return;
        submitRef.current.addEventListener('click', onSubmitStart);
}