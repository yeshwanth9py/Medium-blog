import { useParams } from "react-router-dom"
import { useBlog } from "../hooks";
import FullBlog from "../components/FullBlog";


const Blog = () => {
  const {id} = useParams();
  // console.log(id);
  const {loading, blog} = useBlog(id || "");
  
  // must keep a skeleton here
  if(loading || !blog) return <div>Loading...</div>

  return (
    <div>
        <FullBlog blog={blog}/>
    </div>
  )
}

export default Blog