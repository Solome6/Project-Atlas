import { useContext } from "react";
import ModalsContext, { ModalsManager } from "../contexts/Modal";

export function useModalsManager(): ModalsManager {
    return useContext(ModalsContext)!;
}
