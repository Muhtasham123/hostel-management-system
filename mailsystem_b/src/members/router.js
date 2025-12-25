const express = require("express")
const { verifyToken, isAdmin } = require("../middleWares")
const { addMember, editMember, deleteMember, filterMembers, inactive } = require("./controllers")

const memberRouter = express.Router()

memberRouter.post("/:hostel_id/:room_id",verifyToken, isAdmin, addMember)
memberRouter.put("/:hostel_id/:member_id",verifyToken, isAdmin, editMember)
memberRouter.put("/inactive/:hostel_id/:member_id",verifyToken, isAdmin, inactive)
memberRouter.delete("/:hostel_id/:member_id",verifyToken, isAdmin, deleteMember)
memberRouter.get("/:hostel_id",verifyToken, isAdmin, filterMembers)

module.exports = memberRouter