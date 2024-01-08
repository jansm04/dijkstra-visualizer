'use client'
import { useDraw } from "@/hooks/useDraw"
import Header from '@/components/header'
import Footer from "@/components/footer"
import Instructions from "@/components/instructions"


export const Canvas = () => {

    const { 
        canvasRef, 
        pqRef, 
        selectModeRef, 
        startPromptRef, 
        retryPromptRef,
        startVisRef,
        visPromptRef,
        resetRef,
        editRef 
    } = useDraw();

    return (
        <div>
            <Header />
            <div className="flex">
                 <div className="w-[200px] mx-8">
                    <h1 className="mb-2 text-gray-400 text-[15px] text-center font-bold">Priority Queue</h1>
                    <table ref={pqRef} className="w-full">
                        <tbody>
                            <tr className="h-10 text-[14px]">
                                <th className="border border-gray-500">Vertex</th>
                                <th className="border border-gray-500">Distance</th>
                            </tr>
                        </tbody>
                    </table>
                 </div>
                 <div>
                    <canvas ref={canvasRef} height={550} width={700} className="border outline-none border-white bg-slate-950 rounded-md" tabIndex={0}></canvas>
                    <div className="text-center">
                        <div className="inline-block">
                            <button 
                                ref={selectModeRef} 
                                className="py-2 px-6 mt-5 float-left text-gray-300 italic border border-white text-center text-[13px] rounded hover:bg-slate-800">
                                    Select Start Vertex
                            </button>
                            <span 
                                ref={startPromptRef} 
                                className="p-2 ml-8 mt-5 float-left text-gray-300 text-[13px]" 
                                hidden={true}>
                                    Select a vertex to <span className="text-[green]">start</span> with.
                            </span>
                            <span 
                                ref={retryPromptRef} 
                                className="p-2 ml-8 mt-5 float-left text-gray-300 text-[13px]" 
                                hidden={true}>
                                    Please make sure all vertices have a label and all edges have a weight.
                            </span>
                            <button 
                                ref={startVisRef} 
                                className="py-2 px-6 mt-5 ml-4 float-left text-gray-300 italic border border-[green] text-center text-[13px] rounded hover:bg-slate-800" 
                                hidden={true}>
                                    Visualize Dijkstra&apos;s Algorithm
                            </button>
                            <span 
                                ref={visPromptRef} 
                                className="p-2 mt-5 float-left text-gray-300 text-[13px]" 
                                hidden={true}>
                                    Visualizing Dijkstra&apos;s Algorithm...
                            </span>
                        </div>
                    </div>    
                </div>
                <div>
                    <Instructions />
                    <div className="grid mx-8 text-gray-300 text-[13px]">
                        <button ref={resetRef} className="py-2 px-4 w-[100px] italic text-center border border-sky-700 rounded hover:bg-slate-800">
                            Reset
                        </button>
                        <button ref={editRef} className="mt-3 py-2 px-4 w-[100px] italic text-center border border-yellow-700 rounded hover:bg-slate-800" hidden={true}>
                            Edit
                        </button>
                    </div>
                </div>
                
            </div>
            <Footer />
        </div>
            
    )
}