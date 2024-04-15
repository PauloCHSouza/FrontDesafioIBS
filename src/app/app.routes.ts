import { Routes } from '@angular/router';
import { ListaComponent } from './pessoas/lista/lista.component';
import { HomeComponent } from './home/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'pessoas', component: ListaComponent, canActivate: [AuthGuard] },
];
