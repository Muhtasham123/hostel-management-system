const pool = require("../db")


const getRoles = async(req, res)=>{
    try {
        const admin_id = req.user.id
        const [roles] = await pool.query("SELECT * FROM roles WHERE role <> 'admin'")
        return res.status(200).json({success:true, message:"Roles fetched", data:roles})

    } catch (error) {
        console.log("Error in get roles : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = getRoles