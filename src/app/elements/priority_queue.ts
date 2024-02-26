import Vertex from "./vertex";

// Minimum priority queue
class PriorityQueue {
    vertices: Array<Vertex>;

    constructor() {
        // initalize empty array
        this.vertices = new Array<Vertex>();
    }

    // Returns the first vertex in the priority queue if it exists
    front() {
        if (this.vertices.length > 0) return this.vertices[0];
    }

    // Returns true if the priority queue is empty
    empty() {
        return this.vertices.length == 0;
    }

    /* 
    Builds the priority queue given an array of vertices. The function runs in O(n) time as we only need to make
    changes in the front half of the array (the back half is by default correct as each vertex is already prioritized
    over all its children - since it has no children in the first place)
    */
    buildHeap(vertices: Array<Vertex>) {
        if (vertices.length == 0) return;
        this.vertices = new Array<Vertex>(...vertices);
        var n = Math.floor(this.vertices.length / 2);

        // set index of each vertex so we can later update the priority queue in O(log(n)) time
        for (let idx = 0; idx < this.vertices.length; idx++)
            this.vertices[idx].idx = idx;

        // update position of each vertex in front half (if nec.)
        for (let idx = n; idx >= 0; idx--)
            this.heapifyDown(idx);
    }

    // Adds a vertex to the back of the queue, then moves it up until it no longer has priority over its parent
    enqueue(vertex: Vertex) {
        this.vertices.push(vertex);
        var idx = this.vertices.length - 1;
        vertex.idx = idx;
        this.heapifyUp(idx);
    }

    /* 
    Removes the vertex with the highest priority by swapping it with the last vertex in the array, popping 
    it, and then moving the swapped vertex down the heap until it has priority over its children
    */
    dequeue() {
        if (this.vertices.length == 0) return;
        this.swap(0, this.vertices.length - 1);
        var vertex = this.vertices.pop();
        if (vertex) vertex.idx = -1;
        this.heapifyDown(0);
    }

    
    // Move a vertex up the heap by swapping it with its parent until it does not have priority over its parent
    heapifyUp(idx: number) {
        while (idx > 0) {
            var parentIdx = Math.floor((idx - 1) / 2);
            if (this.hasPriority(parentIdx, idx)) 
                break;
            this.swap(idx, parentIdx);
            idx = parentIdx; // update index to parent's index
        }
    }

    /* 
    Move a vertex down the heap until it has priority over both its children. At each level, the function finds 
    the child with the highest priority, then checks if the current vertex has priority over it. If it does, then 
    the function returns. If not, then the function swaps the current vertex with the child of highest priority
    */
    heapifyDown(idx: number) {
        while (idx < Math.floor(this.vertices.length / 2)) {
            var leftIdx  = idx * 2 + 1;
            var rightIdx = idx * 2 + 2;
            var minIdx = rightIdx < this.vertices.length ? // check if right index is in bounds
                (this.hasPriority(leftIdx, rightIdx) ? // if yes then check priority
                    leftIdx : 
                    rightIdx) : 
                leftIdx; // if no then take left index
            if (this.hasPriority(idx, minIdx))
                break;
            this.swap(idx, minIdx);
            idx = minIdx; // update index to priority child index
        }
    }

    /* 
    Returns true if the vertex at index A has priority over the vertex at index B. Returns false if 
    either are null
    */
    hasPriority(idxA: number, idxB: number) {
        var distA = this.vertices[idxA].dist;
        var distB = this.vertices[idxB].dist;
        if (distA == null || distB == null) 
            return false;
        return distA <= distB;
    }

    // Swaps two vertices in the queue and updates their indices
    swap(idxA: number, idxB: number) {
        this.vertices[idxA].idx = idxB;
        this.vertices[idxB].idx = idxA;
        var temp = this.vertices[idxA];
        this.vertices[idxA] = this.vertices[idxB];
        this.vertices[idxB] = temp;
    }
}

export default PriorityQueue;