import { Hono } from "hono";
import {sign, verify, decode} from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {signupinput, signininput} from "@yeshwanth9py/medium-common";
 
export const userrouter = new Hono<{
    Bindings:{
		DATABASE_URL: string,
		JWT_SECRET: string
	}
}>();

userrouter.post('/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())

	const body = await c.req.json();
	const {success} = signupinput.safeParse(body);
	if(!success){
		c.status(411);
		return c.json({
			message: "inputs not correct"
		});
	}

	const user = await prisma.user.create({
		data:{
			email: body.username,
			password: body.password
		}
	});

	const token = await sign({id: user.id}, c.env.JWT_SECRET);
  	return c.json({token});
});




userrouter.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())

	const body = await c.req.json();

	const {success} = signininput.safeParse(body);
	if(!success){
		c.status(411);
		return c.json({
			message: "inputs not correct"
		});
	}

	const user = await prisma.user.findUnique({
		where: {
			email: body.username,
			password: body.password
		}
	});

	if(!user){
		c.status(403);
		return c.json({message: 'invalid credentials'})
	}

	const token = await sign({id: user.id}, c.env.JWT_SECRET);
	return c.json({token});
});