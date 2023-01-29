import {Post} from ".prisma/client";
import { Context } from "../../index";


interface PostCreateArgs {
    post: {
        title : string;
        content: string;
    }
}

interface PostUpdateArgs {
    postId: string
    post:{
        title? : string;
        content?: string;
    }
}



interface PostPayloadType {
    userErrors: {
        message: string
    }[]
    post: Post | null
}

export const postResolvers = {
    postCreate: async(_: any, {post}: PostCreateArgs, {userInfo, prisma}: Context) : Promise<PostPayloadType> => {
        // check for req body validation
        if(!userInfo){
            return {
                userErrors: [
                    {
                        message: "you are not authorized to create post!"
                    }
                ],
                post: null
            }
        }
        const {title, content} = post;
        if(!title || !content){
            return {
                userErrors: [
                    {
                        message: "please provide title and content"
                    }
                ],
                post: null
            }
        }
        // find user creating this post
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId: userInfo.userId
            }
        })

        return {
            userErrors: [],
            post: newPost
        }
    },
    postUpdate: async(_:any, {postId,post}: PostUpdateArgs,  {prisma}: Context ) => {
        const {title, content} = post;

        if(!title && !content){
            return {
                userErrors:[
                    {
                        message: "Need to have at least one field to update!"
                    }
                ],
                post: null
            }
        }
        // check the existance of post
        const existingPost = await prisma.post.findUnique({
            where:{
                id: Number(postId)
            }
        })
        if(!existingPost){
            return {
                userErrors:[
                    {
                        message: "post does not exist!"
                    }
                ],
                post: null
            }
        }


        let requestBody = {
            title,
            content
        }

        if(!title){
            delete requestBody.title
        }
        if(!content){
            delete requestBody.content
        }

        return{
            userErrors: [],
            post: await prisma.post.update(
            
                {
                data: {
                    ...requestBody
                },
                where:{
                    id: Number(postId)
                }
            })
        }

    },

    postDelete: async(_:any, {postId}: {postId: string},  {prisma}: Context) => {
        // check if the post exist
        const existingPost = await prisma.post.findUnique({
            where:{
                id: Number(postId)
            }
        })
        if(!existingPost){
            return {
                userErrors:[
                    {
                        message: "post does not exist!"
                    }
                ],
                post: null
            }
        }


        return {
            userErrors: [],
            post: await prisma.post.delete({
                where: {
                    id: Number(postId)
                }
            })
        }
    }

}