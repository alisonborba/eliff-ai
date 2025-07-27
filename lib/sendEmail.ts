import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export const sendEmail = async (to: string, subject: string, caseLink: string) => {
    console.log('Sending email to', to, subject, caseLink);
    try {
        const data = await resend.emails.send({
            from: 'noreply@resend.dev',
            to: to,
            subject: subject,
            html: html(caseLink)
        });

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const html = (link: string) => {
    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Mediation Notification</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                padding: 20px;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            h1 {
                font-size: 20px;
                color: #2e6da4;
            }
            p {
                font-size: 16px;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background-color: #2e6da4;
                color: white;
                text-decoration: none;
                border-radius: 4px;
            }
            .footer {
                margin-top: 40px;
                font-size: 12px;
                color: #888;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Mediation Case Notification - Mediatiff</h1>
            <p>Dear Sir/Madam,</p>
            <p>
                You have been listed as the opposing party in a mediation case submitted on the <strong>Mediatiff</strong> platform.
            </p>
            <p>
                The claimant has chosen to pursue peaceful conflict resolution with support from our verified mediators and legal experts. To review the case details and confirm your willingness to participate in the mediation process, please click the button below:
            </p>
            <a href="${link}" class="button">View Case Details</a>
            <p>
                If you do not recognise this case or have any concerns, feel free to contact our support team for clarification.
            </p>
            <p>Kind regards,<br />The Mediatiff Team</p>

            <div class="footer">
                This is an automated message. Please do not reply to this email.
            </div>
            </div>
        </body>
</html>
`
  
};