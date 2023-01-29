import JWT from "jsonwebtoken";
import { JWT_SIGN } from "../keys";




export const getUserFromToken = async(token: string) => {
    // check 
    if(!token){
        return null
    }
    try{
        let authorizedUser = await JWT.verify(token, JWT_SIGN) as {userId: number}; 
        return authorizedUser
    }catch(error){
        return null;
    }

}