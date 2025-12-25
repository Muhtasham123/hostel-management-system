const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const { sendEmail, getEmails } = require("./controllers")

const emailRouter = express.Router()

emailRouter.post("/:hostel_id",verifyToken, isAdmin, sendEmail)
emailRouter.get("/:hostel_id/:id",verifyToken, isAdmin, getEmails)

module.exports = emailRouter