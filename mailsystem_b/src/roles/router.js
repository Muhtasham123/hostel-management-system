const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const  getRoles  = require("./controllers")

const roleRouter = express.Router()

roleRouter.get("/getRole",verifyToken, isAdmin, getRoles)

module.exports = roleRouter