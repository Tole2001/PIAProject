import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisternastavnikComponent } from './registernastavnik/registernastavnik.component';
import { NastavnikComponent } from './nastavnik/nastavnik.component';
import { UcenikComponent } from './ucenik/ucenik.component';
import { NastavnikdetaljiComponent } from './nastavnikdetalji/nastavnikdetalji.component';
import { AdminComponent } from './admin/admin.component';
import { GuestComponent } from './guest/guest.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { AdminLogInComponent } from './admin-log-in/admin-log-in.component';
import { SpecialComponent } from './special/special.component';
import { ForgotComponent } from './forgot/forgot.component';


const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "registernastavnik", component: RegisternastavnikComponent},
  {path: "ucenik", component:UcenikComponent},
  { path: 'nastavnikDetails/:username', component: NastavnikdetaljiComponent },
  {path: "nastavnik", component:NastavnikComponent},
  {path: "admin", component:AdminComponent},
  {path: "", component:GuestComponent},
  {path: "change", component:ChangepassComponent},
  {path: "loginAdmin", component:AdminLogInComponent},
  {path: "special", component:SpecialComponent},
  {path: "forgot", component:ForgotComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
