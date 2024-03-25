import mongoose from 'mongoose'



const userSchema = new mongoose.Schema(
    {
        username : String,
        password : String,
        type : Number
        
    }
)




export default mongoose.model('UserModel', 
userSchema, 'users');