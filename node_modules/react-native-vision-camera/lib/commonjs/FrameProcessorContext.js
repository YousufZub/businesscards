"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FrameProcessorContext = void 0;
let workletRuntime = null;
let createWorklet = () => {
  throw new Error("Reanimated V3 is not installed, Frame Processors are not available!");
};
try {
  const reanimated = require('react-native-reanimated');
  if (reanimated.createWorkletRuntime == null) {
    console.warn("Frame Processors are disabled because you're using an incompatible version of Reanimated.");
  }
  workletRuntime = reanimated.createWorkletRuntime('VisionCamera');
  createWorklet = reanimated.makeShareableCloneRecursive;
} catch {
  // Frame Processors are not enabled
}
const FrameProcessorContext = {
  workletRuntime: workletRuntime,
  createWorklet: createWorklet
};
exports.FrameProcessorContext = FrameProcessorContext;
//# sourceMappingURL=FrameProcessorContext.js.map