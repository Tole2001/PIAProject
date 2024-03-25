import express from 'express';
import UserM from '../models/user';
import UcenikM from '../models/ucenik';
import bcrypt from 'bcrypt';
import NastavnikM from '../models/nastavnik';
import CasM from '../models/cas'
import NastavnikRedM from '../models/nastavnikcekanje'
import PredmetM from '../models/predmet'
import multer from 'multer';

const upload = multer();

export class UserController {

 

  login =  async (req: express.Request, res: express.Response)=>{
    try{
      const { username, password,type } = req.body;
      const user = await UserM.findOne({ username,type });
      if (user){
        const isPasswordValid = await bcrypt.compare(password,  String(user.password));

        if (isPasswordValid){
          res.json({message:"Uspeh"})
        }else{
          res.json({message:"Neuspeh"})
        }
      }else{
        res.json({message:"Neuspeh"})
      }
      
      
    }catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    
    
  }

  registerU = async (req: express.Request, res: express.Response) => {
    try {
      let usernameP = req.body.username;
      let passwordP = await bcrypt.hash(req.body.password, 10);
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
      const existingUser = await UcenikM.findOne({ $or: [{ username: usernameP }, { email: emailP }] });
      const existingNast = await NastavnikM.findOne({ $or: [{ username: usernameP }, { email: emailP }] });

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
        type : 1
      };

      await Promise.all([
        new UcenikM(ucenik).save(),
        new UserM(user).save(),
      ]);

      res.json({ message: 'ok' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  registerN = async (req: express.Request, res: express.Response) => {
    try {
      let usernameP = req.body.username;
      let passwordP = await bcrypt.hash(req.body.password, 10);
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
      let predmetiP = req.body.predmeti
      let potvrdaP = req.body.potvrda
      let picturePathP = req.body.profilePic;
      let CVp = req.body.CV;

      const existingUser = await NastavnikM.findOne({ $or: [{ username: usernameP }, { email: emailP }] });
      const existingUcenik = await UcenikM.findOne({ $or: [{ username: usernameP }, { email: emailP }] });

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
        profilePic:picturePathP,
        CV : CVp
      };

      let user = {
        username: usernameP,
        password: passwordP,
        type : 2
      };

      await new NastavnikM(profa).save();
      await new UserM(user).save();

      res.json({ message: 'ok' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  getucenik =  (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    UcenikM.findOne({username: username}).then(
      user=>{
          res.json(user)
      }
  ).catch(err=>console.log(err))
  }

  getnastavnik = (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    NastavnikM.findOne({username: username}).then(
      user=>{
          res.json(user)
      }
  ).catch(err=>console.log(err))


  }

  updatenastavnik = (req: express.Request, res: express.Response) =>{
    let username = req.body.username;
    NastavnikM.updateOne({username:username},{
      name: req.body.name,
      surname: req.body.surname,
      adress : req.body.adress,
      email : req.body.email,
      telephone:req.body.telephone,
      razredi : req.body.razredi,
      predmeti:req.body.predmeti,


    }).then(books=>{
      res.json({message: "uspesnoupdated"})
    }).catch((err)=>{
      console.log(err)
      res.json({message: "Fail"})
      })
  }

  updateucenik = (req: express.Request, res: express.Response) =>{
    let username = req.body.username;
    UcenikM.updateOne({username: username},{
      name: req.body.name,
      surname: req.body.surname,
      adress : req.body.adress,
      email : req.body.email,
      telephone:req.body.telephone,
      schooltype:req.body.schooltype,
      schoolgrade:req.body.schoolgrade,

    }).then(books=>{
      res.json({message: "uspesnoupdated"})
    }).catch((err)=>{
      console.log(err)
      res.json({message: "Fail"})
      })
  }
  
  getnastavniciporazred = (req: express.Request, res: express.Response) =>{
    let check
    if(req.body.broj == 1){
      check = "osnovna1-4"
    }else if(req.body.broj == 2){
      check = "osnovna5-8"
    }else{
      check = "srednja"
    }
    NastavnikM.find({ razredi: check, potvrda: 1 }).then(nst=>{
        console.log('Nastavnici found:', nst);
        res.json(nst)
    }).catch((err)=>{
        console.log(err)
    })
  }

  pretraganastavnik = async (req: express.Request, res: express.Response) =>{
    try{
      let name_surname = req.body.name
      const user =  await NastavnikM.findOne({name : name_surname})
      if(user){
        res.json(user)
      }else{
        const user2 = await NastavnikM.findOne({surname : name_surname})
        if(user2){
          res.json(user2)
        }
      }

    }catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    
  }

  cascreate =  (req: express.Request, res: express.Response) =>{
    
    let cas = {
      predmet : req.body.predmet,
      nastavnik : req.body.nastavnik,
      ucenik : req.body.ucenik,
      opis : req.body.opis,
      datumvreme : new Date(req.body.datumvreme),
      datumvremekraj : new Date(req.body.datumvremekraj),
      odrzan : req.body.odrzan,
      komentar : req.body.komentar,
      potvrdjen : req.body.potvrdjen,
      ocena : req.body.ocena,
      potvrdaObavestenje : req.body.potvrdaObavestenje,
      otkazObavestenj : req.body.otkazObavestenj
    }


    new CasM(cas).save().then(ok=>{
      res.json({message: "ok"})
  }).catch(err=>{
      console.log(err)
  })
  }

  casget = (req: express.Request, res: express.Response) =>{
    let param = req.body.number
    let name = req.body.name
    CasM.find({ odrzan: param, ucenik: name}).sort({ datumvreme: 'desc' }).then(casovi=>{
      res.json(casovi)
    }).catch(err=>{
      console.log(err)
  })
  }


  casgetAll = (req: express.Request, res: express.Response) =>{
    let name = req.body.name
    CasM.find({ potvrdjen: 1, odrzan: 0, nastavnik : name}).sort({ datumvreme: 1 }).then(casovi=>{
      res.json(casovi)
    }).catch(err=>{
      console.log(err)
  })
  }




  casgetthree = (req: express.Request, res: express.Response) =>{
    let username = req.body.username
    let param = req.body.number
    let novi = new Date(req.body.datumvreme);
    novi.setDate(novi.getDate() + 3)
    novi.setHours(novi.getHours() + 8)

    CasM.find({datumvreme: {
      $gte: req.body.datumvreme,
      $lte: novi,}, potvrdjen: 1, odrzan: 0, nastavnik : username}).sort({ datumvreme: 1 }).then(casDocuments => {
        res.json(casDocuments)
      })
      .catch(error => {
        console.error(error);
      });
  }

  casgetpotvrda = (req: express.Request, res: express.Response) =>{
    
    let name = req.body.name
    CasM.find({ potvrdjen: 0, nastavnik: name}).then(casovi=>{
      
      res.json(casovi)
    }).catch(err=>{
      console.log(err)
  })
  }


  casgetdosije = (req: express.Request, res: express.Response) =>{
    let nastavnik = req.body.nastavnik
    let ucenik = req.body.ucenik
    let param = req.body.odrzao
    CasM.find({  nastavnik: nastavnik, odrzan : param, ucenik : ucenik}).then(casovi=>{
      res.json(casovi)
    }).catch(err=>{
      console.log(err)
  })
  }

  odrzocas = (req: express.Request, res: express.Response) =>{
    let nastavnik = req.body.nastavnik
    let vremeodrzavanja = req.body.datumvreme
    let odrzi = req.body.potvrda
    CasM.updateOne({nastavnik: nastavnik, datumvreme: vremeodrzavanja},{
      odrzan: odrzi
    }).then(casovi=>{
      res.json({message : "odrzan je"})
    }).catch(err=>{
      console.log(err)
  })
  }

  potvrdicas = (req: express.Request, res: express.Response) =>{
    let nastavnik = req.body.nastavnik
    let vremeodrzavanja = req.body.datumvreme
    let potvrda = req.body.potvrda
    CasM.updateOne({nastavnik: nastavnik, datumvreme: vremeodrzavanja, _id: req.body.id},{
      potvrdjen: potvrda
    }).then(casovi=>{
      res.json({message : "potvrdjen"})
    }).catch(err=>{
      console.log(err)
  })
  }


  odrzi = (req: express.Request, res: express.Response) =>{
    let nastavnik = req.body.nastavnik
    let vremeodrzavanja = req.body.datumvreme
    let potvrda = req.body.potvrda
    CasM.updateOne({nastavnik: nastavnik, datumvreme: vremeodrzavanja},{
      odrzan: potvrda
    }).then(casovi=>{
      res.json({message : "potvrdjen"})
    }).catch(err=>{
      console.log(err)
  })
  }


  getsvojeucenike = (req: express.Request, res: express.Response) =>{
    let nastavnik = req.body.nastavnik
    let odrzan = req.body.odrzan
  
    CasM.find({nastavnik: nastavnik, odrzan : odrzan}).then(casovi=>{
      console.log('Casovi found:', casovi);
      res.json(casovi)
    }).catch(err=>{
      console.log(err)
  })
  }


  getpredmete = (req: express.Request, res: express.Response) =>{
    let potvrda = req.body.potvrdjen
    PredmetM.find({potvrdjen: potvrda}).then(rez=>{
      res.json(rez)
    }).catch(err=>{
      console.log(err)
  })
  }

  potvrdipredmet = (req: express.Request, res: express.Response) =>{
    let name = req.body.predmeti
    let potvrda = req.body.potvrdjen
    console.log("OVDESAM",name)
    console.log("OVDESAM",potvrda)
    PredmetM.updateOne({predmet:name}, {potvrdjen: potvrda}).then(rez=>{
      console.log("OVDESAM2")
      res.json({message: "UbacenPrdemet"})
    }).catch(err=>{
      console.log(err)
  })
  }

  addpredmet =  (req: express.Request, res: express.Response) =>{
    let name = req.body.predmeti
    let param = req.body.param

    let prdmt = {
      predmet : name,
      potvrdjen : param
    }
    console.log("OVDESAM",name)
    console.log("OVDESAM",param)

    new PredmetM(prdmt).save()

    res.json({message : "Dodat predmet"})
   
    
  }


  getnastavnicired = (req: express.Request, res: express.Response) =>{
    NastavnikM.find({potvrda: 0}).then(rez=>{
      res.json(rez)
    }).catch(err=>{
      console.log(err)
  })
  }

  potvrdinastavnika = (req: express.Request, res: express.Response) => {
    let user = req.body.username
    let param = req.body.param
    console.log("INSALLAHA", user)
    let nastavnik = NastavnikRedM.findOne({username : user})
    console.log("KEKEK", nastavnik)
    if(param){
      new NastavnikM(nastavnik).save()
    }
    

    NastavnikRedM.deleteOne({username : user})

    res.json({message : "Nastavnik odradjen"})
  }



  PotvrdaNastavnika2 = (req: express.Request, res: express.Response) => {
    let user = req.body.username
    let param = req.body.param
    NastavnikM.updateOne(
      {username : user},{potvrda: param}
    ).then(data=>{

    }
    ).catch(err=>{
      console.log(err)
  })
    
  }

  getAllNastavnik = (req: express.Request, res: express.Response) => {
    NastavnikM.find({potvrda : 1}).then(rez =>{
      res.json(rez)
    }).catch(err=>{
      console.log(err)
  })
  }

  mailcheck = (req: express.Request, res: express.Response) => {
    NastavnikM.find().then(rez =>{
      res.json(rez)
    }).catch(err=>{
      console.log(err)
  })
  }

  getAllCasovi = (req: express.Request, res: express.Response) => {
    CasM.find({ odrzan : 1}).then(rez =>{
      res.json(rez)
    }).catch(err=>{
      console.log(err)
  })
  }


  getAllUcenik = (req: express.Request, res: express.Response) => {
    UcenikM.find().then(rez =>{
      res.json(rez)
    }).catch(err=>{
      console.log(err)
  })
  }

  casgetseven = (req: express.Request, res: express.Response) =>{
    let novi = new Date(req.body.datumvreme);
    novi.setDate(novi.getDate() - 7)

    CasM.find({datumvreme: {
      $gte: novi,
      $lte: req.body.datumvreme,}, odrzan: 1}).sort({ datumvreme: 1 }).then(casDocuments => {
        res.json(casDocuments)
      })
      .catch(error => {
        console.error(error);
      });
  }

  casgetMonth = (req: express.Request, res: express.Response) =>{
    let novi = new Date(req.body.datumvreme);
    novi.setDate(novi.getDate() - 31)

    CasM.find({datumvreme: {
      $gte: novi,
      $lte: req.body.datumvreme,}, odrzan: 1}).sort({ datumvreme: 1 }).then(casDocuments => {
        res.json(casDocuments)
      })
      .catch(error => {
        console.error(error);
      });
  }

  updatePassNoSafety= async (req: express.Request, res: express.Response) =>{
    let old = req.body.old
    let test = await bcrypt.hash(req.body.old, 10);
    let novi = await bcrypt.hash(req.body.new, 10);
    console.log(req.body.old)
    console.log(req.body.new)
    let user = req.body.user
    console.log(req.body.user)
    const ucenik = await UcenikM.findOne({username: user})
    const profa = await NastavnikM.findOne({username: user, potvrda : 1})
    const admin = await UserM.findOne({username: user})
    if(ucenik){
      console.log(ucenik.password)
      console.log(test)
      const isPasswordValid = await bcrypt.compare(old, String(ucenik.password))
      if(isPasswordValid){
        UserM.updateOne({username: user},{password : novi}).then(dt=>{
          
        })
        UcenikM.updateOne({username: user},{password : novi}).then(data=>{
          res.json({message: "Uspesno promenjena lozinka"})
        })
        return;
      }
      
    }else if(profa){
      const isPasswordValid = await bcrypt.compare(old, String(profa.password))
      if(isPasswordValid){
        UserM.updateOne({username: user},{password : novi}).then(dt=>{
          
        })
        NastavnikM.updateOne({username: user},{password : novi}).then(data=>{
          res.json({message: "Uspesno promenjena lozinka"})
        })
        return;
      }
      
    }else if(admin){
      console.log(admin.username)
      console.log(admin.password)
      const isPasswordValid = await bcrypt.compare(old, String(admin.password))
      console.log(isPasswordValid)
      if(isPasswordValid){
        UserM.updateOne({username: user},{password : novi}).then(dt=>{
          res.json({message: "Uspesno promenjena lozinka"})
        })
        return
      }
    }
    res.json({message: "Sifra ili user nije dobro uneto"})
   
    

  }

  updatePassSafety= async (req: express.Request, res: express.Response) =>{
    let user = req.body.user
    let pas = req.body.new
    const ucenik = await UcenikM.findOne({username: user})
    const profa = await NastavnikM.findOne({username: user, potvrda : 1})
    let novi = await bcrypt.hash(req.body.new, 10);
    if(ucenik){
      UserM.updateOne({username: user},{password : novi}).then(dt=>{
          
      })
      UcenikM.updateOne({username: user},{password : novi}).then(data=>{
        res.json({message: "Uspesno promenjena lozinka"})
      })
      return;
      
    }else if(profa){
      UserM.updateOne({username: user},{password : novi}).then(dt=>{
          
      })
      NastavnikM.updateOne({username: user},{password : novi}).then(data=>{
        res.json({message: "Uspesno promenjena lozinka"})
      })
      return;
      
    }
    res.json({message: "Sifra ili user nije dobro uneto"})
  }

  getCasoviNastavnika  = (req: express.Request, res: express.Response) =>{
    let name = req.body.name;
    let potvrda = req.body.id
    CasM.find({nastavnik : name,potvrdjen : potvrda}).then(casovi=>{
      res.json(casovi)
    }).catch(error => {
      console.error(error);
    });
  }

  updateCas =(req: express.Request, res: express.Response) =>{
    let user = req.body.nastavnik
    let begin = req.body.datumvreme
    let end = req.body.datumvremekraj
    let ocena = req.body.ocena
    let kom = req.body.komentar
    CasM.updateOne({nastavnik: user,datumvreme:begin,datumvremekraj:end, _id : req.body._id},
      {ocena:ocena,komentar : kom }).then(rez=>{
        res.json({message:"Cas updated"})
      }).catch((err)=>{
        console.log(err)
        res.json({message: "Fail"})
        })
  }


  updateSlika =(req: express.Request, res: express.Response) =>{
    let user = req.body.user
    let pic = req.body.pic

    UcenikM.updateOne({username: user},{profilePic: pic}).then(rez=>{
      res.json({message:"Slika updated"})
    }).catch((err)=>{
      console.log(err)
      res.json({message: "Fail"})
      })


    
    
  }


  updateSlikaNastavnik =(req: express.Request, res: express.Response) =>{
    let user = req.body.user
    let pic = req.body.pic

    NastavnikM.updateOne({username: user},{profilePic: pic}).then(rez=>{
      res.json({message:"Slika updated"})
    }).catch((err)=>{
      console.log(err)
      res.json({message: "Fail"})
      })

    
  }


  updateCV =(req: express.Request, res: express.Response) =>{
    let user = req.body.user
    let CV = req.body.CV

    NastavnikM.updateOne({username: user},{CV: CV}).then(rez=>{
      res.json({message:"CV updated"})
    }).catch((err)=>{
      console.log(err)
      res.json({message: "Fail"})
      })

    
  }


  ucenikGetPotvrdjeni =(req: express.Request, res: express.Response) =>{
    let user = req.body.user
    let p = req.body.potvrda

    CasM.find({ucenik:user , potvrdjen: p}).then(rez=>{
      res.json(rez)
    }).catch((err)=>{
      console.log(err)
      res.json({message: "Fail"})
      })

  }


  PotvrdaObavestenje =(req: express.Request, res: express.Response) =>{
    let ucenik = req.body.user
    let potvrda = req.body.potvrda
    let datum = req.body.datum
    CasM.updateOne({ucenik: ucenik,datumvreme:datum, _id: req.body.id},
      {potvrdaObavestenje : potvrda}).then(rez=>{
        res.json({message:"Notif Good"})
      }).catch((err)=>{
        console.log(err)
        res.json({message: "Fail"})
        })

  }



  
  OtkazObavestenje =(req: express.Request, res: express.Response) =>{
    let ucenik = req.body.user
    let potvrda = req.body.potvrda
    let datum = req.body.datum
    CasM.updateOne({ucenik: ucenik,datumvreme:datum , _id: req.body.id},
      {otkazObavestenj : potvrda}).then(rez=>{
        res.json({message:"Notif Good"})
      }).catch((err)=>{
        console.log(err)
        res.json({message: "Fail"})
        })

  }



 






 


 





  

}
