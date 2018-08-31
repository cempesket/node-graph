const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {getUserIdFromToken} = require('../utils/Utils');

const login = async (root, args, context) => {
    const user = await context.db.query.user({where: {email: args.email}}, '{id,password}');
    if (!user)
        throw new Error('No such user');

    const isValidPassword = await bcrypt.compare(args.password, user.password);
    if (!isValidPassword)
        throw new Error('Password incorrect');
    const token = await jwt.sign({userId: user.id}, 'secret');
    return {token, user}

};

const signup = async (root, args, context) => {
    const passwordHash = await bcrypt.hash(args.password, 10);
    const user = await context.db.mutation.createUser({data: {...args, password: passwordHash}}, '{id}');
    const token = await jwt.sign({userId: user.id}, 'secret');
    return {token, user}
};

const postLink = async (root, args, context, info) => {

    const {url, description} = args;
    if (url === '' || description === '')
        throw new Error('Fields should not be empty');

    const userId = await getUserIdFromToken(context);
    //const userId = 'cjlcdoynt00370801y0psmvor';

    return context.db.mutation.createLink({data: {...args, author: {connect: {id: userId}}}}, info)


};

const updateLink = async (root, args, context, info) => {

    await getUserIdFromToken(context);
    const id = args.id;
    delete args.id;
    return context.db.mutation.updateLink(
        {
            where: {id: id}, data: {
                ...args,
            }
        }, info);
};
const deleteLink = async (root, args, context, info) => {
    await getUserIdFromToken(context);
    const id = args.id;
    delete args.id;
    return context.db.mutation.deleteLink(
        {
            where: {id: id}
        }, info);
};
const createVote = async (root, args, context, info) => {

    const userId = await getUserIdFromToken(context);
    const vote = await context.db.mutation.createVote({
        data: {
            user: {connect: {id: userId}},
            link: {connect: {id: args.linkId}}
        }
    }, info);
    return vote
};

module.exports = {login, signup, postLink, updateLink, deleteLink, createVote};