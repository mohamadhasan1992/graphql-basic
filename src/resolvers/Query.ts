import { prisma } from "../index"


export const Query = {
    posts: async(_:any, __:any) => {
        const posts = await prisma.post.findMany({
            orderBy: [
                {
                    createdAt: "desc"
                }
            ] 
        });


        return posts;
    } 
}

