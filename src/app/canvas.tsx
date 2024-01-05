'use client'
import { useDraw } from "@/hooks/useDraw"
import Header from '@/components/header'
import Instructions from "@/components/instructions"

export const Canvas = () => {

    const { canvasRef, pqRef, startRef } = useDraw()

    return (
        <div>
            <Header />
            <div className="flex">
                 <div>
                    <h1 className="m-2 text-gray-400 text-[16px] text-center font-bold">Priority Queue</h1>
                    <canvas ref={pqRef} height={500} width={200} className="my-4 mx-12 border border-gray-400 outline-none max-w-[400px]" tabIndex={0}></canvas>
                 </div>
                <canvas ref={canvasRef} height={600} width={800} className="border outline-none border-white bg-slate-950 rounded-md max-w-[800px]" tabIndex={0}></canvas>
                <Instructions />
            </div>
            <div className="text-center">
                <button ref={startRef} className="py-2 px-6 m-10 text-gray-300 italic text-center border border-white rounded hover:bg-slate-800">Visualize Algorithm</button>
            </div>
        </div>
            
    )
}