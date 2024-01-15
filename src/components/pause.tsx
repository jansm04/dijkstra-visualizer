import Refs from "@/interfaces/refs"
import { IoIosPause } from "react-icons/io";

const Pause = ({
    refs
} : {
    refs: Refs
}) => {
    return (
        <div className="mx-8 w-[180px]">
            <button ref={refs.pauseRef} className="mt-4 py-1 px-3 w-fit italic border border-gray-800 text-center text-gray-700 text-[13px] rounded hover:bg-amber-400" hidden={true}>
                Pause
            </button>
        </div>
    )
}

export default Pause;