type PointerPoint = {
  clientX: number;
  clientY: number;
};

type CanvasRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CanvasSize = {
  width: number;
  height: number;
};

export const getCanvasPointerPosition = (
  pointer: PointerPoint,
  rect: CanvasRect,
  canvas: CanvasSize,
) => {
  if (!rect.width || !rect.height) return { x: 0, y: 0 };

  return {
    x: ((pointer.clientX - rect.left) / rect.width) * canvas.width,
    y: ((pointer.clientY - rect.top) / rect.height) * canvas.height,
  };
};
