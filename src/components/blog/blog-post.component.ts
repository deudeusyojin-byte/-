import { Component, inject, signal, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { BlogService, BlogPost } from '../../services/blog.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [NavBarComponent, RouterModule, CommonModule],
  template: `
    <div class="h-screen overflow-y-auto bg-white text-gray-800 custom-scrollbar">
      <app-nav-bar></app-nav-bar>
      
      @if (post()) {
         <article class="max-w-3xl mx-auto px-6 py-24">
            <div class="mb-8 text-center">
               <span class="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wide">
                  {{ post()?.category }}
               </span>
               <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight break-keep">
                  {{ post()?.title }}
               </h1>
               <div class="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span>{{ post()?.author }}</span>
                  <span>•</span>
                  <span>{{ post()?.date }}</span>
               </div>
            </div>

            <div class="w-full h-80 md:h-96 rounded-3xl overflow-hidden mb-12 shadow-lg">
               <img [src]="post()?.imageUrl" class="w-full h-full object-cover">
            </div>

            <div class="prose prose-lg prose-indigo mx-auto text-gray-600 leading-relaxed" [innerHTML]="post()?.content"></div>
            
            <div class="mt-16 pt-10 border-t border-gray-100 flex justify-between items-center">
               <a routerLink="/blog" class="text-indigo-600 font-bold hover:underline flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  목록으로 돌아가기
               </a>
               
               <div class="flex gap-2">
                  <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                     🔗
                  </button>
               </div>
            </div>
         </article>
      } @else {
         <div class="h-[50vh] flex flex-col items-center justify-center">
            <h2 class="text-2xl font-bold text-gray-400 mb-4">게시글을 찾을 수 없습니다.</h2>
            <a routerLink="/blog" class="text-indigo-600 hover:underline">목록으로 돌아가기</a>
         </div>
      }
    </div>
  `
})
export class BlogPostComponent implements OnInit {
  route = inject(ActivatedRoute);
  blogService = inject(BlogService);
  post = signal<BlogPost | undefined>(undefined);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
       const id = params.get('id');
       if (id) {
          this.post.set(this.blogService.getPost(id));
       }
    });
  }
}
