const pool = require("../db")

const dashboardItems = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {hostel_id} = req.params

        const [rooms] = await pool.query("SELECT COUNT(r.id) as room_count FROM rooms r JOIN floors f ON f.id = r.floor_id JOIN hostel_users hu ON hu.hostel_id = f.hostel_id WHERE hu.user_id = ? AND f.hostel_id = ?",[admin_id, hostel_id])

        const [filled_rooms] = await pool.query("SELECT COUNT(r.id) as room_count FROM rooms r JOIN floors f ON f.id = r.floor_id JOIN hostel_users hu ON hu.hostel_id = f.hostel_id WHERE hu.user_id = ? AND f.hostel_id = ? AND r.status = 'unavailable'",[admin_id, hostel_id])

        const [vaccant_rooms] = await pool.query("SELECT COUNT(r.id) as room_count FROM rooms r JOIN floors f ON f.id = r.floor_id JOIN hostel_users hu ON hu.hostel_id = f.hostel_id WHERE hu.user_id = ? AND f.hostel_id = ? AND r.status = 'available'",[admin_id, hostel_id])

        const [floors] = await pool.query("SELECT COUNT(f.id) as floor_count FROM floors f JOIN hostel_users hu ON f.hostel_id = hu.hostel_id WHERE hu.user_id = ? AND hu.hostel_id = ?",[admin_id, hostel_id])

        const [residents] = await pool.query("SELECT COUNT(u.id) as resident_count FROM users u JOIN hostel_users hu ON u.id = hu.user_id JOIN roles r ON hu.role_id = r.id WHERE hu.hostel_id = ? AND hu.user_id AND r.role = 'resident'",[hostel_id, admin_id])

        const [sent_mails] = await pool.query("SELECT COUNT(id) as sent_count FROM emails  WHERE  admin_id = ?",[admin_id])

        const [scheduled_mails] = await pool.query("SELECT COUNT(id) as scheduled_count FROM schedueled_emails WHERE admin_id = ?",[admin_id])

        const [seats] = await pool.query("SELECT SUM(r.seats) as seat_count FROM rooms r JOIN floors f ON r.floor_id = f.id JOIN hostel_users hu ON f.hostel_id = hu.hostel_id WHERE f.hostel_id = ? AND hu.user_id = ?",[hostel_id, admin_id])

        const [hostel] = await pool.query("SELECT * FROM hostels h JOIN hostel_users hu ON h.id = hu.hostel_id WHERE h.id = ? AND hu.user_id = ?",[hostel_id, admin_id])

        const data = {
            rooms:rooms[0].room_count,
            seats:seats[0].seat_count - residents[0].resident_count,
            filled:filled_rooms[0].room_count,
            vaccant:vaccant_rooms[0].room_count,
            floors:floors[0].floor_count,
            residents:residents[0].resident_count,
            sent:sent_mails[0].sent_count,
            scheduled:scheduled_mails[0].scheduled_count,
            latitude:hostel[0].latitude,
            longitude:hostel[0].longitude
        }

        res.status(200).json({success:true, message:"data fetched", data})
    } catch (error) {
        console.log("Error in dashboard items : " + error.message)
        res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = dashboardItems