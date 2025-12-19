const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const { addRoom, editRoom, deleteRoom, getRoom } = require("./controllers")

const roomRouter = express.Router()

roomRouter.post("/:hostel_id/:floor_id",verifyToken, isAdmin, addRoom)
roomRouter.put("/:hostel_id/:floor_id/:room_id",verifyToken, isAdmin, editRoom)
roomRouter.delete("/:hostel_id/:floor_id/:room_id",verifyToken, isAdmin, deleteRoom)
roomRouter.get("/:hostel_id",verifyToken, isAdmin, getRoom)

module.exports = roomRouter