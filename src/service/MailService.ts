import { createTransport } from "nodemailer";
import { MyError } from "../models/MyError";
import { logError } from "../utility/Logger";

const emailFrom = "noreply.drincs.productions@gmail.com";

export async function sendVerificationLinkMail(emailTo: string, userName: string, link: string) {
    var subject = "Verify your email for DRincs WebSite";
    var body = `Hello ${userName},
Follow this link to verify your email address.
${link}
If you didn’t ask to verify this address, you can ignore this email.

Thanks,
Your DRincs Productions`

    return await sendEmailSmtpClient(emailTo, subject, body);
}

export async function sendResetPasswordMail(emailTo: string, link: string) {
    var subject = "Reset your password for DRincs WebSite";
    var body = `Hello,
Follow this link to reset your DRincs Productions password for your ${emailTo} account.
${link}
If you didn’t ask to reset your password, you can ignore this email.

Thanks,
Your DRincs Productions team`

    return await sendEmailSmtpClient(emailTo, subject, body);
}

async function sendEmailSmtpClient(emailTo: string, subject: string, body: string) {
    try {
        let gmailPassword = process.env.GMAIL_PASSWORD

        // create reusable transporter object using the default SMTP transport
        let transporter = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: emailFrom, // generated ethereal user
                pass: gmailPassword, // generated ethereal password
            },
        });

        // send mail with defined transport object
        return await transporter.sendMail({
            from: emailFrom,
            to: emailTo,
            subject: subject,
            text: body,
        });
    }
    catch (ex) {
        logError("Exception caught in EmailService SendEmailSmtpClient: {0}", ex);
        throw new MyError("There was an error in sending the mail", "sendEmailSmtpClient");
    }
}

