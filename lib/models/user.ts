import type { WithId, Document } from "mongodb";
import {Compose} from "@composecraft/docker-compose-lib";

export interface User extends WithId<Document> {
    email: string,
    password: string,
    companyType: string,
    termsAccepted: boolean,
    brevoId: string|null
}

export interface RegisterCompose extends WithId<Document> {
    userId: string
    data: Compose
}