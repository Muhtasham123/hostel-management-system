const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const { scheduelingEmail, getSchedueledEmails, deleteScheduledEmail } = require("./controllers")

const schedueledEmailRouter = express.Router()

schedueledEmailRouter.post("/:hostel_id",verifyToken, isAdmin, scheduelingEmail)
schedueledEmailRouter.get("/:hostel_id/:id",verifyToken, isAdmin, getSchedueledEmails)
schedueledEmailRouter.delete("/:hostel_id/:id",verifyToken, isAdmin, deleteScheduledEmail)

module.exports = schedueledEmailRouter