const pool = require("../db")

const join = async(req, res)=>{
    try {
        console.log("join")
        const {token} = req.query
        const [rows] = await pool.query("SELECT * FROM invitations WHERE token = ?",[token])

        if(rows.length === 0){
            return res.status(404).send("Token not found")
        }

        const invite_data = rows[0]

        if(invite_data.status === "used"){
            return res.status(400).send("Token has been used")
        }

        const expiry = new Date(invite_data.expiry).getTime()
        const now = Date.now()

        if(expiry < now){
            return res.status(400).send("Link has been expired")
        }

        await pool.query("UPDATE hostel_users SET status = ? WHERE user_id = ? AND hostel_id = ?", ["active", invite_data.user_id, invite_data.hostel_id])

        await pool.query("UPDATE invitations SET status = ? WHERE id = ?", ["used", invite_data.id])

        return res.status(200).send("You have successfully joined this hostel")

    } catch (error) {
        console.log("Error in join  : " + error.message)
        return res.status(500).send("Internal server error")
    }
}

module.exports = {join}