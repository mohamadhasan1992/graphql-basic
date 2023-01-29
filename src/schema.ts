



export const typeDefs = `
    type Query{
        posts: [Post!]!
        
    }

    type Mutation {
        postCreate(post: PostInput!): PostPayload! 
        postUpdate(postId: ID! ,post: PostInput!): PostPayload!
        postDelete(postId: ID!): PostPayload!
        signup(email: String! name: String! password: String! bio:String): AuthPayload!
        signin(email:String!, password:String!): AuthPayload!
    }

    type AuthPayload {
        userErrors: [UserErrors!]
        token: String
        
    }

    type PostPayload{
        userErrors: [UserErrors!]
        post: Post
    }

    type UserErrors {
        message: String!
    }

    type Post {
        id: ID!
        title: String
        content: String!
        createdAt: String!
        published: Boolean!
        user: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        profile: Profile!
        posts: [Post!]!
    }

    type Profile{
        id: ID!
        bio: String!
        user: User!
    }

    input PostInput {
        title: String
        content: String
    }
`;


