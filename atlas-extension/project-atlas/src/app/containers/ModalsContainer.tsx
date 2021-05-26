import * as React from "react";
import { ReactNode, useMemo, useReducer, useRef } from "react";
import { WelcomeModal } from "../components/static/WelcomeModal";
import ModalsContext, { ModalActionType, ModalObject, ModalsManager, modalsReducer } from "../contexts/Modal";

const STARTUP_MODALS: ModalObject[] = [
    {
        id: -1,
        content: <WelcomeModal />,
        options: { size: "small" },
    },
];

export interface ModalsContainerProps {
    children?: ReactNode;
}

export default function ModalsContainer({ children }: ModalsContainerProps) {
    const modalCountRef = useRef(0);
    const [modals, dispatch] = useReducer<typeof modalsReducer>(modalsReducer, STARTUP_MODALS);

    const modalsManager: ModalsManager = useMemo(
        () => ({
            modals: modals,
            addModal: (modalObject: Partial<ModalObject>) => {
                dispatch({
                    type: ModalActionType.AddModal,
                    data: {
                        id: modalCountRef.current,
                        content: "",
                        options: { size: "medium" },
                        ...modalObject,
                    },
                });
                return modalCountRef.current++;
            },
            removeModal: (id: number) => {
                dispatch({ type: ModalActionType.RemoveModal, data: id });
            },
        }),
        [modals],
    );

    return <ModalsContext.Provider value={modalsManager}>{children}</ModalsContext.Provider>;
}
