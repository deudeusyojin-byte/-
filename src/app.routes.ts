import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CapsuleDetailComponent } from './components/capsule-detail/capsule-detail.component';
import { PrivacyComponent } from './components/legal/privacy.component';
import { TermsComponent } from './components/legal/terms.component';
import { AboutComponent } from './components/legal/about.component';
import { ContactComponent } from './components/legal/contact.component';
import { BlogListComponent } from './components/blog/blog-list.component';
import { BlogPostComponent } from './components/blog/blog-post.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'capsule/:id', component: CapsuleDetailComponent },
  { path: 'login', component: LoginComponent },
  
  // Information & Legal Pages (Critical for AdSense)
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  
  // Blog Section (Content Inventory)
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/:id', component: BlogPostComponent },
  
  { path: '**', redirectTo: 'home' }
];
