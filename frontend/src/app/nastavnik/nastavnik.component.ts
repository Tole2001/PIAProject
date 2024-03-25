import { Component } from '@angular/core';
import { LoginservisService } from '../servisi/loginservis.service';
import { Nastavnik } from '../models/nastavnik';
import { Cas } from '../models/cas';
import { Helper } from '../models/helper';
import { Router } from '@angular/router';
import { Predmet } from '../models/predmet';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-nastavnik',
  templateUrl: './nastavnik.component.html',
  styleUrls: ['./nastavnik.component.css']
})
export class NastavnikComponent {
  constructor(private servis : LoginservisService, private router : Router, private cdr: ChangeDetectorRef ) {}

  where : number = 1
  displayCasovi : number = 1
  username : string = "nastavnik3"
  nastavnik : Nastavnik = new Nastavnik()
  edited : Nastavnik = new Nastavnik()
  selectedAges: string[] = [];
  casthree : Cas[] = []
  firstFiveElements: Cas[] = []
  casovizapotvrdu : Cas[] = []
  casovizaucenike : Cas[] = []
  ucenici : string[] = []
  ucenicinodupes : string[] = []
  helper : Helper[] = []
  predmeti : Predmet[] = []
  selectedPredmeti: string[] = []
  backend: string = "http://localhost:4000"
  imgRel: string = "http://localhost:4000"
  selectedFile: File | null = null;
  selectedPDF: File | null = null;
  imageUrl : string = ""
  pdfUrl : string = ""
  updatedpdfUrl : string = ""
  zaOpenPDF : string = ""
  mails : string[] = []
  allCasovi : Cas[] = []
  odbijenKomentar : string = ""

  ngOnInit(){
    this.where = 1
    this.username = "nastavnik3"
    let logged = localStorage.getItem("nastavnik")
    if(!logged){
      console.log("AM HERE")

      this.router.navigate(['login']);
    }else{
      this.username = logged
    }
    this.servis.getpredmeti(1).subscribe(data=>{
      if(data)this.predmeti = data

    })
    this.servis.getAllNastavnik().subscribe(nst=>{
      this.servis.getAllUcenici().subscribe(ucenici=>{
        for(let a of ucenici){
          this.mails.push(a.email)
        }
        for(let b of nst){
          this.mails.push(b.email)
        }
      })
    })
    this.servis.getnastavnik(this.username).subscribe(nst=>{
      this.nastavnik = nst
      this.imgRel += nst.profilePic
      this.zaOpenPDF = nst.CV
      this.pdfUrl = this.backend + nst.CV

    })
    this.selectedAges = []
    this.edited = new Nastavnik()
    this.servis.getpotvrda(this.username).subscribe(casovi =>{
      this.casovizapotvrdu = casovi


      for(let a of this.casovizapotvrdu){
        a.startDisplayTime = new Date(a.datumvreme)
        a.endDisplayTime = new Date(a.datumvremekraj)
        a.startDisplayTime.setHours(a.startDisplayTime.getHours() - 1)
        a.endDisplayTime.setHours(a.endDisplayTime.getHours() - 1)
        this.servis.getucenik(a.ucenik).subscribe(ucenik=>{
          if(ucenik){
            a.ucenikName = ucenik.name
            a.ucenikSurname = ucenik.surname
          }
        })
        if(a.endDisplayTime.getHours() - a.startDisplayTime.getHours() === 2){
          a.isduble = 1
        }
        this.servis.casget(1,a.ucenik).subscribe(data=>{
          if(data){
            let sum = 0
            let num = 0
            for(let cas of data){
              if(cas.ocena !== 0){
                num++;
                sum += cas.ocena
              }
            }
            if(num >= 3){
              a.avgOcena = sum/num
            }
          }
        })
      }
    })
    this.servis.casGETALL(this.username).subscribe(casovi=>{
      this.allCasovi = casovi
      this.allCasovi.sort((a, b) => {
        const dateA = new Date(a.datumvreme);
        const dateB = new Date(b.datumvreme);

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
      });
      this.allCasovi = this.allCasovi.filter(dt => new Date(dt.datumvreme) >= new Date())
      for(let a of this.allCasovi){

        a.startDisplayTime = new Date(a.datumvreme)
        a.startDisplayTime.setHours(a.startDisplayTime.getHours() - 1)

        this.servis.getucenik(a.ucenik).subscribe(ucenik=>{
          if(ucenik){
            a.ucenikName = ucenik.name
            a.ucenikSurname = ucenik.surname
          }
        })
      }
    })
    this.servis.getthree(this.username).subscribe(casovi =>{
      this.casthree = casovi
      //this.casthree = this.casthree.filter(dt => new Date(dt.datumvreme) >= new Date())
      for(let a of this.casthree){
        a.startDisplayTime = new Date(a.datumvreme)
        a.startDisplayTime.setHours(a.startDisplayTime.getHours() - 1)

        this.servis.getucenik(a.ucenik).subscribe(ucenik=>{
          if(ucenik){
            a.ucenikName = ucenik.name
            a.ucenikSurname = ucenik.surname
          }
        })
      }


    })
    this.servis.getsvojeucenike(this.username).subscribe(casovi=>{
      this.casovizaucenike = casovi
      for (let cas of this.casovizaucenike){
        this.ucenici.push(cas.ucenik)
      }
      this.ucenicinodupes = Array.from(new Set(this.ucenici))
      for (let ucenik of this.ucenicinodupes){
        let hlp = new Helper()
        hlp.ucenik = ucenik
        this.servis.getucenik(ucenik).subscribe(rez=>{
          hlp.fullname = rez.name + " " + rez.surname
        })


        this.helper.push(hlp)
      }

    })





  }

