export interface UserRecordArgs {   // CreateRequest
    uid: string;
    email: string;
    phoneNumber: string;
    displayName: string;
    emailVerified: boolean;
    photoUrl: string;
    disabled: boolean;
    password: string;
}