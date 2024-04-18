'use client'
import { useDraw } from "@/hooks/useDraw"

// components
import PriorityQueue from "./pq"
import Canvas from "./canvas"
import Select from "./select"
import Instructions from "./instructions"
import Options from "./options"
import Slider from "./slider"
import Pause from "./pause"

const Main = () => {

    const { refs } = useDraw();

    return (
        <div className="flex select-none">
                <PriorityQueue pqRef={refs.pqRef} />
                <div>
                <Canvas canvasRef={refs.canvasRef} />
                <Select refs={refs} />
            </div>
            <div>
                <Instructions />
                <Options refs={refs} />
                <Slider refs={refs} />
                <Pause pauseRef={refs.pauseRef} />
            </div>
        </div>
    )
}

export default Main;