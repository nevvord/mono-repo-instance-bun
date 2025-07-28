import { beforeAll } from 'bun:test';
import { JSDOM } from 'jsdom';
import '@testing-library/jest-dom';

// Setup JSDOM for React testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
});

// Make JSDOM globals available
global.document = dom.window.document;
global.window = dom.window as unknown as Window & typeof globalThis;
global.navigator = dom.window.navigator;
global.location = dom.window.location;
global.history = dom.window.history;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
} as unknown as typeof IntersectionObserver;

// Mock getComputedStyle
global.getComputedStyle = (_element: Element) => {
  return {
    getPropertyValue: (_prop: string) => '',
  } as CSSStyleDeclaration;
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as ReturnType<typeof requestAnimationFrame>;
};

// Mock cancelAnimationFrame
global.cancelAnimationFrame = (handle: number) => {
  clearTimeout(handle);
};

beforeAll(() => {
  // Additional setup if needed
});
