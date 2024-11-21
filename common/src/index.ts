import z from "zod";

export const signupinput = z.object({
    username: z.string().email(),   
    password: z.string().min(6),
    name: z.string().optional()
});

export type signupinput = z.infer<typeof signupinput>

export const signininput = z.object({
    username: z.string().email(),
    password: z.string().min(6)
});

export type signininput = z.infer<typeof signininput>   

export const createbloginput = z.object({
    title: z.string(),
    content: z.string()
});

export type createbloginput = z.infer<typeof createbloginput>

export const updatebloginput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string()
});