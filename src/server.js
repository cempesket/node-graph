const {GraphQLServer} = require('graphql-yoga');

const context = require('./context/context');
const mutation = require('./resolvers/Mutation');
const {getInfo, getFeed, getVotes, getLink} = require('./resolvers/Query');
const {user} = require('./resolvers/AuthPayload');

const resolvers = {
    Query: {
        info: getInfo,
        feed: getFeed,
        votes: getVotes
    },
    Mutation: mutation,

    AuthPayload: {
        user: user
    },
    Link: {
        votes: getVotes
    },
    Vote: {
        link: getLink
    }

};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql', resolvers, context
});

server.start().then(() => {
    console.log('Listening')
});