import { Component } from '@angular/core';

@Component({
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class ObjectCreatorComponet {
  public attachmentDragHandler(ev: DragEvent) {
    ev.preventDefault();
    console.log(ev);
  }
}
