import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const updatePost = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());
        
        const formData = await c.req.formData();
        const title =  formData.get("title") as string;
        const content = formData.get("content") as string;
        const blogId = formData.get("blogId") as string;

        // check if blogId is missing
        if(!blogId) {
            return c.json({error: "Blog ID is missing"}, 403);
        }
        
        // Check if title or content are missing or invalid
        if (typeof title !== 'string' || typeof content !== 'string' || !title.trim() || !content.trim()) {
            return c.json({ error: 'Invalid or missing title/content' }, 400);
        }
        
        // check if the blogId is correct 
        const isExistingBlog = await prisma.post.findUnique({
            where: {
                id: blogId,
            }, 
            select: {
                id: true,   // will fetch id only to check if it exists
                authorId: true
            }
        });
            console.log(isExistingBlog)
        if(isExistingBlog && (isExistingBlog.authorId == c.get('userId'))) {
            const updatedPost = await prisma.post.update({
                where: {
                    id: blogId,
                    authorId: c.get('userId')
                }, 
                data: {
                    title: title,
                    content: content,
                    published: true
                }
            })
        
            return c.json({
                message: "Succesfully Updated",
                updatedPost: updatedPost
            }, 200)
        }
        
        return c.json({message: "blog not found"})  
    } catch(err) {
        return c.json({error: "Something went wrong", err}, 500)
    }
}