import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

function Headers(){

    const {logout}=useAuth();
    
      function handleclick(){
        logout();
        window.location.reload()
      }
    
    return(

        <div className="flex justify-evenly">
        <Link to={"/"}>Home</Link>
        <Link to={"/login"}>Login</Link>
        <Link to={"/signup"}>Signup</Link>
        <Link to={"/upload"}>upload</Link>
        <button type="submit" onClick={handleclick} className=" hover:cursor-pointer">Logout</button>
        </div>
    )
}

export default Headers;