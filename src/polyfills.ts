
// Node.js polyfills for browser environment
// This file must be imported before any other imports

// Make window the global object
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
  
  // Ensure global is accessible in different contexts
  if (typeof globalThis !== 'undefined') {
    // @ts-ignore
    globalThis.global = globalThis;
  }
  
  // For ES6-style modules that check for global
  // @ts-ignore
  if (typeof global === 'undefined') {
    // @ts-ignore
    window.global = window;
  }

  // Fix constructor and prototype chain for class inheritance
  // @ts-ignore
  if (!window.constructor || typeof window.constructor !== 'function') {
    // @ts-ignore
    window.constructor = Function;
  }
  
  // Add process polyfill
  // @ts-ignore
  window.process = window.process || {
    env: {},
    browser: true,
    version: '',
    nextTick: function(cb: Function) { setTimeout(cb, 0); }
  } as any;
  
  // Add Buffer polyfill - with proper TypeScript types
  // @ts-ignore
  if (!window.Buffer) {
    console.log('Creating Buffer polyfill');
    // Create a TypeScript-compatible minimal Buffer implementation
    class MinimalBuffer {
      data: Uint8Array;
      length: number;
      
      constructor(arg?: number | ArrayBuffer | Uint8Array | Array<number> | string, encodingOrOffset?: string | number, length?: number) {
        if (typeof arg === 'number') {
          this.data = new Uint8Array(arg);
          this.length = arg;
        } else if (arg instanceof Uint8Array || Array.isArray(arg)) {
          this.data = new Uint8Array(arg);
          this.length = this.data.length;
        } else if (typeof arg === 'string') {
          // Simple string encoding
          const str = arg;
          this.data = new Uint8Array(str.length);
          for (let i = 0; i < str.length; i++) {
            this.data[i] = str.charCodeAt(i) & 0xff;
          }
          this.length = this.data.length;
        } else {
          // Default empty buffer
          this.data = new Uint8Array(0);
          this.length = 0;
        }
      }
      
      // Minimal implementations of required methods
      toString(encoding?: string): string {
        let result = '';
        for (let i = 0; i < this.data.length; i++) {
          result += String.fromCharCode(this.data[i]);
        }
        return result;
      }
      
      write(): number { return 0; }
      toJSON(): { type: string; data: number[] } { 
        return { type: 'Buffer', data: Array.from(this.data) };
      }
      equals(): boolean { return false; }
      compare(): number { return 0; }
      copy(): number { return 0; }
      slice(): MinimalBuffer { return new MinimalBuffer(); }
      readUInt8(): number { return 0; }
      readInt8(): number { return 0; }
    }
    
    // Setup Buffer static methods that satisfy TypeScript interfaces
    const BufferPolyfill = MinimalBuffer as any;
    
    BufferPolyfill.isBuffer = function(obj: any): obj is Buffer {
      return obj instanceof MinimalBuffer;
    };
    
    BufferPolyfill.from = function(data: any, encodingOrOffset?: string | number, length?: number): Buffer {
      const buf = new MinimalBuffer(data, encodingOrOffset, length);
      return buf as unknown as Buffer;
    };
    
    BufferPolyfill.alloc = function(size: number, fill?: string | number | Uint8Array, encoding?: string): Buffer {
      const buf = new MinimalBuffer(size) as unknown as Buffer;
      return buf;
    };
    
    BufferPolyfill.allocUnsafe = function(size: number): Buffer {
      return BufferPolyfill.alloc(size);
    };
    
    BufferPolyfill.allocUnsafeSlow = function(size: number): Buffer {
      return BufferPolyfill.alloc(size);
    };

    // @ts-ignore - Assign our minimal implementation
    window.Buffer = BufferPolyfill;
  }
  
  // Add EventEmitter for PouchDB - using a simple implementation instead of require('events')
  // @ts-ignore
  if (!window.EventEmitter) {
    class EventEmitter {
      private events: Record<string, Function[]> = {};
      
      on(event: string, listener: Function): this {
        if (!this.events[event]) {
          this.events[event] = [];
        }
        this.events[event].push(listener);
        return this;
      }
      
      emit(event: string, ...args: any[]): boolean {
        if (!this.events[event]) {
          return false;
        }
        this.events[event].forEach(listener => listener(...args));
        return true;
      }
      
      removeListener(event: string, listener: Function): this {
        if (!this.events[event]) {
          return this;
        }
        this.events[event] = this.events[event].filter(l => l !== listener);
        return this;
      }
    }
    
    // @ts-ignore
    window.EventEmitter = EventEmitter;
  }
  
  // Add util polyfills needed by PouchDB
  // @ts-ignore
  window.util = window.util || {
    inherits: function(ctor: any, superCtor: any) {
      if (superCtor) {
        ctor.super_ = superCtor;
        Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
      }
    }
  };
}

// Create a proper global object to be used by modules
const globalObj = typeof window !== 'undefined' 
  ? window 
  : typeof global !== 'undefined' 
    ? global 
    : typeof self !== 'undefined' 
      ? self 
      : {};

// Explicitly expose as global
// @ts-ignore
if (typeof window !== 'undefined') window.global = globalObj;

export default globalObj;
