

const mongoose = require('mongoose');
const Token = require('../models/token');
const uuid = require('uuid')

module.exports = {};


module.exports.makeTokenForUserId = async (userId) => {
    const newToken = uuid.v4()
    //console.log("DAO new token is ", newToken)
    //console.log("DAO user id is ", userId)
    const madeToken = await Token.create({userId:userId, token:newToken})
    //console.log("created token is ", madeToken)
    return madeToken;
}

module.exports.getUserIdFromToken = async (tokenString) => {
    //console.log("DAO check token ", tokenString)
    const checkToken = await Token.findOne({token:tokenString})
    //console.log("check token result is ", checkToken)
    if (!checkToken){
        return false
    } else{
        return checkToken.userId;
    }
}


module.exports.removeToken = async (tokenString) => {
    //console.log("DAO remove token ", tokenString)
    const removedToken = await Token.updateOne({token:tokenString}, {token:""})
    //console.log("DAO removed token - string to remove ", tokenString)
    //console.log(await Token.find())
    return true;
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;