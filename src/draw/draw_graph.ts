import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import TempEdge from "@/app/elements/temp_edge";

import { RefObject } from "react";
import PriorityQueue from "@/app/elements/priority_queue";

export const addGraphVisualizer = (
        canvasRef: RefObject<HTMLCanvasElement>,
        selectModeRef: RefObject<HTMLButtonElement>,
        startPromptRef: RefObject<HTMLParagraphElement>,
        endPromptRef: RefObject<HTMLParagraphElement>,
        startVisRef: RefObject<HTMLButtonElement>,
        vertices: Array<Vertex>,
        edges: Array<Edge>,
        pq: PriorityQueue
    ) => {

    var tempEdge: TempEdge | null;
    var selectedObject: Vertex | Edge | null = null;
    var startingVertex: Vertex | null = null;
    var endingVertex: Vertex | null = null;

    var heldObject: Vertex | null = null;
    var originalPosition: {x: number, y: number};
    var isShiftPressed = false
    var isMoving = false;
    var inSelectionMode = false;
    var timer: NodeJS.Timeout;
    var takenLetters = "";

    const onDoubleClick = (e: MouseEvent) => {
        if (inSelectionMode) return;
        const point = computePointInCanvas(e);
        if (!point) return;
        selectedObject = selectObject(point.x, point.y);
        if (!selectedObject && vertices.length < 26) {
            var vertex: Vertex = new Vertex(point.x, point.y);
            selectedObject = vertex;
            vertices.push(vertex);
        }
        drawGraph();
        pulseCursor();
    }

    function onMouseDown(e: MouseEvent) {
        setTimeout(() => null, 1);
        var point = computePointInCanvas(e);
        if (!point) return;

        selectedObject = selectObject(point.x, point.y);
        if (inSelectionMode) {
            if (selectedObject instanceof Vertex) {
                if (!startingVertex) {
                    startingVertex = selectedObject;
                    if (startPromptRef.current) startPromptRef.current.hidden = true;
                    if (endPromptRef.current) endPromptRef.current.hidden = false;
                }
                else if (!endingVertex) { 
                    endingVertex = selectedObject;
                    if (endPromptRef.current) endPromptRef.current.hidden = true;
                    if (startVisRef.current) startVisRef.current.hidden = false;
                } else return;
                selectedObject.isCursorVisible = false;
                clearInterval(timer);
                drawGraphInSelectionMode();
            }
            return;
        }
        if (selectedObject instanceof Vertex && isShiftPressed) {
            tempEdge = new TempEdge(selectedObject, point.x, point.y);
        } else if (selectedObject instanceof Vertex) {
            heldObject = selectedObject;
            originalPosition = {x: (selectedObject.x), y: (selectedObject.y)};
        }
        drawGraph();
        if (selectedObject) pulseCursor();
    }

    function onMouseMove(e: MouseEvent) {
        if (inSelectionMode) return;
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
                selectedObject.isCursorVisible = false;
                clearInterval(timer);
            }
            drawGraph();
        }
        if (heldObject) {
            var point = computePointInCanvas(e);
            if (!point) return;
            isMoving = true;
            heldObject.x = point.x;
            heldObject.y = point.y;
            heldObject.isCursorVisible = false;
            clearInterval(timer);
            relocateEdges();
            drawGraph();
        }
    }

    function onMouseUp(e: MouseEvent) {
        if (inSelectionMode) return;
        const point = computePointInCanvas(e);
        if (!point) return;

        selectedObject = selectObject(point.x, point.y);
        if (selectedObject instanceof Vertex && tempEdge && selectedObject != tempEdge.vertex) {
            var edge = new Edge(tempEdge.vertex, selectedObject);
            selectNewEdge(edge);
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
        pulseCursor();
    }

    function onKeyDown(e: KeyboardEvent) {
        if (inSelectionMode) return;
        if (e.key == 'Shift')
            isShiftPressed = true;
        else {
            if (selectedObject instanceof Edge) {
                if (e.key == 'Delete') 
                    deleteEdgeFromCanvas(selectedObject);
                else 
                    setEdgeWeight(e.key);
            }
            if (selectedObject instanceof Vertex) {
                if (e.key == 'Delete') 
                    deleteVertexFromCanvas(selectedObject);
                else 
                    setVertexLabel(e.key);
            }
        }
        drawGraph();
    }

    function onKeyUp(e: KeyboardEvent) {
        if (inSelectionMode) return;
        if (e.key == 'Shift') {
            isShiftPressed = false;
        }
    }

    function onEnterSelectMode(e: MouseEvent) {
        startingVertex = null;
        endingVertex = null;
        inSelectionMode = true;
        if (selectModeRef.current) selectModeRef.current.innerHTML = "Reselect Start/End Vertices";
        if (startPromptRef.current) startPromptRef.current.hidden = false;
        if (endPromptRef.current) endPromptRef.current.hidden = true;
        if (startVisRef.current) startVisRef.current.hidden = true;
        drawGraphInSelectionMode();
    }

    function onSubmitBuild(e: MouseEvent) {
        if (startingVertex instanceof Vertex)
            startingVertex.dist = 0;
        pq.buildHeap(vertices);
    }

    function setEdgeWeight(key: string) {
        if (selectedObject instanceof Edge) {
            var weight = selectedObject.weight;
            if (Number.isInteger(parseInt(key, 10))) {
                if (!weight) weight = parseInt(key, 10);
                else weight = weight * 10 + parseInt(key, 10);
            } else if (weight && key == 'Backspace') {
                if (weight < 10) weight = null;
                else weight = Math.floor(weight / 10);
            } 
            selectedObject.weight = weight;
        }  
    }

    function setVertexLabel(key: string) {
        if (selectedObject instanceof Vertex) {
            var label = selectedObject.label;
            var letter = key.toUpperCase();
            if (!label && key.length == 1 && key.match('[a-z]|[A-Z]') && !takenLetters.includes(letter)) {
                label = letter;
                takenLetters += letter;
            } else if (label && key == 'Backspace') {
                takenLetters = takenLetters.replaceAll(label, "");
                label = null;
            }
            selectedObject.label = label;
        }
    }

    function deleteVertexFromCanvas(vertex: Vertex) {
        var idx = vertices.indexOf(vertex);
        var n = vertex.edges.length;
        for (let i = 0; i < n; i++)
            deleteEdgeFromCanvas(vertex.edges[0]);
        selectedObject = null;
        if (vertex.label)
            takenLetters = takenLetters.replaceAll(vertex.label, "");
        vertices.splice(idx, 1);
    }

    function deleteEdgeFromCanvas(edge: Edge) {
        var idx = edges.indexOf(edge);
        edge.va.removeEdge(edge);
        edge.vb.removeEdge(edge);
        if (selectedObject instanceof Edge) 
            selectedObject = null;
        edges.splice(idx, 1);
    }

    function computePointInCanvas(e: MouseEvent) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return {x, y};
    }

    function relocateEdges() {
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

    function selectNewEdge(edge: Edge) {
        if (!selectedObject) return;
        selectedObject.isCursorVisible = false;
        edge.isCursorVisible = true;
        selectedObject = edge;
    }

    function selectObject(x: number, y: number) {
        if (selectedObject) selectedObject.isCursorVisible = false;
        for (let i = 0; i < vertices.length; i++) {
            if (vertices[i].containsPoint(x, y)) {
                vertices[i].isCursorVisible = true;
                return vertices[i];
            }
        }
        if (tempEdge) return null;
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].containsPoint(x, y)) {
                edges[i].isCursorVisible = true;
                return edges[i];
            } 
        }
        return null;
    }

    function pulseCursor() {
        clearInterval(timer);
        timer = setInterval(() => {
            if (!selectedObject) return;
            selectedObject.isCursorVisible = !selectedObject.isCursorVisible;
            drawGraph();
        }, 500);
    }

    function resetContext() {
        var ctx = canvasRef.current?.getContext("2d");
        var rect = canvasRef.current?.getBoundingClientRect();
        if (!ctx || !rect) return;
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.lineWidth = 2;
        return ctx;
    }

    function drawGraph() {
        var colourScheme = { def: 'white', selected: 'aqua'};
        const ctx = resetContext();
        if (!ctx) return;
        if (tempEdge && !tempEdge.vertex.containsPoint(tempEdge.px, tempEdge.py)) { 
            ctx.strokeStyle = colourScheme.selected;
            tempEdge.draw(ctx);
        } 
        for (let i = 0; i < edges.length; i++) {
            var strokeStyle = (edges[i] == selectedObject) ? colourScheme.selected : colourScheme.def;
            edges[i].draw(ctx, strokeStyle);
        }
        for (let i = 0; i < vertices.length; i++) {
            var strokeStyle = (vertices[i] == selectedObject) ? colourScheme.selected : colourScheme.def;
            vertices[i].draw(ctx, strokeStyle);
        }
    }

    function drawGraphInSelectionMode() {
        var colourScheme = { def: 'gray', start: 'green', end: 'red'};
        const ctx = resetContext();
        if (!ctx) return;
        for (let i = 0; i < edges.length; i++) {
            edges[i].draw(ctx, colourScheme.def);
        }
        for (let i = 0; i < vertices.length; i++) {
            var strokeStyle = (vertices[i] == startingVertex) ? 
                colourScheme.start : 
                (vertices[i] == endingVertex) ? 
                    colourScheme.end : 
                    colourScheme.def;
            vertices[i].draw(ctx, strokeStyle);
        }
    }

    if (!canvasRef.current || !selectModeRef.current) return;
    // mouse events
    canvasRef.current.addEventListener('dblclick', onDoubleClick);
    canvasRef.current.addEventListener('mousedown', onMouseDown);
    canvasRef.current.addEventListener('mousemove', onMouseMove);
    canvasRef.current.addEventListener('mouseup', onMouseUp);
    // key events
    canvasRef.current.addEventListener('keydown', onKeyDown, true);
    canvasRef.current.addEventListener('keyup', onKeyUp, true);
    selectModeRef.current.addEventListener('click', onEnterSelectMode);
}