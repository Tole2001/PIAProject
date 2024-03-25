import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginservisService } from '../servisi/loginservis.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private servis : LoginservisService){}


  username: string = ""
  password: string = ""
  type : number = 0
  message : string = ""


  login(){
    this.message = ""
    if(this.username === "" || this.password === "" || this.type === 0){
      this.message = "Popunite sva polja"
      return
    }
    this.message = ""
    this.servis.login(this.username, this.password,this.type).subscribe(
      data=>{
        console.log(data.message)
        if(data.message === "Neuspeh") {

          this.message = "Podaci nisu ispravno uneseni"
        }
        else {
          if(this.type == 1){
            localStorage.setItem("logged", this.username)
            this.router.navigate(['ucenik'])
          }else{
            localStorage.setItem("nastavnik", this.username)
            this.router.navigate(['nastavnik'])
          }

        }

      }
    )
  }




}
