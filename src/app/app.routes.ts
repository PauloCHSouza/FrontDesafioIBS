import { Routes } from '@angular/router';
import { ListaComponent } from './pessoas/lista/lista.component';
import { HomeComponent } from './home/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pessoas', component: ListaComponent },
];
