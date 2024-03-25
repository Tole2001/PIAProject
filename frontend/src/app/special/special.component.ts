import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginservisService } from '../servisi/loginservis.service';
import { User } from '../models/user';

@Component({
  selector: 'app-special',
  templateUrl: './special.component.html',
  styleUrls: ['./special.component.css']
})
export class SpecialComponent {
  constructor(private router: Router, private servis : LoginservisService){}
  username: string = ""
  password: string = ""
  type : number = 0
  message : string = ""
  new : User  = new User()


  login(){
    this.new = new User()
    this.message = ""
    if(this.username === "" && this.password === "" && this.type === 0){
      this.message = "Popunite sva polja"
      return
    }
    this.servis.login(this.username,this.password,3).subscribe(data=>{
      if(data.message === "Neuspeh") {
        this.message = "Podaci pogresno uneti"
      }
      else {
        localStorage.setItem("admin", this.username)
        this.router.navigate(['admin'])



      }
      //this.message = "Podaci pogresno uneti"
    })



  }

}
