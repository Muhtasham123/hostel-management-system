const pool = require("../db")

//ADD room
const addRoom = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {number, seats} = req.body
        const {floor_id, hostel_id} = req.params
       
        if(number < 0){
            return res.status(400).json({success:false, message:"Enter a valid number"})
        }

        if(!number || !seats){
            return res.status(400).json({success:false, message:"Room number and seats are required"})
        }

        const [rooms] = await pool.query("SELECT * FROM rooms r JOIN floors f ON r.floor_id = f.id WHERE r.number = ? AND f.id = ? AND f.hostel_id = ?", [number, floor_id, hostel_id])

        if(rooms.length !== 0){
            return res.status(400).json({success:false, message:"Room already exists"})
        }

        const [result] =  await pool.query("INSERT INTO rooms(number, seats, floor_id) VALUES(?, ?, ?)", [number, seats,  floor_id])

        const [insertedRoom] = await pool.query("SELECT * FROM rooms WHERE id = ? AND floor_id = ?",[result.insertId, floor_id])

        return res.status(201).json({success:true, message:"Room added", data:insertedRoom[0]})

    } catch (error) {
        console.log("Error in add room : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}


//EDIT room
const editRoom = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {number, seats} = req.body
        const {room_id, floor_id, hostel_id} = req.params

        if(number < 0){
            return res.status(400).json({success:false, message:"Enter a valid number"})
        }

        if(!number || !seats){
            return res.status(400).json({success:false, message:"Room number and seats are required"})
        }

        const [rows] = await pool.query("SELECT * FROM rooms WHERE id = ? AND floor_id = ?",[room_id, floor_id])

        if(rows.length === 0){
            return res.status(404).json({success:false, message:"Room does not exist"})
        }

        const [rooms] = await pool.query("SELECT * FROM rooms r JOIN floors f ON r.floor_id = f.id WHERE r.number = ? AND f.id = ? AND f.hostel_id = ? AND r.id <> ?", [number, floor_id, hostel_id, room_id])

        if(rooms.length !== 0){
            return res.status(400).json({success:false, message:"Room number already exists"})
        }

        await pool.query("UPDATE rooms SET number = ?, seats = ?, floor_id = ? WHERE id = ?", [number, seats, floor_id, room_id])

        return res.status(200).json({success:true, message:"Room updated"})

    } catch (error) {
        console.log("Error in edit room : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

//DELETE room 
const deleteRoom = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {room_id, floor_id} = req.params

        const [rooms] = await pool.query("SELECT * FROM rooms WHERE id = ?", [room_id])

        if(rooms.length === 0){
            return res.status(404).json({success:false, message:"Room does not exist"})
        }

        await pool.query("DELETE FROM rooms WHERE id = ? AND floor_id = ?", [room_id, floor_id])
        return res.status(200).json({success:true, message:"Room deleted"})

    } catch (error) {
        console.log("Error in delete room : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}


//GET rooms
const getRoom = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {hostel_id} = req.params

        const [rooms] = await pool.query("SELECT r.*, f.number as floor_number FROM rooms r JOIN floors f ON r.floor_id = f.id WHERE f.hostel_id = ? ORDER BY r.id DESC",[hostel_id])
        return res.status(200).json({success:true, message:"Rooms fetched", data:rooms})

    } catch (error) {
        console.log("Error in get room : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = {addRoom, editRoom, deleteRoom, getRoom}