import Refs from "@/interfaces/refs"

export const addSlider = (
    refs: Refs
) => {
    var isThumbMoving = false;

    refs.sliderRef.current?.addEventListener('mousedown', (e: MouseEvent) => {
        isThumbMoving = true;
        const slideRect = refs.sliderRef.current?.getBoundingClientRect();
        const thumb = refs.thumbRef.current;
        if (slideRect && thumb) 
            thumb.style.left = `${e.clientX - slideRect.left}px`;
    })

    document.addEventListener('mousemove', (e: MouseEvent) => {
        const slideRect = refs.sliderRef.current?.getBoundingClientRect();
        const thumb = refs.thumbRef.current;
        if (isThumbMoving && slideRect && thumb) {
            var thumbX = e.clientX - slideRect.left;
            if (thumbX >= 0 && thumbX <= slideRect.width)
                thumb.style.left = `${thumbX}px`;
        }
            
    })

    document.addEventListener('mouseup', (e: MouseEvent) => {
        isThumbMoving = false;
    })
}