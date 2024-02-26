import Refs from "@/interfaces/refs"

export const addSlider = (
    refs: Refs
) => {
    var isThumbMoving = false;

    /* 
    Callback function for mouse down event listener. Styles the thumb of the slider so that it's x-position is based 
    on the mouse's x-position. Sets isThumbMoving to true.
    */
    refs.sliderRef.current?.addEventListener('mousedown', (e: MouseEvent) => {
        isThumbMoving = true;
        const slideRect = refs.sliderRef.current?.getBoundingClientRect();
        const thumb = refs.thumbRef.current;

        // style thumb using distance from mouse event to end of slider
        if (slideRect && thumb) 
            thumb.style.left = `${e.clientX - slideRect.left}px`;
    })

    /* 
    Callback function for mouse move event listener. Styles the thumb of the slider so that it's x-position is based 
    on the mouse's x-position within the bounds of the slider.
    */
    document.addEventListener('mousemove', (e: MouseEvent) => {
        const slideRect = refs.sliderRef.current?.getBoundingClientRect();
        const thumb = refs.thumbRef.current;
        if (isThumbMoving && slideRect && thumb) {
            var thumbX = e.clientX - slideRect.left;

            // style thumb using distance from mouse event to end of slider only IF mouse event is within bounds
            if (thumbX >= 0 && thumbX <= slideRect.width)
                thumb.style.left = `${thumbX}px`;
        }
            
    })

    /* 
    Callback function for mouse up event listener.
    Just sets isThumbMoving to false.
    */
    document.addEventListener('mouseup', (e: MouseEvent) => {
        isThumbMoving = false;
    })
}