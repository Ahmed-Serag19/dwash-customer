// Create a new polyfills file
if (typeof window !== "undefined") {
  // Polyfill for global
  window.global = window;

  // Polyfill for process.nextTick
  window.process = window.process || {};
  window.process.nextTick = window.process.nextTick || setTimeout;

  // Polyfill for Buffer
  window.Buffer = window.Buffer || require("buffer").Buffer;
}
