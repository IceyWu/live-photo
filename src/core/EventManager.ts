type EventHandler = (event: Event) => void;

interface EventRegistration {
  element: HTMLElement | Window | Document;
  event: string;
  handler: EventHandler;
  options?: AddEventListenerOptions;
}

export class EventManager {
  private registrations: EventRegistration[] = [];

  public addEventListener(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventHandler,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options);
    this.registrations.push({ element, event, handler, options });
  }

  public removeEventListener(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventHandler
  ): void {
    const index = this.registrations.findIndex(
      reg => reg.element === element && reg.event === event && reg.handler === handler
    );
    if (index !== -1) {
      const { options } = this.registrations[index];
      element.removeEventListener(event, handler, options);
      this.registrations.splice(index, 1);
    }
  }

  public destroy(): void {
    this.registrations.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.registrations.length = 0; // 清空数组但保留引用，比重新赋值 [] 更节省分配
  }
}
