const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const dashboardItems = require("./controllers")

const dashboardRouter = express.Router()

dashboardRouter.get("/:hostel_id",verifyToken, isAdmin, dashboardItems)

module.exports = dashboardRouter