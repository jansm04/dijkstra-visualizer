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

    const ctx = refs.canvasRef.current?.getContext("2d");
    const rect = refs.canvasRef.current?.getBoundingClientRect();

    const colourScheme = { 
        unvisisted: 'lightgray', // unvisited vertices or edge
        used: 'navy', // used edge or visited vertex
        current: 'gold' // current edge or vertex
    };

    var visited = new Array<Vertex>();
    var usedEdges = new Array<Edge>();
    var currVertex: Vertex | undefined | null;
    var currEdge: Edge | undefined | null;
    var startVertex: Vertex | undefined;
    var isFinished = false;
    var isSliderSelected = false;
    var isPaused = false;
    var pos = 0;
    var count = 1;

    // speed
    var ms: number = getPercentage();

    function updatePQ(highlight: Vertex | null, isFinished: boolean) {
        updatePQVisualizer(refs.pqRef, graph.pq, visited, highlight, isFinished);
    }

    function drawState() {
        if (!ctx || !rect) return;
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.lineWidth = 2;
        var strokeStyle: string;
        for (let i = 0; i < graph.edges.length; i++) {
            if (isFinished && usedEdges.includes(graph.edges[i]))
                strokeStyle = count ? 
                    colourScheme.unvisisted : 
                    colourScheme.used;
            else if (graph.edges[i] == currEdge) 
                strokeStyle = colourScheme.current;
            else if (usedEdges.includes(graph.edges[i])) 
                strokeStyle = colourScheme.used;
            else 
                strokeStyle = colourScheme.unvisisted;
            graph.edges[i].draw(ctx, strokeStyle);
        }
        for (let i = 0; i < graph.vertices.length; i++) {
            if (isFinished) 
                strokeStyle = count ? 
                    colourScheme.unvisisted : 
                    colourScheme.used;
            else if (graph.vertices[i] == currVertex) 
                strokeStyle = colourScheme.current;
            else if (visited.includes(graph.vertices[i])) 
                strokeStyle = colourScheme.used;
            else 
                strokeStyle = colourScheme.unvisisted;
            graph.vertices[i].draw(ctx, strokeStyle);
        }
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function addUsedEdge(vertex: Vertex, edge: Edge) {
        for (let i = 0; i < vertex.edges.length; i++) {
            var idx = usedEdges.indexOf(vertex.edges[i]);
            if (idx != -1) usedEdges.splice(idx, 1);
        }
        usedEdges.push(edge);
    }

    async function resumeAlgorithm() {
        while (!graph.pq.empty()) {
            currEdge = null;
            currVertex = graph.pq.front();
            if (pos > 1) pos--;
            if (currVertex != startVertex) { 
                if (pos == 1) await sleep(ms); drawState(); updatePQ(null, false);
            }
            graph.pq.dequeue();
            if (currVertex) {
                visited.push(currVertex);
                if (pos > 1) pos--;
                if (pos == 1) await sleep(ms); updatePQ(null, false);

                // loop through all edges
                for (let i = 0; i < currVertex.edges.length; i++) {

                    currEdge = currVertex.edges[i];
                    var neighbor: Vertex = currEdge.va == currVertex ? currEdge.vb : currEdge.va;
                    if (pos > 1) pos--;

                    if (!visited.includes(neighbor)) {
                        if (pos == 1) await sleep(ms); drawState(); updatePQ(neighbor, false);

                        if (currVertex.dist + currEdge.weight < neighbor.dist) {
                            neighbor.dist = currVertex.dist + currEdge.weight;
                            addUsedEdge(neighbor, currEdge);  
                            graph.pq.heapifyUp(neighbor.idx);

                            if (pos > 1) pos--;
                            if (pos == 1) await sleep(ms); updatePQ(neighbor, false);   
                        } 
                    }        
                }
            }
        }
        finish();
    }

    async function dijkstras() {
        startVertex = currVertex = graph.pq.front();
        drawState();
        while (!graph.pq.empty()) {
            currEdge = null;
            currVertex = graph.pq.front();
            pos++;
            if (isPaused) return;
            if (currVertex != startVertex) { 
                await sleep(ms); drawState(); updatePQ(null, false);
            }
            graph.pq.dequeue();
            if (currVertex) {
                visited.push(currVertex);
                pos++;
                if (isPaused) return;
                await sleep(ms); updatePQ(null, false);

                // loop through all edges
                for (let i = 0; i < currVertex.edges.length; i++) {

                    currEdge = currVertex.edges[i];
                    var neighbor: Vertex = currEdge.va == currVertex ? currEdge.vb : currEdge.va;
                    pos++;
                    if (isPaused) return;

                    if (!visited.includes(neighbor)) {
                        await sleep(ms); drawState(); updatePQ(neighbor, false);

                        if (currVertex.dist + currEdge.weight < neighbor.dist) {
                            neighbor.dist = currVertex.dist + currEdge.weight;
                            addUsedEdge(neighbor, currEdge);  
                            graph.pq.heapifyUp(neighbor.idx);

                            pos++;
                            if (isPaused) return;
                            await sleep(ms); updatePQ(neighbor, false);   
                        } 
                    }        
                }
                console.log("paused?", isPaused);
            }
        }
        finish();
    }

    async function finish() {
        currVertex = null;
        currEdge = null;
        await sleep(ms); drawState();
        await sleep(ms); updatePQ(null, true);
        isFinished = true;
        if (refs.visPromptRef.current) 
            refs.visPromptRef.current.innerHTML = "Visualization Complete.";
        if (refs.restartRef.current) 
            refs.restartRef.current.hidden = false;
        if (refs.editRef.current) 
            refs.editRef.current.hidden = false;
        drawState();
        count--;
        await sleep(200); drawState();
    }

    function reset() {
        var table = refs.pqRef.current;
        if (!table) return;
        var n = table.rows.length;
        for (let i = 1; i < n; i++)
            table.deleteRow(1);

        n = visited.length;
        for (let i = 0; i < n; i++)
            visited[i].dist = Infinity;
        visited.splice(0, n);
    }

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

    function changeSpeed(e: MouseEvent) {
        const slideRect = refs.sliderRef.current?.getBoundingClientRect();
        const thumb = refs.thumbRef.current;
        if (isSliderSelected && slideRect && thumb) {
            var thumbX = e.clientX - slideRect.left;
            if (thumbX < 0) thumbX = 0;
            if (thumbX > slideRect.width) thumbX = slideRect.width;
            thumb.style.left = `${thumbX}px`;
            var newSpeed = getPercentage();
            ms = newSpeed;
            isSliderSelected = false;
        }    
    }

    function pauseOrPlay() {
        if (isPaused) {
            isPaused = false;
            reset();
            if (startVertex instanceof Vertex)
                startVertex.dist = 0;
            graph.pq.buildHeap(graph.vertices);
            addPQVisualizer(refs.pqRef, graph.pq);
            resumeAlgorithm();
        } else {
            isPaused = true;
        }
    }

    addPQVisualizer(refs.pqRef, graph.pq);
    dijkstras();

    refs.restartRef.current?.addEventListener('click', reset);
    refs.editRef.current?.addEventListener('click', reset);
    refs.sliderRef.current?.addEventListener('mousedown', () => isSliderSelected = true);
    refs.pauseRef.current?.addEventListener('click', pauseOrPlay);
    document.addEventListener('mouseup', changeSpeed);
}