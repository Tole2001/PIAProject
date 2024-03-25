import { Component } from '@angular/core';
import { LoginservisService } from '../servisi/loginservis.service';
import { Ucenik } from '../models/ucenik';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private servis: LoginservisService, private router: Router) {}


  user: Ucenik = new Ucenik()
  gradeO : Number[] = [1,2,3,4,5,6,7,8]
  gradeH : Number[] = [1,2,3,4]
  selectedFile: File | null = null;
  image : string | undefined;
  showPic : number = 0
  imageUrl: string = ""
  pdfUrl: string = ""
  message: string = ""


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    console.log("Ovde sam TRI");
    if (! this.selectedFile) {

      this.showPic = 0;
      this.selectedFile = null;
      return;
    }
    console.log("Ovde sam TRI IPO");
    fileReader.onload = (e) => {
      const img = new Image();
      img.src = fileReader.result as string;
      console.log("Ovde sam DVA");
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        console.log("Ovde sam");
        if (width >= 100 && width <= 300 && height >= 100 && height <= 300) {
          console.log("Image dimensions are valid:", width, "x", height);
          this.message = ""
          this.showPic = 1;
        } else {
          console.log("Image dimensions are invalid:", width, "x", height);
          this.message = "Slika mora biti u regionu 100x100 i 300x300";
          this.showPic = 2;
          //this.selectedFile = null;
          //return

        }
      };
    };
    //if(this.showPic === 2)return
    fileReader.readAsDataURL(this.selectedFile!);
  }



  register(){
    if(this.showPic === 2){
      this.message = "Slika je loseg formata"
      return
    }
    if(this.selectedFile !== null){
      if(this.user.username === "" || this.user.name === "" || this.user.password === "" || this.user.surname === "" ||
        this.user.safetya === "" || this.user.safetyq === "" || this.user.adress === "" || this.user.email === "" || this.user.sex === "" || this.user.telephone === "" ||
        this.user.sex === "" || this.user.schooltype === "" || this.user.schoolgrade === 0 ){
          this.message = "Popunite sva polja"
          return
        }
        this.message = ""
        //this.user.picture = this.selectedFile;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const telephoneRegex = /^[0-9]+$/

        console.log("Email to validate:" + this.user.email);
        if (!emailRegex.test(this.user.email)) {
          this.message = "Format mail-a je los";
          return;
        }
        if (!passwordRegex.test(this.user.password)) {
          this.message = "Lozinka mora biti izmedju 6-10 karaktera da pocinje slovom da ima bar jedno veliko bar tri mala slova bar jedan broj i bar jedan specijalni znak "
          return;
        }
        if(!telephoneRegex.test(this.user.telephone)){
           this.message = "Telefon moraju biti brojevi"
          return
        }
      this.uploadTest().then(() => {
        this.user.profilePic = this.imageUrl
        this.servis.register(this.user).subscribe(
          data=>{
            if(data.message=="ok"){

              this.router.navigate(['login'])
            }else{
              console.log(data.message)
              this.message = data.message
            }
          }
        )

      });
      return

    }else{
      this.user.profilePic = "/uploads/default.jpg"
    }



    if(this.user.username === "" || this.user.name === "" || this.user.password === "" || this.user.surname === "" ||
    this.user.safetya === "" || this.user.safetyq === "" || this.user.adress === "" || this.user.email === "" || this.user.sex === "" || this.user.telephone === "" ||
    this.user.sex === "" || this.user.schooltype === "" || this.user.schoolgrade === 0 ){
      this.message = "Popunite sva polja"
      return
    }
    this.message = ""
    //this.user.picture = this.selectedFile;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telephoneRegex = /^[0-9]+$/
    console.log("Email to validate:" + this.user.email);
    if (!emailRegex.test(this.user.email)) {
      this.message = "Format mail-a je los";
      return;
    }

    if (!passwordRegex.test(this.user.password)) {
      console.log(this.user.surname)
      this.message = "Lozinka mora biti izmedju 6-10 karaktera da pocinje slovom da ima bar jedno veliko bar tri mala slova bar jedan broj i bar jedan specijalni znak "
      return;
    }
    if(!telephoneRegex.test(this.user.telephone)){
      this.message = "Telefon moraju biti brojevi"
      return
    }
    //alert(this.user.profilePic)
    this.servis.register(this.user).subscribe(
      data=>{
        if(data.message=="ok"){

          this.router.navigate(['login'])
        }else{
          console.log(data.message)
          this.message = "Username ili e-mail vec su u upotrebi"
        }
      }
    )
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

  show(){
    this.showPic = 1
  }


  fetchPdf(){
    const filename = '1707046306323.pdf'; // Replace with the actual filename
    this.servis.getPdfUrl(filename).subscribe(
      (response: Blob) => {
        this.pdfUrl = URL.createObjectURL(response);
        console.log(this.pdfUrl)
      },
      (error) => {
        console.error('Error fetching PDF:', error);
      }
    );
  }


}
