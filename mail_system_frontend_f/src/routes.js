import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";

// Auth Imports
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";
import Members from "views/admin/members";
import Floors from "views/admin/floors";
import Rooms from "views/admin/rooms";
import SentMails from "views/admin/sentmails"
import ScheduledMails from "views/admin/scheduledmails"

// Icon Imports
import {
  MdHome,
  MdLock,
} from "react-icons/md";

import { FaUsersLine } from "react-icons/fa6";
import { FaRegBuilding, FaDoorOpen } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { SlCalender } from "react-icons/sl";


const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    // name: "NFT Marketplace",
    // layout: "/admin",
    // path: "nft-marketplace",
    // icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    // component: <NFTMarketplace />,
    // secondary: true,
  },
  {
    // name: "Data Tables",
    // layout: "/admin",
    // icon: <MdBarChart className="h-6 w-6" />,
    // path: "data-tables",
    // component: <DataTables />,
  },
  {
    // name: "Profile",
    // layout: "/admin",
    // path: "profile",
    // icon: <MdPerson className="h-6 w-6" />,
    // component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
  },
  {
    name: "Sent",
    layout: "/admin",
    path: "sent",
    icon: <IoMdSend  className="h-6 w-6" />,
    component: <SentMails />,
  },
  {
    name: "Scheduled Mails",
    layout: "/admin",
    path: "scheduled-mails",
    icon: <SlCalender />,
    component: <ScheduledMails />,
  },
  {
    name: "Members",
    layout: "/admin",
    path: "members",
    icon: <FaUsersLine  className="h-6 w-6" />,
    component: <Members />,
  },
  {
    name: "Floors",
    layout: "/admin",
    path: "floors",
    icon: <FaRegBuilding className="h-6 w-6" />,
    component: <Floors />,
  },
  {
    name: "Rooms",
    layout: "/admin",
    path: "rooms",
    icon: <FaDoorOpen className="h-6 w-6" />,
    component: <Rooms />,
  },
  {
    // name: "RTL Admin",
    // layout: "/rtl",
    // path: "rtl",
    // icon: <MdHome className="h-6 w-6" />,
    // component: <RTLDefault />,
  },
];
export default routes;
