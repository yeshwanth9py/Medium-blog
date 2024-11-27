import { Link } from "react-router-dom"
// import parse from 'html-react-parser';
import DOMPurify from 'dompurify';


export interface blogtype {
    id: string,
    authorname: string,
    title: string,
    content: string,
    publisheddate: string
}



const Blogcard = ({
    id,
    authorname,
    title,
    content,
    publisheddate
}: blogtype) => {
    // const sanitizedContent = DOMPurify.sanitize(content).slice(0, 500)+"...";
    const sanitizedContent = DOMPurify.sanitize(content);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedContent;
    const plainText = tempDiv.innerText.slice(0, 100)+"...";

    return (
        <>
            <Link to={"/blog/"+id}>
                <div className="border-b border-slate-400 p-4 w-screen max-w-screen-lg">
                    <div className="flex">
                        <Avatar name={authorname} />
                        <div className="font-extralight pl-2 text-sm flex flex-col justify-center">{authorname?authorname:"Anonyomous"}</div>
                        <div className="flex flex-col justify-center"><Circle /></div>
                        <div className="pl-2 font-thin text-slate-500 text-sm flex flex-col justify-center">{publisheddate?publisheddate:"2023-01-01"}</div>
                    </div>
                    <div className="text-xl font-semibold pt-2">{title}</div>
                    <div className="text-md font-thin ">
                        {plainText}
                    </div>

                    <div className="text-sm text-slate-500 font-thin pt-4">
                        {`${Math.ceil(content.length / 100)} minute(s) read`}
                    </div>
                </div>
            </Link>
        </>
    )
}

export const Avatar = ({ name, size = "small" }: { name: string, size?: "small" | "large" }) => {
    return (
        <>
            <div className={`relative inline-flex items-center justify-center ${size === "small" ? "w-6 h-6" : "w-10 h-10"} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
                <span className={`font-medium text-gray-600 dark:text-gray-300 ${size === "small" ? "text-sm" : "text-lg"}`}>
                    {name
                        ? name.split(" ").length >= 2
                            ? name.split(" ")[0][0] + name.split(" ")[1][0]
                            : name[0]
                        : "A"}
                </span>
            </div>
        </>
    )
}

export function Circle() {
    return <div className="w-1 h-1 rounded-full bg-slate-500 ml-2">
    </div>
}



export default Blogcard