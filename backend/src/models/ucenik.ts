import mongoose from 'mongoose'



const ucenikSchema = new mongoose.Schema(
    {
        username : String,
        password : String,
        safetyq : String,
        safetya : String,
        name : String,
        surname : String,
        sex : String,
        adress : String,
        telephone : String,
        email : String,
        schooltype : String,
        schoolgrade : Number,
        profilePic: String,
       

        
    }
)




export default mongoose.model('UcenikModel', 
ucenikSchema, 'ucenik');