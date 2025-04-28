import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ConsultComponent } from './components/consult/consult.component';
import { AnimousMasteryComponent } from './components/animous-mastery/animous-mastery.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'consult', component: ConsultComponent },
  { path: 'animous-mastery', component: AnimousMasteryComponent }
];
