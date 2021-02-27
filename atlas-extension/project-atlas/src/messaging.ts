interface Camera {
    x: number;
    y: number;
    scale: number;
}

export enum MessageType {
    Refresh = "refresh",
    ChangeSource = "change_source",
    None = "none",
}

interface IMessage {
    type: MessageType | string;
    data?: any;
}

export interface RefreshMessage extends IMessage {
    type: MessageType.Refresh | "refresh";
    data?: Camera;
}

export interface ChangeSourceMessage extends IMessage {
    type: MessageType.ChangeSource | "change_source";
}
export interface NoMessage extends IMessage {
    type: MessageType.None | "none";
}

export type Message = RefreshMessage | ChangeSourceMessage | NoMessage;
