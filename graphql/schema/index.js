const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User{
        _id: ID!
        firstname: String!
        lastname: String!
        email: String!
    }

    input UserInput {
        _id: String!
        firstname: String!
        lastname: String!
        email: String!
    }

    type RootQuery {
        users: [User!]!
        loadProfile(userId: String): User
    }

    type RootMutation {
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);