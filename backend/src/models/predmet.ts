import mongoose from 'mongoose'



const predmetiSchema = new mongoose.Schema(
    {
        predmet : String,
        potvrdjen : Number
        
    }
)




export default mongoose.model('PredmetiModel', 
predmetiSchema, 'predmeti');