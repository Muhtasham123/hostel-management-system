const pool = require("../db")
const sanitizeHtml = require("sanitize-html")
const generateToken = require("../generateInviteToken")
const createTransporter = require("../emails/transporter")

// ADD member
const addMember = async(req, res)=>{
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {

        const admin_id = req.user.id
        const {hostel_id, room_id} = req.params

        let {name, email, role, phone_no, appPassword} = req.body
        const allowed_roles = ["resident", "staff", "manager"]

        if(!name || !email || !role || !phone_no){
            return res.status(400).json({success:false, message:"All fields are required"})
        }

        if(!allowed_roles.includes(role)){
            return res.status(400).json({success:false, message:"Invalid role"})
        }

        if(role === "resident" &&  !room_id){
            return res.status(400).json({success:false, message:"Room id is required for residents"})
        }

        name = sanitizeHtml(name).trim()
        email = sanitizeHtml(email)

        let [admin_email] = await conn.query("SELECT * FROM users WHERE id = ?",[admin_id])
        admin_email = admin_email[0].email

        let [role_id] = await conn.query("SELECT id FROM roles WHERE role = ?",[role])
        role_id = role_id[0].id

        let member
        let member_id
        [member] = await conn.query("SELECT * FROM users WHERE email = ?",[email])
        
        if(member.length){

            const [existing] = await conn.query("SELECT * FROM hostel_users WHERE user_id = ? AND hostel_id = ?",[member[0].id, hostel_id])

            if(existing.length){
                return res.status(400).json({success:false, message:"Member already exists", data:member[0]})
            }
            member_id = member[0].id

        }else{
            [member] = await conn.query("INSERT INTO users(email, username, password, account_type) VALUES (?, ?, NULL, 'customer')",[email, name])
            member_id = member.insertId
        }

        await conn.query("INSERT INTO hostel_users(hostel_id, user_id, role_id, name, phone_no) VALUES(?, ?, ?, ?, ?)",[hostel_id, member_id, role_id, name, phone_no])

        if(role === "resident"){
            const [room] = await conn.query("SELECT * FROM rooms WHERE id = ?",[room_id])
            if(room.length === 0){
                return res.status(400).json({success:false, message:"Room not found"})
            }
            await conn.query("INSERT INTO users_rooms(user_id, room_id) VALUES(?, ?)",[member_id, room_id])

            const [count] = await conn.query("SELECT COUNT(*) AS fill_count FROM users_rooms WHERE room_id = ?",[room_id])

           if(count[0].fill_count == room[0].seats){
                await conn.query("UPDATE rooms SET status = ? WHERE id = ?",["Unavailable",room_id])
           }
            
        }


        [member] = await conn.query("SELECT * FROM users WHERE email = ?",[email])

        const now = new Date()
        const expiry = new Date(now.getTime() + 48 * 60 * 60 * 1000)

        const inviteToken = generateToken()
        await conn.query("INSERT INTO invitations(token, hostel_id, user_id, role_id, expiry) VALUES(?, ?, ?, ?, ?)",[inviteToken, hostel_id, member_id, role_id, expiry])

        const invitationLink = `http://localhost:4000/join-hostel?token=${inviteToken}`
        const subject = "Invite"
        const body = `Dear resident you can access resident portal by clicking this join link: ${invitationLink}`

        const transporter = createTransporter(admin_email, appPassword)
        await transporter.sendMail({
            from:admin_email,
            to:admin_email,
            bcc:email,
            subject:subject,
            html:body
        })

        await conn.commit()
        res.status(201).json({success:true, message:"Member added", data:member[0]})
    } catch (error) {
        await conn.rollback()
        console.log("Error in add member : " + error.message)
        res.status(500).json({success:false, message:"Internal server error"})
    }finally{
        conn.release()
    }
} 


//UPDATE member
const editMember = async(req, res)=>{
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        const admin_id = req.user.id
        const {hostel_id, member_id} = req.params
        let {name, role, phone_no, room_id} = req.body

        const [member] = await conn.query("SELECT * FROM users WHERE id = ?",[member_id])
        let [member_role] = await conn.query("SELECT * FROM roles r JOIN hostel_users hu ON r.id = hu.role_id WHERE hu.user_id = ?", [member_id])

        member_role = member_role[0].role

        let prevRoomId = null
        let prevRoom = null
        if(member_role === "resident"){
            [prevRoom] = await conn.query("SELECT * FROM rooms r JOIN users_rooms ur ON r.id = ur.room_id WHERE ur.user_id = ?",[member_id])
            prevRoomId = prevRoom[0].room_id
        }

        if(member.length === 0){
            return res.status(404).json({success:false, message:"Member does not exist"})
        }

        if(!name || !role || !phone_no){
            return res.status(400).json({success:false, message:"All fields are required"})
        }

        if(role === "resident" && !room_id){
            return res.status(400).json({success:false, message:"Room id is required for residents"})
        }

        name = sanitizeHtml(name).trim()

        let [role_id] = await conn.query("SELECT * FROM roles WHERE role = ?",[role])
        role_id = role_id[0].id

        await conn.query("UPDATE hostel_users SET role_id = ?, name = ?, phone_no = ? WHERE hostel_id = ? AND user_id = ?",[role_id, name, phone_no, hostel_id, member_id])

        if(role !== "resident" && prevRoomId){
            await conn.query("DELETE FROM users_rooms WHERE user_id = ?", [member_id])
            const [prevCountRows] = await conn.query("SELECT COUNT(*) AS fill_count FROM users_rooms WHERE room_id = ?", [prevRoomId])

            if(prevCountRows[0].fill_count < prevRoom[0].seats){
                await conn.query("UPDATE rooms SET status = ? WHERE id = ?", ['Available', prevRoomId])
            }
        }

        if(role === "resident"){
            const [room] = await conn.query("SELECT * FROM rooms WHERE id = ?",[room_id])
            if(room.length === 0){
                return res.status(400).json({success:false, message:"Room not found"})
            }

            if(prevRoom){
                await conn.query("UPDATE users_rooms SET room_id = ? WHERE user_id = ?",[room_id, member_id])
            }else{
                await conn.query("INSERT INTO users_rooms(user_id, room_id) VALUES(?, ?)",[member_id, room_id])
            }

            const [count] = await conn.query("SELECT COUNT(*) AS fill_count FROM users_rooms WHERE room_id = ?",[room_id])

           if(prevRoom){
                const [prevCountRows] = await conn.query("SELECT COUNT(*) AS fill_count FROM users_rooms WHERE room_id = ?", [prevRoomId])

                if(prevCountRows[0].fill_count < prevRoom[0].seats){
                     console.log(prevRoom[0])

                     await conn.query("UPDATE rooms SET status = ? WHERE id = ?", ["Available", prevRoomId])
                 }
            }

           if(count[0].fill_count >= room[0].seats){
                await conn.query("UPDATE rooms SET status = ? WHERE id = ?",["Unavailable",room_id])
           }
            
        }
        await conn.commit()
        res.status(201).json({success:true, message:"Member updated"})

    } catch (error) {
        await conn.rollback()
        console.log("Error in edit member : " + error)
        res.status(500).json({success:false, message:"Internal server error"})

    }finally{
        conn.release()
    }
}


