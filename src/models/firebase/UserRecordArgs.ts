import * as EmailValidator from 'email-validator';
import { IsNullOrWhiteSpace } from "../../utility/UtilityFunctionts";
import { MyError } from "../MyError";


export class UserRecordArgsCreate {   // CreateRequest
    constructor(
        email: string | undefined,
        displayName: string | undefined,
        emailVerified: boolean,
        photoUrl: string,
        disabled: boolean,
        password: string | undefined,
        phoneNumber?: string,
    ) {
        if (!email || IsNullOrWhiteSpace(email)) {
            throw new MyError("Email is null or white space", "UserRecordArgsCreate")
        }
        if (!EmailValidator.validate(email)) {
            throw new MyError("Email is not valid mail", "UserRecordArgsCreate")
        }
        if (!displayName || IsNullOrWhiteSpace(displayName)) {
            throw new MyError("Display Name is null or white space", "UserRecordArgsCreate")
        }
        if (!password || IsNullOrWhiteSpace(password)) {
            throw new MyError("Password is null or white space", "UserRecordArgsCreate")
        }
        this.email = email
        this.phoneNumber = phoneNumber
        this.displayName = displayName
        this.emailVerified = emailVerified
        this.photoUrl = photoUrl
        this.disabled = disabled
        this.password = password
    }
    email: string
    phoneNumber?: string
    displayName: string
    emailVerified: boolean
    photoUrl: string
    disabled: boolean
    password: string
}

export class UserRecordArgs extends UserRecordArgsCreate {   // CreateRequest
    constructor(
        uid: string,
        email: string,
        displayName: string,
        emailVerified: boolean,
        photoUrl: string,
        disabled: boolean,
        password: string,
        phoneNumber?: string,
    ) {
        super(
            email,
            displayName,
            emailVerified,
            photoUrl,
            disabled,
            password,
            phoneNumber,
        )
        this.uid = uid
    }
    uid: string
}