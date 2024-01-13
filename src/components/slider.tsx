import Refs from "@/interfaces/refs"

const Slider = ({ 
    refs
} : {
    refs: Refs
}) => {
    return (
        <div className="mx-8 mt-6">
            <h1 className="text-gray-700 text-[12px] font-bold">Speed</h1>
            <div ref={refs.sliderRef} className="w-[180px] h-1 bg-gray-300 rounded inline-block hover:cursor-pointer">
                <div ref={refs.thumbRef} className="-top-1 -ml-[6px] left-[50%] w-3 h-3 rounded-xl relative bg-slate-700"></div>
            </div>
        </div>
    )
}

export default Slider;