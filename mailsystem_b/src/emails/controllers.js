const createTransporter = require("./transporter")
const pool = require("../db")
const sanitizeHtml = require("sanitize-html")

//SENDING and storing email
const sendEmail = async(req, res)=>{
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        let {recipients, subject, body, appPassword} = req.body
        const admin_id = req.user.id

        recipients = recipients.split(",")

        if(recipients.length === 0 || !subject || !body || !appPassword){
            return res.status(400).json({success:false, message:"All fields are required"})
        }

        const [admin] = await connection.query("SELECT email FROM users WHERE id = ?",[admin_id])
        const admin_email = admin[0].email

        const [members] = await connection.query("SELECT email FROM users WHERE id IN (?)", [recipients])

        const member_emails = members.map((m)=>{
            return m.email
        })

        subject = sanitizeHtml(subject)
        body = sanitizeHtml(body,{
            allowedTags:["a", "br", "strong", "p"],
            allowedAttributes:{
                a:["href"]
            },
            allowedSchemes: ["http", "https", "mailto"]

        })
        appPassword = sanitizeHtml(appPassword)

        const transporter = createTransporter(admin_email, appPassword)
        await transporter.sendMail({
            from:admin_email,
            to:admin_email,
            bcc:member_emails,
            subject:subject,
            html:body
        })

        const [insertResult] = await connection.query("INSERT INTO emails(subject, body, admin_id) VALUES(?, ?, ?)",[subject, body, admin_id])
        const email_id = insertResult.insertId

        for (const user_id of recipients){
            await connection.query("INSERT INTO email_users(user_id, email_id) VALUES(?, ?)",[user_id, email_id])
        }

        await connection.commit()

        return res.status(201).json({success:true, message:"Email sent"})

    } catch (error) {
        await connection.rollback()
        console.log("Error in send email : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})

    }finally{
        connection.release()
    }
}

// GET emails
const getEmails = async(req, res)=>{
    try {
        const {id, hostel_id} = req.params
        const admin_id = req.user.id

        if(id !== "all"){
            const [email] = await pool.query("SELECT e.id, e.subject, e.body, e.sent_at,GROUP_CONCAT(hu.name SEPARATOR ',') AS recipient_name, GROUP_CONCAT(hu.user_id SEPARATOR ',') AS recipient_id, GROUP_CONCAT(u.email SEPARATOR ',') AS recipient_email, GROUP_CONCAT(r.role SEPARATOR ',') AS recipient_role, GROUP_CONCAT(hu.status SEPARATOR ',') AS recipient_status FROM emails e JOIN email_users eu ON e.id = eu.email_id JOIN users u ON eu.user_id = u.id JOIN hostel_users hu ON u.id = hu.user_id AND hu.hostel_id = ? JOIN roles r ON hu.role_id = r.id WHERE e.admin_id = ? AND e.id = ? GROUP BY e.id",[hostel_id, admin_id, id])

            return res.status(200).json({success:true, message:"Email fetched", data:email[0]})
        }

        const [emails] = await pool.query("SELECT e.id, e.subject, e.body, e.sent_at,GROUP_CONCAT(DISTINCT hu.name) AS recipients FROM emails e JOIN email_users eu ON e.id = eu.email_id JOIN hostel_users hu ON eu.user_id = hu.user_id AND hu.hostel_id = ?WHERE e.admin_id = ? GROUP BY e.id ORDER BY e.id DESC",[hostel_id, admin_id])

        return res.status(200).json({success:true, message:"Emails fetched", data:emails})
        
    } catch (error) {
        console.log("Error in get emails : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = {sendEmail, getEmails}