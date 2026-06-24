import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import navbarimage from "assets/img/layout/Navbar.png";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";
import axios from "axios"
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const navigate = useNavigate()

  const handelLogout = async()=>{
    try {
      const res = await axios.post("http://localhost:4000/admin/auth/logout")
      console.log(res.data.message)
      navigate("/auth/owner/sign-in")
    } catch (error) {
      if(error.response){
        console.log(error.response.data.message)
        toast.error(error.response.data.message)
      }else{
        console.log(error)
      }
    }
  }

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            class="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={"data:image/png;base64,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"}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <button
                  onClick={handelLogout}
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
