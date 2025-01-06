import {createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE} from "next-safe-action";

export class PassToClientError extends Error {}

export const actionClient = createSafeActionClient({
    handleServerError(e){
        if(e instanceof PassToClientError){
            return e.message
        }

        return DEFAULT_SERVER_ERROR_MESSAGE;
    }
});