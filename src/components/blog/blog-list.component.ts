import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { BlogService } from '../../services/blog.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [NavBarComponent, RouterModule, CommonModule],
  template: `
    <div class="h-screen overflow-y-auto bg-gray-50 text-gray-800 custom-scrollbar">
      <app-nav-bar></app-nav-bar>
      
      <div class="bg-white border-b border-gray-200 py-16 md:py-24">
         <div class="max-w-7xl mx-auto px-6 text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Time Capsuffle Guide</h1>
            <p class="text-xl text-gray-500 max-w-2xl mx-auto">
               디지털 타임캡슐 활용법부터 추억을 더 아름답게 보관하는 팁까지.<br>
               다양한 이야기를 만나보세요.
            </p>
         </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
         <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (post of blogService.getPosts()(); track post.id) {
               <a [routerLink]="['/blog', post.id]" class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1">
                  <div class="h-56 overflow-hidden relative">
                     <img [src]="post.imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" [alt]="post.title">
                     <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm uppercase tracking-wide">
                        {{ post.category }}
                     </div>
                  </div>
                  <div class="p-6 flex flex-col flex-1">
                     <h2 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {{ post.title }}
                     </h2>
                     <p class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                        {{ post.excerpt }}
                     </p>
                     <div class="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                        <span>{{ post.date }}</span>
                        <span>{{ post.author }}</span>
                     </div>
                  </div>
               </a>
            }
         </div>
      </div>
    </div>
  `
})
export class BlogListComponent {
  blogService = inject(BlogService);
}
