import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ConsultComponent } from './components/consult/consult.component';
import { AnimousMasteryComponent } from './components/animous-mastery/animous-mastery.component';
import { SimulationComponent } from './components/simulation/simulation.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'consult', component: ConsultComponent, canActivate: [authGuard] },
  { path: 'animous-mastery', component: AnimousMasteryComponent, canActivate: [authGuard] },
  { path: 'simulacao', component: SimulationComponent, canActivate: [authGuard] },
  { path: 'calculators', loadComponent: () => import('./components/calculators/calculators.component').then(m => m.CalculatorsComponent), canActivate: [authGuard] },
  { path: 'analytics-test', loadComponent: () => import('./components/analytics-test/analytics-test.component').then(m => m.AnalyticsTestComponent) },
];
