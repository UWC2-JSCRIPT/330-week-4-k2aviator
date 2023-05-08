const mongoose = require('mongoose');
const Note = require('../models/note');


module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
    //console.log("DAO  - create note")
    const addedNote = await Note.create({userId:userId, text:noteObj});
    //console.log("added note is ", addedNote)
    return addedNote;
}

module.exports.getUserNotes = async (userId) => {
    const fetchedNote = await Note.find({userId:userId})
    return fetchedNote;
}


module.exports.getNote = async (userId, noteId) => {
    //console.log("DAO note function... userId is ", userId, " and note Id is ", noteId)
    //console.log(await Note.find())
    const findUser = await Note.findOne({userId: userId})
    //console.log('found user is ', findUser)
    const userNote = await Note.findOne({ _id:noteId})
    //console.log("found note is ", userNote, " and find user is ", findUser)
    const findBoth = await Note.findOne({_id:noteId, userId:userId})
    //console.log("find both is ", findBoth)
    if (findBoth == null){
      return false
    }
    if (!userNote){
    //console.log("error - no matching note")
    return false
    } else {
      //console.log("note matches - do something")
      return userNote
    }
  
}


class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;