  updateCas(cas : Cas){
    if(cas.ocena>5 || cas.ocena < 0){
      alert("Ocena moze biti od 1 do 5 ")
      return
    }
    this.servis.updateCas(cas).subscribe(data=>{
      console.log(data.message)
    })
    for(let a of this.helper){
      if(a.ucenik === cas.ucenik){
        for(let b of a.casovi){
          if(cas.datumvreme === b.datumvreme){
            b.ocena = cas.ocena
            b.komentar = cas.komentar
            return
          }
        }
      }
    }

    //this.servis.getsvojeucenike(this.username).subscribe(casovi=>{
      //this.casovizaucenike = casovi
      //for (let cas of this.casovizaucenike){
       // this.ucenici.push(cas.ucenik)
      //}
      //this.ucenicinodupes = Array.from(new Set(this.ucenici))
      //this.helper = []
      //for (let ucenik of this.ucenicinodupes){
     //   let hlp = new Helper()
    //    hlp.ucenik = ucenik


      //  this.helper.push(hlp)
     // }

    //})
  }
  getAll(name : Helper){
    if(name.toggle){
      name.toggle = 0
    }else{

      name.toggle = 1
    }

  }


  changeWhere(b : number){
    this.where = b;
    if(b == 3){
      for(let hlp of this.helper){
        this.servis.getdosije(hlp.ucenik,this.username).subscribe(casovi=>{
          hlp.casovi = casovi
          for(let a of hlp.casovi){
            a.startDisplayTime = new Date(a.datumvreme)
            a.endDisplayTime = new Date(a.datumvremekraj)
            a.startDisplayTime.setHours(a.startDisplayTime.getHours() - 1)
            a.endDisplayTime.setHours(a.endDisplayTime.getHours() - 1)
          }
        })
      }
    }
  }


  changeDisplay(b : number){
    this.displayCasovi = b;
  }


