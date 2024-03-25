import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginservisService } from '../servisi/loginservis.service';
import { Nastavnik } from '../models/nastavnik';
import { Cas } from '../models/cas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nastavnikdetalji',
  templateUrl: './nastavnikdetalji.component.html',
  styleUrls: ['./nastavnikdetalji.component.css']
})
export class NastavnikdetaljiComponent {
  constructor(private route: ActivatedRoute, private servis : LoginservisService, private ruter : Router) {}
  username : string = ""
  nastavnik : Nastavnik = new Nastavnik()
  cas : Cas = new Cas()
  casovi : Cas[] = []
  ocene : number[] = []
  komentari : string[] = []
  isSpecialized : number = 0
  dupli : boolean = false
  message : string = ""
  succes : string = ""
  imgRel : string = ""
  backend: string = "http://localhost:4000"

  ngOnInit(){

    this.message=""
    this.isSpecialized  = 0
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.cas.nastavnik = this.username
    this.cas.ucenik = localStorage.getItem("logged")!
    this.servis.getnastavnik(this.username).subscribe(nst=>{
      this.nastavnik = nst
      if(this.nastavnik.predmeti.length == 1){
        this.isSpecialized  = 1
      }
      this.imgRel = this.backend +  nst.profilePic
    })
    this.servis.getCasoviNastavnika(this.username,1).subscribe(data=>{
      if(data){
        this.casovi = data
        this.casovi = this.casovi.filter(dt => dt.odrzan != 2)
        for(let b of data){
          if(b.ocena !== 0)this.ocene.push(b.ocena)
          if(b.komentar !== "")this.komentari.push(b.komentar)

        }
      }

    })



  }




  submitForm() {
    this.succes = ""
    let novi = new Date(this.cas.datumvreme);
    let begin = new Date(this.cas.datumvreme);
    if(novi < new Date()){
      this.message = "Cas ne moze biti u proslosti"
      return;
    }
    this.succes = ""
    console.log("Vreme pocetka:" + begin)
    if(this.cas.predmet === "" && this.nastavnik.predmeti.length !== 1){
      this.message = "Izaberite predmet"
      return;
    }
    if(this.nastavnik.predmeti.length === 1){
      this.cas.predmet = this.nastavnik.predmeti[0]
    }

    if(this.isWeekend(begin)){
      this.message = "Dont't work on weekends"
      return;
    }
    if(this.dupli){
      novi.setMinutes(novi.getMinutes() + 120);
    }else{
      novi.setMinutes(novi.getMinutes() + 60);
    }
    console.log("Vreme kraja:" + novi)
    if(begin.getHours() < 10){
      this.message = "Start time is before 10 AM"
      return;
    }

    if(novi.getHours() > 18 || (novi.getHours() == 18 && novi.getMinutes() !== 0)){
      this.message = "End time is after 6 PM"
      return;
    }
    //if(!this.checkWeek(begin,novi)){
    //  this.message = "Nema ove nedelje otvorenih termina"
    //  return;
    //}
    if(!this.checkDay(begin,novi)){
      this.message = "Nema danas otvorenih termina"
      return;
    }

    if(!this.isValidTime(novi)){
      this.message = "Cas mora biti ili na pola sata ili na okrugli sat ili na 15 minuta"
      return;
    }



    //novi.setHours(novi.getHours() + 1);
    //begin.setHours(begin.getHours() + 1);
    this.message=""
    //this.cas.datumvreme = begin
    ///this.cas.datumvremekraj = novi;
    this.cas.datumvreme = new Date(begin)
    this.cas.datumvremekraj = new Date(novi);
    this.cas.datumvreme.setHours(this.cas.datumvreme.getHours() + 1)
    this.cas.datumvremekraj.setHours(this.cas.datumvremekraj.getHours() + 1)
    if(this.checkForOverlap(this.cas.datumvreme,this.cas.datumvremekraj)){
      this.message = "Vec postoji cas u tom terminu"
      return;
    }
    this.message=""
    console.log("VREME POCETKA " +  this.cas.datumvreme.getHours() )
    this.servis.createcas(this.cas).subscribe(data=>{
      if(data.message === "ok"){
        //alert("Zahtev za cas je poslat")
        this.succes = "Zahtev za cas je poslat"
      }
    })
    this.servis.getCasoviNastavnika(this.username,1).subscribe(data=>{
      if(data){
        this.casovi = data
      }

    })

  }

