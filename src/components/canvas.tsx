import { RefObject } from "react";

const Canvas = ({ 
    canvasRef 
} : { 
    canvasRef: RefObject<HTMLCanvasElement> 
}) => {
    return (
        <canvas 
            ref={canvasRef} 
            height={500} 
            width={650} 
            className="block border border-gray-700 outline-none bg-white rounded-lg select-none" 
            tabIndex={0}>
        </canvas>
    )
}

export default Canvas;