import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
import { SocketIOAdapter } from "./socker-io.adapter";

@Injectable()
export class WebSocketUtils {
    private uuid = uuidv4().toLocaleLowerCase();

    constructor(private socketIOAdapter: SocketIOAdapter) {
        socketIOAdapter.subcribeEvent(this.uuid, (sender, event) => {
            this.__onEvent(sender, event)
        })
    }

    __onEvent(sender: string, event?: any) {
        
    }
}