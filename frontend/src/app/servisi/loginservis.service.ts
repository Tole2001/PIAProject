import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ucenik } from '../models/ucenik';
import { Message } from '../models/message';
import { Nastavnik } from '../models/nastavnik';
import { User } from '../models/user';
import { Cas } from '../models/cas';
import { Predmet } from '../models/predmet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginservisService {

  constructor(private http: HttpClient) { }

  register(user: Ucenik){


    return this.http.post<Message>("http://localhost:4000/users/register",user)
  }

  registerN(user: Nastavnik){
    return this.http.post<Message>("http://localhost:4000/users/registernastavnik",user)
  }


  login(username: string, password: string, type: number){
    const data={
      username: username,
      password: password,
      type : type
    }
    return this.http.post<Message>("http://localhost:4000/users/login", data)
  }

  getucenik(username: string){
    const data={
      username: username,

    }
    return this.http.post<Ucenik>("http://localhost:4000/users/getucenik", data)
  }


  updateucenik(u: Ucenik){

    return this.http.post<Message>("http://localhost:4000/users/updateucenik", u)
  }


  updatenastavnik(u: Nastavnik){

    return this.http.post<Message>("http://localhost:4000/users/updatenastavnik", u)
  }

  getnastavniciporazred(br : number){
    let data = {
      broj: br
    }
    return this.http.post<Nastavnik[]>("http://localhost:4000/users/getnastavniciporazred", data)
  }

  getnastavnik(user : string){
    let data = {
      username: user
    }
    return this.http.post<Nastavnik>("http://localhost:4000/users/getnastavnik", data)
  }

  searchnastavnik(name2 : string){
    let data = {
      name : name2
    }
    return this.http.post<Nastavnik[]>("http://localhost:4000/users/nastavnikpretraga", data)
  }

  createcas(cas : Cas){
    return this.http.post<Message>("http://localhost:4000/users/napravicas", cas)
  }


  casget(param : number, ime : string){
    let body= {
      number : param,
      name : ime
    }
    return this.http.post<Cas[]>("http://localhost:4000/users/dohvaticasove", body)
  }




  getthree(name : string){
    let body ={
      username: name,
      number : 1,
      datumvreme : new Date()
    }
    return this.http.post<Cas[]>("http://localhost:4000/users/casgetthree", body)

  }



  getpotvrda(name : string){
    let body ={
      name: name,


    }
    return this.http.post<Cas[]>("http://localhost:4000/users/casgetpotvrda", body)

  }

  potvrdiCas(datum : Date , name : string, potvrd : number, id : string){
    let body = {
      nastavnik : name,
      datumvreme : datum,
      potvrda : potvrd,
      id:id
    }
    return this.http.post<Message>("http://localhost:4000/users/potvrdicas", body)
  }



  odrziCas(datum : Date , name : string, potvrd : number){
    let body = {
      nastavnik : name,
      datumvreme : datum,
      potvrda : potvrd

    }
    return this.http.post<Message>("http://localhost:4000/users/odrzicas", body)
  }

  getsvojeucenike(name : string){
    let body ={
      nastavnik: name,
      odrzan : 1


    }
    return this.http.post<Cas[]>("http://localhost:4000/users/getsvojeucenike", body)

  }


  getdosije(ucenik : string, nastavnik : string){
    let body ={
      nastavnik: nastavnik,
      ucenik : ucenik,
      odrzao : 1


    }
    return this.http.post<Cas[]>("http://localhost:4000/users/getdosije", body)

  }

  getpredmeti(num : number){

    let body = {
      potvrdjen : num
    }
    return this.http.post<Predmet[]>("http://localhost:4000/users/getpredmeti", body)


  }

  addpredmeti(name : string, prm : number){
    let body = {
      predmeti : name,
      param : prm
    }
    return this.http.post<Message>("http://localhost:4000/users/addpredmet", body)
  }

  potvrdipredmet(name : string, prm : number){
    let body = {
      predmeti : name,
      potvrdjen : prm
    }
    return this.http.post<Message>("http://localhost:4000/users/potvrdipredmet", body)
  }

  nastavnikwait(){
    let body = {

    }

    return this.http.post<Nastavnik[]>("http://localhost:4000/users/getnastavnikered",body)
  }

  potvrdinastavnik(name : string, potvrda : number){
    let body = {
      username: name,
      param: potvrda
    }

    return this.http.post<Nastavnik[]>("http://localhost:4000/users/potvrdinastavnika",body)
  }



  potvrdinastavnikagain(name : string, potvrda : number){
    let body = {
      username: name,
      param: potvrda
    }

    return this.http.post<Nastavnik[]>("http://localhost:4000/users/potvrdanastavnikaagain",body)
  }

  getAllNastavnik(){
    let body = {}
    return this.http.post<Nastavnik[]>("http://localhost:4000/users/allNastavnik",body)
  }

  getAllCasoviOdrzani(){
    let body = {}
    return this.http.post<Cas[]>("http://localhost:4000/users/allCasovi",body)
  }


  getAllUcenici(){
    let body = {}
    return this.http.post<Ucenik[]>("http://localhost:4000/users/allUcenici",body)
  }


  getCasoviMonth(){
    let body = {
      datumvreme : new Date()
    }
    return this.http.post<Cas[]>("http://localhost:4000/users/casovimonth",body)
  }

  getCasoviSeven(){
    let body = {
      datumvreme : new Date()
    }
    return this.http.post<Cas[]>("http://localhost:4000/users/casoviseven",body)
  }


  updatePassNoSafety(user : string, old: string, nova: string){
    let body = {
      old : old,
      new : nova,
      user : user
    }
    return this.http.post<Message>("http://localhost:4000/users/updatepass",body)
  }


  getCasoviNastavnika(user : string, id : number){
    let body = {
      name : user,
      id : id
    }
    return this.http.post<Cas[]>("http://localhost:4000/users/getCasoviNastavnik",body)
  }


  uploadPicture(pic : File){
    const formData = new FormData();
    formData.append('profileImage', pic);


    return this.http.post<any>('http://localhost:4000/upload', formData)
  }


  uploadCV(){

  }


  getPdfUrl(filename: string): Observable<Blob> {
    return this.http.get('http://localhost:4000/pdf/' + filename, { responseType: 'blob' });
  }

  getImage(filename: string): Observable<Blob> {
    return this.http.get('http://localhost:4000/images/' + filename, { responseType: 'blob' });
  }

  updateCas(body : Cas){

    return this.http.post<Message>("http://localhost:4000/users/updateCas",body)
  }

  updateSlika(user : string, url:string){
    let body = {
      user: user,
      pic: url
    }
    return this.http.post<Message>("http://localhost:4000/users/updateSlika",body)
  }


  updateSlikaNastavnik(user : string, url:string){
    let body = {
      user: user,
      pic: url
    }
    return this.http.post<Message>("http://localhost:4000/users/updateSlikaNastavnik",body)
  }


  updateCV(user : string, url:string){
    let body = {
      user: user,
      CV: url
    }
    return this.http.post<Message>("http://localhost:4000/users/updateCV",body)
  }


  ucenikPotvrdjeni(user : string, url:number){
    let body = {
      user: user,
      potvrda: url
    }
    return this.http.post<Cas[]>("http://localhost:4000/users/ucenikPotvrdjeni",body)
  }


  PotvrdaObavestenja(user : string, url:number, datum: Date, id:string){
    let body = {
      user: user,
      potvrda: url,
      datum : datum,
      id:id
    }
    return this.http.post<Message>("http://localhost:4000/users/potvrdanotif",body)
  }


  OtkazObavestenja(user : string, url:number, datum : Date, id: string){
    let body = {
      user: user,
      potvrda: url,
      datum : datum,
      id : id
    }
    return this.http.post<Message>("http://localhost:4000/users/otkaznotif",body)
  }


  updatePasSafety(user : string,nova: string){
    let body = {
      new : nova,
      user : user
    }
    return this.http.post<Message>("http://localhost:4000/users/updatepassSafetyQ",body)
  }


  casGETALL(name : string){
    let body = {
      name : name
    }
    return this.http.post<Cas[]>("http://localhost:4000/users/casgetALL",body)
  }


  mailcheck(){
    let body = {

    }
    return this.http.post<Nastavnik[]>("http://localhost:4000/users/mailchecknastavnik",body)
  }






}
