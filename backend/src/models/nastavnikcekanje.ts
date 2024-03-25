import mongoose from 'mongoose'



const nastavnikRedSchema = new mongoose.Schema(
    {
        username : String,
        password : String,
        safetyq : String,
        safetya : String,
        name : String,
        surname : String,
        sex : String,
        adress : String,
        telephone : Number,
        email : String,
        razredi: [{ type: String }],
        referenca : String,
        predmeti: [{ type: String }],
        potvrda : Number

        
    }
)




export default mongoose.model('NastavnikRedModel', 
nastavnikRedSchema, 'nastavnicired');