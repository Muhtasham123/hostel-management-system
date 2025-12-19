const pool = require("../db")

const dashboardItems = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const [rooms] = await pool.query("SELECT COUNT(r.id) as room_count FROM rooms r JOIN floors f ON f.id = r.floor_id WHERE f.admin_id = ?",[admin_id])

        const [filled_rooms] = await pool.query("SELECT COUNT(r.id) as room_count FROM rooms r JOIN floors f ON f.id = r.floor_id WHERE f.admin_id = ? AND r.status = 'unavailable'",[admin_id])

        const [vaccant_rooms] = await pool.query("SELECT COUNT(r.id) as room_count FROM rooms r JOIN floors f ON f.id = r.floor_id WHERE f.admin_id = ? AND r.status = 'available'",[admin_id])

        const [floors] = await pool.query("SELECT COUNT(id) as floor_count FROM floors WHERE admin_id = ?",[admin_id])

        const [residents] = await pool.query("SELECT COUNT(u.id) as resident_count FROM users u JOIN admin_users au ON u.id = au.user_id JOIN roles r ON u.role_id = r.id WHERE au.admin_id = ? AND r.role = 'resident'",[admin_id])

        const [sent_mails] = await pool.query("SELECT COUNT(id) as sent_count FROM emails  WHERE  admin_id = ?",[admin_id])

        const [scheduled_mails] = await pool.query("SELECT COUNT(id) as scheduled_count FROM schedueled_emails WHERE admin_id = ?",[admin_id])

        const [seats] = await pool.query("SELECT SUM(r.seats) as seat_count FROM rooms r JOIN floors f ON r.floor_id = f.id WHERE f.admin_id = ?",[admin_id])

        const data = {
            rooms:rooms[0].room_count,
            seats:seats[0].seat_count - residents[0].resident_count,
            filled:filled_rooms[0].room_count,
            vaccant:vaccant_rooms[0].room_count,
            floors:floors[0].floor_count,
            residents:residents[0].resident_count,
            sent:sent_mails[0].sent_count,
            scheduled:scheduled_mails[0].scheduled_count
        }

        res.status(200).json({success:true, message:"data fetched", data})
    } catch (error) {
        console.log("Error in dashboard items : " + error.message)
        res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = dashboardItems