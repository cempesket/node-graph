const db = require('../database/db');

const context = req => ({
    ...req,
    db
});

module.exports = context;