import { ProjectJSON } from "./project";

export enum WebViewMessageType {
    AppLoaded = "APP_LOADED",
    Refresh = "REFRESH",
    ChangeSource = "CHANGE_SOURCE",
    UnloadProject = "UNLOAD_PROJECT",
    None = "NONE",
}

export enum APIMessageType {
    NewJSONData = "NEW_JSON_DATA",
    None = "NONE",
}

interface IMessage {
    type: MessageType | string;
    data?: any;
}

export interface DocumentLoadedMessage extends IMessage {
    type: WebViewMessageType.AppLoaded;
}
export interface RefreshMessage extends IMessage {
    type: WebViewMessageType.Refresh;
}

export interface ChangeSourceMessage extends IMessage {
    type: WebViewMessageType.ChangeSource;
}

export interface UnloadProjectMessage extends IMessage {
    type: WebViewMessageType.UnloadProject;
}

export interface NoMessage extends IMessage {
    type: WebViewMessageType.None | APIMessageType.None;
}
export interface NewMessage extends IMessage {
    type: WebViewMessageType.None;
}
export interface NewJSONDataMessage extends IMessage {
    type: APIMessageType.NewJSONData;
    data: ProjectJSON | null;
}

export type WebViewMessage =
    | DocumentLoadedMessage
    | RefreshMessage
    | ChangeSourceMessage
    | UnloadProjectMessage
    | NoMessage; // TODO: TEMP

export type APIMessage = NewJSONDataMessage | NoMessage;

export type MessageType = WebViewMessage | APIMessage;
