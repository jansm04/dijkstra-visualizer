'use client'
import { useDraw } from "@/hooks/useDraw"

// components
import Header from "./header"
import PriorityQueue from "./pq"
import Canvas from "./canvas"
import Select from "./select"
import Instructions from "./instructions"
import Options from "./options"
import Footer from "./footer"

export const Main = () => {

    const { refs } = useDraw();

    return (
        <div>
            <Header />
            <div className="flex">
                 <PriorityQueue pqRef={refs.pqRef} />
                 <div>
                    <Canvas canvasRef={refs.canvasRef} />
                    <Select refs={refs} />
                </div>
                <div>
                    <Instructions />
                    <Options refs={refs} />
                </div>
                
            </div>
            <Footer />
        </div>
            
    )
}