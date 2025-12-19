const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const { addFloor, editFloor, deleteFloor, getFloor } = require("./controllers")

const floorRouter = express.Router()

floorRouter.post("/:hostel_id",verifyToken, isAdmin, addFloor)
floorRouter.put("/:hostel_id/:floor_id",verifyToken, isAdmin, editFloor)
floorRouter.delete("/:hostel_id/:floor_id",verifyToken, isAdmin, deleteFloor)
floorRouter.get("/:hostel_id",verifyToken, isAdmin, getFloor)

module.exports = floorRouter