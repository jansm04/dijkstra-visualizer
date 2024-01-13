import Refs from "@/interfaces/refs"

export const addSlider = (
    refs: Refs
) => {
    const rect = refs.sliderRef.current?.getBoundingClientRect();
    const thumb = refs.thumbRef.current;

    var isThumbMoving = false;

    refs.sliderRef.current?.addEventListener('mousedown', (e: MouseEvent) => {
        isThumbMoving = true;
        if (rect && thumb) 
            thumb.style.left = `${e.clientX - rect.left}px`;
    })

    refs.sliderRef.current?.addEventListener('mousemove', (e: MouseEvent) => {
        if (isThumbMoving && rect && thumb) 
            thumb.style.left = `${e.clientX - rect.left}px`;
    })

    refs.sliderRef.current?.addEventListener('mouseup', (e: MouseEvent) => {
        isThumbMoving = false;
    })
}