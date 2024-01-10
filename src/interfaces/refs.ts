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
    // prompts
    startPromptRef: RefObject<HTMLParagraphElement>,
    retryPromptRef: RefObject<HTMLParagraphElement>,
    emptyPromptRef: RefObject<HTMLParagraphElement>,
    visPromptRef: RefObject<HTMLParagraphElement>
}

export default Refs;