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
            className="block outline-none bg-white rounded-md select-none" 
            tabIndex={0}>
        </canvas>
    )
}

export default Canvas;