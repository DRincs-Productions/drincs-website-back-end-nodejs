import { UserRecord } from "firebase-functions/v1/auth";
import { IsNullOrWhiteSpace } from "../../utility/UtilityFunctionts";
import { MyError } from "../MyError";

export class AuthData {
    constructor(userRecord: UserRecord, tokenExpirationTime?: number, token?: string) {
        if (!userRecord.displayName || IsNullOrWhiteSpace(userRecord.displayName)) {
            throw new MyError("Display Name is null or white space", "AuthData")
        }
        this.username = userRecord.displayName;
        this.id = userRecord.uid;
        this.emailVerified = userRecord.emailVerified;
        this.token = token
        this.tokenExpirationTime = tokenExpirationTime ?? 0
    }
    token?: string;
    tokenExpirationTime: number;
    id: string;
    username: string;
    emailVerified?: boolean;
}