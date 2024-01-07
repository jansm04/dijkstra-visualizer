'use client'
import { useDraw } from "@/hooks/useDraw"
import Header from '@/components/header'
import Instructions from "@/components/instructions"

export const Canvas = () => {

    const { 
        canvasRef, 
        pqRef, 
        selectModeRef, 
        startPromptRef, 
        // endPromptRef,
        startVisRef 
    } = useDraw();

    return (
        <div>
            <Header />
            <div className="flex">
                 <div>
                    <h1 className="my-2 mr-12 text-gray-400 text-[16px] text-center font-bold">Priority Queue</h1>
                    {/* <canvas ref={pqRef} height={500} width={200} className="my-4 mx-12 border border-gray-400 outline-none max-w-[400px]" tabIndex={0}></canvas> */}
                    <table ref={pqRef} className="w-[240px] my-4 mr-12 max-w-[400px]">
                        <tbody>
                        

                        <tr className="h-10 text-[14px]">
                            <th className="border border-gray-500">Vertex</th>
                            <th className="border border-gray-500">Distance</th>
                        </tr>
                        </tbody>
                        
                        
                    </table>
                 </div>
                 <div>
                    <canvas ref={canvasRef} height={600} width={800} className="border outline-none border-white bg-slate-950 rounded-md max-w-[800px]" tabIndex={0}></canvas>
                    <div className="text-center">
                        <div className="inline-block">
                            <button 
                                ref={selectModeRef} 
                                className="py-2 px-6 mt-5 float-left text-gray-300 italic border border-white text-center text-[14px] rounded hover:bg-slate-800">
                                    Select Start Vertex
                            </button>
                            <span 
                                ref={startPromptRef} 
                                className="p-2 ml-8 my-5 float-left text-gray-300 text-[14px]" 
                                hidden={true}>
                                    Select a vertex to <span className="text-[green]">start</span> with.
                            </span>
                            {/* <span 
                                ref={endPromptRef} 
                                className="p-2 ml-8 my-5 float-left text-gray-300 text-[14px]" 
                                hidden={true}>
                                    Select a vertex to <span className="text-[red]">end</span> with.
                            </span> */}
                            <button 
                                ref={startVisRef} 
                                className="py-2 px-6 mt-5 ml-4 float-left text-gray-300 italic border border-[green] text-center text-[14px] rounded hover:bg-slate-800" 
                                hidden={true}>
                                    Visualize Dijkstra's Algorithm
                            </button>
                        </div>
                    </div>    
                </div>
                <Instructions />
            </div>
            
        </div>
            
    )
}