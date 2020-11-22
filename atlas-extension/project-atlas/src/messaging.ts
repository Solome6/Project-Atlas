interface Camera {
    x: number;
    y: number;
    scale: number;
}

export enum MessageType {
    Refresh = "refreshAtlas",
    None = "none",
}

interface IMessage {
    type: MessageType | string;
    data?: any;
}

interface RefreshMessage extends IMessage {
    type: MessageType.Refresh | "refreshAtlas";
    data?: Camera;
}

interface NoMessage extends IMessage {
    type: MessageType.None | "none";
}

export type Message = RefreshMessage | NoMessage;
