// elements
import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import TempEdge from "@/app/elements/temp_edge";

// interfaces
import Refs from "@/interfaces/refs";
import Graph from "@/interfaces/graph";

export const addGraphVisualizer = (
    refs: Refs,
    graph: Graph
) => {

    var tempEdge: TempEdge | null;
    var selectedObject: Vertex | Edge | null = null;
    var startingVertex: Vertex | null = null;
    var heldObject: Vertex | null = null;
    var originalPosition: {x: number, y: number};
    var isShiftPressed = false
    var isMoving = false;
    var inSelectionMode = false;
    var inVisMode = false;
    var timer: NodeJS.Timeout;
    var takenLetters = "";

    function onDoubleClick(e: MouseEvent) {
        if (inSelectionMode || inVisMode) return;
        if (isEmpty() && refs.emptyPromptRef.current && refs.emptyPromptRef.current.hidden == false)
            refs.emptyPromptRef.current.hidden = true;
        const point = computePointInCanvas(e);
        if (!point) return;
        selectedObject = selectObject(point.x, point.y);
        if (!selectedObject && graph.vertices.length < 26) {
            var vertex: Vertex = new Vertex(point.x, point.y);
            selectedObject = vertex;
            graph.vertices.push(vertex);
        }
        drawGraph();
        pulseCursor();
    }

    function onMouseDown(e: MouseEvent) {
        if (inVisMode) return;
        var point = computePointInCanvas(e);
        if (!point) return;

        selectedObject = selectObject(point.x, point.y);
        if (inSelectionMode) {
            if (selectedObject)
                selectedObject.isCursorVisible = false;
            if (selectedObject instanceof Vertex && !startingVertex) {
                startingVertex = selectedObject;
                if (refs.selectModeRef.current) refs.selectModeRef.current.hidden = false;
                if (refs.startPromptRef.current) refs.startPromptRef.current.hidden = true;
                if (refs.startVisRef.current) refs.startVisRef.current.hidden = false;
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
        if (inSelectionMode  || inVisMode) return;
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
        if (inSelectionMode || inVisMode) return;
        const point = computePointInCanvas(e);
        if (!point) return;

        selectedObject = selectObject(point.x, point.y);
        if (selectedObject instanceof Vertex && tempEdge && selectedObject != tempEdge.vertex) {
            var edge = new Edge(tempEdge.vertex, selectedObject);
            selectNewEdge(edge);
            graph.edges.push(edge);
        }
        if (heldObject && isMoving) {
            var isValid = true;
            for (let i = 0; i < graph.vertices.length; i++) {
                if (graph.vertices[i] != heldObject && graph.vertices[i].containsPoint(point.x, point.y)) {
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
        if (inSelectionMode || inVisMode) return;
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
        if (inSelectionMode || inVisMode) return;
        if (e.key == 'Shift') {
            isShiftPressed = false;
        }
    }

    function isValid() {
        for (let i = 0; i < graph.edges.length; i++)
            if (graph.edges[i].weight == 0)
                return false;
        for (let i = 0; i < graph.vertices.length; i++)
            if (graph.vertices[i].label == "")
                return false;
        return true;
    }

    function isEmpty() {
        return graph.vertices.length == 0;
    }

    function setEdgeWeight(key: string) {
        if (selectedObject instanceof Edge) {
            var weight = selectedObject.weight;
            if (Number.isInteger(parseInt(key, 10))) {
                if (!weight) weight = parseInt(key, 10);
                else weight = weight * 10 + parseInt(key, 10);
            } else if (weight && key == 'Backspace') {
                if (weight < 10) weight = 0;
                else weight = Math.floor(weight / 10);
            } 
            selectedObject.weight = weight;
        }  
    }

    function setVertexLabel(key: string) {
        if (selectedObject instanceof Vertex) {
            var label = selectedObject.label;
            var letter = key.toUpperCase();
            if (label.length == 0 && key.length == 1 && key.match('[a-z]|[A-Z]') && !takenLetters.includes(letter)) {
                label = letter;
                takenLetters += letter;
            } else if (label.length == 1 && key == 'Backspace') {
                takenLetters = takenLetters.replaceAll(label, "");
                label = "";
            }
            selectedObject.label = label;
        }
    }

    function deleteVertexFromCanvas(vertex: Vertex) {
        var idx = graph.vertices.indexOf(vertex);
        var n = vertex.edges.length;
        for (let i = 0; i < n; i++)
            deleteEdgeFromCanvas(vertex.edges[0]);
        selectedObject = null;
        if (vertex.label)
            takenLetters = takenLetters.replaceAll(vertex.label, "");
        graph.vertices.splice(idx, 1);
    }

    function deleteEdgeFromCanvas(edge: Edge) {
        var idx = graph.edges.indexOf(edge);
        edge.va.removeEdge(edge);
        edge.vb.removeEdge(edge);
        if (selectedObject instanceof Edge) 
            selectedObject = null;
        graph.edges.splice(idx, 1);
    }

    function computePointInCanvas(e: MouseEvent) {
        const canvas = refs.canvasRef.current;
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
        for (let i = 0; i < graph.vertices.length; i++) {
            if (graph.vertices[i].containsPoint(x, y)) {
                graph.vertices[i].isCursorVisible = true;
                return graph.vertices[i];
            }
        }
        if (tempEdge) return null;
        for (let i = 0; i < graph.edges.length; i++) {
            if (graph.edges[i].containsPoint(x, y)) {
                graph.edges[i].isCursorVisible = true;
                return graph.edges[i];
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
        var ctx = refs.canvasRef.current?.getContext("2d");
        var rect = refs.canvasRef.current?.getBoundingClientRect();
        if (!ctx || !rect) return;
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.lineWidth = 2;
        return ctx;
    }

    function drawGraph() {
        var colourScheme = { def: 'gray', selected: '#0284c7'};
        const ctx = resetContext();
        if (!ctx) return;
        if (tempEdge && !tempEdge.vertex.containsPoint(tempEdge.px, tempEdge.py)) { 
            ctx.strokeStyle = colourScheme.selected;
            tempEdge.draw(ctx);
        } 
        for (let i = 0; i < graph.edges.length; i++) {
            var strokeStyle = (graph.edges[i] == selectedObject) ? 
                colourScheme.selected : 
                colourScheme.def;
            graph.edges[i].draw(ctx, strokeStyle);
        }
        for (let i = 0; i < graph.vertices.length; i++) {
            var strokeStyle = (graph.vertices[i] == selectedObject) ? 
                colourScheme.selected : 
                colourScheme.def;
            graph.vertices[i].draw(ctx, strokeStyle);
        }
    }

    function drawGraphInSelectionMode() {
        var colourScheme = { def: 'lightgray', start: '#075985'};
        const ctx = resetContext();
        if (!ctx) return;
        for (let i = 0; i < graph.edges.length; i++) {
            graph.edges[i].draw(ctx, colourScheme.def);
        }
        for (let i = 0; i < graph.vertices.length; i++) {
            var strokeStyle = (graph.vertices[i] == startingVertex) ? 
                colourScheme.start : 
                colourScheme.def;
            graph.vertices[i].draw(ctx, strokeStyle);
        }
    }

    function onEnterSelectMode(e: MouseEvent) {
        if (!isValid()) {
            if (refs.retryPromptRef.current) refs.retryPromptRef.current.hidden = false;
            return;
        }
        if (isEmpty()) {
            if (refs.emptyPromptRef.current) refs.emptyPromptRef.current.hidden = false;
            return;
        }
        if (selectedObject) selectedObject.isCursorVisible = false;
        clearInterval(timer);

        startingVertex = null;
        inSelectionMode = true;
        if (refs.selectModeRef.current) {
            refs.selectModeRef.current.innerHTML = "Reselect Start Vertex";
            refs.selectModeRef.current.hidden = true;
        }
        if (refs.startPromptRef.current) refs.startPromptRef.current.hidden = false;
        if (refs.retryPromptRef.current) refs.retryPromptRef.current.hidden = true;
        if (refs.emptyPromptRef.current) refs.emptyPromptRef.current.hidden = true;
        if (refs.startVisRef.current) refs.startVisRef.current.hidden = true;
        if (refs.editRef.current) refs.editRef.current.hidden = false;

        drawGraphInSelectionMode();
    }

    function onSubmitVisualize(e: MouseEvent) {
        inSelectionMode = false;
        inVisMode = true;
        if (startingVertex instanceof Vertex)
            startingVertex.dist = 0;
        graph.pq.buildHeap(graph.vertices);

        if (refs.selectModeRef.current) refs.selectModeRef.current.hidden = true;
        if (refs.startPromptRef.current) refs.startPromptRef.current.hidden = true;
        if (refs.startVisRef.current) refs.startVisRef.current.hidden = true;
        if (refs.visPromptRef.current) refs.visPromptRef.current.hidden = false;
        if (refs.editRef.current) refs.editRef.current.hidden = true;
        if (refs.pauseRef.current) refs.pauseRef.current.hidden = false;
    }

    function enterEditMode() {
        selectedObject = null;
        inSelectionMode = inVisMode = false;
        if (refs.selectModeRef.current) {
            refs.selectModeRef.current.innerHTML = "Select Start Vertex";
            refs.selectModeRef.current.hidden = false;
        }
        if (refs.startPromptRef.current) refs.startPromptRef.current.hidden = true;
        if (refs.startVisRef.current) refs.startVisRef.current.hidden = true;
        if (refs.visPromptRef.current) {
            refs.visPromptRef.current.innerHTML = "Visualizing Dijkstra's Algorithm...";
            refs.visPromptRef.current.hidden = true;
        }
        if (refs.editRef.current) refs.editRef.current.hidden = true;
        if (refs.restartRef.current) refs.restartRef.current.hidden = true;
        if (refs.pauseRef.current) refs.pauseRef.current.hidden = true;
        drawGraph();
    }

    function restart() {
        selectedObject = startingVertex = null;
        inSelectionMode = true;
        inVisMode = false;
        if (refs.startPromptRef.current) refs.startPromptRef.current.hidden = false;
        if (refs.visPromptRef.current) {
            refs.visPromptRef.current.innerHTML = "Visualizing Dijkstra's Algorithm...";
            refs.visPromptRef.current.hidden = true;
        }
        if (refs.restartRef.current) refs.restartRef.current.hidden = true;
        if (refs.editRef.current) refs.editRef.current.hidden = false;
        if (refs.pauseRef.current) refs.pauseRef.current.hidden = true;
        drawGraphInSelectionMode();
    }

    // mouse events
    refs.canvasRef.current?.addEventListener('dblclick', onDoubleClick);
    refs.canvasRef.current?.addEventListener('mousedown', onMouseDown);
    refs.canvasRef.current?.addEventListener('mousemove', onMouseMove);
    refs.canvasRef.current?.addEventListener('mouseup', onMouseUp);
    // key events
    refs.canvasRef.current?.addEventListener('keydown', onKeyDown, true);
    refs.canvasRef.current?.addEventListener('keyup', onKeyUp, true);
    // buttons
    refs.selectModeRef.current?.addEventListener('click', onEnterSelectMode);
    refs.startVisRef.current?.addEventListener('click', onSubmitVisualize);
    refs.editRef.current?.addEventListener('click', enterEditMode);
    refs.restartRef.current?.addEventListener('click', restart);
}