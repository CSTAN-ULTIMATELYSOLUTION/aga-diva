import assert from "node:assert/strict";
import { test } from "node:test";
import { getCanvasPointerPosition } from "../src/signatureCanvas.ts";

test("maps pointer coordinates from displayed canvas size to drawing buffer size", () => {
  const position = getCanvasPointerPosition(
    { clientX: 160, clientY: 80 },
    { left: 40, top: 20, width: 360, height: 90 },
    { width: 720, height: 180 },
  );

  assert.deepEqual(position, { x: 240, y: 120 });
});

test("returns origin when the displayed canvas has no measurable size", () => {
  const position = getCanvasPointerPosition(
    { clientX: 160, clientY: 80 },
    { left: 40, top: 20, width: 0, height: 0 },
    { width: 720, height: 180 },
  );

  assert.deepEqual(position, { x: 0, y: 0 });
});
