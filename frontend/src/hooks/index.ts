import axios from "axios";
import { useEffect, useState } from "react";
import { Backendurl } from "../config";


export interface Blog{
    "content": string,
    "title": string,
    "published": string,
    "id"?: string,
    "author": {
        "name": string
    }
}

export const useBlog = (id: string)=>{
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(()=>{
        axios.get(`${Backendurl}/api/v1/blog/${id}`, {
            headers: {
                "Authorization": `${localStorage.getItem("token")}`
            }
        }).then((res)=>{
            setBlog(res.data.blog);
            setLoading(false);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])

    return {loading, blog};
}


export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(()=>{
        axios.get(`${Backendurl}/api/v1/blog/bulk`, {
            headers: {
                "Authorization": `${localStorage.getItem("token")}`
            }
        }).then((res)=>{
            setBlogs(res.data.allblogs);
            setLoading(false);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])

    return {loading, blogs};

}