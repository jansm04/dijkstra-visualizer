import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";

import { useEffect, useRef } from "react";
import TempEdge from "@/app/elements/temp-edge";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    var vertices = new Array<Vertex>();
    var edges = new Array<Edge>();
    var tempEdge: TempEdge | null;

    var selectedObject: Vertex | null = null;
    var isShiftPressed = false;
    var count = 0;

    useEffect(() => {
        if (count) {
            count--;
            return;
        } else count++;

        const onDoubleClick = (e: MouseEvent) => {
            const point = computePointInCanvas(e);
            if (!point) return;

            selectedObject = selectObject(point.x, point.y);
            if (!selectedObject) {
                var vertex: Vertex = new Vertex(point.x, point.y, '');
                selectedObject = vertex;
                vertices.push(vertex);
            }
            drawGraph(canvasRef.current?.getContext("2d"));
            console.log(vertices);
        }

        const onClick = (e: MouseEvent) => {
            const point = computePointInCanvas(e);
            if (!point) return;
            selectedObject = selectObject(point.x, point.y);
            if (selectedObject) {
                drawGraph(canvasRef.current?.getContext("2d"));
            }
        }

        const onMouseDown= (e: MouseEvent) => {
            var point = computePointInCanvas(e);
            if (!point) return;

            selectedObject = selectObject(point.x, point.y);
            console.log(selectedObject);

            if (selectedObject && isShiftPressed) {
                tempEdge = new TempEdge(selectedObject, point.x, point.y);
            }
        }

        const onMouseMove = (e: MouseEvent) => {
            if (tempEdge) {
                var point = computePointInCanvas(e);
                if (!point) return;
                tempEdge.px = point.x;
                tempEdge.py = point.y;
                drawGraph(canvasRef.current?.getContext("2d"));
            }
        }

        const onMouseUp= (e: MouseEvent) => {
            const point = computePointInCanvas(e);
            if (!point) return;
            selectedObject = selectObject(point.x, point.y);
            if (selectedObject && tempEdge) {
                var edge = new Edge(0, selectedObject, tempEdge.vertex);
                edges.push(edge);
            }
            tempEdge = null;
            drawGraph(canvasRef.current?.getContext("2d"));
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key == 'Shift') {
                isShiftPressed = true;
            }
        }

        const onKeyUp = (e: KeyboardEvent) => {
            if (e.key == 'Shift') {
                isShiftPressed = false;
            }
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

        const drawGraph = (ctx: CanvasRenderingContext2D | null | undefined) => {
            if (!ctx) return;

            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            ctx?.clearRect(0, 0, rect.width, rect.height);

            // draw vertices
            for (let i = 0; i < vertices.length; i++) {
                ctx.strokeStyle = (vertices[i] == selectedObject) ? 'blue' : 'black';
                vertices[i].draw(ctx);
            }

            // draw temp edge
            if (tempEdge) {
                for (let i = 0; i < vertices.length; i++) {
                    if (vertices[i].containsPoint(tempEdge.px, tempEdge.py)) break;
                }
                tempEdge.draw(ctx);
            } 
        }

        // add event listeners
        canvasRef.current?.addEventListener('dblclick', onDoubleClick);
        canvasRef.current?.addEventListener('click', onClick);
        canvasRef.current?.addEventListener('mousedown', onMouseDown);
        canvasRef.current?.addEventListener('mousemove', onMouseMove);
        canvasRef.current?.addEventListener('mouseup', onMouseUp);
        canvasRef.current?.addEventListener('keydown', onKeyDown, true);
        canvasRef.current?.addEventListener('keyup', onKeyUp, true);

        // remove event listeners
        return () => {
            canvasRef.current?.addEventListener('dblclick', onDoubleClick);
            canvasRef.current?.addEventListener('click', onClick);
            canvasRef.current?.addEventListener('mousedown', onMouseDown);
            canvasRef.current?.addEventListener('mousemove', onMouseMove);
            canvasRef.current?.addEventListener('mouseup', onMouseUp);
            canvasRef.current?.addEventListener('keydown', onKeyDown, true);
            canvasRef.current?.addEventListener('keyup', onKeyUp, true);
        }
    }, [])

    return { canvasRef };
}