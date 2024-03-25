import { Component } from '@angular/core';
import { LoginservisService } from '../servisi/loginservis.service';
import { Router } from '@angular/router';
import { Ucenik } from '../models/ucenik';
import { Nastavnik } from '../models/nastavnik';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent {
  constructor(private router: Router, private servis : LoginservisService){}
  ucenik : Ucenik = new Ucenik()
  nast : Nastavnik = new Nastavnik()
  old: string = ""
  newpass : string = ""
  newpassAgain : string = ""
  user : string = ""
  message: string = ""
  where : number = 0
  usersafety: string = ""
  safetyanswer : string = ""
  safetyQ : string = ""
  safetyneed : string = ""
  newpassS : string = ""
  newpassAgainS : string = ""
  messageS: string = ""


  changePass(){

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
    if(this.old === "" || this.newpass === "" || this.newpassAgain === "" || this.user === ""){
      this.message = 'Popunite sva polja'
      //alert('Format sifre je los ispravi');
      return;
    }
    if (!passwordRegex.test(this.newpass)) {
      this.message = 'Format sifre je los ispravi'
      //alert('Format sifre je los ispravi');
      return;
    }
    if(this.newpassAgain !== this.newpass){
      this.message = "Molim vas da potvrda bude ista kao i sifra"
     //alert("Molim vas da potvrda bude ista kao i sifra")
      return;
    }
    this.servis.updatePassNoSafety(this.user,this.old,this.newpass).subscribe(data=>{
      if(data.message ===  "Uspesno promenjena lozinka"){
        alert(data.message)
        this.router.navigate(['login'])
      }else{
        this.message = data.message
      }
    })
  }

  changePassS(){
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
    if(this.newpassS === "" || this.newpassAgainS === ""){
      this.messageS = 'Popunite sva polja'
      //alert('Format sifre je los ispravi');
      return;
    }
    if (!passwordRegex.test(this.newpassS)) {
      this.messageS = 'Format sifre je los ispravi'
      //alert('Format sifre je los ispravi');
      return;
    }
    if(this.newpassAgainS !== this.newpassS){
      this.messageS = "Molim vas da potvrda bude ista kao i sifra"
     //alert("Molim vas da potvrda bude ista kao i sifra")
      return;
    }
    this.servis.updatePasSafety(this.usersafety,this.newpassS).subscribe(rez=>{
      if(rez.message === "Uspesno promenjena lozinka"){
        alert(rez.message)
        this.router.navigate(['login'])
      }else{
        this.messageS = rez.message
      }
    })
  }

  changeWhere(num : number){
    if(num === 2){
      this.servis.getucenik(this.usersafety).subscribe(ucenik=>{
        if(ucenik){
          this.ucenik = ucenik
          this.safetyneed = ucenik.safetya
          this.safetyQ = ucenik.safetyq
          this.where = num
        }else{
          this.servis.getnastavnik(this.usersafety).subscribe(nastavnik=>{
            if(nastavnik){
              this.nast = nastavnik
              this.safetyneed = nastavnik.safetya
              this.safetyQ = nastavnik.safetyq
              this.where = num
            }else{
              alert("Username ne postoji")
            }
          })
        }
      })
    }else if(num === 3){
      if(this.safetyneed === this.safetyanswer){
        this.where = num
      }else{
        alert("Odgovor je pogresan")
      }

    }else{
      this.where = num
    }

  }
}
