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
    var heldObject: Vertex | null = null;
    var originalPosition: {x: number, y: number};
    var isShiftPressed = false, isMoving = false;
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
            console.log(edges);
        }

        const onMouseDown= (e: MouseEvent) => {
            var point = computePointInCanvas(e);
            if (!point) return;

            selectedObject = selectObject(point.x, point.y);
            console.log(selectedObject);

            if (selectedObject && isShiftPressed) {
                tempEdge = new TempEdge(selectedObject, point.x, point.y);
            } else if (selectedObject) {
                heldObject = selectedObject;
                originalPosition = {x: (selectedObject.x), y: (selectedObject.y)};
            }
        }

        const onMouseMove = (e: MouseEvent) => {
            if (tempEdge) {
                var point = computePointInCanvas(e);
                if (!point) return;

                selectedObject = selectObject(point.x, point.y);
                if (!selectedObject) {
                    tempEdge.px = point.x;
                    tempEdge.py = point.y;
                } else {
                    var midX = (selectedObject.x + tempEdge.vx) / 2;
                    var midY = (selectedObject.y + tempEdge.vy) / 2;
                    var p = selectedObject.computeClosestPoint(midX, midY);
                    tempEdge.px = p.px;
                    tempEdge.py = p.py;
                }
                drawGraph(canvasRef.current?.getContext("2d"));
            }
            if (heldObject) {
                var point = computePointInCanvas(e);
                if (!point) return;
                isMoving = true;
                heldObject.x = point.x;
                heldObject.y = point.y;
                relocateEdges();
                drawGraph(canvasRef.current?.getContext("2d"));
            }
        }

        const onMouseUp= (e: MouseEvent) => {
            const point = computePointInCanvas(e);
            if (!point) return;
            selectedObject = selectObject(point.x, point.y);
            if (selectedObject && tempEdge && selectedObject != tempEdge.vertex) {
                console.log("REACHED HERE");
                var edge = new Edge(0, selectedObject, tempEdge.vertex);
                edges.push(edge);
            }
            if (heldObject && isMoving) {
                var isValid = true;
                for (let i = 0; i < vertices.length; i++) {
                    if (vertices[i] != heldObject && vertices[i].containsPoint(point.x, point.y)) {
                        heldObject.x = originalPosition.x;
                        heldObject.y = originalPosition.y;
                        isValid = false;
                    }      
                }
                if (isValid) {
                    heldObject.x = point.x;
                    heldObject.y = point.y;
                }
            }
            relocateEdges();
            tempEdge = null;
            heldObject = null;
            isMoving = false;
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

        const relocateEdges = () => {
            if (!heldObject) return;
            for (let i = 0; i < heldObject.edges.length; i++) {
                var edge: Edge = heldObject.edges[i];
                if (edge.va == heldObject) {
                    var midX = (heldObject.x + edge.bx) / 2;
                    var midY = (heldObject.y + edge.by) / 2;
                    var a = heldObject.computeClosestPoint(midX, midY);
                    var b = edge.vb.computeClosestPoint(midX, midY); 
                } else {
                    var midX = (heldObject.x + edge.ax) / 2;
                    var midY = (heldObject.y + edge.ay) / 2;
                    var a = edge.va.computeClosestPoint(midX, midY);
                    var b = heldObject.computeClosestPoint(midX, midY);
                }
                edge.ax = a.px;
                edge.ay = a.py;
                edge.bx = b.px;
                edge.by = b.py;
            }
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
            ctx.lineWidth = 2;

            // draw vertices
            for (let i = 0; i < vertices.length; i++) {
                ctx.strokeStyle = (vertices[i] == selectedObject) ? 'blue' : 'white';
                vertices[i].draw(ctx);
            }
            ctx.strokeStyle = 'white';

            // draw temp edge
            if (tempEdge && !tempEdge.vertex.containsPoint(tempEdge.px, tempEdge.py)) { 
                tempEdge.draw(ctx);
            } 

            // draw edges
            for (let i = 0; i < edges.length; i++) {
                edges[i].draw(ctx);
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