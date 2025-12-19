const pool = require("../db")

//ADD floor 
const addFloor = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {number} = req.body
        const {hostel_id} = req.params

        if(number < 0){
            return res.status(400).json({success:false, message:"Enter a valid number"})
        }

        if(!number){
            return res.status(400).json({success:false, message:"Floor number is required"})
        }

        const [floors] = await pool.query("SELECT * FROM floors WHERE number = ? AND hostel_id = ?", [number, hostel_id])

        if(floors.length !== 0){
            return res.status(400).json({success:false, message:"Floor already exists"})
        }

        const [insertResult] = await pool.query("INSERT INTO floors(number, hostel_id) VALUES(?, ?)", [number, hostel_id])

        const [insertedFloors] = await pool.query("SELECT * FROM floors WHERE id = ?", insertResult.insertId)
        return res.status(201).json({success:true, message:"Floor added", data:insertedFloors[0]})

    } catch (error) {
        console.log("Error in add floor : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}


//EDIT floor
const editFloor = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {number} = req.body
        const {floor_id, hostel_id} = req.params

        if(number < 0){
            return res.status(400).json({success:false, message:"Enter a valid number"})
        }

        const [rows] = await pool.query("SELECT * FROM floors WHERE id = ?",[floor_id])

        if(rows.length === 0){
            return res.status(404).json({success:false, message:"Floor does not exist"})
        }

        const [floors] = await pool.query("SELECT * FROM floors WHERE number = ? AND hostel_id = ? AND id <> ?", [number, hostel_id, floor_id])

        if(floors.length !== 0){
            return res.status(400).json({success:false, message:"Floor number already exists"})
        }

        await pool.query("UPDATE floors SET number = ? WHERE id = ? AND hostel_id = ?", [number, floor_id, hostel_id])

        const [updatedFloor] = await pool.query("SELECT * FROM floors WHERE id = ? AND hostel_id = ?",[floor_id, hostel_id])

        return res.status(200).json({success:true, message:"Floor updated", data:updatedFloor[0]})

    } catch (error) {
        console.log("Error in edit floor : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

//DELETE floor 
const deleteFloor = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {floor_id, hostel_id} = req.params

        const [floors] = await pool.query("SELECT * FROM floors WHERE id = ? AND hostel_id = ?", [floor_id, hostel_id])

        if(floors.length === 0){
            return res.status(404).json({success:false, message:"Floor does not exist"})
        }

        await pool.query("DELETE FROM floors WHERE id = ? AND hostel_id = ?", [floor_id, hostel_id])
        return res.status(200).json({success:true, message:"Floor deleted"})

    } catch (error) {
        console.log("Error in delete floor : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}


//GET floors
const getFloor = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {hostel_id} = req.params

        let [floors] = await pool.query("SELECT * FROM floors WHERE hostel_id = ? ORDER BY id DESC",[hostel_id])

        const [noOfRooms] = await pool.query("SELECT f.id, COUNT(r.id) AS noOfRooms FROM floors f LEFT JOIN rooms r ON f.id = r.floor_id WHERE f.hostel_id = ? GROUP BY f.id",[hostel_id])

        floors = floors.map(f=>{
            const room = noOfRooms.find(n=>n.id === f.id)
            return {...f, noOfRooms:room.noOfRooms}
        })
        return res.status(200).json({success:true, message:"Floors fetched", data:floors})

    } catch (error) {
        console.log("Error in get floor : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = {addFloor, editFloor, deleteFloor, getFloor}