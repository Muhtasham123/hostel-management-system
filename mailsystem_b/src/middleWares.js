const jwt = require("jsonwebtoken")
const pool = require("./db")

// verifying token
const verifyToken = (req, res, next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({success:false, message:"No token provided"})
        }
        const decoded = jwt.verify(token, "askjaldjslkjd")
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({success:false, message:error.message})
        console.log("Error in verify token : " + error.message)
    }
}

// verifying role
const isAdmin = async(req, res, next)=>{
    try {
        const user_id = req.user.id
        const {hostel_id} = req.params

        if(!hostel_id){
            return res.status(400).json({success:false, message:"Hostel context is required"})
        }

        let [role] = await pool.query("SELECT role FROM roles r JOIN hostel_users hu ON r.id = hu.role_id WHERE hu.user_id = ? AND hu.hostel_id = ?",[user_id, hostel_id])
        role = role[0].role

        if(role !== "admin"){
            return res.status(403).json({success:false, message:"You are not authourized for this operation"})
        }
        next()
    } catch (error) {
        console.log("Error in is admin : ", error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

// verify capability
const isOwner = async(req, res, next)=>{
    try {
        const {account_type} = req.user

        if(account_type !== "owner"){
            return res.status(403).json({success:false, message:"You are not capable for this operation"})
        }
        next()
    } catch (error) {
        console.log("Error in is owner : ", error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

const isCustomer = async(req, res, next)=>{
    try {
        const {account_type} = req.user

        if(account_type !== "customer"){
            return res.status(403).json({success:false, message:"You are not capable for this operation"})
        }
        next()
    } catch (error) {
        console.log("Error in is owner : ", error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = {verifyToken, isAdmin, isCustomer, isOwner}