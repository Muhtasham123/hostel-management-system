const express = require("express")
const { verifyToken } = require("../middleWares")
const { join} = require("./controllers")

const joinRouter = express.Router()

joinRouter.get("/", join)

module.exports = joinRouter
