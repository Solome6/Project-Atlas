export const toTry = async <T>(promise: Promise<T>, defaultValue?: T): Promise<T | undefined> => {
    try {
        return await promise;
    } catch {
        return defaultValue;
    }
};
