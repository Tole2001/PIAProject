import { Component } from '@angular/core';
import { LoginservisService } from '../servisi/loginservis.service';
import { Router } from '@angular/router';
import { Ucenik } from '../models/ucenik';
import { Nastavnik } from '../models/nastavnik';
import { Cas } from '../models/cas';


class NastavnikInfo{
  ime: string = "";
  prezime : string = "";
  predmet: string = "";
  username: string = "";
  visible : boolean = true;



  constructor(ime: string, prezime: string, predmet: string, user: string) {
    this.ime = ime;
    this.prezime = prezime;
    this.predmet = predmet;
    this.username = user
  }
}


@Component({
  selector: 'app-ucenik',
  templateUrl: './ucenik.component.html',
  styleUrls: ['./ucenik.component.css']
})
export class UcenikComponent {
  constructor(private servis : LoginservisService, private ruter : Router ){}
  loggedUcenik : Ucenik = new Ucenik()
  editedUcenik : Ucenik = new Ucenik()
  where : number = 0
  display : number = 0
  called : number = 0
  nastavnici : Nastavnik[] = []
  search : string = ""
  odrzani : Cas[] = []
  neodrzani : Cas[] = []
  potvrdaObavestenja : Cas[] = []
  odbijenObavestenja : Cas[] = []
  otkazObavestenja : Cas[] = []
  searchIme: string = '';
  searchPrezime: string = '';
  searchPredmet : string = '';

  imgRel: string = "http://localhost:4000"
  imgURL: string = "http://localhost:4000"
  selectedFile: File | null = null;
  imageUrl : string = ""
  mails : string[] = []
  tableainfo : NastavnikInfo[] = []

