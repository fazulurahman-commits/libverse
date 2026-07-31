
'use client';

type ErrorHandler = (error: any) => void;

class ErrorEmitter {
  private listeners: { [channel: string]: ErrorHandler[] } = {};

  on(channel: string, handler: ErrorHandler) {
    if (!this.listeners[channel]) this.listeners[channel] = [];
    this.listeners[channel].push(handler);
  }

  off(channel: string, handler: ErrorHandler) {
    if (!this.listeners[channel]) return;
    this.listeners[channel] = this.listeners[channel].filter((h) => h !== handler);
  }

  emit(channel: string, error: any) {
    if (!this.listeners[channel]) return;
    this.listeners[channel].forEach((handler) => handler(error));
  }
}

export const errorEmitter = new ErrorEmitter();
