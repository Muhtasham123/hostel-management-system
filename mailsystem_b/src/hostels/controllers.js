const pool = require("../db")

//ADD hostel 
const addHostel = async(req, res)=>{
    console.log("add hostel")
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
        const admin_id = req.user.id
        let {name, location, description, type, services} = req.body

        if(!name || !location || !description || !type || services.length === 0){
            return res.status(400).json({success:false, message:"All fields are required"})
        }

        if (!req.file) {
            return res.status(400).json({
            success: false,
            message: "Photo is required"
        })
        }

        services = JSON.parse(services)

        photoUrl = req.file.path

        name = name.trim().toLowerCase()
        type = type.trim().toLowerCase()
        const allowedTypes = ['boys', 'girls', 'mixed']

        if(!allowedTypes.includes(type)){
            return res.status(400).json({success:false, message:"invalid type"})

        }

        const [hostels] = await connection.query("SELECT * FROM hostels WHERE name = ?", [name])

        if(hostels.length !== 0){
            return res.status(400).json({success:false, message:"Hostel name already exists"})
        }

        const [insertResult] = await connection.query("INSERT INTO hostels(name, location, description, type, photo) VALUES(?, ?, ?, ?, ?)", [name, location, description, type, photoUrl])

        let [role_id] = await connection.query("SELECT id FROM roles WHERE role = 'admin'")
        role_id = role_id[0].id

        await connection.query("INSERT INTO hostel_users(hostel_id, user_id, role_id, status) VALUES(?, ?, ?, ?)", [insertResult.insertId, admin_id, role_id, 'active'])

        for(const s of services){
            await connection.query("INSERT INTO services(name, hostel_id) VALUES(?, ?)", [s.service, insertResult.insertId])
        }

        const [insertedHostel] = await connection.query("SELECT h.*, GROUP_CONCAT(s.name SEPARATOR ', ')as serv FROM hostels h JOIN services s ON h.id = s.hostel_id WHERE h.id = ? GROUP BY h.id", [insertResult.insertId])

        await connection.commit()

        return res.status(201).json({success:true, message:"Hostel added", data:insertedHostel[0]})

    } catch (error) {
        await connection.rollback()
        console.log("Error in add hostel : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})

    }finally{
        connection.release()
    }
}


//EDIT hostel
const editHostel = async(req, res)=>{
   const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
        const admin_id = req.user.id
        const {hostel_id} = req.params

        const [existHostels] = await pool.query("SELECT * FROM hostels WHERE id = ?", [hostel_id])

        if(existHostels.length === 0){
            return res.status(404).json({success:false, message:"Hostel does not exist"})
        }

        let {name, location, description, type, services} = req.body

        if(!name || !location || !description || !type || services.length === 0){
            return res.status(400).json({success:false, message:"All fields are required"})
        }

        name = name.trim().toLowerCase()
        type = type.trim().toLowerCase()
        const allowedTypes = ['boys', 'girls', 'mixed']

        if(!allowedTypes.includes(type)){
            return res.status(400).json({success:false, message:"invalid type"})

        }

        const [hostels] = await connection.query("SELECT * FROM hostels WHERE name = ? AND id <> ?", [name, hostel_id])

        if(hostels.length !== 0){
            return res.status(400).json({success:false, message:"Hostel name already exists"})
        }

        await connection.query("UPDATE hostels SET name = ?, location = ?, description = ?, type = ? WHERE id = ?", [name, location, description, type, hostel_id])

        await connection.query("DELETE FROM services WHERE hostel_id = ?",[hostel_id])

        for(const s of services){
            await connection.query("INSERT INTO services(name, hostel_id) VALUES(?, ?)", [s, hostel_id])
        }

        const [updatedHostel] = await connection.query("SELECT h.*, GROUP_CONCAT(s.name SEPARATOR ', ') as serv FROM hostels h JOIN services s ON h.id = s.hostel_id WHERE id = ? GROUP BY h.id", hostel_id)

        await connection.commit()

        return res.status(201).json({success:true, message:"Hostel data updated", data:updatedHostel[0]})

    } catch (error) {
        await connection.rollback()
        console.log("Error in update hostel : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})

    }finally{
        connection.release()
    }
}

//DELETE hostel 
const deleteHostel = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {hostel_id} = req.params

        const [hostels] = await pool.query("SELECT * FROM hostels WHERE id = ?", [hostel_id])

        if(hostels.length === 0){
            return res.status(404).json({success:false, message:"Hostel does not exist"})
        }

        await pool.query("DELETE FROM hostels h JOIN hostel_users hu ON h.id = hu.hostel_id WHERE h.id = ? AND hu.user_id = ? AND hu.role_id = (SELECT id FROM roles WHERE role = 'admin')", [hostel_id, admin_id])

        return res.status(200).json({success:true, message:"Hostel deleted"})

    } catch (error) {
        console.log("Error in delete hostel : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}


//GET hostels for specific admin
const getHostelsAdmin = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const {hostel_id} = req.params

        if(hostel_id !== "all"){
            let [hostels] = await pool.query("SELECT h.*, GROUP_CONCAT(s.name SEPARATOR ', ') as serv FROM hostels h JOIN services s ON h.id = s.hostel_id JOIN hostel_users hu ON h.id = hu.hostel_id WHERE hu.user_id = ? AND h.id = ? GROUP BY h.id ORDER BY h.id DESC",[admin_id, hostel_id])

            return res.status(200).json({success:true, message:"Hostels fetched", data:hostels})
        }

        let [hostels] = await pool.query("SELECT h.*, GROUP_CONCAT(s.name SEPARATOR ', ') as serv FROM hostels h JOIN services s ON h.id = s.hostel_id JOIN hostel_users hu ON h.id = hu.hostel_id WHERE hu.user_id = ? GROUP BY h.id ORDER BY h.id DESC",[admin_id])

        return res.status(200).json({success:true, message:"Hostels fetched", data:hostels})

    } catch (error) {
        console.log("Error in get floor : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

//GET all hostels for customers
const getHostelsCustomer = async(req, res)=>{
    try {
        const {hostel_id} = req.params

        if(hostel_id !== "all"){
            let [hostels] = await pool.query("SELECT h.*, GROUP_CONCAT(s.name SEPARATOR ', ') as serv FROM hostels h JOIN services s ON h.id = s.hostel_id  WHERE h.id = ? GROUP BY h.id",[hostel_id])

            return res.status(200).json({success:true, message:"Hostels fetched", data:hostels})
        }

        let [hostels] = await pool.query("SELECT h.*, GROUP_CONCAT(s.name SEPARATOR ', ') as serv FROM hostels h JOIN services s ON h.id = s.hostel_id GROUP BY h.id")

        return res.status(200).json({success:true, message:"Hostels fetched", data:hostels})

    } catch (error) {
        console.log("Error in get floor : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = {addHostel, editHostel, deleteHostel, getHostelsAdmin, getHostelsCustomer}