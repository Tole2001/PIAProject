import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginservisService } from '../servisi/loginservis.service';

@Component({
  selector: 'app-admin-log-in',
  templateUrl: './admin-log-in.component.html',
  styleUrls: ['./admin-log-in.component.css']
})
export class AdminLogInComponent {
  constructor(private router: Router, private servis : LoginservisService){}
  username: string = ""
  password: string = ""

  login(){

  }

}
