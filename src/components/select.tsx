import Refs from "@/interfaces/refs"

const Select = ({
    refs
} : {
    refs: Refs
}) => {
    return (
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
    )
}

export default Select;