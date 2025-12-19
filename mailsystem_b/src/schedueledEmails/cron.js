const cron = require("node-cron")
const pool = require("../db")
const createTransporter = require("../emails/transporter")
const {decrypt} = require("./enc-dec")

cron.schedule("* * * * *",async()=>{
    console.log("Running scheduler")
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];


        const today = new Date()
        const day = days[today.getDay()]
        const month = months[today.getMonth()]
        const date = today.getDate()

        const [emails] = await connection.query("SELECT e.*, GROUP_CONCAT(u.email SEPARATOR ',') as recipientEmail, GROUP_CONCAT(u.id SEPARATOR ',') as recipientIds FROM schedueled_emails e JOIN schedueled_email_users eu ON e.id = eu.email_id JOIN users u ON eu.user_id = u.id GROUP BY e.id")

        const now = new Date()
        for(const email of emails){
            if(email.status === "pending" && ((email.type === "weekly" && email.day === day)
                || (email.type === "monthly" && Number(email.date) === date)
                || (email.type === "yearly" && email.month === month)
                )){
                
                const recipients = email.recipientIds.split(",")
                const recipientsEmails = email.recipientEmail.split(",")
                
                const appPassword = decrypt(email.app_password);

                const transporter = createTransporter(email.admin_email, appPassword)
                try{
                    await transporter.sendMail({
                        from:email.admin_email,
                        to:email.admin_email,
                        bcc:recipientsEmails,
                        subject:email.subject,
                        html:email.body
                    })

                    await connection.query("UPDATE schedueled_emails SET status = ? WHERE id = ?",["sent", email.id])

                     const [insertResult] = await connection.query("INSERT INTO emails(subject, body, admin_id) VALUES(?, ?, ?)",[email.subject, email.body, email.admin_id])
                     const email_id = insertResult.insertId
                             
                    for(const recipient of recipients){
                        await connection.query("INSERT INTO email_users(user_id, email_id) VALUES(?, ?)",[recipient, email_id])
                    }
                    

                }catch(error){
                    console.log("Error in scheduel loop : " + error.message)
                    await connection.query("UPDATE schedueled_emails SET status = ? WHERE id = ?",["failed", email.id])
                }

            }else{
                if(email.status === "sent" && ((email.type === "weekly" && email.day !== day)
                || (email.type === "monthly" && Number(email.date) !== date)
                || (email.type === "yearly" && email.month !== month))){
                    await connection.query("UPDATE schedueled_emails SET status = ? WHERE id = ?",["pending", email.id])
                }
            }
        }
        await connection.commit()
    } catch (error) {
        await connection.rollback()
        console.log("Error in cron : " + error.message)
    }finally{
        connection.release()
    }
})