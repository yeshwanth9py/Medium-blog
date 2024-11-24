// import React from 'react'

import Appbar from "../components/Appbar"
import Blogcard from "../components/Blogcard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks"

const Blogs = () => {
  const { loading, blogs } = useBlogs();


  //keep a spinner here
  if (loading) {
    return (
      <>
        <Appbar />
        <div className="flex justify-center">
          <div>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
          </div>
        </div>
        

      </>
    )
  }


  return (
    <>
      <Appbar />
      <div className="flex justify-center">
        <div>
          <Blogcard id={"1"} authorname="Yeshwanth" title="What We Should Have Learned in School But Never Did" content="For the last ten years, I’ve read 100s of books and interviewed more than 700 people. We have an ongoing joke at The Unmistakable Creative. My guest choices are usually a reflection of some problem in my life. I guess you could say I’ve been trying to figure out what we should have learned in school but never did.Fortunately for me, it seems like most of our listeners are interested in those same issues. There’s one big lesson I’ve taken away from my guests on the Unmistakable Creative: There are many life skills that we should have learned in school but never did. I would have taken a different approach in college, my career, and my relationships knowing what I do at age 41." publisheddate="2023-01-01" />
          {blogs.map((blog) => (
            <>
              <Blogcard id={String(blog.id)} authorname={blog.author.name} title={blog.title} content={blog.content} publisheddate={blog.published} />
            </>
          ))}
        </div>
      </div>
    </>
  )
}




export default Blogs