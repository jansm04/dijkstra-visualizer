import Refs from "@/interfaces/refs"

const Options = ({ 
    refs
} : {
    refs: Refs
}) => {
    return (
        <div className="inline mx-8 text-gray-700 text-[13px]">
            <button ref={refs.resetRef} className="py-1 px-4 w-[90px] italic border border-gray-800 text-center text-[13px] rounded hover:bg-amber-400">
                Reset
            </button>
            <button ref={refs.editRef} className="ml-2 py-1 px-4 w-[90px] italic border border-gray-800 text-center text-[13px] rounded hover:bg-amber-400" hidden={true}>
                Edit
            </button>
        </div>
    )
}

export default Options;