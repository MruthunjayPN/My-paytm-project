import mongoose from "mongoose";

mongoose.connect('mongodb+srv://mpn:6mNajB2jIKv65PHF@courseapp.elmem.mongodb.net/Paytm')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true ,
        unique : true ,
        trim : true,
        minLength : 3,
        maxLength: 20,
        lowercase : true
    } , 
    password : {
        type: String ,
        required : true,
        minLength : 6,
    },
    firstName : {
        type : String,
        required : true ,
        trim : true,
        maxLength: 20
    },
    lastName : {
        type : String,
        required : true ,
        trim : true,
        maxLength: 20
    }
})

//we dont store decimal values in db due to precision issues. we store num+ no of decimal values
//we should create references to user table(some1 who has not signed up cannot have a balance)
const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    } , 
    balance : {
        type : Number,
        required : true
    }
})

const Account = mongoose.model('account', accountSchema);
const User = mongoose.model('user', userSchema);

export { User , Account}
