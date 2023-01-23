import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsModule } from '../ws/ws.module';
import { APIResponse } from '../../../../../backend/lib/api/api.types';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class APIModule {
  constructor(public WSModule: WsModule) {}

  public async call(
    action: string,
    data: { [key: string]: any }
  ): Promise<APIResponse> {
    let reponse = await this.WSModule.sendMessageAwaitResponse(action, data);
    if (!reponse.success) throw Error(reponse.error);
    return reponse;
  }
}
