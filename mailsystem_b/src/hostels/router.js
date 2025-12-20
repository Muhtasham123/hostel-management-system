const express = require("express")
const { verifyToken, isAdmin, isCustomer, isOwner, multerUpload} = require("../middleWares")
const { addHostel, editHostel, deleteHostel, getHostelsAdmin, getHostelsCustomer } = require("./controllers")

const hostelRouterAdmin = express.Router()
const hostelRouterCustomer = express.Router()

hostelRouterAdmin.post("/",verifyToken, isOwner, multerUpload, addHostel)
hostelRouterAdmin.put("/:hostel_id",verifyToken, isAdmin, editHostel)
hostelRouterAdmin.delete("/:hostel_id",verifyToken, isAdmin, deleteHostel)
hostelRouterAdmin.get("/:hostel_id",verifyToken, isOwner, getHostelsAdmin)
hostelRouterCustomer.get("/:hostel_id",verifyToken, isCustomer, getHostelsCustomer)


module.exports = {hostelRouterAdmin, hostelRouterCustomer}