// elements
import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";
import TempEdge from "@/app/elements/temp_edge";

// interfaces
import Refs from "@/interfaces/refs";
import Graph from "@/interfaces/graph";

// builder
import { buildGraph } from "@/build/build_graph";

export const addGraphVisualizer = (
    refs: Refs,
    graph: Graph
) => {

    var tempEdge: TempEdge | null; // temporary edge before full edge is added
    var selectedObject: Vertex | Edge | null = null; // selected vertex or edge
    var startingVertex: Vertex | null = null; // vertex to start algorithm with
    var heldObject: Vertex | null = null; // vertex being moved

    /* 
    Original position of vertex being moved. Used in case vertex is dropped on another vertex and must be 
    placed back in original position
    */
    var originalPosition: {x: number, y: number}; 

    var isShiftPressed = false // if shift key is currently pressed
    var isMoving = false; // if a vertex is being dragged
    var inSelectionMode = false; // if used is selecting a start vertex
    var inVisMode = false; // if visualization is running
    var timer: NodeJS.Timeout; // timer to pulse cursor
    var takenLetters = ""; // letters used to label vertices



    /* 
    Callback function for the double click event listener. Returns immediately if the user is selecting a start vertex
    or if the visualization is running. 

    If the empty prompt was previously displayed, the function removes this prompt.

    If there is NO object at the point of selection, the function creates a new vertex, sets it as the selected object and adds 
    it to the graph.

    If there IS an object at the point of selection, the function simply keeps it as the selected object and does not create a new
    vertex.
    */
    function onDoubleClick(e: MouseEvent) {
        e.preventDefault();
        if (inSelectionMode || inVisMode) return;
        if (isEmpty() && refs.emptyPromptRef.current && refs.emptyPromptRef.current.hidden == false)
            refs.emptyPromptRef.current.hidden = true;
        const point = computePointInCanvas(e);
        if (!point) return;
        selectedObject = selectObject(point.x, point.y);

        // if no selected object and canvas has space
        if (!selectedObject && graph.vertices.length < 26) {

            // create vertex with no label at x and y of mouse click
            var vertex: Vertex = new Vertex(point.x, point.y, "", true); 
            selectedObject = vertex;
            graph.vertices.push(vertex);
        }
        drawGraph();
        pulseCursor();
    }

    /* 
    Callback function for mouse down event listener. Returns immediately if the visualization is running.

    If the user is selecting a start vertex, then the function checks that the selected object on mouse down
    is an instance of a Vertex AND that a start vertex has not yet been selected - if yes, then the start vertex
    is set and the prompts are updated accordingly

    If the user is NOT selecting a start vertex, then the function creates a new temp edge IF the shift key is 
    pressed, or sets the held object if the shift key is NOT pressed and the selected object is a vertex - this 
    sets up the mouse move event listener to move a held object if one exists
    */
    function onMouseDown(e: MouseEvent) {
        if (inVisMode) return;
        var point = computePointInCanvas(e);
        if (!point) return;

        selectedObject = selectObject(point.x, point.y);
        if (inSelectionMode) {
            if (selectedObject)
                selectedObject.isCursorVisible = false; // prevent cursor from appearing

            if (selectedObject instanceof Vertex && !startingVertex) {
                startingVertex = selectedObject;

                // update prompts
                if (refs.selectModeRef.current) refs.selectModeRef.current.hidden = false;
                if (refs.startPromptRef.current) refs.startPromptRef.current.hidden = true;
                if (refs.startVisRef.current) refs.startVisRef.current.hidden = false;
                drawGraphInSelectionMode();
            }
            return;
        }
        if (selectedObject instanceof Vertex && isShiftPressed) {

            // create new 'temp' edge to serve as an edge before it is
            // connected to its second vertex
            tempEdge = new TempEdge(selectedObject, point.x, point.y);

        } else if (selectedObject instanceof Vertex) {

            // set held object to selected object so that on mouse move
            // the user can move a vertex around on the canvas
            heldObject = selectedObject;
            originalPosition = {x: (selectedObject.x), y: (selectedObject.y)};
        }
        drawGraph();
        if (selectedObject) pulseCursor();
    }

    /* 
    Callback function for the mouse move event listener. Returns immediately if the user is selecting a start vertex
    or if the visualization is running.

    If a temp edge exists, then the function adjusts the unconnected endpoint of the edge depending on whether or not the selected 
    object is null or a vertex 
    
        - if it is null then the endpoint is simply updated 
        to the mouse location 
        - if it is not null then the endpoint is updated to the 
        closest point in the selected vertex's circle but a full edge
        is not yet created -- that occurs on the mouse up event

    If a temp edge does not exist but a held object does, then the function updates the position of the held object based
    on the mouse's position
    */
    function onMouseMove(e: MouseEvent) {
        if (inSelectionMode  || inVisMode) return;
        if (tempEdge) {
            var point = computePointInCanvas(e);
            if (!point) return;

            selectedObject = selectObject(point.x, point.y);
            if (!(selectedObject instanceof Vertex)) {

                // update unconnected endpoint
                tempEdge.px = point.x;
                tempEdge.py = point.y;

            } else if (selectedObject instanceof Vertex) {

                // connect unconnected endpoint to vertex by computing the closest point
                var midX = (selectedObject.x + tempEdge.vx) / 2;
                var midY = (selectedObject.y + tempEdge.vy) / 2;
                var p = selectedObject.computeClosestPoint(midX, midY);
                tempEdge.px = p.px;
                tempEdge.py = p.py;

                // make sure selected vertex has no cursor
                selectedObject.isCursorVisible = false; 
                clearInterval(timer);
            }
            drawGraph();
        }
        if (heldObject) {
            var point = computePointInCanvas(e);
            if (!point) return;
            isMoving = true;

            // update held vertex's position
            heldObject.x = point.x;
            heldObject.y = point.y;

            // make sure held vertex has no cursor
            heldObject.isCursorVisible = false; 
            clearInterval(timer);

            relocateEdges(); // update all edges connected to held vertex
            drawGraph();
        }
    }

    /* 
    Callback function for the mouse up event listener. Returns immediately if the user is selecting a start vertex
    or if the visualization is running.
    
    If there is a temp edge connected to two vertices, then the function creates a new edge and adds it to the graph.

    If there is a held vertex, the function releases the vertex unless it held over an already existing vertex -- in 
    which case the held vertex is relocated back to its original position.
    */
    function onMouseUp(e: MouseEvent) {
        if (inSelectionMode || inVisMode) return;
        const point = computePointInCanvas(e);
        if (!point) return;

        selectedObject = selectObject(point.x, point.y);

        // if a temp edge is connected to two vertices
        if (selectedObject instanceof Vertex && tempEdge && selectedObject != tempEdge.vertex) {
            var edge = new Edge(tempEdge.vertex, selectedObject, 0, true);
            selectNewEdge(edge);
            graph.edges.push(edge);
        }
        if (heldObject && isMoving) {

            // check if the held vertex was released over an already existing vertex
            // if yes -- reset held vertex to original position
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
            relocateEdges(); // update all edges connected to held vertex
        }

        // temp edge and held object are both removed no matter what
        tempEdge = null; 
        heldObject = null;

        isMoving = false;
        drawGraph();
        pulseCursor();
    }

    /* 
    Callback function for the key down event listener. Returns immediately if the user is selecting a start vertex
    or if the visualization is running.
    
    If the shift key is pressed, then isShiftPressed is simply set to true.

    If the delete key is pressed over a selected object, then that object is deleted from the canvas.

    If a number is pressed while an edge is selected, then its weight is updated with that number.

    If an alphabetic character is pressed while a vertex is selected, then its label is updated with that character
    */
    function onKeyDown(e: KeyboardEvent) {
        if (inSelectionMode || inVisMode) return;
        if (e.key == 'Shift')
            isShiftPressed = true;
        else {
            if (selectedObject instanceof Edge) {
                if (e.key == 'Delete') 
                    // deletes edge only
                    deleteEdgeFromCanvas(selectedObject);
                else 
                    setEdgeWeight(e.key);
            }
            if (selectedObject instanceof Vertex) {
                if (e.key == 'Delete') 
                    // deletes vertex and all edges connected to it
                    deleteVertexFromCanvas(selectedObject);
                else 
                    setVertexLabel(e.key);
            }
        }
        drawGraph();
    }

    /* 
    Callback function for the key up event listener. Returns immediately if the user is selecting a start vertex
    or if the visualization is running.
    
    If the shift key was pressed, isShiftPressed is simply set to false
    */
    function onKeyUp(e: KeyboardEvent) {
        if (inSelectionMode || inVisMode) return;
        if (e.key == 'Shift') {
            isShiftPressed = false;
        }
    }

    
    // Returns true if a graph is valid. A graph is valid if all edges have a positive weight and all vertices have a label
    function isValid() {

        // check edges
        for (let i = 0; i < graph.edges.length; i++)
            if (graph.edges[i].weight == 0)
                return false;

        // check vertices
        for (let i = 0; i < graph.vertices.length; i++)
            if (graph.vertices[i].label == "")
                return false;

        return true;
    }

    // Returns true if a graph has no vertices  
    function isEmpty() {
        return graph.vertices.length == 0;
    }

    /* 
    Sets the weight of an edge using the key provided.

    If the key is a number, then the digit is added to the weight. 
    
    If the key is a backspace, then the last digit is deleted.
    */    
    function setEdgeWeight(key: string) {
        if (selectedObject instanceof Edge) {
            var weight = selectedObject.weight;

            // if the key is a number of base 10
            if (Number.isInteger(parseInt(key, 10))) {
                if (!weight) weight = parseInt(key, 10);
                else weight = weight * 10 + parseInt(key, 10);

            // if there is an existing weight and the key is a backspace
            } else if (weight && key == 'Backspace') {
                if (weight < 10) weight = 0;
                else weight = Math.floor(weight / 10);
            } 
            selectedObject.weight = weight;
        }  
    }

    /* 
    Sets the label of an vertex using the key provided.

    If the key is a UNIQUE alphabetic character, then the character is appended to the end of the string
    
    If the key is a backspace, then the last character is deleted.
    */      
    function setVertexLabel(key: string) {
        if (selectedObject instanceof Vertex) {
            var label = selectedObject.label;
            var letter = key.toUpperCase(); // automatically convert all keys to uppercase

            // if key is a UNIQUE alphabetic character
            if (label.length == 0 && key.length == 1 && letter.match('[A-Z]') && !takenLetters.includes(letter)) {
                label = letter;
                takenLetters += letter;

            // if there is an existing label and the key is a backspace
            } else if (label.length == 1 && key == 'Backspace') {
                takenLetters = takenLetters.replaceAll(label, ""); // remove label from used labels
                label = "";
            }
            selectedObject.label = label;
        }
    }

    /* 
    Removes a vertex from the graph and all the edges that are connected to it. Also resets the selected 
    object to null.
    */
    function deleteVertexFromCanvas(vertex: Vertex) {
        var idx = graph.vertices.indexOf(vertex);
        var n = vertex.edges.length;

        // remove all edges connected to the vertex
        for (let i = 0; i < n; i++)
            deleteEdgeFromCanvas(vertex.edges[0]);
        if (selectedObject instanceof Vertex)
            selectedObject = null;
        if (vertex.label)
            takenLetters = takenLetters.replaceAll(vertex.label, ""); // remove label from used labels
        graph.vertices.splice(idx, 1);
    }

    // Removes an edge from the graph. Also resets the selected object to null.
    function deleteEdgeFromCanvas(edge: Edge) {
        var idx = graph.edges.indexOf(edge);
        edge.va.removeEdge(edge);
        edge.vb.removeEdge(edge);
        if (selectedObject instanceof Edge) 
            selectedObject = null;
        graph.edges.splice(idx, 1);
    }

    
    // Computes the point in the canvas where the mouse event occurs
    function computePointInCanvas(e: MouseEvent) {
        const canvas = refs.canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return {x, y};
    }

    /* 
    For when the user is dragging a vertex around on the canvas, the function adjusts the endpoints of all the edges connected
    to the dragged vertex so that the vertex 'drags' all its edges with it. Returns immediately if there is no held object. 
    */
    function relocateEdges() {
        if (!heldObject) return;
        for (let i = 0; i < heldObject.edges.length; i++) {
            var edge: Edge = heldObject.edges[i];
            
            // check which end of the edge is the held vertex
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
            // update the respective endpoint
            edge.ax = a.px;
            edge.ay = a.py;
            edge.bx = b.px;
            edge.by = b.py;
        }
    }

    /* 
    Sets the given edge as the selected object.
    */
    function selectNewEdge(edge: Edge) {
        if (!selectedObject) return;
        selectedObject.isCursorVisible = false;
        edge.isCursorVisible = true;
        selectedObject = edge;
    }

    /* 
    Returns the edge or vertex at the given point and sets its cursor as visible.

    If there is a temp edge, then the edges are not checked if they are selected. The function automatically returns null.

    The function also returns null if there is no edge or vertex at the given point.
    */
    function selectObject(x: number, y: number) {
        if (selectedObject) selectedObject.isCursorVisible = false;
        for (let i = 0; i < graph.vertices.length; i++) {
            if (graph.vertices[i].containsPoint(x, y)) {
                graph.vertices[i].isCursorVisible = true;
                return graph.vertices[i];
            }
        }
        if (tempEdge) return null; // skip all edges
        for (let i = 0; i < graph.edges.length; i++) {
            if (graph.edges[i].containsPoint(x, y)) {
                graph.edges[i].isCursorVisible = true;
                return graph.edges[i];
            } 
        }
        return null;
    }

    
    // Schedules a function that switches the selected objects' cursor on/off to execute repeatedly every 0.5 seconds  
    function pulseCursor() {
        clearInterval(timer); // reset Timeout object
        timer = setInterval(() => {
            if (!selectedObject) return;
            selectedObject.isCursorVisible = !selectedObject.isCursorVisible;
            drawGraph();
        }, 500);
    }

    
    /*
    Resets the canvas to a blank state with a line width for the next draw function. Returns a 
    CanvasRenderingContext2D object.
    */
    function resetContext() {
        var ctx = refs.canvasRef.current?.getContext("2d");
        var rect = refs.canvasRef.current?.getBoundingClientRect();
        if (!ctx || !rect) return;
        const dpi = window.devicePixelRatio;
        ctx.clearRect(0, 0, rect.width * dpi, rect.height * dpi);
        ctx.lineWidth = 2;
        return ctx;
    }

    // Callback function for when the pre-build button is pressed. Loads a graph using saved data and draws it on the canvas.
    function prebuild() {
        selectedObject = null;
        startingVertex = null;
        var pb = buildGraph(); // from build folder
        graph.vertices = pb.vertices;
        graph.edges = pb.edges;
        drawGraph();
    }

    /* 
    Draws the graph using the using the graph object's arrays of vertices and edges. A special colour is used for the 
    selected object
    */
    function drawGraph() {
        var colourScheme = { def: 'gray', selected: '#0284c7'};
        const ctx = resetContext();
        if (!ctx) return;
        ctx.save();
        const dpi = window.devicePixelRatio;
        ctx.scale(dpi, dpi);
        if (tempEdge && !tempEdge.vertex.containsPoint(tempEdge.px, tempEdge.py)) { 
            ctx.strokeStyle = colourScheme.selected;
            tempEdge.draw(ctx);
        } 
        for (let i = 0; i < graph.vertices.length; i++) {
            var strokeStyle = (graph.vertices[i] == selectedObject) ? colourScheme.selected : colourScheme.def;
            graph.vertices[i].draw(ctx, strokeStyle);
        }
        for (let i = 0; i < graph.edges.length; i++) {
            var strokeStyle = (graph.edges[i] == selectedObject) ? colourScheme.selected : colourScheme.def;
            graph.edges[i].draw(ctx, strokeStyle);
        }
        ctx.restore();
    }

    
    // Draws the graph when the user is selecting a start vertex. A special colour is used for the chosen start vertex
    function drawGraphInSelectionMode() {
        var colourScheme = { def: 'lightgray', start: '#075985'};
        const ctx = resetContext();
        if (!ctx) return;
        ctx.save();
        const dpi = window.devicePixelRatio;
        ctx.scale(dpi, dpi);
        for (let i = 0; i < graph.edges.length; i++) {
            graph.edges[i].draw(ctx, colourScheme.def);
        }
        for (let i = 0; i < graph.vertices.length; i++) {
            var strokeStyle = (graph.vertices[i] == startingVertex) ? colourScheme.start : colourScheme.def;
            graph.vertices[i].draw(ctx, strokeStyle);
        }
        ctx.restore();
    }

    /* 
    Set variables and html elements when the user enters selection mode (when the user wants to choose a start vertex).
    Exceptions are also checked and prompts are responded accordingly
    */
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

        // set visibility and prompts
        if (refs.selectModeRef.current) {
            refs.selectModeRef.current.innerHTML = "Reselect Start Vertex";
            refs.selectModeRef.current.hidden = true;
        }
        if (refs.startPromptRef.current) refs.startPromptRef.current.hidden = false;
        if (refs.retryPromptRef.current) refs.retryPromptRef.current.hidden = true;
        if (refs.emptyPromptRef.current) refs.emptyPromptRef.current.hidden = true;
        if (refs.startVisRef.current) refs.startVisRef.current.hidden = true;
        if (refs.editRef.current) refs.editRef.current.hidden = false;
        if (refs.buildRef.current) refs.buildRef.current.hidden = true;

        drawGraphInSelectionMode();
    }

    
    // Set variables and html elements when the user runs the visualization.
    function onSubmitVisualize(e: MouseEvent) {
        inSelectionMode = false;
        inVisMode = true;

        // set start vertex distance to zero and build the priority queue
        if (startingVertex instanceof Vertex)
            startingVertex.dist = 0;
        graph.pq.buildHeap(graph.vertices);

        // set visibility
        if (refs.selectModeRef.current) refs.selectModeRef.current.hidden = true;
        if (refs.startPromptRef.current) refs.startPromptRef.current.hidden = true;
        if (refs.startVisRef.current) refs.startVisRef.current.hidden = true;
        if (refs.visPromptRef.current) refs.visPromptRef.current.hidden = false;
        if (refs.editRef.current) refs.editRef.current.hidden = true;
        if (refs.pauseRef.current) refs.pauseRef.current.hidden = false;
    }

     
    // Set variables and html elements when the user enters edit mode (this only occurs after a visualization was ran)
    function enterEditMode() {
        selectedObject = null;
        inSelectionMode = inVisMode = false;

        // set visibility and prompts
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
        if (refs.buildRef.current) refs.buildRef.current.hidden = false;
        if (refs.restartRef.current) refs.restartRef.current.hidden = true;
        if (refs.pauseRef.current) refs.pauseRef.current.hidden = true;
        drawGraph();
    }


    // Set variables and html elements when the user wants to reselect a start vertex
    function restart() {
        selectedObject = startingVertex = null;
        inSelectionMode = true;
        inVisMode = false;

        // set visibility and prompts
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
    refs.buildRef.current?.addEventListener('click', prebuild);
}