if (typeof window !== "undefined") {
  // Polyfill for global
  window.global = window;

  // Polyfill for process
  window.process = window.process || {};
  window.process.env = window.process.env || {};

  // Polyfill for Buffer
  if (!window.Buffer) {
    try {
      window.Buffer = require("buffer").Buffer;
    } catch (e) {
      console.warn("Buffer polyfill could not be loaded");
    }
  }
}

export {};
