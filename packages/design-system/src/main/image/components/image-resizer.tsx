import { useCallback, useEffect, useRef } from "react";
import type { ImageResizerProps } from "../types";

const MIN_WIDTH = 100;

const handleBaseStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: 6,
  height: 32,
  borderRadius: 3,
  backgroundColor: "#3b82f6",
  cursor: "col-resize",
  opacity: 0.8,
  touchAction: "none",
  zIndex: 10,
};

const leftHandleStyle: React.CSSProperties = { ...handleBaseStyle, left: -3 };
const rightHandleStyle: React.CSSProperties = { ...handleBaseStyle, right: -3 };

export function ImageResizer({
  imageRef,
  maxWidth,
  onResizeEnd,
  onResizeStart,
}: ImageResizerProps) {
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const ratioRef = useRef(1);
  const directionRef = useRef<-1 | 1>(1);
  const isDraggingRef = useRef(false);

  // Store latest callbacks in refs so document listeners always use current values
  const onResizeEndRef = useRef(onResizeEnd);
  onResizeEndRef.current = onResizeEnd;

  const maxWidthRef = useRef(maxWidth);
  maxWidthRef.current = maxWidth;

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const img = imageRef.current;
      if (!img) return;

      const dx = (event.clientX - startXRef.current) * directionRef.current;
      let newWidth = Math.max(MIN_WIDTH, startWidthRef.current + dx);
      newWidth = Math.min(newWidth, maxWidthRef.current);
      const newHeight = newWidth / ratioRef.current;

      img.style.width = `${newWidth}px`;
      img.style.height = `${newHeight}px`;
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const img = imageRef.current;
      if (!img) return;

      onResizeEndRef.current(img.offsetWidth, img.offsetHeight);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [imageRef]);

  const startDrag = useCallback(
    (dir: -1 | 1, event: React.PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const img = imageRef.current;
      if (!img) return;

      isDraggingRef.current = true;
      onResizeStart();
      startXRef.current = event.clientX;
      startWidthRef.current = img.offsetWidth;
      ratioRef.current = img.offsetWidth / img.offsetHeight;
      directionRef.current = dir;
    },
    [imageRef, onResizeStart]
  );

  const onPointerDownLeft = useCallback(
    (e: React.PointerEvent) => startDrag(-1, e),
    [startDrag]
  );
  const onPointerDownRight = useCallback(
    (e: React.PointerEvent) => startDrag(1, e),
    [startDrag]
  );

  return (
    <>
      <div
        role="button"
        tabIndex={-1}
        onPointerDown={onPointerDownLeft}
        style={leftHandleStyle}
      />
      <div
        role="button"
        tabIndex={-1}
        onPointerDown={onPointerDownRight}
        style={rightHandleStyle}
      />
    </>
  );
}
