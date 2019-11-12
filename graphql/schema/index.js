const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User{
        _id: ID!
        firstname: String!
        lastname: String!
        email: String!
        password: String
    }

    input UserInput {
        firstname: String!
        lastname: String!
        email: String!
        password: String
    }

    type RootQuery {
        users: [User!]!
    }

    type RootMutation {
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);