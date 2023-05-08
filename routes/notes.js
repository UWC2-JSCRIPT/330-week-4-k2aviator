const { Router } = require("express");
const router = Router();

const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');


//Middleware 

router.use(async function (req,res, next){
    const userAuth = req.headers.authorization
    if (userAuth){ //user authorization is present  
        const re = /Bearer (\d\w+)/
        //console.log("user authorization ", userAuth)
        const token = userAuth.replace(/Bearer /,"")
        // console.log("token is ", token)
        req.body.token = token
        //check token
        const checkToken = await tokenDAO.getUserIdFromToken(req.body.token)
        if (checkToken == false) {
            //console.log("MIDDLEWARE - bogus token: ", token)
            return res.status(401).send("bogus token")
        } else {
            const userId = await tokenDAO.getUserIdFromToken(req.body.token)
            req.body.userId = userId
            //onsole.log("returned user ID is ", userId)
            next()
        }
     } else {
        //console.log("User authorization is not present") 
        //console.log("request method is ", req.method, " and request url is ", req.url)
        //console.log("request body is ", req.body)
        if (req.method === "POST" && req.url === "/"){
            res.status(401).send("")
        } else if (req.method === "GET" && req.url === "/") {
             res.status(401).send("")
        } 
    next() 
    }    
})



// Create
router.post("/", async (req, res, next) => {
    try {
    //console.log("Post function")
    //console.log("request body is ", req.body)
    //POST should store a note with user id
    const createdNote = await noteDAO.createNote(req.body.userId, req.body.text)
    //console.log('created note is ', createdNote)
    const savedNote = createdNote.text
    return res.json(createdNote)
    } catch(e) {
        next(e)
    }
});


// Get
router.get("/", async (req, res, next) => {
    try {
    //console.log("Get function")
    if (!req.body.token){
        res.status(401).send("no token")
    }
    const getNote = await noteDAO.getUserNotes(req.body.userId)
    return res.json(getNote)
    } catch(e) {
        next(e)
    }
});
 

// Get by id
router.get("/:id", async (req, res, next) => {
    try {
    //console.log("Get by id function")
    //console.log("request token is ", req.body.token)
    //console.log("request parameter id ", req.params)
    const noteId = req.params.id
    if (!req.body.token){
        res.status(401).send("no valid token")
    } else { 
        //console.log("Request userId ", req.body.userId, " note id is ", noteId)
        const getNoteById = await noteDAO.getNote(req.body.userId,noteId)
        //console.log("note to return is ", getNoteById)
        if (getNoteById == false) {
            res.status(404).send('no valid note')
        } else {
            return res.json(getNoteById)
        }
    }
    } catch(e) {
        next(e)
    }
});
  
router.use(function (err, req, res, next){
    if (err.message.includes("Cast to ObjectId failed")){
        res.status(400).send('Invalid id provided')
    } else {
        res.status(500).send('Something broke!')
    }
});

module.exports = router;