import express from 'express'
import { UserController } from '../controllers/user.controllers'

const userRouter = express.Router()


userRouter.route("/register").post(
    (req,res)=>new UserController().registerU(req,res)
)

userRouter.route("/registernastavnik").post(
    (req,res)=>new UserController().registerN(req,res)
)

userRouter.route("/login").post(
    (req,res)=>new UserController().login(req,res)
)

userRouter.route("/getucenik").post(
    (req,res)=>new UserController().getucenik(req,res)
)

userRouter.route("/getnastavnik").post(
    (req,res)=>new UserController().getnastavnik(req,res)
)


userRouter.route("/updateucenik").post(
    (req,res)=>new UserController().updateucenik(req,res)
)

userRouter.route("/updatenastavnik").post(
    (req,res)=>new UserController().updatenastavnik(req,res)
)

userRouter.route("/getnastavniciporazred").post(
    (req,res)=>new UserController().getnastavniciporazred(req,res)
)


userRouter.route("/nastavnikpretraga").post(
    (req,res)=>new UserController().pretraganastavnik(req,res)
)

userRouter.route("/napravicas").post(
    (req,res)=>new UserController().cascreate(req,res)
)


userRouter.route("/dohvaticasove").post(
    (req,res)=>new UserController().casget(req,res)
)

userRouter.route("/odrzicas").post(
    (req,res)=>new UserController().odrzocas(req,res)
)

userRouter.route("/casgetdosije").post(
    (req,res)=>new UserController().casgetdosije(req,res)
)

userRouter.route("/potvrdicas").post(
    (req,res)=>new UserController().potvrdicas(req,res)
)

userRouter.route("/casgetpotvrda").post(
    (req,res)=>new UserController().casgetpotvrda(req,res)
)


userRouter.route("/casgetthree").post(
    (req,res)=>new UserController().casgetthree(req,res)
)

userRouter.route("/odrzicas").post(
    (req,res)=>new UserController().odrzi(req,res)
)

userRouter.route("/getdosije").post(
    (req,res)=>new UserController().casgetdosije(req,res)
)

userRouter.route("/getsvojeucenike").post(
    (req,res)=>new UserController().getsvojeucenike(req,res)
)

userRouter.route("/addpredmet").post(
    (req,res)=>new UserController().addpredmet(req,res)
)

userRouter.route("/getpredmeti").post(
    (req,res)=>new UserController().getpredmete(req,res)
)

userRouter.route("/potvrdipredmet").post(
    (req,res)=>new UserController().potvrdipredmet(req,res)
)

userRouter.route("/potvrdinastavnika").post(
    (req,res)=>new UserController().potvrdipredmet(req,res)
)


userRouter.route("/getnastavnikered").post(
    (req,res)=>new UserController().getnastavnicired(req,res)
)


userRouter.route("/potvrdanastavnikaagain").post(
    (req,res)=>new UserController().PotvrdaNastavnika2(req,res)
)


userRouter.route("/allNastavnik").post(
    (req,res)=>new UserController().getAllNastavnik(req,res)
)

userRouter.route("/allUcenici").post(
    (req,res)=>new UserController().getAllUcenik(req,res)
)

userRouter.route("/allCasovi").post(
    (req,res)=>new UserController().getAllCasovi(req,res)
)

userRouter.route("/casoviseven").post(
    (req,res)=>new UserController().casgetseven(req,res)
)

userRouter.route("/casovimonth").post(
    (req,res)=>new UserController().casgetMonth(req,res)
)


userRouter.route("/updatepass").post(
    (req,res)=>new UserController().updatePassNoSafety(req,res)
)


userRouter.route("/getCasoviNastavnik").post(
    (req,res)=>new UserController().getCasoviNastavnika(req,res)
)


userRouter.route("/updateCas").post(
    (req,res)=>new UserController().updateCas(req,res)
)

userRouter.route("/updateSlika").post(
    (req,res)=>new UserController().updateSlika(req,res)
)

userRouter.route("/updateSlikaNastavnik").post(
    (req,res)=>new UserController().updateSlikaNastavnik(req,res)
)

userRouter.route("/updateCV").post(
    (req,res)=>new UserController().updateCV(req,res)
)


userRouter.route("/ucenikPotvrdjeni").post(
    (req,res)=>new UserController().ucenikGetPotvrdjeni(req,res)
)


userRouter.route("/otkaznotif").post(
    (req,res)=>new UserController().OtkazObavestenje(req,res)
)


userRouter.route("/potvrdanotif").post(
    (req,res)=>new UserController().PotvrdaObavestenje(req,res)
)


userRouter.route("/updatepassSafetyQ").post(
    (req,res)=>new UserController().updatePassSafety(req,res)
)


userRouter.route("/casgetALL").post(
    (req,res)=>new UserController().casgetAll(req,res)
)



userRouter.route("/mailchecknastavnik").post(
    (req,res)=>new UserController().mailcheck(req,res)
)















export default userRouter;