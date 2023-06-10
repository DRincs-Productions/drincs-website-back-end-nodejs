import { UserRecord } from "firebase-functions/v1/auth";

export class AuthData {
    constructor(userRecord: UserRecord, tokenExpirationTime: number, token?: string) {
        this.username = userRecord.displayName || "";
        this.id = userRecord.uid;
        this.emailVerified = userRecord.emailVerified;
        this.token = token
        this.tokenExpirationTime = tokenExpirationTime
    }
    token?: string;
    tokenExpirationTime: number;
    id: string;
    username: string;
    emailVerified?: boolean;
}