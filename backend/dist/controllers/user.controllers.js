"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const ucenik_1 = __importDefault(require("../models/ucenik"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nastavnik_1 = __importDefault(require("../models/nastavnik"));
const cas_1 = __importDefault(require("../models/cas"));
const nastavnikcekanje_1 = __importDefault(require("../models/nastavnikcekanje"));
const predmet_1 = __importDefault(require("../models/predmet"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
class UserController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, type } = req.body;
                const user = yield user_1.default.findOne({ username, type });
                if (user) {
                    const isPasswordValid = yield bcrypt_1.default.compare(password, String(user.password));
                    if (isPasswordValid) {
                        res.json({ message: "Uspeh" });
                    }
                    else {
                        res.json({ message: "Neuspeh" });
                    }
                }
                else {
                    res.json({ message: "Neuspeh" });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.registerU = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let usernameP = req.body.username;
                let passwordP = yield bcrypt_1.default.hash(req.body.password, 10);
                let safetyqP = req.body.safetyq;
                let safetyaP = req.body.safetya;
                let nameP = req.body.name;
                let surnameP = req.body.surname;
                let sexP = req.body.sex;
                let adressP = req.body.adress;
                let telephoneP = req.body.telephone;
                let schooltypeP = req.body.schooltype;
                let schoolgradeP = req.body.schoolgrade;
                let emailP = req.body.email;
                let picturePathP = req.body.profilePic;
                const existingUser = yield ucenik_1.default.findOne({ $or: [{ username: usernameP }, { email: emailP }] });
                const existingNast = yield nastavnik_1.default.findOne({ $or: [{ username: usernameP }, { email: emailP }] });
                if (existingUser || existingNast) {
                    return res.json({ message: 'Username or email already exists' });
                }
                let ucenik = {
                    username: usernameP,
                    password: passwordP,
                    safetyq: safetyqP,
                    safetya: safetyaP,
                    name: nameP,
                    surname: surnameP,
                    sex: sexP,
                    adress: adressP,
                    telephone: telephoneP,
                    email: emailP,
                    schooltype: schooltypeP,
                    schoolgrade: schoolgradeP,
                    profilePic: picturePathP
                };
                let user = {
                    username: usernameP,
                    password: passwordP,
                    type: 1
                };
                yield Promise.all([
                    new ucenik_1.default(ucenik).save(),
                    new user_1.default(user).save(),
                ]);
                res.json({ message: 'ok' });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.registerN = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let usernameP = req.body.username;
                let passwordP = yield bcrypt_1.default.hash(req.body.password, 10);
                let safetyqP = req.body.safetyq;
                let safetyaP = req.body.safetya;
                let nameP = req.body.name;
                let surnameP = req.body.surname;
                let sexP = req.body.sex;
                let adressP = req.body.adress;
                let telephoneP = req.body.telephone;
                let emailP = req.body.email;
                let razrediP = req.body.razredi;
                let referencaP = req.body.referenca;
                let predmetiP = req.body.predmeti;
                let potvrdaP = req.body.potvrda;
                let picturePathP = req.body.profilePic;
                let CVp = req.body.CV;
                const existingUser = yield nastavnik_1.default.findOne({ $or: [{ username: usernameP }, { email: emailP }] });
                const existingUcenik = yield ucenik_1.default.findOne({ $or: [{ username: usernameP }, { email: emailP }] });
                if (existingUser || existingUcenik) {
                    return res.json({ message: 'Username or email already exists' });
                }
                let profa = {
                    username: usernameP,
                    password: passwordP,
                    safetyq: safetyqP,
                    safetya: safetyaP,
                    name: nameP,
                    surname: surnameP,
                    sex: sexP,
                    adress: adressP,
                    telephone: telephoneP,
                    email: emailP,
                    razredi: razrediP,
                    referenca: referencaP,
                    predmeti: predmetiP,
                    potvrda: potvrdaP,
                    profilePic: picturePathP,
                    CV: CVp
                };
                let user = {
                    username: usernameP,
                    password: passwordP,
                    type: 2
                };
                yield new nastavnik_1.default(profa).save();
                yield new user_1.default(user).save();
                res.json({ message: 'ok' });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.getucenik = (req, res) => {
            let username = req.body.username;
            ucenik_1.default.findOne({ username: username }).then(user => {
                res.json(user);
            }).catch(err => console.log(err));
        };
        this.getnastavnik = (req, res) => {
            let username = req.body.username;
            nastavnik_1.default.findOne({ username: username }).then(user => {
                res.json(user);
            }).catch(err => console.log(err));
        };
        this.updatenastavnik = (req, res) => {
            let username = req.body.username;
            nastavnik_1.default.updateOne({ username: username }, {
                name: req.body.name,
                surname: req.body.surname,
                adress: req.body.adress,
                email: req.body.email,
                telephone: req.body.telephone,
                razredi: req.body.razredi,
                predmeti: req.body.predmeti,
            }).then(books => {
                res.json({ message: "uspesnoupdated" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.updateucenik = (req, res) => {
            let username = req.body.username;
            ucenik_1.default.updateOne({ username: username }, {
                name: req.body.name,
                surname: req.body.surname,
                adress: req.body.adress,
                email: req.body.email,
                telephone: req.body.telephone,
                schooltype: req.body.schooltype,
                schoolgrade: req.body.schoolgrade,
            }).then(books => {
                res.json({ message: "uspesnoupdated" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.getnastavniciporazred = (req, res) => {
            let check;
            if (req.body.broj == 1) {
                check = "osnovna1-4";
            }
            else if (req.body.broj == 2) {
                check = "osnovna5-8";
            }
            else {
                check = "srednja";
            }
            nastavnik_1.default.find({ razredi: check, potvrda: 1 }).then(nst => {
                console.log('Nastavnici found:', nst);
                res.json(nst);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.pretraganastavnik = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let name_surname = req.body.name;
                const user = yield nastavnik_1.default.findOne({ name: name_surname });
                if (user) {
                    res.json(user);
                }
                else {
                    const user2 = yield nastavnik_1.default.findOne({ surname: name_surname });
                    if (user2) {
                        res.json(user2);
                    }
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.cascreate = (req, res) => {
            let cas = {
                predmet: req.body.predmet,
                nastavnik: req.body.nastavnik,
                ucenik: req.body.ucenik,
                opis: req.body.opis,
                datumvreme: new Date(req.body.datumvreme),
                datumvremekraj: new Date(req.body.datumvremekraj),
                odrzan: req.body.odrzan,
                komentar: req.body.komentar,
                potvrdjen: req.body.potvrdjen,
                ocena: req.body.ocena,
                potvrdaObavestenje: req.body.potvrdaObavestenje,
                otkazObavestenj: req.body.otkazObavestenj
            };
            new cas_1.default(cas).save().then(ok => {
                res.json({ message: "ok" });
            }).catch(err => {
                console.log(err);
            });
        };
        this.casget = (req, res) => {
            let param = req.body.number;
            let name = req.body.name;
            cas_1.default.find({ odrzan: param, ucenik: name }).sort({ datumvreme: 'desc' }).then(casovi => {
                res.json(casovi);
            }).catch(err => {
                console.log(err);
            });
        };
        this.casgetAll = (req, res) => {
            let name = req.body.name;
            cas_1.default.find({ potvrdjen: 1, odrzan: 0, nastavnik: name }).sort({ datumvreme: 1 }).then(casovi => {
                res.json(casovi);
            }).catch(err => {
                console.log(err);
            });
        };
        this.casgetthree = (req, res) => {
            let username = req.body.username;
            let param = req.body.number;
            let novi = new Date(req.body.datumvreme);
            novi.setDate(novi.getDate() + 3);
            novi.setHours(novi.getHours() + 8);
            cas_1.default.find({ datumvreme: {
                    $gte: req.body.datumvreme,
                    $lte: novi,
                }, potvrdjen: 1, odrzan: 0, nastavnik: username }).sort({ datumvreme: 1 }).then(casDocuments => {
                res.json(casDocuments);
            })
                .catch(error => {
                console.error(error);
            });
        };
        this.casgetpotvrda = (req, res) => {
            let name = req.body.name;
            cas_1.default.find({ potvrdjen: 0, nastavnik: name }).then(casovi => {
                res.json(casovi);
            }).catch(err => {
                console.log(err);
            });
        };
        this.casgetdosije = (req, res) => {
            let nastavnik = req.body.nastavnik;
            let ucenik = req.body.ucenik;
            let param = req.body.odrzao;
            cas_1.default.find({ nastavnik: nastavnik, odrzan: param, ucenik: ucenik }).then(casovi => {
                res.json(casovi);
            }).catch(err => {
                console.log(err);
            });
        };
        this.odrzocas = (req, res) => {
            let nastavnik = req.body.nastavnik;
            let vremeodrzavanja = req.body.datumvreme;
            let odrzi = req.body.potvrda;
            cas_1.default.updateOne({ nastavnik: nastavnik, datumvreme: vremeodrzavanja }, {
                odrzan: odrzi
            }).then(casovi => {
                res.json({ message: "odrzan je" });
            }).catch(err => {
                console.log(err);
            });
        };
        this.potvrdicas = (req, res) => {
            let nastavnik = req.body.nastavnik;
            let vremeodrzavanja = req.body.datumvreme;
            let potvrda = req.body.potvrda;
            cas_1.default.updateOne({ nastavnik: nastavnik, datumvreme: vremeodrzavanja, _id: req.body.id }, {
                potvrdjen: potvrda
            }).then(casovi => {
                res.json({ message: "potvrdjen" });
            }).catch(err => {
                console.log(err);
            });
        };
        this.odrzi = (req, res) => {
            let nastavnik = req.body.nastavnik;
            let vremeodrzavanja = req.body.datumvreme;
            let potvrda = req.body.potvrda;
            cas_1.default.updateOne({ nastavnik: nastavnik, datumvreme: vremeodrzavanja }, {
                odrzan: potvrda
            }).then(casovi => {
                res.json({ message: "potvrdjen" });
            }).catch(err => {
                console.log(err);
            });
        };
        this.getsvojeucenike = (req, res) => {
            let nastavnik = req.body.nastavnik;
            let odrzan = req.body.odrzan;
            cas_1.default.find({ nastavnik: nastavnik, odrzan: odrzan }).then(casovi => {
                console.log('Casovi found:', casovi);
                res.json(casovi);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getpredmete = (req, res) => {
            let potvrda = req.body.potvrdjen;
            predmet_1.default.find({ potvrdjen: potvrda }).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.potvrdipredmet = (req, res) => {
            let name = req.body.predmeti;
            let potvrda = req.body.potvrdjen;
            console.log("OVDESAM", name);
            console.log("OVDESAM", potvrda);
            predmet_1.default.updateOne({ predmet: name }, { potvrdjen: potvrda }).then(rez => {
                console.log("OVDESAM2");
                res.json({ message: "UbacenPrdemet" });
            }).catch(err => {
                console.log(err);
            });
        };
        this.addpredmet = (req, res) => {
            let name = req.body.predmeti;
            let param = req.body.param;
            let prdmt = {
                predmet: name,
                potvrdjen: param
            };
            console.log("OVDESAM", name);
            console.log("OVDESAM", param);
            new predmet_1.default(prdmt).save();
            res.json({ message: "Dodat predmet" });
        };
        this.getnastavnicired = (req, res) => {
            nastavnik_1.default.find({ potvrda: 0 }).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.potvrdinastavnika = (req, res) => {
            let user = req.body.username;
            let param = req.body.param;
            console.log("INSALLAHA", user);
            let nastavnik = nastavnikcekanje_1.default.findOne({ username: user });
            console.log("KEKEK", nastavnik);
            if (param) {
                new nastavnik_1.default(nastavnik).save();
            }
            nastavnikcekanje_1.default.deleteOne({ username: user });
            res.json({ message: "Nastavnik odradjen" });
        };
        this.PotvrdaNastavnika2 = (req, res) => {
            let user = req.body.username;
            let param = req.body.param;
            nastavnik_1.default.updateOne({ username: user }, { potvrda: param }).then(data => {
            }).catch(err => {
                console.log(err);
            });
        };
        this.getAllNastavnik = (req, res) => {
            nastavnik_1.default.find({ potvrda: 1 }).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.mailcheck = (req, res) => {
            nastavnik_1.default.find().then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getAllCasovi = (req, res) => {
            cas_1.default.find({ odrzan: 1 }).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getAllUcenik = (req, res) => {
            ucenik_1.default.find().then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.casgetseven = (req, res) => {
            let novi = new Date(req.body.datumvreme);
            novi.setDate(novi.getDate() - 7);
            cas_1.default.find({ datumvreme: {
                    $gte: novi,
                    $lte: req.body.datumvreme,
                }, odrzan: 1 }).sort({ datumvreme: 1 }).then(casDocuments => {
                res.json(casDocuments);
            })
                .catch(error => {
                console.error(error);
            });
        };
        this.casgetMonth = (req, res) => {
            let novi = new Date(req.body.datumvreme);
            novi.setDate(novi.getDate() - 31);
            cas_1.default.find({ datumvreme: {
                    $gte: novi,
                    $lte: req.body.datumvreme,
                }, odrzan: 1 }).sort({ datumvreme: 1 }).then(casDocuments => {
                res.json(casDocuments);
            })
                .catch(error => {
                console.error(error);
            });
        };
        this.updatePassNoSafety = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let old = req.body.old;
            let test = yield bcrypt_1.default.hash(req.body.old, 10);
            let novi = yield bcrypt_1.default.hash(req.body.new, 10);
            console.log(req.body.old);
            console.log(req.body.new);
            let user = req.body.user;
            console.log(req.body.user);
            const ucenik = yield ucenik_1.default.findOne({ username: user });
            const profa = yield nastavnik_1.default.findOne({ username: user, potvrda: 1 });
            const admin = yield user_1.default.findOne({ username: user });
            if (ucenik) {
                console.log(ucenik.password);
                console.log(test);
                const isPasswordValid = yield bcrypt_1.default.compare(old, String(ucenik.password));
                if (isPasswordValid) {
                    user_1.default.updateOne({ username: user }, { password: novi }).then(dt => {
                    });
                    ucenik_1.default.updateOne({ username: user }, { password: novi }).then(data => {
                        res.json({ message: "Uspesno promenjena lozinka" });
                    });
                    return;
                }
            }
            else if (profa) {
                const isPasswordValid = yield bcrypt_1.default.compare(old, String(profa.password));
                if (isPasswordValid) {
                    user_1.default.updateOne({ username: user }, { password: novi }).then(dt => {
                    });
                    nastavnik_1.default.updateOne({ username: user }, { password: novi }).then(data => {
                        res.json({ message: "Uspesno promenjena lozinka" });
                    });
                    return;
                }
            }
            else if (admin) {
                console.log(admin.username);
                console.log(admin.password);
                const isPasswordValid = yield bcrypt_1.default.compare(old, String(admin.password));
                console.log(isPasswordValid);
                if (isPasswordValid) {
                    user_1.default.updateOne({ username: user }, { password: novi }).then(dt => {
                        res.json({ message: "Uspesno promenjena lozinka" });
                    });
                    return;
                }
            }
            res.json({ message: "Sifra ili user nije dobro uneto" });
        });
        this.updatePassSafety = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let user = req.body.user;
            let pas = req.body.new;
            const ucenik = yield ucenik_1.default.findOne({ username: user });
            const profa = yield nastavnik_1.default.findOne({ username: user, potvrda: 1 });
            let novi = yield bcrypt_1.default.hash(req.body.new, 10);
            if (ucenik) {
                user_1.default.updateOne({ username: user }, { password: novi }).then(dt => {
                });
                ucenik_1.default.updateOne({ username: user }, { password: novi }).then(data => {
                    res.json({ message: "Uspesno promenjena lozinka" });
                });
                return;
            }
            else if (profa) {
                user_1.default.updateOne({ username: user }, { password: novi }).then(dt => {
                });
                nastavnik_1.default.updateOne({ username: user }, { password: novi }).then(data => {
                    res.json({ message: "Uspesno promenjena lozinka" });
                });
                return;
            }
            res.json({ message: "Sifra ili user nije dobro uneto" });
        });
        this.getCasoviNastavnika = (req, res) => {
            let name = req.body.name;
            let potvrda = req.body.id;
            cas_1.default.find({ nastavnik: name, potvrdjen: potvrda }).then(casovi => {
                res.json(casovi);
            }).catch(error => {
                console.error(error);
            });
        };
        this.updateCas = (req, res) => {
            let user = req.body.nastavnik;
            let begin = req.body.datumvreme;
            let end = req.body.datumvremekraj;
            let ocena = req.body.ocena;
            let kom = req.body.komentar;
            cas_1.default.updateOne({ nastavnik: user, datumvreme: begin, datumvremekraj: end, _id: req.body._id }, { ocena: ocena, komentar: kom }).then(rez => {
                res.json({ message: "Cas updated" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.updateSlika = (req, res) => {
            let user = req.body.user;
            let pic = req.body.pic;
            ucenik_1.default.updateOne({ username: user }, { profilePic: pic }).then(rez => {
                res.json({ message: "Slika updated" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.updateSlikaNastavnik = (req, res) => {
            let user = req.body.user;
            let pic = req.body.pic;
            nastavnik_1.default.updateOne({ username: user }, { profilePic: pic }).then(rez => {
                res.json({ message: "Slika updated" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.updateCV = (req, res) => {
            let user = req.body.user;
            let CV = req.body.CV;
            nastavnik_1.default.updateOne({ username: user }, { CV: CV }).then(rez => {
                res.json({ message: "CV updated" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.ucenikGetPotvrdjeni = (req, res) => {
            let user = req.body.user;
            let p = req.body.potvrda;
            cas_1.default.find({ ucenik: user, potvrdjen: p }).then(rez => {
                res.json(rez);
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.PotvrdaObavestenje = (req, res) => {
            let ucenik = req.body.user;
            let potvrda = req.body.potvrda;
            let datum = req.body.datum;
            cas_1.default.updateOne({ ucenik: ucenik, datumvreme: datum, _id: req.body.id }, { potvrdaObavestenje: potvrda }).then(rez => {
                res.json({ message: "Notif Good" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.OtkazObavestenje = (req, res) => {
            let ucenik = req.body.user;
            let potvrda = req.body.potvrda;
            let datum = req.body.datum;
            cas_1.default.updateOne({ ucenik: ucenik, datumvreme: datum, _id: req.body.id }, { otkazObavestenj: potvrda }).then(rez => {
                res.json({ message: "Notif Good" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
    }
}
exports.UserController = UserController;
