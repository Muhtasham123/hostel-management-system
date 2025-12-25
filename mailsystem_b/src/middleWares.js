const jwt = require("jsonwebtoken")
const pool = require("./db")
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("./cloudinaryConfig")

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hostels",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }]
  }
})

const upload = multer({ storage })

const multerUpload = (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err)

        // Multer-specific errors
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            success: false,
            message: err.message
          })
        }

        // Cloudinary or other errors
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed"
        })
      }

      next()
    })
  }


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

        let [role] = await pool.query("SELECT role FROM roles r JOIN hostel_users hu ON r.id = hu.role_id WHERE hu.user_id = ?",[user_id])

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
        console.log("Error in is customer : ", error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = {verifyToken, isAdmin, isCustomer, isOwner, multerUpload}