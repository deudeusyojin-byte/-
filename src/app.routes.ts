import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CapsuleDetailComponent } from './components/capsule-detail/capsule-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // Home and Capsule pages are now accessible without login (Guard removed)
  { path: 'home', component: HomeComponent },
  { path: 'capsule/:id', component: CapsuleDetailComponent },
  { path: '**', redirectTo: 'home' }
];