// export default async function (req: any, res: any) {
//     const sgMail = require('@sendgrid/mail')
//     sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY_)


//     const mailData = {
//         to: 'stay@dreamerspuertorico.com',
//         from: 'dreamerswelcome.web@gmail.com',
//         subject: `[${req.body.bucket}] | [${req.body.subject}] New Form Submission from ${req.body.name}`,
//         text: req.body.message + ' | Sent from: ' + req.body.email,
//         html: `<p>Sent from: ${req.body.email}</p>
//                 <div><strong>Name:</strong> ${req.body.name}</div>
//                 <div><strong>Subject:</strong> ${req.body.subject}</div>
//                 <div><strong>Property:</strong> ${req.body.property}</div>
//                 <div><strong>Destination:</strong> ${req.body.bucket}</div>
//                 <div><strong>Message:</strong></div>
//                 <div><p>${req.body.message}</p></div>`,
//     }

//     sgMail
//         .send(mailData)
//         .then(() => {
//             res.status(200)
//             res.end()
//         })
//         .catch((error: any) => {

//             console.log(error)
//             res.status(500).json({ error: error.message || error.toString() })


//         })
// }



import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { name, email, subject, message, property, bucket } = req.body

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", 
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER, 
                pass: process.env.GMAIL_PASS,
            },
        })

        const mailOptions = {
            from: `"Dreamers Welcome" <${process.env.GMAIL_USER}>`,
            to: 'hello@dreamerswelcome.com',
            // to: 'akshita@yopmail.com',
            subject: `[${bucket}] | [${subject}] New Form Submission from ${name}`,
            text: `${message} | Sent from: ${email}`,
            html: `
        <p>Sent from: ${email}</p>
        <div><strong>Name:</strong> ${name}</div>
        <div><strong>Subject:</strong> ${subject}</div>
        <div><strong>Property:</strong> ${property}</div> 
        <div><strong>Destination:</strong> ${bucket}</div>
        <div><strong>Message:</strong></div>
        <div><p>${message}</p></div>
      `,
        }
 
        await transporter.sendMail(mailOptions)

        res.status(200).json({ success: true, message: 'Email sent successfully' })
    } catch (error: any) {
        console.error('Nodemailer Error:', error)
        res.status(500).json({ error: error.message || 'Email failed to send' })
    }
}
