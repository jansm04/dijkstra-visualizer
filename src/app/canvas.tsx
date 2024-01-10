'use client'
import { useDraw } from "@/hooks/useDraw"
import Header from '@/components/header'
import Footer from "@/components/footer"
import Instructions from "@/components/instructions"


export const Canvas = () => {

    const { refs } = useDraw();

    return (
        <div>
            <Header />
            <div className="flex">
                 <div className="w-[200px] mx-8">
                    <h1 className="mb-2 text-gray-700 text-[15px] text-center font-bold">Priority Queue</h1>
                    <table ref={refs.pqRef} className="w-full">
                        <tbody>
                            <tr className="h-[30px] text-[14px]">
                                <th className="border border-[gray]">Vertex</th>
                                <th className="border border-[gray]">Distance</th>
                            </tr>
                        </tbody>
                    </table>
                 </div>
                 <div>
                    <canvas ref={refs.canvasRef} height={500} width={650} className="block border border-gray-700 outline-none bg-white rounded-lg select-none" tabIndex={0}></canvas>
                    <div className="text-center">
                        <div className="inline-block">
                            <button 
                                ref={refs.selectModeRef} 
                                className="py-1 px-6 mt-5 float-left text-gray-700 italic border border-gray-800 text-center text-[13px] rounded hover:border-sky-800">
                                    Select Start Vertex
                            </button>
                            <span 
                                ref={refs.startPromptRef} 
                                className="p-1 ml-8 mt-5 float-left text-gray-700 text-[13px]" 
                                hidden={true}>
                                    Select a vertex to <span className="text-[green]">start</span> with.
                            </span>
                            <span 
                                ref={refs.retryPromptRef} 
                                className="p-1 ml-8 mt-5 float-left text-gray-700 text-[13px]" 
                                hidden={true}>
                                    Please make sure all vertices have a label and all edges have a weight.
                            </span>
                            <span 
                                ref={refs.emptyPromptRef} 
                                className="p-1 ml-8 mt-5 float-left text-gray-700 text-[13px]" 
                                hidden={true}>
                                    Please add a few vertices first.
                            </span>
                            <button 
                                ref={refs.startVisRef} 
                                className="py-1 px-6 mt-5 ml-4 float-left text-gray-700 italic border border-gray-800 text-center text-[13px] rounded hover:border-sky-800" 
                                hidden={true}>
                                    Visualize Dijkstra&apos;s Algorithm
                            </button>
                            <span 
                                ref={refs.visPromptRef} 
                                className="p-1 mt-5 float-left text-gray-700 text-[13px]" 
                                hidden={true}>
                                    Visualizing Dijkstra&apos;s Algorithm...
                            </span>
                        </div>
                    </div>    
                </div>
                <div>
                    <Instructions />
                    <div className="inline mx-8 text-gray-700 text-[13px]">
                        <button ref={refs.resetRef} className="py-1 px-4 w-[90px] italic border border-gray-800 text-center text-[13px] rounded hover:border-sky-800">
                            Reset
                        </button>
                        <button ref={refs.editRef} className="ml-2 py-1 px-4 w-[90px] italic border border-gray-800 text-center text-[13px] rounded hover:border-sky-800" hidden={true}>
                            Edit
                        </button>
                    </div>
                </div>
                
            </div>
            <Footer />
        </div>
            
    )
}