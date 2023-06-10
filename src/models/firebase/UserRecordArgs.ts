export class UserRecordArgsCreate {   // CreateRequest
    constructor(
        email: string,
        displayName: string,
        emailVerified: boolean,
        photoUrl: string,
        disabled: boolean,
        password: string,
        phoneNumber?: string,
    ) {
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