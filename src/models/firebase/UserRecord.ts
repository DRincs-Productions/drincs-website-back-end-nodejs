export interface UserRecord {
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    photoUrl: string;
    providerId: string;
    emailVerified: boolean;
    disabled: boolean;
    providerData: UserInfo[];
    tokensValidAfterTimestamp: string;
    userMetaData: UserMetadata;
    customClaims: { [key: string]: any; };
    tenantId: string;
}