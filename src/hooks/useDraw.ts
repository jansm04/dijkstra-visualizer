import { useEffect, useRef } from "react";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            console.log({x: e.clientX, y: e.clientY})
        }

        // add event listeners
        canvasRef.current?.addEventListener('dblclick', handler)

        // remove event listeners
        return () => canvasRef.current?.addEventListener('dblclick', handler)
    }, [])

    return { canvasRef }
}