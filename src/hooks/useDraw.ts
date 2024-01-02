import Vertex from "@/app/elements/vertex";
import { useEffect, useRef } from "react";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    var vertices = new Array<Vertex>();
    var selectedObject: Vertex | null = null;
    var count = 0;

    useEffect(() => {
        if (count) {
            count--;
            return;
        } else count++;

        const handler = (e: MouseEvent) => {
            const point = computePointInCanvas(e);
            if (!point) return;

            selectedObject = selectObject(point.x, point.y);
            if (!selectedObject) {
                var vertex: Vertex = new Vertex(point.x, point.y, '');
                selectedObject = vertex;
                vertices.push(vertex);
            }
            draw(canvasRef.current?.getContext("2d"));
            console.log(vertices);
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

        const draw = (ctx: CanvasRenderingContext2D | null | undefined) => {
            if (!ctx) return;
            
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            ctx?.clearRect(0, 0, rect.width, rect.height);

            for (let i = 0; i < vertices.length; i++) {
                ctx.strokeStyle = (vertices[i] == selectedObject) ? 'blue' : 'black';
                vertices[i].draw(ctx);
            }
        }

        // add event listeners
        canvasRef.current?.addEventListener('dblclick', handler);

        // remove event listeners
        return () => canvasRef.current?.addEventListener('dblclick', handler);
    }, [])

    return { canvasRef };
}