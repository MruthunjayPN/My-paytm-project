import express from 'express';
import zod from 'zod'
import { Account, User } from '../db.js';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../config.js'
import authmiddleware from '../middleware.js';
const router = express.Router();

//signup route
const signupBody = zod.object({
    username : zod.string().email(),
    password : zod.string().min(6),
    firstName : zod.string().min(2).max(20),
    lastName : zod.string().min(2).max(20)  // validation rules here
})
router.post('/signup', async(req, res) => { 
    //checking for correct inputs
    const {success} = signupBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message : 'Invalid inputs'
        })
    }
    //checking if username already taken
    const existingUser = await User.findOne({username : req.body.username})
    if(existingUser) {
        return res.status(409).json({
            message : 'Email already taken'
        })
    }

    //creating a new user
    const newUser = await User.create({
        username : req.body.username,
        password : req.body.password,
        firstName : req.body.firstName,
        lastName : req.body.lastName
    })

    //extrating userid and providing user with token
    const userId = newUser._id;

    //after creating user , we are initalizing them with some balance(btwn 1 and 10000)
    await Account.create({
        userId,
        balance : Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message : 'User created successfully',
        token : token
    })
});

//signin route
const signinBody = zod.object({
    username : zod.string().email(),
    password : zod.string()  // validation rules for signin
})

router.post('/signin', async(req, res) =>{
    //checking for correct inputs
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message : 'Invalid inputs'
        })
    }

    //checking if the user exists
    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    })
    //if user exists send him token
    if(user){
        const token = jwt.sign({
            userId : user._id
        }, JWT_SECRET);

        res.json({token: token})
        return ;
    }
    //if user doesn't exist send error message - else wala case
    res.status(411).json({
        message : 'error while logging in'
    })
})

//route for updating the credentials
const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(), //optional: user may change any of these, not compulsary to update all
    lastName: zod.string().optional(),
})


router.put("/", authmiddleware, async (req, res) => {
    //validating inputs
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    //upfs
    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

//displaying names from backend containing user inputs -> filter-> firstname/lastname
//hints:
//https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
//https://stackoverflow.com/questions/3305561/how-to-query-mongodb-with-like

router.get('/bulk', async(req, res)=> {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or : [{
            firstName : { "$regex": filter },   //regex means regular expression which mongoose use-> here we are sending user input as filter to database to match expressions
        },
        {
            lastName : { "$regex": filter }
        }]
    })

    res.json({
        user: users.map(user => ({
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }))
    })
})

export default router 