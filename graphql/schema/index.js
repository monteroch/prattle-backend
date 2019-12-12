const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User{
        _id: String!
        firstname: String!
        lastname: String!
        email: String!
        contacts: [String]
        requests: [Request]
        pendingRequests: [Request]
    }

    type UserExtended{
        _id: String!
        firstname: String!
        lastname: String!
        email: String!
        contacts: [Contact]
        requests: [Request]
        pendingRequests: [Request]
    }

    type Contact{
        _id: String!
        firstname: String!
        lastname: String!
        email: String!
    }

    type Request{
        requestId: String!
        sourceId: String!
        sourceName: String!
        targetId: String!
        targetName: String!
    }

    input RequestInput{
        sourceId: String!
        sourceName: String!
        targetId: String!
        targetName: String!
    }

    input UserInput {
        _id: String!
        firstname: String!
        lastname: String!
        email: String!
    }

    input HandleRequest{
        value: Boolean!
        requestId: String!
        sourceId: String!
        targetId: String!
    }

    type RootQuery {
        users: [User!]!
        loadProfile(userId: String): UserExtended
        retrieveUsers(pattern: String!): [User!]!
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        addContact(RequestInput: RequestInput): User
        handleFriendshipRequest(HandleRequest: HandleRequest): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);