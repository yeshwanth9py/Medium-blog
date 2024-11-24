import { Link } from "react-router-dom"
import { Avatar } from "./Blogcard"


const Appbar = () => {
  return (
    <div className="border-b flex justify-between px-10 py-4">
        <Link to="/blogs" className="flex flex-col justify-center">Medium</Link>
        <div>
          <Link to="/publish">
            <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-400 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2">New</button>
          </Link>
          <Avatar name="John Doe" size="large"/>
        </div>
    </div>
  )
}

export default Appbar