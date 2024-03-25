import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UcenikComponent } from './ucenik/ucenik.component';
import { NastavnikComponent } from './nastavnik/nastavnik.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { RegisternastavnikComponent } from './registernastavnik/registernastavnik.component';
import { NastavnikdetaljiComponent } from './nastavnikdetalji/nastavnikdetalji.component';
import { GuestComponent } from './guest/guest.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { NgChartsModule } from 'ng2-charts';
import { AdminLogInComponent } from './admin-log-in/admin-log-in.component';
import { MatIconModule } from '@angular/material/icon';
import { SpecialComponent } from './special/special.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ReactiveFormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UcenikComponent,
    NastavnikComponent,
    AdminComponent,
    RegisterComponent,
    RegisternastavnikComponent,
    NastavnikdetaljiComponent,
    GuestComponent,
    ChangepassComponent,
    AdminLogInComponent,
    SpecialComponent,
    ForgotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    MatIconModule,
    ReactiveFormsModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



