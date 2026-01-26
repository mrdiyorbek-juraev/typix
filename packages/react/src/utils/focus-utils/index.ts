const findFirstFocusableDescendant = (
    startElement: HTMLElement,
): HTMLElement | null => {
    const focusableSelector =
        'button, a[href], input, select, textarea, details, summary [tabindex], [contenteditable]';

    const focusableDescendants = startElement.querySelector(
        focusableSelector,
    ) as HTMLElement;

    return focusableDescendants;
};

const focusNearestDescendant = (
    startElement: HTMLElement,
): HTMLElement | null => {
    const el = findFirstFocusableDescendant(startElement);
    el?.focus();
    return el;
};

const isKeyboardInput = (
    event: MouseEvent | PointerEvent | React.MouseEvent,
): boolean => {
    if ('pointerId' in event && 'pointerType' in event) {
        return event.pointerId === -1 && event.pointerType === '';
    }

    return event?.detail === 0;
};

export { findFirstFocusableDescendant, focusNearestDescendant, isKeyboardInput };