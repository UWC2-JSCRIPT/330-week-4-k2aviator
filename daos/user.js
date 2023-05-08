const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt')

module.exports = {};

module.exports.createUser = async (username, hashedPass) => {
    //console.log("DAO - details for creating user: username ", username, " password ", password )
    const addedUser = await User.create({email:username, password:hashedPass})
    //console.log("DAO - created user ", addedUser)
    return true;
}

module.exports.getUser = async (userName) => {
    // Get user using their email address
    //console.log("DAO get user function... input: ", userName)
    //const userRecord = await User.findOne({email:userName})
    const userRecord = await User.find({email:userName})
    //console.log("user record found ", await userRecord)
    //console.log("user record length: ", userRecord.length)
    if (userRecord.length == 0) {
        return false
    } else {
        return userRecord 
    }
}

module.exports.updateUserPassword = async (userId, password) => {
    //console.log("DAO - update password ")
    //console.log('user id is ', userId)
    const allUsers = await User.find();
    //console.log('all users to match from' , allUsers)
    const matchId = await User.findOne({_id:userId})
    //console.log("match result is ", matchId)
    const updatePassword = await User.updateOne({_id:userId},{password:password})
    //console.log("DAO update password result ", updatePassword)
    //console.log("all users after password update ", await User.find())
    if (!updatePassword){
        return false
    } else {
        return true
    }
}

module.exports.checkPassword = async (userId, password) => {
    //console.log("DAO - check user password... inputs: userId ", userId, " password ", password)
    const userRecord = await User.find({email:userId})
    //console.log("DAO - matched user record ", userRecord[0])
    const userRecordPassword = userRecord[0].password
    //console.log("matched user record for compare ", password, " user record password ", userRecordPassword)
    const toMatch = await bcrypt.compare(password,userRecordPassword)
    //console.log("to match ", toMatch)
    return toMatch
}

module.exports.hashPassword = async (password) => {
    //console.log("DAO - hash password.. password to hash is ", password)
    let savedHash;
    function logHash(hash){
        //console.log(`Hash for ${password} is ${hash}`);
        savedHash = hash
    }

    const hashedResult = await bcrypt.hash(password, 10)
    return hashedResult
}


class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;