import { BottomWarning } from "../components/BottomWarning.jsx"
import { Button } from "../components/Button.jsx"
import { Heading } from "../components/Heading.jsx"
import { InputBox } from "../components/InputBox.jsx"
import {SubHeading} from "../components/SubHeading.jsx"

export const Signin = () => {
  return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your infromation to sign in into your account"} />
        <InputBox label={"Email"} placeholder={"mruthunjay@gmail.com"} />
        <InputBox label={"Password"} placeholder={"123123"} />
        <div className="pt-4"> 
           <Button  onClick={async () => {
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
              username,
              password
            });
            localStorage.setItem("token", response.data.token)
            navigate("/dashboard")
          }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Dont have an account ?" } buttonText={"Sign up"} to={"/signup"}/>
      </div>
    </div>
  </div>
}