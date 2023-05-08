const { Router } = require("express");
const router = Router();

const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');


// Post signup 
router.post("/signup", async (req, res, next) => {
    try {

    if (req.body.email && req.body.password){
    //console.log("Post signup function")
    //console.log("request body ", req.body)
    const findUser = await userDAO.getUser(req.body.email)
    //console.log("find user result is ", findUser)
        if (findUser.length > 0){
            //console.log("user already exists")
            return res.status(409).send("user already exists - send 409")
        } else {  
            //console.log("create user")
            //console.log("user to create is ", req.body)
            const hashedPass = await userDAO.hashPassword(req.body.password)
            //console.log("hashed pass in the route is ", hashedPass)
            const newUser = await userDAO.createUser(req.body.email, hashedPass)
            return res.status(200).send("user created")
        }
    } else {
        res.status(400).send("")
    }
   
    } catch(e) {
        next(e)


    }
});


router.post("/", async (req, res, next) => {
    try {
    //console.log("post request body" , req.body)
    const userEmail = req.body.email
    const userPassword = req.body.password
    if (!userPassword){
        return res.status(400).send("") 
    }
    const findUser = await userDAO.getUser(req.body.email)
    //console.log("LOGIN POST - find user result is ", findUser)
    if (!findUser == false){
        if(!req.body.password){
            //console.log('NO PASSWORD')
            return res.status(400).send("no password provided") 
        } else {
            //console.log("body password to check ", req.body.password)
            //hash password
            const checkPass = await userDAO.checkPassword(req.body.email, req.body.password)
            //console.log("returned check pass ", checkPass, " for user ", req.body.email)
            //console.log("login page request body ", req.body)
            if (checkPass == true){
                //console.log("password correct - return token")
                const userId = findUser[0]._id
                //console.log("find user object id is ", userId)
                const makeToken = await tokenDAO.makeTokenForUserId(userId)
                //console.log("make token result is ", makeToken)
                return res.json({token:makeToken.token})
                //return res.status(200).send("")
            } else {
                //console.log("password doesn't match -- send 401")
                return res.status(401).send("") 
            }
        }
   
    } else {
        //console.log("RETURN user doesn't exist")
        return res.status(401).send("user doesn't exist")
    }     
     
    } catch(e) {  
        console.log(e)
        next(e)
    }
});


//Middleware 

router.use(async function (req,res, next){
    // console.log("Middleware")
    const userName = req.body.email
    const userPassword = req.body.password
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
           next()
        }
     } else {
        res.status(401).send()
     } 
})

router.post("/password", async (req, res, next) => {
    try {
        //console.log('POST PASS FUNCTION')
        const bodyPassword = req.body.password
        const bodyEmail = req.body.email
        const token = req.body.token
        //console.log("Post pass function - request body ", req.body)
        if (req.body.email){
            return res.status(401).send("")
        } else if (token == undefined) {
            return res.status(401).send("")
        } else {
            if (!bodyPassword){
                //console.log("POST PASS - password doesn't exist")
                return res.status(400).send("")
            } else {
                //console.log("POST PASS - password exists - token is ", token, " password to update is ", bodyPassword)
                const userId = await tokenDAO.getUserIdFromToken(token)
                //console.log("returned user id is ", userId)
                if (!userId){
                    //console.log("user id is not a match")
                    return res.status(401).send("")
                } else {
                    //console.log("user id matches")
                    const hashedPass = await userDAO.hashPassword(bodyPassword)
                    const updatedPassword = await userDAO.updateUserPassword(userId, hashedPass)
                    //console.log("result of updated password function ", updatedPassword)
                        if (updatedPassword === true){
                            //console.log("POST PASS - password updated to  ", bodyPassword, " send status 200")
                            return res.status(200).send("updated password")
                        } else {
                            //console.log("POST PASS - unable to update password ", updatedPassword)
                            return res.status(401).send("")
                        }
                }
          
            }
        } 
    } catch(e) {
        console.log(e)
        next(e)
    }
});


router.post("/logout", async (req, res, next) => {
    try {
    //console.log("LOGOUT FUNCTION ", req.body)
    const token = req.body.token
    const checkToken = await tokenDAO.getUserIdFromToken(req.body.token)
    //console.log("LOGOUT FUNCTION - check token result ", checkToken )

    if (checkToken == false) {
        //console.log("bogus token: ", token)
        return res.status(401).send("bogus token")
    } else {
        const removeToken = await tokenDAO.removeToken(token)
        //console.log("remove token result is ", removeToken)
        if (removeToken == true) {
            //console.log("remove token is true ", removeToken)
            //console.log("request body is now " , req.body)
            return res.status(200).send("")  
        } //else {
        //     //console.log("remove token is false ", removeToken)
        //     return res.status(200).send("")
        // 
    }
        
    } catch(e) {
        next(e)
    }
});



module.exports = router;