  ngOnInit(){
    this.imageUrl = ""
    this.selectedFile = null
    this.where = 1
    this.called = 0

    let logged = localStorage.getItem("logged")
    if(logged){
      this.servis.mailcheck().subscribe(nst=>{
        this.servis.getAllUcenici().subscribe(ucenici=>{
          for(let a of ucenici){
            this.mails.push(a.email)
          }
          for(let b of nst){
            this.mails.push(b.email)
          }
        })
      })

      this.servis.getucenik(logged).subscribe(user=>{
        this.loggedUcenik = user;
        this.editedUcenik = new Ucenik();
        this.imgRel += user.profilePic
        this.editedUcenik.profilePic = this.loggedUcenik.profilePic
        if(this.loggedUcenik.schooltype ==="osnovna" && this.loggedUcenik.schoolgrade < 5 ){
          this.servis.getnastavniciporazred(1).subscribe( nst =>{
            this.nastavnici = nst
            this.nastavnici.forEach((nastavnik) =>{
              console.log("EVO ME U NOVOM TESTU")
              nastavnik.predmeti.forEach((predmet) =>{
                this.tableainfo.push(new NastavnikInfo(nastavnik.name, nastavnik.surname, predmet,nastavnik.username));
              }

              )
            })
          })
        }else if(this.loggedUcenik.schooltype ==="osnovna"){
          this.servis.getnastavniciporazred(2).subscribe( nst =>{
            this.nastavnici = nst
            this.nastavnici.forEach((nastavnik) =>{
              nastavnik.predmeti.forEach((predmet) =>{
                this.tableainfo.push(new NastavnikInfo(nastavnik.name, nastavnik.surname, predmet,nastavnik.username));
              }

              )
            })
          })
        }else{

          this.servis.getnastavniciporazred(3).subscribe( nst =>{

            this.nastavnici = nst
            this.nastavnici.forEach((nastavnik) =>{
              nastavnik.predmeti.forEach((predmet) =>{
                this.tableainfo.push(new NastavnikInfo(nastavnik.name, nastavnik.surname, predmet,nastavnik.username));
              }

              )
            })
          })
        }




      })
      this.servis.casget(2,logged).subscribe(data=>{
        if(data){
          this.otkazObavestenja = data
          for(let b of data){
            b.startDisplayTime = new Date(b.datumvreme)
            b.startDisplayTime.setHours(b.startDisplayTime.getHours() - 1)
            b.endDisplayTime = new Date(b.datumvremekraj)
            b.endDisplayTime.setHours(b.endDisplayTime.getHours() - 1)
            this.servis.getnastavnik(b.nastavnik).subscribe(rez=>{
              b.name = rez.name
              b.surname = rez.surname
            })
          }
        }
      })
      this.servis.ucenikPotvrdjeni(logged,1).subscribe(rez=>{
        if(rez){
          this.potvrdaObavestenja = rez
          this.potvrdaObavestenja = this.potvrdaObavestenja.filter(fl => fl.odrzan === 0)
          for(let b of rez){

            b.startDisplayTime = new Date(b.datumvreme)
            b.startDisplayTime.setHours(b.startDisplayTime.getHours() - 1)
            b.endDisplayTime = new Date(b.datumvremekraj)
            b.endDisplayTime.setHours(b.endDisplayTime.getHours() - 1)
            this.servis.getnastavnik(b.nastavnik).subscribe(rez=>{
              b.name = rez.name
              b.surname = rez.surname
            })
          }
        }
      })
      this.servis.ucenikPotvrdjeni(logged,2).subscribe(rez=>{
        if(rez){
          this.odbijenObavestenja = rez
          for(let b of rez){
            b.startDisplayTime = new Date(b.datumvreme)
            b.startDisplayTime.setHours(b.startDisplayTime.getHours() - 1)
            b.endDisplayTime = new Date(b.datumvremekraj)
            b.endDisplayTime.setHours(b.endDisplayTime.getHours() - 1)
            this.servis.getnastavnik(b.nastavnik).subscribe(rez=>{
              b.name = rez.name
              b.surname = rez.surname
            })
          }
        }
      })
      this.servis.casget(1,logged).subscribe(data=>{
        if(data){
          this.odrzani = data
          for(let b of data){
            b.startDisplayTime = new Date(b.datumvreme)
            b.startDisplayTime.setHours(b.startDisplayTime.getHours() - 1)
            b.endDisplayTime = new Date(b.datumvremekraj)
            b.endDisplayTime.setHours(b.endDisplayTime.getHours() - 1)
            this.servis.getnastavnik(b.nastavnik).subscribe(rez=>{
              b.name = rez.name
              b.surname = rez.surname
            })


          }

        }
      })
      this.servis.ucenikPotvrdjeni(logged,1).subscribe(data=>{
        if(data){
          let currentDate = new Date();
          this.neodrzani = data.filter(dt=> dt.odrzan === 0 &&  new Date(dt.datumvreme) > currentDate)
          for(let b of this.neodrzani){
            b.startDisplayTime = new Date(b.datumvreme)
            b.startDisplayTime.setHours(b.startDisplayTime.getHours() - 1)
            b.endDisplayTime = new Date(b.datumvremekraj)
            b.endDisplayTime.setHours(b.endDisplayTime.getHours() - 1)
            this.servis.getnastavnik(b.nastavnik).subscribe(rez=>{
              b.name = rez.name
              b.surname = rez.surname
            })


          }
        }
      })

    }else {
      console.log("AM HERE")
      // If 'logged' is not set, navigate to the 'login' URL
      this.ruter.navigate(['login']);
    }
  }


  changeWhere(value: number): void {
    this.where = value;
  }

