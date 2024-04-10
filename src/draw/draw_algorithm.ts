// elements
import Vertex from "@/app/elements/vertex";
import Edge from "@/app/elements/edge";

// priority queue visualizers
import { addPQVisualizer, updatePQVisualizer } from "@/draw/draw_pq";

// interfaces
import Refs from "@/interfaces/refs";
import Graph from "@/interfaces/graph";

export const addAlgorithmVisualizer = (
    refs: Refs,
    graph: Graph
) => {

    var ctx = refs.canvasRef.current?.getContext("2d");
    var rect = refs.canvasRef.current?.getBoundingClientRect();

    // colours used to draw graph at each state in visualization
    const colourScheme = { 
        start: 'green',
        unvisisted: 'lightgray',
        used: '#075985', // sky-800
        current: 'gold' 
    };

    var visited = new Array<Vertex>(); // vertices visited in traversal
    var usedEdges = new Array<Edge>(); // edges used in current shortest path
    var currVertex: Vertex | undefined | null; // current vertex in traversal
    var currEdge: Edge | undefined | null; // current edge in traversal
    var startVertex: Vertex | undefined; // vertex to start traversal with

    var isFinished = false; // if visualization is done
    var isSliderSelected = false; // if slider is selected
    var isSleeping = false; // if visualization is in 'sleep' state - a pause in between steps in the traversal
    var isPaused = false; // if visualization is paused

    var pauseCount = 0; // keep track of pause button clicks
    var currPos = 0; // keep track of step in traversal
    var lastPos = 0; // to remember step at last pause

    var count = 1; // for flash to signal completion

    var ms: number = getPercentage(); // speed of the animation


    // Updates the priority queue visualization using the new state of the priority queue
    function updatePQ(highlight: Vertex | null, isFinished: boolean) {
        if (pauseCount) return;
        updatePQVisualizer(refs.pqRef, graph.pq, visited, highlight, isFinished);
    }

    /* 
    Draws the current state of the graph using the array of visited vertices, the array of used edges,
    and the current vertex and edge. Returns immediately if the pause button is clicked 
    */
    function drawState() {
        if (pauseCount) return;
        if (!ctx || !rect) return;
        const dpi = window.devicePixelRatio;
        ctx.clearRect(0, 0, rect.width * dpi, rect.height * dpi);
        ctx.lineWidth = 2;
        ctx.save();
        ctx.scale(dpi, dpi);
        var strokeStyle: string;
        for (let i = 0; i < graph.edges.length; i++) {

            // if animation is finished, check count to draw used eges in state of the flash effect
            if (isFinished && usedEdges.includes(graph.edges[i]))
                strokeStyle = count ? colourScheme.unvisisted : colourScheme.used;
            else if (graph.edges[i] == currEdge) 
                strokeStyle = colourScheme.current;
            else if (usedEdges.includes(graph.edges[i])) 
                strokeStyle = colourScheme.used;
            else 
                strokeStyle = colourScheme.unvisisted;
            graph.edges[i].draw(ctx, strokeStyle);
        }
        for (let i = 0; i < graph.vertices.length; i++) {

            // if animation is finished, check count to draw vertices in state of the flash effect
            if (isFinished) 
                strokeStyle = count ? colourScheme.unvisisted : graph.vertices[i] == startVertex ? colourScheme.start : colourScheme.used;
            else if (graph.vertices[i] == currVertex) 
                strokeStyle = colourScheme.current;
            else if (visited.includes(graph.vertices[i])) 
                strokeStyle = graph.vertices[i] == startVertex ? colourScheme.start : colourScheme.used;
            else 
                strokeStyle = colourScheme.unvisisted;
            graph.vertices[i].draw(ctx, strokeStyle);
        }
        ctx.restore();
    }

    /* 
    Returns a promise that is not resolves until after the given time has passed. Serves as a sleep function that 
    allows the animation to occur and so that the user can alter the speed of the animation
    */
    function sleep(ms: number) {
        isSleeping = true;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* 
    Adds a new edge to the list of used edges. This function also takes a vertex that the new edge is connecting to 
    (opposite from the current vertex). If that vertex already has a used edge as one of its edges, then the function 
    removes that edge from the list of used edges before adding the new edge.
    */
    function addUsedEdge(vertex: Vertex, edge: Edge) {

        // traverse though vertex's edges
        for (let i = 0; i < vertex.edges.length; i++) {
            var idx = usedEdges.indexOf(vertex.edges[i]);

            // if vertex already has used edge
            if (idx != -1) 
                usedEdges.splice(idx, 1); 
        }
        usedEdges.push(edge);
    }

    /* 
    A checkpoint for each step in the algorithm traversal. Returns true if the pause button was pushed while asleep, false otherwise
    */
    async function checkpoint(
        draw: () => void, 
        update: (highlight: Vertex | null, isFinished: boolean) => void , 
        highlight: Vertex | null, 
        isFinished: boolean) {
            currPos++; // update the current position in the traversal
            if (lastPos > 0) lastPos--; // updates the last position in the traversal (if traversing the pause step)

            // if not traversing to pause step (if in animation)
            if (lastPos == 0) { 
                await sleep(ms); 
                isSleeping = false;
                draw(); 
                update(highlight, isFinished);
                if (pauseCount) { // check if pause button was pushed while sleep function was called
                    pauseCount--;
                    return true;
                }
            }
            return false;
    }

    /* 
    --  DIJKSTRAS ALGORITHM --

    Traverses through the graph via the priority queue and computes the shortest path from the starting vertex
    to every other vertex.

    Calls checkpoint function to visualize the state of the graph at each step in the traversal. If at any point the 
    checkpoint function returns true, the function returns, with the current position saved for when the resume button is pushed.

    When finished, calls a 'finish' function to draw flash and update other elements
    */
    async function dijkstras() {

        // set starting vertex as vertex at front of priority queue
        startVertex = currVertex = graph.pq.front();

        // traverse through graph while priority queue still has vertices
        while (!graph.pq.empty()) {
            currEdge = null;
            currVertex = graph.pq.front();

            // checkpoint 1 for current vertex
            var wasPaused = await checkpoint(drawState, updatePQ, null, false);
            if (wasPaused) return;

            graph.pq.dequeue();
            if (currVertex) {
                visited.push(currVertex);

                // checkpoint 2 for current vertex
                var wasPaused = await checkpoint(() => null, updatePQ, null, false);
                if (wasPaused) return;

                for (let i = 0; i < currVertex.edges.length; i++) {
                    currEdge = currVertex.edges[i];

                    // find vertex on other end of edge
                    var neighbor: Vertex = currEdge.va == currVertex ? currEdge.vb : currEdge.va;

                    // if neighbor has not been visited 
                    if (!visited.includes(neighbor)) {

                        // checkpoint 3 for current vertex
                        var wasPaused = await checkpoint(drawState, updatePQ, neighbor, false);
                        if (wasPaused) return;

                        // update neighbors's distance if distance to current vertex PLUS weight
                        // of edge to neighbor is LESS than the neighbor's current distance
                        if (currVertex.dist + currEdge.weight < neighbor.dist) {
                            neighbor.dist = currVertex.dist + currEdge.weight;
                            addUsedEdge(neighbor, currEdge);  

                            // update neighbor's position in priority queue
                            graph.pq.heapifyUp(neighbor.idx); 

                            var wasPaused = await checkpoint(() => null, updatePQ, neighbor, false);
                            if (wasPaused) return;
                        } 
                    }        
                }
            }
        }
        finish();
    }

    /* 
    Finishes the visualization by resetting variables, 'flashing' the graph once and updating 
    the prompts below the canvas
    */
    async function finish() {

        // reset current vertex and edge to null
        currVertex = null;
        currEdge = null;

        // final update for graph
        var wasPaused = await checkpoint(drawState, () => null, null, false);
        if (wasPaused) return;

        // final update for priority queue
        var wasPaused = await checkpoint(() => null, updatePQ, null, true);
        if (wasPaused) return;

        isFinished = true;
        if (refs.visPromptRef.current) 
            refs.visPromptRef.current.innerHTML = "Visualization Complete.";
        if (refs.restartRef.current) 
            refs.restartRef.current.hidden = false;
        if (refs.editRef.current) 
            refs.editRef.current.hidden = false;
        if (refs.pauseRef.current)
            refs.pauseRef.current.hidden = true;

        // flash effect
        drawState();
        count--;
        await sleep(200); isSleeping= false; drawState();
    }

    
    // Resets the priority queue table by deleting each row one by one
    function resetTable() {
        var table = refs.pqRef.current;
        if (!table) return;
        var n = table.rows.length;
        for (let i = 1; i < n; i++)
            table.deleteRow(1);
    }

    
    // Resets the vertices in the graph by setting the distance of each vertex to infinity    
    function resetVertices() {
        var n = graph.vertices.length;
        for (let i = 0; i < n; i++) 
            graph.vertices[i].dist = Infinity;
    }

    
    // Resets the visited vertices in the graph by setting by emptying the array
    function resetVisited() {
        visited.splice(0, visited.length);
    }

    
    // Rests the priority queue table, the vertices and the array of visited vertices. Also removes all event listeners
    function removeAlgorithmVisualizer() {
        resetTable();
        resetVertices();
        resetVisited();
        removeListeners();
    }

    /* 
    Returns the new speed set by slider.

    The function works by first calculating the percentage of the slider thumb position in relation to the length of the slider.
    The function then calculates the speed factor using the formula: 

        factor = 0.25 * 2^(4 * percentage)

    And then returns 1000 / speed factor to update the new speed. This creates a scale so the slider has the following intervals,

        0.25x
        0.5x
        1x
        2x
        4x

    at equal distances in the slider
    */
    function getPercentage() {
        const slideRect = refs.sliderRef.current?.getBoundingClientRect();
        const thumb = refs.thumbRef.current;
        if (slideRect && thumb && thumb.style.left) {
            var thumbX = Number.parseInt(thumb.style.left);
            var percentage = thumbX / slideRect.width;
            var factor = 0.25 * 2 ** (4 * percentage);
            return 1000 / factor;
        }
        return 1000;
    }

    /* 
    Update the speed of the animation using the slider and set the new position of the thumb using the 
    position of the mouse
    */
    function changeSpeed(e: MouseEvent) {
        const slideRect = refs.sliderRef.current?.getBoundingClientRect();
        const thumb = refs.thumbRef.current;
        if (isSliderSelected && slideRect && thumb) {
            var thumbX = e.clientX - slideRect.left;

            // if mouse is below lower bound set x = 0
            if (thumbX < 0) thumbX = 0; 

            // if mouse is above upper bound set x = slider width
            if (thumbX > slideRect.width) thumbX = slideRect.width;

            thumb.style.left = `${thumbX}px`;
            var newSpeed = getPercentage();
            ms = newSpeed;
            isSliderSelected = false;
        }    
    }

    /* 
    If the animation is paused, the function updates the html accordingly, resets the visited array, and the priority queue. 
    It then calls dijkstras algorithm from the start and runs without animation until the position it was last paused at.

    If the animation is running, the function updates the html accordingly and signals that the animation was paused.
    */
    async function pauseOrPlay() {
        var pause = refs.pauseRef.current;
        var prompt = refs.visPromptRef.current;
        if (!pause || !prompt) return;

        if (isPaused) {
            isPaused = false;
            pause.innerHTML = "Pause";
            prompt.innerHTML = "Visualizing Dijkstra&apos;s Algorithm...";
            resetVertices();
            resetVisited();

            // reset priority queue
            if (startVertex instanceof Vertex)
                startVertex.dist = 0;
            graph.pq.buildHeap(graph.vertices);

            lastPos = currPos; // update lastPos to position in traversal at pause
            currPos = 0; // reset currPos to 0 before running dijsktra's algorithm
            dijkstras();
        } else {
            isPaused = true;
            pauseCount++;
            pause.innerHTML = "Resume";
            prompt.innerHTML = "Visualization Paused.";
        }
    }

    /* 
    Removes all the event listeners for the animation.
    */
    function removeListeners() {
        refs.restartRef.current?.removeEventListener('click', removeAlgorithmVisualizer);
        refs.editRef.current?.removeEventListener('click', removeAlgorithmVisualizer);
        refs.sliderRef.current?.removeEventListener('mousedown', () => isSliderSelected = true);
        refs.pauseRef.current?.removeEventListener('click', pauseOrPlay);
        document.removeEventListener('mouseup', changeSpeed);
    }

    addPQVisualizer(refs.pqRef, graph.pq);
    dijkstras();

    refs.restartRef.current?.addEventListener('click', removeAlgorithmVisualizer);
    refs.editRef.current?.addEventListener('click', removeAlgorithmVisualizer);
    refs.sliderRef.current?.addEventListener('mousedown', () => isSliderSelected = true);
    refs.pauseRef.current?.addEventListener('click', pauseOrPlay);
    document.addEventListener('mouseup', changeSpeed);
}