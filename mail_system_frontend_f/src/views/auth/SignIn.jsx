import InputField from "components/fields/InputField";
import {useReducer} from "react"
import reducer from "./reducer"
import SignInHandler from "./handlers"
import {Link, useNavigate} from "react-router-dom"

export default function SignIn() {
  const [state, dispatch] = useReducer(reducer, {username:"", password:""})
  const url = "http://localhost:4000/admin/auth/login"
  const navigate = useNavigate()

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
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
        onClick = {(e)=>SignInHandler(e,url,
        {
            username:state.username,
            password:state.password,
            role:"admin"
        }, navigate)}>
          Sign In
        </button>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <Link
            to="/auth/sign-up"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
