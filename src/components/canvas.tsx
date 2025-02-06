import { RefObject, useEffect, useState } from "react";

const Canvas = ({ 
    canvasRef 
} : { 
    canvasRef: RefObject<HTMLCanvasElement> 
}) => {
    const [dpi, setDpi] = useState<number>(1);
    useEffect(() => {
        setDpi(window.devicePixelRatio);

        const handleResize = () => {
            location.reload()
        }

        window.addEventListener("resize", handleResize);

        return () => {
        window.removeEventListener("resize", handleResize);
        };
    }, [dpi]);
    return (
        <canvas 
            ref={canvasRef} 
            height={500 * dpi} 
            width={650 * dpi} 
            className="h-[500px] w-[650px] block outline-none bg-white rounded-md select-none" 
            tabIndex={0}>
        </canvas>
    )
}

export default Canvas;