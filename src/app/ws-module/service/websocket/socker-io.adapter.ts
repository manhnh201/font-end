import { Injectable } from "@angular/core";
import { IWebSocketAdapter, WebSocketEventEnum } from "./i-ws.adapter";
import { Socket, io } from 'socket.io-client'
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/common-module/services/auth/auth.service";

@Injectable()
export class SocketIOAdapter implements IWebSocketAdapter {
    host!: string;
    port!: number;
    protocol!: "http" | "https" | "wss";

    socket!: Socket;

    private __keepAliveInterval: any;

    static readonly KEEP_ALIVE_INTERVAL_IN_MS: any = 30000

    private __onEvents: Record<string, (sender: string, event?: any) => any> = {};

    constructor(private authService: AuthService) {
        this.__initConnection()
    }

    unSubcribeEvent(uuid: string): void {
        // console.log(`unSubcribeEvent ${uuid}`)
        delete this.__onEvents[uuid]
    }

    subcribeEvent(uuid: string, onEvent: (sender: string, event?: any) => any): void {
        // console.log(`subcribeEvent ${uuid}`)
        this.__onEvents[uuid] = onEvent
    }

    connect(params: any) {
        throw new Error("Method not implemented.");
    }

    disconnect(params: any) {
        throw new Error("Method not implemented.");
    }

    emit(params: { event: string, data: any }) {
        this.__safeEmit(params)
    }

    private __initConnection() {
        this.socket = io(environment.apiUrl, {
            auth: {
                token: this.authService.getAccessToken()
            },
        });

        this.socket.on('connect', () => {
            this.__onConnect()
            this.__pushEvent(WebSocketEventEnum.connect, this.socket.id)
        })
        this.socket.on('disconnect', (reason) => {
            this.__onDisconnect(reason)
            this.__pushEvent(WebSocketEventEnum.disconnect, reason)
        })
        this.socket.on('ping', () => {
            this.__pushEvent(WebSocketEventEnum.ping, this.socket.id)
        })
        this.socket.on('reconnect', () => {
            console.log(`${this.socket.id} reconnect`)
            this.__pushEvent(WebSocketEventEnum.reconnect, this.socket.id)
        })
        this.socket.onAny((...args) => {
            this.__onData(args)
            this.__pushEvent(WebSocketEventEnum.data, args)
        })
    }

    private __onConnect() {
        console.log(`${this.socket.id} connect`)
        let __count: number = 0;
        this.__keepAliveInterval = setInterval(() => {
            this.__safeEmit({ event: 'keepAlive', data: ++__count })
        }, SocketIOAdapter.KEEP_ALIVE_INTERVAL_IN_MS)
    }

    private __onDisconnect(reason?: any) {
        console.log(`${this.socket.id} disconnect <-- ${reason}`)
        if (reason === 'io server disconnect') {
            setTimeout(() => {
                this.__initConnection()
            }, 5000)
        }
        clearInterval(this.__keepAliveInterval)
    }

    private __onData(data?: any) {
        console.log(this.socket.id);
    }

    private __safeEmit(params: { event: string, data: any }) {
        this.socket.volatile.emit(params.event, JSON.stringify(params.data))
    }

    private __pushEvent(sender: string, event?: any) {
        Promise.allSettled(Object.entries(this.__onEvents).map((entry) => {
            return Promise.resolve(entry[1](sender, event))
        }))
    }
}