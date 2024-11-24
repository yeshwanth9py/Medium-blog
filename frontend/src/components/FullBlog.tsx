import Appbar from "./Appbar"
import { Avatar, blogtype } from "./Blogcard"

const FullBlog = ({blog}: {blog: blogtype}) => {
  return (
    <>
        <Appbar/>
        <div className="flex justify-center">
            <div className="grid grid-cols-12 w-full max-w-screen-xl pt-12">
                <div className="col-span-8 ">
                    <div className="text-5xl font-extrabold">
                        {blog.title}
                    </div>
                    <div className="text-slate-500 pt-2">
                        posted on {blog.publisheddate || "2023-01-01"}
                    </div>
                    <div className="pt-4">
                        {blog.content}
                    </div>
                </div>
                <div className="col-span-4  pt-4">
                    <div className="text-slate-600 text-lg">Author</div>
                    <div className="flex w-full">
                        <div className="pr-4 flex flex-col justify-center">
                            <Avatar size="large" name={blog.authorname || "Anonyomous"}/>
                        </div>
                        <div>
                            <div className="text-xl font-bold">
                                {blog.authorname || "Anonyomous"}
                            </div>
                            <div className="pt-2 text-slate-500">
                                Random catch phrase describing the author's ability to grab users attention
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default FullBlog