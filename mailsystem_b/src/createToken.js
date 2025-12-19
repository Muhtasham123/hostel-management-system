const jwt = require("jsonwebtoken")

const createToken = (payload)=>{
    try {
        const token = jwt.sign(payload,"askjaldjslkjd",{
            expiresIn:"2h"
        })
        return token
    } catch (error) {
        console.log("Error in create token : " + error.message)
    }
}

module.exports = createToken