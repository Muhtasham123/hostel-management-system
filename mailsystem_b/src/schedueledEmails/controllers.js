const bcrypt = require("bcrypt")
const pool = require("../db")
const sanitizeHtml = require("sanitize-html")
const {encrypt} = require("./enc-dec")

//SCHEDUELING  email
const scheduelingEmail = async(req, res)=>{
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        const {hoatel_id} = req.params
        let {recipients, subject, body, appPassword, scheduelingTime, type} = req.body
        const admin_id = req.user.id
        let [admin_email] = await pool.query("SELECT email FROM users WHERE id = ?", [admin_id])
        admin_email = admin_email[0].email

        recipients = recipients.split(",")

        if(recipients.length === 0 || !subject || !body || !appPassword || !scheduelingTime || !type){
            return res.status(400).json({success:false, message:"All fields are required"})
        }

        subject = sanitizeHtml(subject)
        body = sanitizeHtml(body,{
            allowedTags:["a", "br", "strong", "p"],
            allowedAttributes:{
                a:["href"]
            },
            allowedSchemes: ["http", "https", "mailto"]

        })
        const encryptedAppPassword = encrypt(appPassword)
        let scheduelType = "day"
        if(type === "monthly") scheduelType = "date"
        else if(type === "yearly") scheduelType = "month"

        const [insertResult] = await connection.query(`INSERT INTO schedueled_emails(subject, body, ${scheduelType}, app_password, admin_email, type, admin_id) VALUES(?, ?, ?, ?, ?, ?, ?)`,[subject, body, scheduelingTime, encryptedAppPassword, admin_email, type, admin_id])
        const email_id = insertResult.insertId

        for (const user_id of recipients){
            await connection.query("INSERT INTO schedueled_email_users(user_id, email_id) VALUES(?, ?)",[user_id, email_id])
        }

        await connection.commit()

        return res.status(201).json({success:true, message:"Email schedueled"})

    } catch (error) {
        await connection.rollback()
        console.log("Error in schedueling email : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})

    }finally{
        connection.release()
    }
}

// GET emails
const getSchedueledEmails = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {id, hostel_id} = req.params

        if(id !== "all"){
            const [email] = await pool.query("SELECT e.subject,e.body, GROUP_CONCAT(hu.name SEPARATOR ',') AS recipient_name, GROUP_CONCAT(u.email SEPARATOR ',') AS recipient_email, GROUP_CONCAT(u.id SEPARATOR ',') as recipient_id, GROUP_CONCAT(r.role SEPARATOR ',') as recipient_role, GROUP_CONCAT(hu.status SEPARATOR ',') AS recipient_status FROM schedueled_emails e JOIN schedueled_email_users eu ON e.id = eu.email_id JOIN users u ON eu.user_id = u.id JOIN hostel_users hu ON u.id = hu.user_id AND hu.hostel_id = ? JOIN roles r ON hu.role_id = r.id WHERE e.admin_id = ? AND e.id = ? GROUP BY e.id",[hostel_id, admin_id, id])

            return res.status(200).json({success:true, message:"Email fetched", data:email[0]})
        }
        const [emails] = await pool.query("SELECT e.id,e.subject,e.body, e.admin_id,e.schedueled_at, e.status, e.type, e.day, e.date, e.month, GROUP_CONCAT(hu.name SEPARATOR ',') AS recipients FROM schedueled_emails e JOIN schedueled_email_users eu ON e.id = eu.email_id JOIN hostel_users hu ON eu.user_id = hu.user_id AND hostel_id = ? WHERE e.admin_id = ? GROUP BY e.id ORDER BY e.id DESC",[hostel_id, admin_id])

        return res.status(200).json({success:true, message:"Emails fetched", data:emails})
        
    } catch (error) {
        console.log("Error in get emails : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

const deleteScheduledEmail = async(req, res)=>{
    try {
        const {id, hostel_id} = req.params

        const [emails] = await pool.query("SELECT * FROM schedueled_emails WHERE id = ?",[id])

        if(emails.length === 0){
            return res.status(404).json({success:false, message:"Email not found"})
        }

        await pool.query("DELETE FROM schedueled_emails WHERE id = ?",[id])
        return res.status(200).json({success:true, message:"Email deleted"})

    } catch (error) {
        console.log("Error in delete emails : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})

    }
}

module.exports = {scheduelingEmail, getSchedueledEmails, deleteScheduledEmail}