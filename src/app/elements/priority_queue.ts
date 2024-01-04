import Edge from "./edge";

class PriorityQueue {
    edges: Array<Edge>;

    constructor() {
        this.edges = new Array<Edge>();
    }

    front() {
        if (this.edges.length > 0) return this.edges[0];
    }

    buildHeap(edges: Array<Edge>) {
        if (edges.length == 0) return;
        this.edges = new Array<Edge>(...edges);
        var n = Math.floor(this.edges.length / 2);
        for (let idx = n; idx >= 0; idx--) {
            this.heapifyDown(idx);
        }
    }

    enqueue(edge: Edge) {
        this.edges.push(edge);
        this.heapifyUp(this.edges.length - 1);
    }

    dequeue() {
        if (this.edges.length == 0) return;
        this.swap(0, this.edges.length - 1);
        this.edges.pop();
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
        while (idx < Math.floor(this.edges.length / 2)) {
            var leftIdx  = idx * 2 + 1;
            var rightIdx = idx * 2 + 2;
            var minIdx = rightIdx < this.edges.length ? 
                (this.hasPriority(leftIdx, rightIdx) ? leftIdx : rightIdx) : leftIdx;
            if (this.hasPriority(idx, minIdx))
                break;
            this.swap(idx, minIdx);
            idx = minIdx;
        }
    }

    hasPriority(idxA: number, idxB: number) {
        var weightA = this.edges[idxA].weight;
        var weightB = this.edges[idxB].weight;
        if (!weightA || !weightB) 
            return false;
        return weightA < weightB;
    }

    swap(idxA: number, idxB: number) {
        var temp = this.edges[idxA];
        this.edges[idxA] = this.edges[idxB];
        this.edges[idxB] = temp;
    }
}

export default PriorityQueue;