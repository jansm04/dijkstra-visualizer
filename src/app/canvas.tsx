'use client'
import { useDraw } from "@/hooks/useDraw"
import Header from '@/components/header'
import Footer from '@/components/footer'
import Instructions from "@/components/instructions"

export const Canvas = () => {

    const { canvasRef } = useDraw()

    return (
        <div>
            <Header />
            <div className="flex">
                <canvas ref={canvasRef} height={600} width={800} className="border outline-none border-white bg-slate-950 rounded-md max-w-[800px]" tabIndex={0}></canvas>
                <Instructions />
            </div>
            <Footer />
        </div>
            
    )
}