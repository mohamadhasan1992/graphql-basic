import { authResolvers } from "./authResolvers";
import { postResolvers } from "./post";





export const Mutation = {
    ...postResolvers,
    ...authResolvers
}