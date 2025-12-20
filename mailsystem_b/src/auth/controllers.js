const sanitizeHtml = require("sanitize-html")
const bcrypt = require("bcrypt")
const pool = require("../db")
const createToken = require("../createToken")

//sign up controller

const signup = async(req, res)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    try {
        let {username, email, password, account_type} = req.body
        username = sanitizeHtml(username).trim()
        email = sanitizeHtml(email)

        if(!emailRegex.test(email)){
            return res.status(400).json({success:false, message:"Invalid email format"})
        }

        if(!strongPasswordRegex.test(password)){
            return res.status(400).json({success:false, message:"Password must have a digit, symbol, uppercase, and lowercase letters"})
        }

        const [user] = await pool.query("SELECT username from users WHERE username = ?",[username])

        if(user.length !== 0){
            return res.status(400).json({success:false, message:"Username already exists"})
        }

        password = await bcrypt.hash(password, 10)

        const [insertResult] = await pool.query("INSERT INTO users(username, email, password, account_type) VALUES (?, ?, ?, ?)",[
            username,
            email,
            password,
            account_type
        ])

        const token = createToken({id:insertResult.insertId, username, account_type})
        res.cookie("token",token,{
            maxAge:1000 * 60 * 60 * 2,
            httpOnly:true
        })
        return res.status(201).json({success:true, message:"Account created"})
        
    } catch (error) {
        console.log("Error in signup : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}


// login controller
const login = async(req, res)=>{
   try {
        let {username, password} = req.body
        username = sanitizeHtml(username)

        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username])

        if(rows.length === 0){
            return res.status(404).json({success:false, message:"Invalid username or password"})
        }

        const user = rows[0]
        const isValidPassword = await bcrypt.compare(password, user.password)

        if(!isValidPassword){
            return res.status(404).json({success:false, message:"Invalid username or password"})
        }
        
        const token = createToken({id:user.id, username, account_type:user.account_type})
        res.cookie("token",token,{
            maxAge:1000 * 60 * 60 * 2,
            httpOnly:true
        })
        return res.status(201).json({success:true, message:"Logged in"})
        
    } catch (error) {
        console.log("Error in login : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

//logout controller
const logout = async(req, res)=>{
    try {
        res.cookie("token","",{
            maxAge:0,
            httpOnly:true
        })
        return res.status(200).json({success:true, message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout : " + error.message)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

module.exports = {signup, login, logout}