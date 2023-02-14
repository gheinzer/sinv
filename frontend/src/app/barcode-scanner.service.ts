import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  private handlers: {
    [key: number]: {
      handler: (value: string) => void;
      hasPriority: boolean;
    };
  } = {};
  public barcodePrefix: string = 'abc';
  public barcodeTimeout: number = 5000;
  public barcodeTerminator: string | null = 'Tab';
  private currentPrefix: string = '';
  private currentBarcodeValue: string = '';
  private timeoutID?: number;
  private eventTarget: EventTarget | null = null;

  constructor() {
    window.addEventListener('keydown', this.keydownHandler);
  }

  private keydownHandler = (ev: KeyboardEvent) => {
    console.log(ev);
    if (ev.key.length > 1 && ev.key !== this.barcodeTerminator) {
      // Ignore special characters and keys like CTRL.
      return;
    }
    if (this.barcodePrefix[this.currentPrefix.length] == ev.key) {
      this.currentPrefix += ev.key;
      this.eventTarget = ev.target;
      if (this.currentPrefix.length == 1) {
        //@ts-ignore
        this.timeoutID = setTimeout(this.timeoutReset, this.barcodeTimeout);
      }
    } else if (
      this.barcodeTerminator == ev.key &&
      this.currentBarcodeValue &&
      this.currentPrefix
    ) {
      ev.preventDefault();
      this.barcodeCompleted();
    } else if (this.currentPrefix == this.barcodePrefix) {
      ev.preventDefault();
      this.currentBarcodeValue += ev.key;
    } else if (this.currentPrefix.length > 0) {
      clearTimeout(this.timeoutID);
      this.currentBarcodeValue = '';
      this.currentPrefix = '';
      this.eventTarget = null;
    }
  };

  private timeoutReset = () => {
    if (this.eventTarget) {
      //@ts-ignore
      this.eventTarget.value += this.currentBarcodeValue;
    }
    this.currentPrefix = '';
    this.currentBarcodeValue = '';
    this.eventTarget = null;
  };

  private barcodeCompleted() {
    if (this.eventTarget) {
      //@ts-ignore
      if (this.eventTarget.value)
        //@ts-ignore
        this.eventTarget.value = this.eventTarget.value.replace(
          this.barcodePrefix,
          ''
        );
    }
    let preferredHandler: {
      handler: (value: string) => void;
      hasPriority: boolean;
    } = {
      handler: () => {},
      hasPriority: false,
    };
    for (let handler of Object.values(this.handlers)) {
      if (handler.hasPriority || !preferredHandler.hasPriority)
        preferredHandler = handler;
    }
    console.log(this.handlers);
    preferredHandler.handler(this.currentBarcodeValue);
    this.currentPrefix = '';
    this.currentBarcodeValue = '';
    clearTimeout(this.timeoutID);
  }

  public addHandler(
    handler: (value: string) => void,
    hasPriority: boolean = false
  ) {
    let handlerID = Object.keys(this.handlers).length;
    this.handlers[handlerID] = {
      handler,
      hasPriority,
    };
    return handlerID;
  }

  public removeHandler(handlerID: number) {
    console.log(handlerID);
    delete this.handlers[handlerID];
  }
}
