const getInfo = () => 'This is the API of a Hackernews Clone';
const getFeed = async (root, args, context, info) => {
    const where = args.filter
        ? {
            OR: [
                {url_contains: args.filter},
                {description_contains: args.filter},
            ],
        }
        : {};


    return await context.db.query.links({where, orderBy: args.orderBy,skip: args.skip, first: args.first}, info);

};
const getVotes = async (root, args, context, info) => {
    let where = {};
    if (root && root.id) {
        where = {where: {link: {id: root.id}}}
    }
    return await  context.db.query.votes(where, info)
};
const getLink = async (root, args, context, info) => {
    let where = {};
    if (root.link) {
        where = {where: {id: root.link.id}}
    }
    return await  context.db.query.link(where, info)
};


const count = async (root, args, context, info) => {
    const countSelectionSet = `
    {
      aggregate {
        count
      }
    } `;
    const data = await context.db.query.linksConnection({}, countSelectionSet, info);

    return data.aggregate.count

};

module.exports = {getInfo, getFeed, count, getVotes, getLink};