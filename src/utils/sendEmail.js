const {Resend} = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async (to, subject,html) => {
    const {data,error} = await resend.emails.send({
        from
    })
} 