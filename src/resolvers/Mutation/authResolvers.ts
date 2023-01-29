import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT_SIGN } from "../../keys";
import { Context } from "../../index";


interface SignUpArgs {
    email: string;
    name: string,
    bio: string,
    password: string
}


interface UserPayload {
    userErrors: {
        message: string
    }[],
    token: string | null
}

export const authResolvers = {
    signup: async(_:any, {email, password, name, bio}: SignUpArgs, {prisma}: Context) : Promise<UserPayload> => {
        // check for email
        const isEmail = validator.isEmail(email);
        if(!isEmail){
            return {
                userErrors: [
                    {
                        message: "please enter email correctly"
                    }
                ],
                token: null
            }
        }

        // check for password
        const correctPassword = validator.isLength(password,{
            min: 5
        });
        if(!correctPassword){
            return {
                userErrors: [
                    {
                        message: "passwod must be more than 5 charachters"
                    }
                ],
                token: null
            }
        }
        // check for name and bio
        if(!name || !bio) {
            return {
                userErrors: [
                    {
                        message: "invalid name or bio!"
                    }
                ],
                token: null
            }
        }

        // hash password for store DB
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })
        // generate AUTH token
        const token = await JWT.sign({
            userId: newUser.id,
            email
        }, 
        JWT_SIGN,
        {expiresIn: 360000}    
        );


        // create user profile
        await prisma.profile.create({
            data: {
                bio,
                userId: newUser.id
            }
        })


        return {
            userErrors: [],
            token 
            
        }
    },
    signin: async(_:any, {email, password}: {email:string, password: string}, {prisma}: Context) : Promise<UserPayload> => {
        // find user base on email
        const logedInUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if(!logedInUser){
            return {
                userErrors: [
                    {
                        message: "Invalid credentials!"
                    }
                ],
                token: null
            }
        }
        // check for passsword
        const isMatch = await bcrypt.compare(password, logedInUser.password);
        if(!isMatch){
            return {
                userErrors: [
                    {
                        message: "Invalid credentials!"
                    }
                ],
                token: null
            }
        }
        // generate JWT 
        const token = await JWT.sign({
            userId: logedInUser.id,
            email
        }, 
        JWT_SIGN,
        {expiresIn: 360000}    
        );

        return {
            userErrors: [],
            token 
        }

    } 
}