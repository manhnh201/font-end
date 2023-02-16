export interface IWebSocketAdapter {
    host?: string
    port?: number
    protocol?: 'http' | 'https' | 'wss'

    /**
     * Kết nối đến Web Socket Server
     */
    connect(params: any): any | Promise<any>

    /**
     * Ngắt kết nối đến Web Socket Server
     * @param params 
     */
    disconnect(params: any): any | Promise<any>

    /**
     * Gửi dữ liệu lên server
     * @param params 
     */
    emit(params: any): any | Promise<any>

    /**
     * Đăng ký sự kiện trả ra
     * @param sender 
     * @param event 
     * @returns 
     */
    subcribeEvent(uuid: string, onEvent: (sender: string, event?: any) => any): void

    /**
     * Hủy đăng ký sự kiện
     * @param uuid 
     */
    unSubcribeEvent(uuid: string): void
}

export enum WebSocketEventEnum {
    connect = 'WebSocketEventEnum_connect',
    disconnect = 'WebSocketEventEnum_disconnect',
    data = 'WebSocketEventEnum_data',
    ping = 'WebSocketEventEnum_ping',
    reconnect = 'WebSocketEventEnum_reconnect',
}