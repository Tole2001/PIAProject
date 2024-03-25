import mongoose from 'mongoose'



const casSchema = new mongoose.Schema(
    {
        predmet : String,
        nastavnik : String,
        ucenik : String,
        opis : String,
        datumvreme : Date,
        datumvremekraj : Date,
        odrzan : Number,
        komentar : String,
        potvrdjen : Number,
        ocena: Number,
        potvrdaObavestenje : Number,
        otkazObavestenj : Number

    }
)




export default mongoose.model('CasModel', 
casSchema, 'casovi');