import mongoose from 'mongoose'



const nastavnikSchema = new mongoose.Schema(
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
        razredi: [{ type: String }],
        referenca : String,
        predmeti: [{ type: String }],
        potvrda : Number,
        profilePic: String,
        CV: String

        
    }
)




export default mongoose.model('NastavnikModel', 
nastavnikSchema, 'nastavnik');