  saveChanges(){
    if(this.selectedPredmeti.length === 0){
      this.edited.predmeti = this.nastavnik.predmeti
    }else{
      this.edited.predmeti = this.selectedPredmeti
    }
    this.edited.username = this.nastavnik.username
    if(this.edited.name  === "")this.edited.name = this.nastavnik.name
    if(this.edited.surname  === "")this.edited.surname = this.nastavnik.surname
    if(this.edited.adress  === "")this.edited.adress = this.nastavnik.adress
    if(this.edited.email  === ""){this.edited.email = this.nastavnik.email}else{
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.edited.email)) {
        alert("Format mail-a je los");
        this.edited = new Nastavnik()
        return;
      }
      if(this.mails.includes(this.edited.email)){
        alert("Mail je vec u upotrebi")
        this.edited = new Nastavnik()
        return
      }
    }
    if(this.edited.telephone  === ""){this.edited.telephone = this.nastavnik.telephone}else{
      const regex = /^[0-9]+$/
      if(!regex.test(this.edited.telephone)){
          alert("Telefon moraju biti brojevi");
          this.edited = new Nastavnik()
          return;
      }
    }
    if(this.selectedAges.length === 0){
      this.edited.razredi = this.nastavnik.razredi
    }else{
      this.edited.razredi = this.selectedAges
    }
    this.servis.updatenastavnik(this.edited).subscribe(data=>{
      if(data.message ===  "uspesnoupdated"){
        this.nastavnik.name = this.edited.name
        this.nastavnik.surname = this.edited.surname
        this.nastavnik.adress = this.edited.adress
        this.nastavnik.email = this.edited.email
        this.nastavnik.telephone = this.edited.telephone
        this.nastavnik.predmeti = this.edited.predmeti
        this.nastavnik.razredi = this.edited.razredi
        this.edited = new Nastavnik()
        this.mails = []
        this.servis.getAllNastavnik().subscribe(nst=>{
          this.servis.getAllUcenici().subscribe(ucenici=>{
            for(let a of ucenici){
              this.mails.push(a.email)
            }
            for(let b of nst){
              this.mails.push(b.email)
            }
          })
        })
      }
    })
    //this.servis.getnastavnik(this.username).subscribe(nst=>{
    //  this.nastavnik = nst
    //})
    //this.ngOnInit()

  }

  toggleAge(age: string) {
    if (this.selectedAges.includes(age)) {

      this.selectedAges = this.selectedAges.filter(item => item !== age);
    } else {
      // Dodaj uzrast ako ne postoji u nizu
      this.selectedAges.push(age);
    }


  }


  prihvatiCas(cas : Cas){
    this.servis.potvrdiCas(cas.datumvreme,this.username,1,cas._id).subscribe(data =>{

    })




    this.servis.getthree(this.username).subscribe(casovi =>{
      this.casthree = casovi
      this.casovizapotvrdu = this.casovizapotvrdu.filter(cs => cs._id !== cas._id);
      for(let a of this.casthree){
        a.startDisplayTime = new Date(a.datumvreme)
        a.startDisplayTime.setHours(a.startDisplayTime.getHours() - 1)
        this.servis.getucenik(a.ucenik).subscribe(ucenik=>{
          if(ucenik){
            a.ucenikName = ucenik.name
            a.ucenikSurname = ucenik.surname
          }
        })
      }
      this.servis.casGETALL(this.username).subscribe(casovi=>{
        this.allCasovi = casovi
        this.allCasovi.sort((a, b) => {
          const dateA = new Date(a.datumvreme);
          const dateB = new Date(b.datumvreme);

          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          return 0;
        });
        this.allCasovi = this.allCasovi.filter(dt => new Date(dt.datumvreme) >= new Date())
        for(let a of this.allCasovi){
          a.startDisplayTime = new Date(a.datumvreme)
          a.startDisplayTime.setHours(a.startDisplayTime.getHours() - 1)
          this.servis.getucenik(a.ucenik).subscribe(ucenik=>{
            if(ucenik){
              a.ucenikName = ucenik.name
              a.ucenikSurname = ucenik.surname
            }
          })
        }
      })


    })




  }

  odbijCas(cas : Cas){
    if(cas.komentar === ""){
      alert("Morate reci zasto ste odbili cas")
      return
    }
    this.servis.potvrdiCas(cas.datumvreme,this.username,2,cas._id).subscribe(data =>{

    })
    this.servis.updateCas(cas).subscribe(data=>{

    })
    this.casovizapotvrdu = this.casovizapotvrdu.filter(cs => cs._id !== cas._id);
    // this.servis.getpotvrda(this.username).subscribe(casovi =>{
    //   this.casovizapotvrdu = casovi
    //   for(let a of this.casovizapotvrdu){
    //     this.servis.casget(1,a.ucenik).subscribe(data=>{
    //       if(data){
    //         let sum = 0
    //         let num = 0
    //         for(let cas of data){
    //           if(cas.ocena !== 0){
    //             num++;
    //             sum += cas.ocena
    //           }
    //         }
    //         if(num >= 3){
    //           a.avgOcena = sum/num
    //         }
    //       }
    //     })
    //   }
    // })
    this.servis.getthree(this.username).subscribe(casovi =>{
      this.casthree = casovi
      for(let a of this.casthree){
        a.startDisplayTime = new Date(a.datumvreme)
        a.startDisplayTime.setHours(a.startDisplayTime.getHours() - 1)
        this.servis.getucenik(a.ucenik).subscribe(ucenik=>{
          if(ucenik){
            a.ucenikName = ucenik.name
            a.ucenikSurname = ucenik.surname
          }
        })
      }
      this.servis.casGETALL(this.username).subscribe(casovi=>{
        this.allCasovi = casovi
        this.allCasovi.sort((a, b) => {
          const dateA = new Date(a.datumvreme);
          const dateB = new Date(b.datumvreme);

          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          return 0;
        });
        this.allCasovi = this.allCasovi.filter(dt => new Date(dt.datumvreme) >= new Date())
        for(let a of this.allCasovi){
          a.startDisplayTime = new Date(a.datumvreme)
          a.startDisplayTime.setHours(a.startDisplayTime.getHours() - 1)
          this.servis.getucenik(a.ucenik).subscribe(ucenik=>{
            if(ucenik){
              a.ucenikName = ucenik.name
              a.ucenikSurname = ucenik.surname
            }
          })
        }
      })

    })

  }

  odrziCas(datum : Date, cas : Cas){
    cas.hidden = 0
    this.servis.odrziCas(datum,this.username,1).subscribe(data =>{

    })
    //this.servis.getpotvrda(this.username).subscribe(casovi =>{
    //  this.casovizapotvrdu = casovi
    //})

    this.servis.getsvojeucenike(this.username).subscribe(casovi=>{
      this.casovizaucenike = casovi
      for (let cas of this.casovizaucenike){
        this.ucenici.push(cas.ucenik)
      }
      this.ucenicinodupes = Array.from(new Set(this.ucenici))
      this.helper = []
      for (let ucenik of this.ucenicinodupes){
        let hlp = new Helper()
        hlp.ucenik = ucenik
        this.servis.getucenik(ucenik).subscribe(rez=>{
          hlp.fullname = rez.name + " " + rez.surname
        })

        this.helper.push(hlp)
      }

    })
    this.casthree = this.casthree.filter(dt => dt._id !== cas._id)
    this.allCasovi = this.allCasovi.filter(dt => dt._id !== cas._id)
    //this.servis.getthree(this.username).subscribe(casovi =>{
    //  this.casthree = casovi

    //})

  }


  otkazi(datum : Date, cas : Cas){
    cas.hidden = 0
    if(cas.komentar === ""){
      alert("Obrazlozenje zasto je otkazan")
      return
    }
    this.servis.odrziCas(datum,this.username,2).subscribe(data =>{

    })
    //this.servis.getpotvrda(this.username).subscribe(casovi =>{
    //  this.casovizapotvrdu = casovi
    //})
    this.servis.updateCas(cas).subscribe(data=>{

    })

    this.servis.getsvojeucenike(this.username).subscribe(casovi=>{
      this.casovizaucenike = casovi
      for (let cas of this.casovizaucenike){
        this.ucenici.push(cas.ucenik)
      }
      this.ucenicinodupes = Array.from(new Set(this.ucenici))
      this.helper = []
      for (let ucenik of this.ucenicinodupes){
        let hlp = new Helper()
        hlp.ucenik = ucenik
        this.servis.getucenik(ucenik).subscribe(rez=>{
          hlp.fullname = rez.name + " " + rez.surname
        })


        this.helper.push(hlp)
      }

    })
    this.casthree = this.casthree.filter(dt => dt._id !== cas._id)
    this.allCasovi = this.allCasovi.filter(dt => dt._id !== cas._id)
    //this.servis.getthree(this.username).subscribe(casovi =>{
    //  this.casthree = casovi

    //})

  }

  LogOut(){
    localStorage.clear()
    this.router.navigate([''])
  }

  toggleSelection(predmet: string) {
    if (this.selectedPredmeti.includes(predmet)) {
      this.selectedPredmeti = this.selectedPredmeti.filter(p => p !== predmet);
    } else {
      this.selectedPredmeti.push(predmet);
    }
  }

  openPdf() {
    if (this.pdfUrl) {
      console.log(this.pdfUrl)
      window.open(this.pdfUrl, '_blank');
    }
  }

  onImageSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    if (! this.selectedFile) {
      // If no file is selected (file input field is empty), set showPic to 0
      this.selectedFile = null; // Clear the selected file
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
            this.imgRel = this.backend + this.imageUrl
            this.edited.profilePic = this.imageUrl
            this.servis.updateSlikaNastavnik(this.nastavnik.username,this.imageUrl).subscribe(rez=>{

            })
          })

        } else {
          alert("Image dimensions are invalid:" + width + "x" + height)
          console.log("Image dimensions are invalid:", width, "x", height);
          this.selectedFile = null; // Clear the selected file
          return

        }
      };
    };

    fileReader.readAsDataURL(this.selectedFile!);


  }

  onPdfSelected(event: any): void {
    this.selectedPDF = event.target.files[0];
    if (!this.selectedPDF) {
      // If no file is selected (file input field is empty), reset selectedPDF and return
      this.selectedPDF = null;
      return;
    }
    if (this.selectedPDF.size > 3 * 1024 * 1024) {
      this.selectedPDF = null;
      alert("CV ne sme imati vise od 3MB");
      return;
    }
    this.uploadPDF().then(()=>{
      this.servis.updateCV(this.nastavnik.username,this.updatedpdfUrl).subscribe(rez=>{

      })
      this.zaOpenPDF = this.updatedpdfUrl
      this.pdfUrl = this.backend + this.updatedpdfUrl
    })



  }


  uploadTest(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.servis.uploadPicture(this.selectedFile!).subscribe(data => {
        if (data && data.filename) {
          console.log('File uploaded successfully.');
          this.imageUrl = data.filename;

          resolve();
        } else {
          reject(new Error('Upload failed'));
        }
      });
    });
  }


  uploadPDF(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.servis.uploadPicture(this.selectedPDF!).subscribe(data => {
        if (data && data.filename) {
          console.log('File uploaded successfully.');
          this.updatedpdfUrl = data.filename;
          console.log(this.updatedpdfUrl);

          resolve();
        } else {
          reject(new Error('Upload failed'));
        }
      });
    });
  }


  isWithinFifteenMinutes(dateTimeString: Date): boolean {
    let zahtevDateTime = new Date(dateTimeString);
    let currentDateTime = new Date();
    let differenceInMilliseconds = zahtevDateTime.getTime() - currentDateTime.getTime();
    let differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes <= 15 && differenceInMinutes > 0;
  }

  iswithin4Hurs(date : Date): boolean {
    let zahtevDateTime = new Date(date);
    let currentDateTime = new Date();
    let differenceInMilliseconds = zahtevDateTime.getTime() - currentDateTime.getTime();
    let differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    return differenceInHours <= 4 && differenceInHours > 0;
  }






}


//<div class="icon-wrapper">
//                      CV:
//                      <input class="btn-outline-dark " type="file" (change)="onPdfSelected($event)" accept=".pdf" />
//                      <mat-icon class="icon" fontIcon="edit"></mat-icon>
//                    </div>
