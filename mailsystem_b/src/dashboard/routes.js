const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const dashboardItems = require("./controllers")

const dashboardRouter = express.Router()

dashboardRouter.get("/getDashboard",verifyToken, isAdmin, dashboardItems)

module.exports = dashboardRouter