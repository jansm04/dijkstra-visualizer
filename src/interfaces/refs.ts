import { RefObject } from "react"

interface Refs {
    // canvas and table
    canvasRef: RefObject<HTMLCanvasElement>,
    pqRef: RefObject<HTMLTableElement>,
    // buttons
    selectModeRef: RefObject<HTMLButtonElement>,
    startVisRef: RefObject<HTMLButtonElement>,
    resetRef: RefObject<HTMLButtonElement>,
    editRef: RefObject<HTMLButtonElement>,
    buildRef: RefObject<HTMLButtonElement>,
    restartRef: RefObject<HTMLButtonElement>,
    pauseRef: RefObject<HTMLButtonElement>,
    // prompts
    startPromptRef: RefObject<HTMLParagraphElement>,
    retryPromptRef: RefObject<HTMLParagraphElement>,
    emptyPromptRef: RefObject<HTMLParagraphElement>,
    visPromptRef: RefObject<HTMLParagraphElement>
    // slider
    sliderRef: RefObject<HTMLDivElement>,
    thumbRef: RefObject<HTMLDivElement>
}

export default Refs;