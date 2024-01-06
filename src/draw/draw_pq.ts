import PriorityQueue from "@/app/elements/priority_queue";

import { RefObject } from "react";

export const addPQVisualizer = (
        pqRef: RefObject<HTMLTableElement>,
        startVisRef: RefObject<HTMLButtonElement>,
        pq: PriorityQueue
    ) => {
        
        function onSubmitBuild(e: MouseEvent) {
            if (!pqRef.current) return;
            for (let i = 0; i < pq.vertices.length; i++) {
                var row = pqRef.current.insertRow();
                row.className = "h-8 text-center border border-gray-300 text-[13px]"
                row.insertCell().textContent = pq.vertices[i].label;
                if (pq.vertices[i].dist == Infinity)
                    row.insertCell().textContent = "Inf";
                else 
                    row.insertCell().textContent = pq.vertices[i].dist.toString();
                row.insertCell().textContent = pq.vertices[i].pred;
            }
        }
    
        if (!startVisRef.current) return;
        startVisRef.current.addEventListener('click', onSubmitBuild);
}