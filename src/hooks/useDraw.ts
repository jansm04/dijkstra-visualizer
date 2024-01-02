import Vertex from "@/app/elements/vertex";
import { useEffect, useRef } from "react";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    var vertices = new Array<Vertex>();
    var selectedObject = null;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const point = computePointInCanvas(e);
            if (!point) return;

            selectedObject = selectObject(point.x, point.y);
            if (!selectedObject) {
                var vertex: Vertex = new Vertex(point.x, point.y, '');
                vertex.draw(canvasRef.current?.getContext("2d"));
                vertices.push(vertex);
            }
            console.log(selectedObject);
        }

        const computePointInCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            return {x, y};
        }

        const selectObject = (x: number, y: number) => {
            for (let i = 0; i < vertices.length; i++) {
                if (vertices[i].containsPoint(x, y)) 
                    return vertices[i];
            }
            return null;
        }

        // add event listeners
        canvasRef.current?.addEventListener('dblclick', handler);

        // remove event listeners
        return () => canvasRef.current?.addEventListener('dblclick', handler);
    }, [])

    return { canvasRef };
}