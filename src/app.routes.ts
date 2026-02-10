import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CapsuleDetailComponent } from './components/capsule-detail/capsule-detail.component';
import { PrivacyComponent } from './components/legal/privacy.component';
import { TermsComponent } from './components/legal/terms.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'capsule/:id', component: CapsuleDetailComponent },
  
  // AdSense Requirements: Dedicated Legal Pages
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  
  { path: '**', redirectTo: 'home' }
];