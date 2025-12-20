import InputField from "components/fields/InputField";
import {useReducer} from "react"
import { Link, useNavigate } from "react-router-dom"
import reducer from "./reducer"
import SignUpHandler from "./handlers"

export default function SignUp() {
    const [state, dispatch] = useReducer(reducer, {username:"",email:"", password:""})
    const url = "http://localhost:4000/admin/auth/signup"
    const route = window.location.pathname
    let account_type = "customer"
    if(route.includes("owner")){
      account_type = "owner"
    }
    const navigate = useNavigate()

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign up section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign Up
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign up!
        </p>

        {/* username */}
        <InputField
            value={state.username}
            dispatch={dispatch}
            actionType="username"
            variant="auth"
            extra="mb-3"
            label="Username"
            placeholder="John doe"
            id="username"
            type="text"
        />

        {/* Email */}
        <InputField
          value={state.email}
          dispatch={dispatch}
          actionType="email"
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
        />

        {/* Password */}
        <InputField
          value={state.password}
          dispatch={dispatch}
          actionType="password"
          variant="auth"
          extra="mb-3"
          label="Password"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
        />
        
        
        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        onClick = {(e)=>SignUpHandler(e,url,
        {
            username:state.username,
            email:state.email,
            password:state.password,
            account_type
        }, navigate)}>
          Sign Up
        </button>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <Link 
            to="/auth/owner/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
