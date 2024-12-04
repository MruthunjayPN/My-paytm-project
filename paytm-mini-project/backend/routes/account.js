import express from 'express';
import { Account } from '../db.js';
import authmiddleware from '../middleware.js';
import mongoose from 'mongoose';

const router = express.Router();

//displaying balance 
router.get('/balance' , authmiddleware, async(req, res)=> {
    const account =  await Account.findOne({
        userId : req.userId
    })
    res.status(200).json({
        balance : account.balance
    })
});

//transfering : here we will face problems like, what if server crashes in between a transction and only half of the transaction is completed; other problem is concurrent requests -> wt if user makes multiple requests before completing previous transaction. so the normal solution using findone, adding & subtracting may lead to these problems.So we should use "Sessions"  in mongoose instead

router.post("/transfer", authmiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const {amount , to} = req.body;
    
    // Fetch the accounts within the transaction
    const account = await Account.findOne({userId : req.userId}).session(session)
    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message : "insufficient funds"
        })
    }
    const toAccount = await Account.findOne({userId : to}).session(session)
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message : "invalid account"
        })
    }
    // Perform the transfer
    await Account.updateOne({userId: req.userId }, {$inc : {balance : -amount }}).session(session);
    await Account.updateOne({userId: to}, {$inc : {balance : amount }}).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.status(200).json({
        message : "Transfer successful"
    })
    
})
export default router