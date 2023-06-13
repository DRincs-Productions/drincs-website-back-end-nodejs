export class LoginAccount {
    // TODO [Required]
    // TODO [EmailAddress]
    email?: string;
    // TODO [Required]
    password?: string;

    verify(): boolean {
        if (!this.email) {
            // TODO ...
        }
        return true
    }
}