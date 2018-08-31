const jwt = require('jsonwebtoken');
const APP_SECRET = 'secret';

const getUserIdFromToken = async (context) => {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const {userId} = await jwt.verify(token, APP_SECRET);
        return userId
    }

    throw new Error('Not authenticated')
};

module.exports = {getUserIdFromToken};