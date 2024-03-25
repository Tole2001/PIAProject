import { Component } from '@angular/core';
import { LoginservisService } from '../servisi/loginservis.service';
import { Nastavnik } from '../models/nastavnik';
import { Predmet } from '../models/predmet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registernastavnik',
  templateUrl: './registernastavnik.component.html',
  styleUrls: ['./registernastavnik.component.css']
})
export class RegisternastavnikComponent {

  constructor(private servis: LoginservisService,private router : Router) {}

  selectedAges: string[] = [];

  user: Nastavnik = new Nastavnik()

  firststep : number = 0
  predmeti : Predmet[] = []
  selectedPredmeti: string[] = []
  predmetToAdd : string = ""
  message: string = ""
  message2: string = ""
  selectedFile: File | null = null;
  selectedPDF: File | null = null;
  imageUrl: string = ""
  PDFUrl: string = ""
  showPic : number = 0
  showCV : number = 0

  ngOnInit(){
    this.imageUrl = ""
    this.PDFUrl = ""
    this.firststep = 0
    this.servis.getpredmeti(1).subscribe(data=>{
      if(data)this.predmeti = data

    })
  }

  goToSecondStep(){
    if(this.showPic === 2){
      this.message = "Slika je loseg formata"
      return
    }
    if(this.user.username === "" || this.user.name === "" || this.user.password === "" || this.user.surname === "" ||
    this.user.safetya === "" || this.user.safetyq === "" || this.user.adress === "" || this.user.email === "" || this.user.sex === "" || this.user.telephone === ""){
      this.message = "Popunite sva polja"
      return
    }
    this.message = ""
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log("Email to validate:" + this.user.email);
    const regex = /^[0-9]+$/

    if (!emailRegex.test(this.user.email)) {
      this.message = "Format mail-a je los";
      return;
    }

    if (!passwordRegex.test(this.user.password)) {
      this.message = "Format sifre je los"
      return;
    }
    if(!regex.test(this.user.telephone)){
      this.message = "Telefon moraju biti brojevi";
        return;
    }
    if(this.selectedFile !== null){
      this.uploadTest().then(() =>{
        this.user.profilePic = this.imageUrl
        //alert(this.user.profilePic)
        this.firststep++;
      })

    }else{
      this.user.profilePic = "/uploads/default.jpg"
      this.firststep++;
    }

  }

  toggleAge(age: string) {
    if (this.selectedAges.includes(age)) {
      // Ukloni uzrast ako već postoji u nizu
      this.selectedAges = this.selectedAges.filter(item => item !== age);
    } else {
      // Dodaj uzrast ako ne postoji u nizu
      this.selectedAges.push(age);
    }


  }

  back(){
    this.firststep = 0
  }

  showAlert() {
    this.message2 = ""
    this.user.razredi = this.selectedAges;
    this.user.predmeti = this.selectedPredmeti
    if(this.showCV === 2){
      this.message2 = "CV je prevelike velicine"
      return
    }
    //if(this.selectedPDF == null){
      //this.message2 = "Unesite CV"
      //return
    //  this.user.CV = "/uploads/CVHolder.pdf"

    //}
    if (this.selectedPredmeti.length === 0) {
      this.message2 = "Nema izabranih predmeta"

      return;
    }
    if (this.selectedAges.length === 0) {
      this.message2 = "Nema izabranih uzrasta"
      return;
    } else {
      if(!this.selectedPDF){
        this.user.CV = "/uploads/CVHolder.pdf"
        this.servis.registerN(this.user).subscribe(
          data=>{
            if(data.message=="ok"){
              this.firststep = 0;
              this.router.navigate(['login'])
            }else{
              this.message2 = "Username ili e-mail vec su u upotrebi"
            }
          }
        )
      }else{
        this.uploadPDF().then(() => {
          this.user.CV = this.PDFUrl
          this.servis.registerN(this.user).subscribe(
            data=>{
              if(data.message=="ok"){
                this.firststep = 0;
                this.router.navigate(['login'])
              }else{
                this.message2 = data.message
              }
            }
          )

        })
      }


    }

  }


  toggleSelection(predmet: string) {
    if (this.selectedPredmeti.includes(predmet)) {
      this.selectedPredmeti = this.selectedPredmeti.filter(p => p !== predmet);
    } else {
      this.selectedPredmeti.push(predmet);
    }
  }

  addPredmet(){
    if(this.predmetToAdd === ""){
      alert("Unesite Predmet")
    }else{
      this.servis.addpredmeti(this.predmetToAdd,0).subscribe(data=>{
        alert("Predmet dodat za razmatranje")
      })
    }
  }

  onFileSelected(event: any) {
    if(!event.target.files[0]){
      this.showPic = 0;
      this.selectedFile = null;
      this.selectedPDF = null
      return
    }
    if(event.target.files[0].type  === 'application/pdf'){
      this.selectedPDF = event.target.files[0];
      if (!this.selectedPDF) {
        // If no file is selected (file input field is empty), reset selectedPDF and return
        this.selectedPDF = null;
        this.showCV = 0
        return;
      }
      if (this.selectedPDF.size > 3 * 1024 * 1024) {

        this.selectedPDF = null;
        this.showCV = 2
        this.message2 = "CV ne sme imati vise od 3MB";

        //return;
      }else{
        this.showCV = 1
        this.message2 = ""
      }

    }else{
      this.selectedFile = event.target.files[0];
      const fileReader = new FileReader();

      if (! this.selectedFile) {
        // If no file is selected (file input field is empty), set showPic to 0
        this.showPic = 0;
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
            this.message = ""
            this.showPic = 1; // Optionally show the image preview
          } else {
            this.message = "Slika mora biti u regionu 100x100 i 300x300";
            this.showPic = 2; // Optionally hide the image preview
            this.selectedFile = null; // Clear the selected file
            //return

          }
        };
      };
      //if(this.showPic === 2)return
      fileReader.readAsDataURL(this.selectedFile!);
  }
    //this.selectedFile = event.target.files[0];
  }


  uploadTest(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.servis.uploadPicture(this.selectedFile!).subscribe(data => {
        if (data && data.filename) {
          console.log('File uploaded successfully.');
          this.imageUrl = data.filename;
          console.log(this.imageUrl);
          resolve(); // Resolve the Promise when upload is completed
        } else {
          reject(new Error('Upload failed')); // Reject the Promise if upload fails
        }
      });
    });
  }


  uploadPDF(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.servis.uploadPicture(this.selectedPDF!).subscribe(data => {
        if (data && data.filename) {
          console.log('File uploaded successfully.');
          this.PDFUrl = data.filename;
          console.log(this.imageUrl);
          resolve(); // Resolve the Promise when upload is completed
        } else {
          reject(new Error('Upload failed')); // Reject the Promise if upload fails
        }
      });
    });
  }

}
