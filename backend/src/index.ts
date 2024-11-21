import { Hono } from 'hono'
import {sign, verify, decode} from "hono/jwt";

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { userrouter } from './routes/user';
import { blogrouter } from './routes/blog';


const app = new Hono<{
	Bindings:{
		DATABASE_URL: string,
		JWT_SECRET: string
	}
}>();

// app.use("/api/v1/blog/*", async (c, next)=>{
// 	const header  = c.req.header("Authorization") || "";

// 	const token = header.split(" ")[1];
// 	const response = await verify(token, c.env.JWT_SECRET);
// 	if(!response){
// 		c.status(403);
// 		return c.json({message: 'invalid token'})
// 	}

// 	next();
// });


app.route('/api/v1', userrouter);
app.route("/api/v1/blog", blogrouter);


export default app
