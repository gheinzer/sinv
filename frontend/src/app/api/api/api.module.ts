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
    let response = await this.WSModule.sendMessageAwaitResponse(action, data);
    if (!response.success) throw Error(response.error);
    return response;
  }
}
