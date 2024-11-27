import { Hono } from "hono";
import {sign, verify, decode} from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { updatebloginput, createbloginput } from "@yeshwanth9py/medium-common";



export const blogrouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userid: string
    }
}>();


blogrouter.use("/*", async (c, next)=>{
    try{
        const authheader = c.req.header("Authorization") || "";
        const user = await verify(authheader, c.env.JWT_SECRET);
        if(user){
            c.set("userid", String(user.id))
            await next();
        }else{
            c.status(403);
            return c.json({
                message: "Unauthorized"
            })
        }
    }catch(err){
        console.log(err);
        c.status(403);
        return c.json({
            message: "Unauthorized"
        })
    }
});

blogrouter.get("/", async (c)=>{
    try{
        const body = await c.req.json();
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.findFirst({
            where:{
                id: body.id
            },
        });
        return c.json({blog});
    } catch(err){
        console.log(err);
        c.status(411);
        return c.json({
            message: "Error while fetching blog post"
        })
    }
});


//add pagination
blogrouter.get("/bulk", async (c)=>{
    
	const prisma = await new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const allblogs = await prisma.post.findMany(
        {
            select:{
                id: true,
                content: true,
                title: true,
                published: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        }
    );

    return c.json({
        allblogs
    });
    
});


blogrouter.get('/:id', async (c) => {
	const id = c.req.param('id');

	const prisma = await new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

	try{
        const blog = await prisma.post.findFirst({
            where: {
                id: id
            },
            select:{
                title: true,
                content: true,
                author: {
                    select:{
                        name: true
                    }
                }
            }
        });
        return c.json({
            blog
        });
        
    }catch(err){
        c.status(411);
        return c.json({
            message: "unavailable"
        });
    }
});

// for liking/unliking a post
blogrouter.put("/like/:id", async (c) => {
    const blog_id = c.req.param('id');
    const user_id = c.get("userid");

    const prisma = await new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        const likeobj = await prisma.like.findFirst({
            where: {
                postId: blog_id,
                userId: user_id
            }
        });

        if(likeobj){
            await prisma.like.delete({
                where: {
                    id: likeobj.id
                }
            });
            return c.json({
                message: "unliked"
            })
        }else{
            const like = await prisma.like.create({
                data: {
                    postId: blog_id,
                    userId: user_id
                }
            });
            return c.json({
                like
            });
        }
    }catch(err){
        console.log(err);
        c.status(411);
        return c.json({
            message: "Error while liking post"
        })
    }
});


blogrouter.put("/comment/:id", async (c) => {
    const post_id = c.req.param("id"); 
    const { content, parentId } = await c.req.json(); 
    const user_id = c.get("userid"); 

    const prisma = await new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());


    try {
        
        const post = await prisma.post.findUnique({
            where: { id: post_id },
        });

        if (!post) {
            return c.json(
                { message: "post not found", success: false },
                404
            );
        }

        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
            });

            if (!parentComment) {
                return c.json(
                    { message: "parent comment not found", success: false },
                    404
                );
            }
        }

        
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId: post_id,
                authorId: user_id,
                parentId: parentId || null, 
            },
        });

        return c.json({
            message: "Comment added successfully",
            comment: newComment,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return c.json(
            { message: "An error occurred", error: error.message, success: false },
            500
        );
    }
});





blogrouter.put('/', async (c) => {
	const body = await c.req.json();

    const {success} = updatebloginput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "inputs not correct"
        });
    }

    const prisma = await new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    });

    return c.json({
        id: blog.id
    });
    
});

blogrouter.post('/', async (c) => {
	const body = await c.req.json();
    const {success} = createbloginput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "inputs not correct"
        })
    }
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.create({
        data:{
            title: body.title,
            content: body.content,
            authorid: c.get("userid")
        }
    });
    return c.json({
        id: blog.id
    })
});


blogrouter.get("/likes/:id", async (c) => {
    const post_id = c.req.param("id"); 

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.findUnique({
            where: { id: post_id },
        });

        if (!post) {
            return c.json({ message: "Post not found", success: false }, 404);
        }

        const likes = await prisma.like.findMany({
            where: { postId: post_id },
            include: {
                user: true
            },
        });

        return c.json({
            message: "Likes retrieved successfully",
            count: likes.length,
            likes: likes.map((like) => ({
                userId: like.userId,
                userEmail: like.user.email, 
                createdAt: like.createdAt,
            })),
            // alllikes:likes,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return c.json({ message: "An error occurred", error: error.message, success: false }, 500);
    }
});


interface CommentResponse {
    id: string;
    content: string;
    authorId: string;
    authorEmail: string;
    parentId: string | null;
    createdAt: Date;
    replies: CommentResponse[];
}

//nice pb
blogrouter.get("/comments/:id", async (c)=>{
    const post_id = c.req.param("id");

    const prisma = await new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.findUnique({
            where: { id: post_id },
        });

        if(!post){
            return c.json({
                message: "post not found",
                success: false
            }, 404);
        }

        const commenst = await prisma.comment.findMany({
            where: {
                postId: post_id
            },
            include: {
                author: true
            }
        });
        
        
        const commentsMap: Record<string, CommentResponse> = {}; 
        const topLevelComments: CommentResponse[] = []; 
        
       
        commenst.forEach((comment) => {
            commentsMap[comment.id] = {
                id: comment.id,
                content: comment.content,
                authorId: comment.authorId,
                authorEmail: comment.author.email,
                parentId: comment.parentId,
                createdAt: comment.createdAt,
                replies: [] 
            };
        });
        
        // Populate the replies array or top-level array
        commenst.forEach((comment) => {
            if (comment.parentId) {
                
                commentsMap[comment.parentId]?.replies.push(commentsMap[comment.id]);
            } else {
                
                topLevelComments.push(commentsMap[comment.id]);
            }
        });
        
        return c.json({
            message: "Comments retrieved successfully",
            count: commenst.length,
            comments: topLevelComments 
        });
    } catch (error) {
        console.error(error);
        return c.json({ message: "An error occurred", error: error.message, success: false }, 500);
    }
});


