const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const { sendEmail, getEmails } = require("./controllers")

const emailRouter = express.Router()

emailRouter.post("/sendEmail",verifyToken, isAdmin, sendEmail)
emailRouter.get("/getEmails",verifyToken, isAdmin, getEmails)

module.exports = emailRouter