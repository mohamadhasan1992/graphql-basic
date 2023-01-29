import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { Query, Mutation } from './resolvers';
import {PrismaClient, Prisma} from "@prisma/client";
import { getUserFromToken } from './utils/getUserFromToken';



// instantiate prisma
export const prisma = new PrismaClient();



export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
    userInfo: {
      userId: number 
    } | null

}



const server = new ApolloServer({
  typeDefs,
  resolvers:{
    Query,
    Mutation
  } 
});

startStandaloneServer(server,{
  context: async ({ req }: any) : Promise<Context> =>{
    const userInfo = await getUserFromToken(req.headers.authorization)
    return {
      prisma,
      userInfo
    }
  },
}).then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);

});
