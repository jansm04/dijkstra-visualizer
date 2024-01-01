import { useEffect, useRef } from "react";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            console.log({x: e.clientX, y: e.clientY});
            const point = computePointInCanvas(e);
            if (!point) return;

            // draw circle
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 40, 0, 2 * Math.PI);
            ctx.stroke();
        }

        const computePointInCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            return {x, y};
        }

        // add event listeners
        canvasRef.current?.addEventListener('dblclick', handler);

        // remove event listeners
        return () => canvasRef.current?.addEventListener('dblclick', handler);
    }, [])

    return { canvasRef };
}