  checkForOverlap(begin: Date, novi: Date): boolean {

    const beginTime = begin.getTime();
    const noviTime = novi.getTime();

    for (let cas of this.casovi) {
      const casDatumvreme = new Date(cas.datumvreme).getTime();
      const casDatumvremekraj = new Date(cas.datumvremekraj).getTime();


      if (
        (beginTime >= casDatumvreme && beginTime < casDatumvremekraj) ||
        (noviTime > casDatumvreme && noviTime <= casDatumvremekraj) ||
        (beginTime <= casDatumvreme && noviTime >= casDatumvremekraj)
      ) {
        console.log(cas.opis)
        //MORAS SAT DA DODAS JEDAN
        this.message = "Postoji cas u terminu od  " + cas.datumvreme  + "do " + cas.datumvremekraj
        return true;
      }
    }

    return false;
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  back(){
    this.ruter.navigate(['ucenik'])
  }

  checkDay(begin: Date, novi: Date) : boolean{
    const beginTime = begin.getTime();
    const noviTime = novi.getTime();
    const filteredCasovi : Cas[] = this.casovi.filter(cas => {
      let casDate  = new Date(cas.datumvreme);
      return casDate.getFullYear() === begin.getFullYear() &&
             casDate.getMonth() === begin.getMonth() &&
             casDate.getDate() === begin.getDate();
    });

    return this.hasOpening(filteredCasovi,begin,novi)




  }

  checkWeek(begin: Date, novi: Date) : boolean{
    let start = new Date(begin)
    let end = new Date(novi)
    let day = start.getDay()
    for(day;day <=5;day++){
      if(this.checkDay(start,end)){
        return true
      }
      start.setDate(start.getDate() + 1);
      end.setDate(end.getDate() + 1);
    }
    return false

  }



  hasOpening(filteredCasovi: Cas[],begin: Date, novi: Date): boolean {
    const openingStartTime = new Date(begin);
    openingStartTime.setHours(10, 0, 0);
    const openingEndTime = new Date(novi);
    openingEndTime.setHours(18, 0, 0);

    const sortedCasovi = filteredCasovi.sort((a, b) => {
      const timeA = new Date(a.datumvreme).getTime();
      const timeB = new Date(b.datumvreme).getTime();
      return timeA - timeB;
    });


    for (let i = 0; i < sortedCasovi.length - 1; i++) {
      const currentEnd = new Date(sortedCasovi[i].datumvremekraj);
      const nextStart = new Date(sortedCasovi[i + 1].datumvreme);
      currentEnd.setHours(currentEnd.getHours() - 1)
      nextStart.setHours(nextStart.getHours() - 1)
      const timeDiffMinutes = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);

      if (timeDiffMinutes >= 60) {
        return true;
      }
    }
    if(sortedCasovi.length === 0){
      return true
    }
    const lastAppointmentEnd = new Date(sortedCasovi[sortedCasovi.length - 1].datumvremekraj);
    lastAppointmentEnd.setHours(lastAppointmentEnd.getHours() - 1)
    const timeDiffLastToClosing = (openingEndTime.getTime() - lastAppointmentEnd.getTime()) / (1000 * 60);
    return timeDiffLastToClosing >= 60;
  }


  isValidTime(time: Date): boolean {
    const selectedTime = new Date(time);
    const minutes = selectedTime.getMinutes();
    return minutes === 0 || minutes === 30 || minutes == 15 || minutes == 45;
  }
}




