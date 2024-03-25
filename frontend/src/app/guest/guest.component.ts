import { Component } from '@angular/core';
import { LoginservisService } from '../servisi/loginservis.service';
import { Ucenik } from '../models/ucenik';
import { Nastavnik } from '../models/nastavnik';
import { Cas } from '../models/cas';

class NastavnikInfo{
  ime: string = "";
  prezime : string = "";
  predmet: string = "";
  visible : boolean = true;



  constructor(ime: string, prezime: string, predmet: string) {
    this.ime = ime;
    this.prezime = prezime;
    this.predmet = predmet;
  }
}

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent {
  constructor(private servis : LoginservisService){}
  ucenici : Ucenik[] = []
  nastavnici : Nastavnik[] = []
  casovi : Cas[] = []
  casovi7 : Cas[] = []
  casovi31 : Cas[] = []
  tableainfo : NastavnikInfo[] = []
  tableinfoHolder : NastavnikInfo[] = []
  searchIme: string = '';
  searchPrezime: string = '';
  searchPredmet: string = '';
  imageUrl: string = ""

  ngOnInit(){

    this.servis.getAllCasoviOdrzani().subscribe(data =>{
      if(data){
        this.casovi = data
      }
    })
    this.servis.getCasoviMonth().subscribe(data=>{
      if(data){
        this.casovi31 = data
        for(let b of this.casovi31){
          console.log(b.datumvreme)
        }
      }

    })
    this.servis.getCasoviSeven().subscribe(data=>{
      if(data)this.casovi7 = data
    })
    this.servis.getAllUcenici().subscribe(data => {
      if(data)this.ucenici = data
    })
    this.servis.getAllNastavnik().subscribe(data=>{
      this.nastavnici = data
      this.nastavnici.forEach((nastavnik) =>{
        nastavnik.predmeti.forEach((predmet) =>{
          this.tableainfo.push(new NastavnikInfo(nastavnik.name, nastavnik.surname, predmet));
        }

        )
      })
      this.tableinfoHolder = this.tableainfo


    })
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


  filterNastavnici(){
    this.tableainfo.forEach(nastavnik => {
      const imeMatch = this.searchIme ? nastavnik.ime.toLowerCase().includes(this.searchIme.toLowerCase()) : true;
      const prezimeMatch = this.searchPrezime ? nastavnik.prezime.toLowerCase().includes(this.searchPrezime.toLowerCase()) : true;
      const predmetMatch = this.searchPredmet ? nastavnik.predmet.toLowerCase().includes(this.searchPredmet.toLowerCase()) : true;

      nastavnik.visible = imeMatch && prezimeMatch && predmetMatch;
    });
  }


  fetchImage(): void {
    const filename = '1707042431780.jpg'; // Replace with the actual filename of the image
    this.servis.getImage(filename)
      .subscribe({
        next: (response: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.imageUrl = reader.result as string;
          };
          reader.readAsDataURL(response);
        },
        error: (error) => {
          console.error('Error fetching image:', error);
        }
      });
  }






}




