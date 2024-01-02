'use client'
import { useDraw } from "@/hooks/useDraw"

export const Canvas = () => {

    const { canvasRef } = useDraw()

    return (
        <canvas ref={canvasRef} height={750} width={750} className="border border-black rounded-md" tabIndex={0}>

        </canvas>    
    )
}