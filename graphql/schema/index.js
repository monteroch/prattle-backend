const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User{
        _id: String!
        fullname: String!
        email: String!
        contacts: [String]
        requests: [Request]
        pendingRequests: [Request]
        conversations: [String]
    }

    type Conversation{
        _id: String!
        name: String
        participants: [Participant]
        createdAt: String
        lastMessageAt: String
    }

    type UserExtended{
        _id: String!
        fullname: String!
        email: String!
        contacts: [Contact]
        requests: [Request]
        pendingRequests: [Request]
        conversations: [Conversation]
    }

    type Contact{
        _id: String!
        fullname: String!
        email: String!
    }

    type Request{
        requestId: String!
        sourceId: String!
        sourceName: String!
        targetId: String!
        targetName: String!
    }

    type Participant{
        _id: String!
        name: String
        addedAt: String
    }

    input RequestInput{
        sourceId: String!
        sourceName: String!
        targetId: String!
        targetName: String!
    }

    input UserInput {
        _id: String!
        fullname: String!
        email: String!
    }

    input HandleRequest{
        value: Boolean!
        requestId: String!
        sourceId: String!
        sourceName: String!
        targetId: String!
        targetName: String!
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