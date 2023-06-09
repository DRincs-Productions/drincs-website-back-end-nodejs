export class AuthData {
    constructor(userRecord: UserRecord) {
        username = userRecord.displayName;
        id = userRecord.uid;
        emailVerified = userRecord.emailVerified;
    }
    token?: string;
    tokenExpirationTime: number;
    id: string;
    username: string;
    emailVerified?: boolean;
}