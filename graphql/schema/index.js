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

    input ContactInput{
        _id: String!
        name: String
        addedAt: String
    }

    input HandleRequest{
        value: Boolean!
        requestId: String!
        sourceId: String!
        sourceName: String!
        targetId: String!
        targetName: String!
    }

    input GroupRequestInput{
        participants: [ContactInput]
    }

    input UsernameInput{
        _id: String!
        name: String
        addedAt: String
    }

    type UsernameOutput{
        name: String
        age: String
    }

    type RootQuery {
        users: [User!]!
        loadProfile(userId: String): UserExtended
        retrieveUsers(pattern: String!): [User!]!
        getConversations(userId: String):[Conversation]
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        addContact(RequestInput: RequestInput): User
        handleFriendshipRequest(HandleRequest: HandleRequest): UserExtended
        createGroup(UsernameInput: [UsernameInput], GroupName: String): Conversation
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);