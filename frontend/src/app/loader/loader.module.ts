import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class LoaderModule {
  private requirements: number = 0;
  private satisifedRequirements: number = 0;
  private onloadHandlers: (() => void)[] = [];
  private onchangeHandlers: ((loaded: boolean) => void)[] = [];
  public loaded: boolean = true;

  public addRequirement() {
    this.requirements++;
    this.runHandlers();
  }

  public satisfyRequirement() {
    this.satisifedRequirements++;
    this.runHandlers();
  }

  private runHandlers() {
    this.loaded = this.requirements == this.satisifedRequirements;

    if (this.loaded) {
      for (let handler of this.onloadHandlers) {
        handler();
      }
    }
    for (let handler of this.onchangeHandlers) {
      handler(this.requirements == this.satisifedRequirements);
    }
  }

  public onchange(handler: (loaded: boolean) => void) {
    this.onchangeHandlers.push(handler);
  }

  public onload(handler: () => void) {
    this.onloadHandlers.push(handler);
  }
}
