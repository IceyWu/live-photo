type EventHandler = (event: Event) => void;

interface EventRegistration {
  element: HTMLElement | Window | Document;
  event: string;
  handler: EventHandler;
  boundHandler: EventHandler;
}

export class EventManager {
  private registrations: EventRegistration[] = [];

  public addEventListener(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventHandler,
    options?: AddEventListenerOptions
  ): void {
    const boundHandler = handler as EventHandler;
    element.addEventListener(event, boundHandler, options);
    
    this.registrations.push({
      element,
      event,
      handler,
      boundHandler,
    });
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
      const registration = this.registrations[index];
      element.removeEventListener(event, registration.boundHandler);
      this.registrations.splice(index, 1);
    }
  }

  public destroy(): void {
    this.registrations.forEach(({ element, event, boundHandler }) => {
      element.removeEventListener(event, boundHandler);
    });
    this.registrations = [];
  }
}