//DELETE member
const deleteMember = async(req, res)=>{
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        const {hostel_id, member_id} = req.params
        const admin_id = req.user.id

        const [member] = await conn.query("SELECT * FROM users WHERE id = ?",[member_id])
        const [role] = await conn.query("SELECT role FROM roles WHERE id = (SELECT role_id FROM hostel_users WHERE user_id = ? AND hostel_id = ?)",[member_id, hostel_id])

        if(member.length === 0){
            await conn.rollback()
            return res.status(404).json({success:false, message:"Member does not exist"})
        }

        await conn.query("DELETE FROM hostel_users  WHERE user_id = ? AND hostel_id = ?", [member_id, hostel_id])

        if(role[0].role === "resident"){
            const [prevRoom] = await conn.query("SELECT * FROM rooms r JOIN users_rooms ur ON r.id = ur.room_id WHERE ur.user_id = ?",[member_id])
            const prevRoomId = prevRoom[0].room_id

            await conn.query("DELETE FROM users_rooms WHERE user_id = ?",[member_id])

            const [prevCountRows] = await conn.query("SELECT COUNT(room_id) AS fill_count FROM users_rooms WHERE room_id = ?", [prevRoomId])

           if(prevCountRows[0].fill_count < prevRoom[0].seats){
                await conn.query("UPDATE rooms SET status = ? WHERE id = ?", ['Available', prevRoomId])
            }
            
        }
        await conn.commit()

        res.status(201).json({success:true, message:"Member deleted"})

    } catch (error) {
        await conn.rollback()
        console.log("Error in delete member : " + error.message)
        res.status(500).json({success:false, message:"Internal server error"})
    }finally{
        conn.release()
    }
}


//FILTERING members
const filterMembers = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {hostel_id} = req.params
        let query = "SELECT u.id, hu.name, hu.status, u.email, hu.phone_no, ro.role as role, r.number as room, f.number as floor FROM users u JOIN hostel_users hu ON u.id = hu.user_id LEFT JOIN users_rooms ur ON u.id = ur.user_id LEFT JOIN rooms r ON ur.room_id = r.id LEFT JOIN floors f ON r.floor_id = f.id JOIN roles ro ON hu.role_id = ro.id WHERE hu.hostel_id = ? AND hu.user_id <> ?"

        let values = [hostel_id, admin_id]

        let {role, room, floor} = req.query

        if(role && role !== "all"){
            query += " AND ro.role = ?"
            values.push(role)
        }

        if(room && room !== "all"){
            query += " AND r.number = ?"
            values.push(room)
        }

        if(floor && floor !== "all"){
            query += " AND f.number = ?"
            values.push(floor)
        }

        const [rows] = await pool.query(query, values)

        if(rows.length === 0){
            return res.status(404).json({success:true, message:"No matching records found"})
        }
        return res.status(200).json({success:true, message:"Records fetched", data:rows})

    } catch (error) {
        console.log("Error in filter members  : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

const inactive = async(req, res)=>{
    try {
        const {hostel_id, member_id} = req.params
        const {status} = req.body

        if(!hostel_id || !member_id){
            return res.status(400).json({success:false, message:"Missing contexts"})
        }

        const [hostel] = await pool.query("SELECT * FROM hostels WHERE id = ?",[hostel_id])
        const [member] = await pool.query("SELECT * FROM hostel_users WHERE hostel_id = ? AND user_id = ?",[hostel_id, member_id])

        if(hostel.length === 0 || member.length === 0){
            return res.status(404).json({success:false, message:"Invalid contexts"})
        }
        await pool.query("UPDATE hostel_users SET status = ? WHERE user_id = ? AND hostel_id = ?",[status, member_id, hostel_id])

        return res.status(200).json({success:true, message:"Member marked as " + status})

    } catch (error) {
        console.log("Error in inactive  : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = {addMember, editMember, deleteMember, filterMembers, inactive}