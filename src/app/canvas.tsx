'use client'
import { useDraw } from "@/hooks/useDraw"

import { Header } from './header'

export const Canvas = () => {

    const { canvasRef } = useDraw()

    return (
        <div>
            <Header />
            <canvas ref={canvasRef} height={600} width={800} className="block border border-white rounded-md max-w-[800px]" tabIndex={0}>

            </canvas>
        </div>
            
    )
}