  saveChanges(){

    this.editedUcenik.username = this.loggedUcenik.username
    if(this.editedUcenik.name  === "")this.editedUcenik.name = this.loggedUcenik.name
    if(this.editedUcenik.surname  === "")this.editedUcenik.surname = this.loggedUcenik.surname
    if(this.editedUcenik.adress  === "")this.editedUcenik.adress = this.loggedUcenik.adress
    if(this.editedUcenik.email  === ""){
      this.editedUcenik.email = this.loggedUcenik.email
    }else{
      if(this.mails.includes(this.editedUcenik.email)){
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.editedUcenik.email)) {
          alert("Format mail-a je los");
          this.editedUcenik = new Ucenik()
          return;
        }
        alert("Mail je vec u upotrebi")
        this.editedUcenik = new Ucenik()
        return
      }
    }
    if(this.editedUcenik.telephone  === ""){this.editedUcenik.telephone = this.loggedUcenik.telephone}else{
      const regex = /^[0-9]+$/
      if(!regex.test(this.editedUcenik.telephone)){
          alert("Telefon moraju biti brojevi");
          this.editedUcenik = new Ucenik()
          return;
      }
    }
    if(this.editedUcenik.schooltype  === "")this.editedUcenik.schooltype = this.loggedUcenik.schooltype
    if(this.loggedUcenik.schooltype  === "osnovna" && this.editedUcenik.schooltype !== "osnovna" && this.editedUcenik.schooltype !== "" ){

      this.editedUcenik.schoolgrade = 1
    }else if(this.editedUcenik.schoolgrade == 0){
      this.editedUcenik.schoolgrade = this.loggedUcenik.schoolgrade
    }
    //this.editedUcenik.profilePic = this.loggedUcenik.profilePic

    this.servis.updateucenik(this.editedUcenik).subscribe(data=>{
      if(data.message === "uspesnoupdated"){
        console.log(this.editedUcenik.schoolgrade)
        console.log("USAO")
        this.loggedUcenik.name = this.editedUcenik.name
        this.loggedUcenik.surname = this.editedUcenik.surname
        this.loggedUcenik.adress = this.editedUcenik.adress
        this.loggedUcenik.email = this.editedUcenik.email
        this.loggedUcenik.telephone = this.editedUcenik.telephone
        this.loggedUcenik.schooltype = this.editedUcenik.schooltype
        this.loggedUcenik.schoolgrade = this.editedUcenik.schoolgrade
        this.editedUcenik = new Ucenik()
        this.mails = []
        this.servis.mailcheck().subscribe(nst=>{
          this.servis.getAllUcenici().subscribe(ucenici=>{
            for(let a of ucenici){
              this.mails.push(a.email)
            }
            for(let b of nst){
              this.mails.push(b.email)
            }
          })
        })
        if(this.loggedUcenik.schooltype ==="osnovna" && this.loggedUcenik.schoolgrade < 5 ){
          this.servis.getnastavniciporazred(1).subscribe( nst =>{
            console.log("USAO U OSNOVNA < 5")
            this.nastavnici = nst
            this.tableainfo = []
            console.log(this.nastavnici.length)
            this.nastavnici.forEach((nastavnik) =>{

              console.log("EVO ME U NOVOM TESTU")
              nastavnik.predmeti.forEach((predmet) =>{
                this.tableainfo.push(new NastavnikInfo(nastavnik.name, nastavnik.surname, predmet,nastavnik.username));
              }

              )
            })
          })
        }else if(this.loggedUcenik.schooltype ==="osnovna"){
          this.servis.getnastavniciporazred(2).subscribe( nst =>{
            this.nastavnici = nst
            this.tableainfo = []
            this.nastavnici.forEach((nastavnik) =>{
              console.log("EVO ME U NOVOM TESTU")
              nastavnik.predmeti.forEach((predmet) =>{
                console.log("EVO ME U NOVOM TESTU BROJ DVA")
                this.tableainfo.push(new NastavnikInfo(nastavnik.name, nastavnik.surname, predmet,nastavnik.username));
              }

              )
            })
          })
        }else{

          this.servis.getnastavniciporazred(3).subscribe( nst =>{
            this.tableainfo = []
            this.nastavnici = nst
            this.nastavnici.forEach((nastavnik) =>{
              console.log("EVO ME U NOVOM TESTU")
              nastavnik.predmeti.forEach((predmet) =>{
                this.tableainfo.push(new NastavnikInfo(nastavnik.name, nastavnik.surname, predmet,nastavnik.username));
              }

              )
            })
          })
        }
      }
    })







  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    if (! this.selectedFile) {

      this.selectedFile = null;
      return;
    }
    fileReader.onload = (e) => {
      const img = new Image();
      img.src = fileReader.result as string;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        if (width >= 100 && width <= 300 && height >= 100 && height <= 300) {
          console.log("Image dimensions are valid:", width, "x", height);
          this.uploadTest().then(()=>{
            this.imgRel = this.imgURL + this.imageUrl
            this.editedUcenik.profilePic = this.imageUrl
            this.servis.updateSlika(this.loggedUcenik.username,this.imageUrl).subscribe(rez=>{

            })
          })

        } else {
          alert("Dimenzije slike nisu u regionu 100x100 i 300x300:" + width + "x" + height)
          console.log("Image dimensions are invalid:", width, "x", height);
          this.selectedFile = null; // Clear the selected file
          return

        }
      };
    };

    fileReader.readAsDataURL(this.selectedFile!);

  }

  incrementSchoolGrade(){
    this.called = 1
    let num = this.loggedUcenik.schoolgrade

    if(this.loggedUcenik.schooltype  === "osnovna" && num == 8){
      alert("Ne moze se povecati razred dok se ne prebacite u srednju!!")
      this.editedUcenik.schoolgrade =  this.loggedUcenik.schoolgrade
      return;
    }
    if(num == 4 && this.loggedUcenik.schooltype !== "osnovna"){
      alert("Cetvrta godina srednje ne mozete povecavati godinu")
      this.editedUcenik.schoolgrade =  this.loggedUcenik.schoolgrade
      return
    }
    num++;
    this.editedUcenik.schoolgrade = num;


  }


  filterNastavnici(){
    this.tableainfo.forEach(nastavnik => {
      const imeMatch = this.searchIme ? nastavnik.ime.toLowerCase().includes(this.searchIme.toLowerCase()) : true;
      const prezimeMatch = this.searchPrezime ? nastavnik.prezime.toLowerCase().includes(this.searchPrezime.toLowerCase()) : true;
      const predmetMatch = this.searchPredmet ? nastavnik.predmet.toLowerCase().includes(this.searchPredmet.toLowerCase()) : true;

      nastavnik.visible = imeMatch && prezimeMatch && predmetMatch;
    });
  }



  sortByPrezime(ascending: boolean){
    this.tableainfo.sort((a, b) => {
      const nameA = a.prezime.toLowerCase();
      const nameB = b.prezime.toLowerCase();
      if (ascending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }


  sortByIme(ascending: boolean){
    this.tableainfo.sort((a, b) => {
      const nameA = a.ime.toLowerCase();
      const nameB = b.ime.toLowerCase();
      if (ascending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }


  sortByPredmet(ascending: boolean){
    this.tableainfo.sort((a, b) => {
      const nameA = a.predmet.toLowerCase();
      const nameB = b.predmet.toLowerCase();
      if (ascending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  LogOut(){
    localStorage.clear()
    this.ruter.navigate([''])
  }


  uploadTest(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.servis.uploadPicture(this.selectedFile!).subscribe(data => {
        if (data && data.filename) {
          console.log('File uploaded successfully.');
          this.imageUrl = data.filename;
          console.log(this.imageUrl);
          resolve();
        } else {
          reject(new Error('Upload failed'));
        }
      });
    });
  }


  OtkazObavestenje(cs : Cas){
    if(cs.otkazObavestenj === 0){
      this.servis.OtkazObavestenja(cs.ucenik,1,cs.datumvreme,cs._id).subscribe(rez=>{
        if(rez.message === "Notif Good"){
          cs.otkazObavestenj = 1
        }
      })
    }
  }

  PotvrdaObavestenje(cs : Cas){
    if (cs.potvrdaObavestenje === 0) {
      this.servis.PotvrdaObavestenja(cs.ucenik,1,cs.datumvreme,cs._id).subscribe(rez=>{
        if(rez.message === "Notif Good"){
          cs.potvrdaObavestenje = 1
        }
      })
    }
  }

  chagneDisplay(num : number){
    this.display = num
  }






}
