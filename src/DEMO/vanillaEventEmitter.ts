interface EventHandler {
  (): void;
}

interface EventMap {
  [key: string]: EventHandler[];
}

class EventEmitter {
  public events: EventMap;

  constructor() {
    this.events = {};
  }

  on(event: string, fn: EventHandler): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  update(): void {
    for (const event in this.events) {
      const listeners = this.events[event];
      if (listeners) {
        listeners.forEach((listener: EventHandler) => listener());
      }
    }
  }

  unmountEvent(event: string): void {
    delete this.events[event];
  }

  clear(): void {
    this.events = {};
  }
}


const eventEmitter = new EventEmitter();
export default eventEmitter;
