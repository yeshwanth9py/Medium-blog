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
})

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
    })
})

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


