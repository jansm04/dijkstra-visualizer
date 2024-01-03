import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import TempEdge from "@/app/elements/temp-edge";
import { useEffect, useRef } from "react";

export const useDraw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    var vertices = new Array<Vertex>();
    var edges = new Array<Edge>();
    var tempEdge: TempEdge | null;

    var selectedObject: Vertex | Edge | null = null;
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
            if (!selectedObject && vertices.length < 26) {
                var vertex: Vertex = new Vertex(point.x, point.y, String.fromCharCode(65+vertices.length));
                selectedObject = vertex;
                vertices.push(vertex);
            }
            drawGraph();
        }

        const onMouseDown= (e: MouseEvent) => {
            var point = computePointInCanvas(e);
            if (!point) return;
            selectedObject = selectObject(point.x, point.y);
            if (selectedObject instanceof Vertex && isShiftPressed) {
                tempEdge = new TempEdge(selectedObject, point.x, point.y);
            } else if (selectedObject instanceof Vertex) {
                heldObject = selectedObject;
                originalPosition = {x: (selectedObject.x), y: (selectedObject.y)};
            }
        }

        const onMouseMove = (e: MouseEvent) => {
            if (tempEdge) {
                var point = computePointInCanvas(e);
                if (!point) return;

                selectedObject = selectObject(point.x, point.y);
                if (!(selectedObject instanceof Vertex)) {
                    tempEdge.px = point.x;
                    tempEdge.py = point.y;
                } else if (selectedObject instanceof Vertex) {
                    var midX = (selectedObject.x + tempEdge.vx) / 2;
                    var midY = (selectedObject.y + tempEdge.vy) / 2;
                    var p = selectedObject.computeClosestPoint(midX, midY);
                    tempEdge.px = p.px;
                    tempEdge.py = p.py;
                }
                drawGraph();
            }
            if (heldObject) {
                var point = computePointInCanvas(e);
                if (!point) return;
                isMoving = true;
                heldObject.x = point.x;
                heldObject.y = point.y;
                relocateEdges();
                drawGraph();
            }
        }

        const onMouseUp= (e: MouseEvent) => {
            const point = computePointInCanvas(e);
            if (!point) return;
            selectedObject = selectObject(point.x, point.y);
            if (selectedObject instanceof Vertex && tempEdge && selectedObject != tempEdge.vertex) {
                var edge = new Edge(null, selectedObject, tempEdge.vertex);
                selectedObject = edge;
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
                relocateEdges();
            }
            tempEdge = null;
            heldObject = null;
            isMoving = false;
            drawGraph();
        }

        const onKeyDown = (e: KeyboardEvent) => {
            console.log(e.key);
            if (e.key == 'Shift') {
                isShiftPressed = true;
            }
            if (selectedObject instanceof Edge) {
                var weight = selectedObject.weight;
                if (Number.isInteger(parseInt(e.key, 10))) {
                    if (!weight) weight = parseInt(e.key, 10);
                    else weight = weight * 10 + parseInt(e.key, 10);
                } else if (e.key == 'Backspace') {
                    if (weight)
                        if (weight < 10) weight = null;
                        else weight = Math.floor(weight / 10);
                }
                selectedObject.weight = weight;
            }
            drawGraph();
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
            if (tempEdge) return null;
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].containsPoint(x, y)) 
                    return edges[i];
            }
            return null;
        }

        const drawGraph = () => {
            const ctx = canvasRef.current?.getContext("2d");
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!ctx || !rect) return;
            ctx?.clearRect(0, 0, rect.width, rect.height);
            ctx.lineWidth = 2;
            if (tempEdge && !tempEdge.vertex.containsPoint(tempEdge.px, tempEdge.py)) { 
                ctx.strokeStyle = 'aqua';
                tempEdge.draw(ctx);
            } 
            for (let i = 0; i < edges.length; i++) {
                var strokeStyle = (edges[i] == selectedObject) ? 'aqua' : 'white';
                edges[i].draw(ctx, strokeStyle);
            }
            for (let i = 0; i < vertices.length; i++) {
                var strokeStyle = (vertices[i] == selectedObject) ? 'aqua' : 'white';
                vertices[i].draw(ctx, strokeStyle);
            }
        }

        // add event listeners
        canvasRef.current?.addEventListener('dblclick', onDoubleClick);
        canvasRef.current?.addEventListener('mousedown', onMouseDown);
        canvasRef.current?.addEventListener('mousemove', onMouseMove);
        canvasRef.current?.addEventListener('mouseup', onMouseUp);
        canvasRef.current?.addEventListener('keydown', onKeyDown, true);
        canvasRef.current?.addEventListener('keyup', onKeyUp, true);

        // remove event listeners
        return () => {
            canvasRef.current?.addEventListener('dblclick', onDoubleClick);
            canvasRef.current?.addEventListener('mousedown', onMouseDown);
            canvasRef.current?.addEventListener('mousemove', onMouseMove);
            canvasRef.current?.addEventListener('mouseup', onMouseUp);
            canvasRef.current?.addEventListener('keydown', onKeyDown, true);
            canvasRef.current?.addEventListener('keyup', onKeyUp, true);
        }
    }, [])

    return { canvasRef };
}