import { useEffect, useRef } from "react";
import { addGraphDesigner } from "@/draw/graph";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    var count = 0;

    useEffect(() => {
        console.log('Entered useEffect');
        if (count) { count--; return; } else count++;
        addGraphDesigner(canvasRef);
    }, [])

    return { canvasRef };
}