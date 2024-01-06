import Vertex from "./vertex";

class PriorityQueue {
    vertices: Array<Vertex>;

    constructor() {
        this.vertices = new Array<Vertex>();
    }

    front() {
        if (this.vertices.length > 0) return this.vertices[0];
    }

    empty() {
        return this.vertices.length == 0;
    }

    buildHeap(vertices: Array<Vertex>) {
        if (vertices.length == 0) return;
        this.vertices = new Array<Vertex>(...vertices);
        var n = Math.floor(this.vertices.length / 2);
        for (let idx = n; idx >= 0; idx--) {
            this.heapifyDown(idx);
        }
    }

    enqueue(vertex: Vertex) {
        this.vertices.push(vertex);
        this.heapifyUp(this.vertices.length - 1);
    }

    dequeue() {
        if (this.vertices.length == 0) return;
        this.swap(0, this.vertices.length - 1);
        this.vertices.pop();
        this.heapifyDown(0);
    }

    heapifyUp(idx: number) {
        while (idx > 0) {
            var parentIdx = Math.floor((idx - 1) / 2);
            if (this.hasPriority(parentIdx, idx)) 
                break;
            this.swap(idx, parentIdx);
            idx = parentIdx;
        }
    }

    heapifyDown(idx: number) {
        while (idx < Math.floor(this.vertices.length / 2)) {
            var leftIdx  = idx * 2 + 1;
            var rightIdx = idx * 2 + 2;
            var minIdx = rightIdx < this.vertices.length ? 
                (this.hasPriority(leftIdx, rightIdx) ? leftIdx : rightIdx) : leftIdx;
            if (this.hasPriority(idx, minIdx))
                break;
            this.swap(idx, minIdx);
            idx = minIdx;
        }
    }

    hasPriority(idxA: number, idxB: number) {
        var distA = this.vertices[idxA].dist;
        var distB = this.vertices[idxB].dist;
        if (distA == null || distB == null) 
            return false;
        return distA <= distB;
    }

    swap(idxA: number, idxB: number) {
        var temp = this.vertices[idxA];
        this.vertices[idxA] = this.vertices[idxB];
        this.vertices[idxB] = temp;
    }
}

export default PriorityQueue;