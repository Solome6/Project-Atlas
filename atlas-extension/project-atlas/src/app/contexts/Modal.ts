import * as React from "react";
import { ReactNode } from "react";

export type ModalSize = "small" | "medium" | "large";

export interface ModalObject {
    id: number;
    content: ReactNode;
    options: ModalOptions;
}

interface ModalOptions {
    size: ModalSize;
    height?: "auto" | ModalSize;
    // clickThrough?: boolean;
    closeable?: boolean;
    stickyClose?: boolean;
    // removeDispatcher: (removeModal: () => void) => void;
}

export interface ModalsManager {
    modals: ModalObject[];
    addModal: (modal: Partial<ModalObject>) => void;
    removeModal: (modalId: ModalObject["id"]) => void;
}

export enum ModalActionType {
    AddModal = "ADD_MODAL",
    RemoveModal = "REMOVE_MODAL",
}

interface IModalAction {
    type: ModalActionType;
    data?: any;
}

export interface AddModalAction extends IModalAction {
    type: ModalActionType.AddModal;
    data: ModalObject;
}

export interface RemoveModalAction extends IModalAction {
    type: ModalActionType.RemoveModal;
    data: ModalObject["id"];
}

export type ModalAction = AddModalAction | RemoveModalAction;

export function modalsReducer(prevState: ModalObject[], action: ModalAction) {
    let newState: ModalObject[];
    switch (action.type) {
        case ModalActionType.AddModal:
            newState = [...prevState, action.data];
            break;
        case ModalActionType.RemoveModal: {
            newState = prevState.filter((modal) => modal.id !== action.data);
            break;
        }
    }
    return newState;
}

const ModalsContext = React.createContext<ModalsManager | null>(null);
export default ModalsContext;
