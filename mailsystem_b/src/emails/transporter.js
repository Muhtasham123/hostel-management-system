const nodemailer = require("nodemailer")

const createTransporter = (adminEmail, appPassword)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:adminEmail,
            pass:appPassword
        }
    })

    return transporter
}

module.exports = createTransporter