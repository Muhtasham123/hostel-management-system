const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const { scheduelingEmail, getSchedueledEmails, deleteScheduledEmail } = require("./controllers")

const schedueledEmailRouter = express.Router()

schedueledEmailRouter.post("/scheduelEmail",verifyToken, isAdmin, scheduelingEmail)
schedueledEmailRouter.get("/getSchedueledEmails",verifyToken, isAdmin, getSchedueledEmails)
schedueledEmailRouter.delete("/deleteSchedueledEmails",verifyToken, isAdmin, deleteScheduledEmail)

module.exports = schedueledEmailRouter