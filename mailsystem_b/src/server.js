require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const seeder = require("./seeders")
const authRouter = require("./auth/router")
const memberRouter = require("./members/router")
const floorRouter = require("./floors/router")
const roomRouter = require("./rooms/router")
const roleRouter = require("./roles/router")
const emailRouter = require("./emails/router")
const schedueledEmailRouter = require("./schedueledEmails/router")
const dashboardRouter = require("./dashboard/routes")
const { hostelRouterAdmin, hostelRouterCustomer } = require("./hostels/router")
require("./schedueledEmails/cron")
const cloudinary = require("./cloudinaryConfig");
const joinRouter = require("./join/router")


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]            
}))

app.use("/admin/auth", authRouter)
app.use("/admin/members", memberRouter)
app.use("/admin/floors", floorRouter)
app.use("/admin/rooms", roomRouter)
app.use("/admin/roles", roleRouter)
app.use("/admin/emails", emailRouter)
app.use("/admin/schedueledEmails", schedueledEmailRouter)
app.use("/admin/dashboard", dashboardRouter)
app.use("/admin/hostels", hostelRouterAdmin)
app.use("/customer/hostels", hostelRouterCustomer)
app.use("/join-hostel", joinRouter)


const port = 4000
app.listen(port,async()=>{
    await seeder()
    console.log("Server is running")
})