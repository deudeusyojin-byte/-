import { Component, signal } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NavBarComponent, CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-screen overflow-y-auto bg-gray-50 text-gray-800 custom-scrollbar">
      <app-nav-bar></app-nav-bar>
      
      <div class="max-w-3xl mx-auto px-6 py-24">
        <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h1 class="text-3xl font-bold mb-2 text-gray-900">문의하기 (Contact Us)</h1>
          <p class="text-gray-500 mb-8">
            서비스 이용 중 궁금한 점, 제휴 제안, 혹은 오류 신고가 있다면 언제든 연락해주세요.<br>
            Time Capsuffle 팀은 여러분의 소중한 의견을 기다립니다.
          </p>

          @if (isSubmitted()) {
             <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-10 text-center animate-fade-in my-8">
                <div class="text-5xl mb-4">📨</div>
                <h3 class="text-2xl font-bold text-indigo-900 mb-2">메일이 전송되었습니다!</h3>
                <p class="text-indigo-700 leading-relaxed">
                   담당자가 내용을 확인 후 입력하신 이메일로 최대한 빠르게 답변드리겠습니다.<br>
                   보통 영업일 기준 24시간 이내에 회신드립니다.
                </p>
                <button (click)="reset()" class="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">추가 문의하기</button>
             </div>
          } @else {
             <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                   <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">이메일 주소 <span class="text-red-500">*</span></label>
                      <input type="email" formControlName="email" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="your@email.com">
                   </div>
                   <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">문의 유형</label>
                      <select formControlName="type" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-gray-50 focus:bg-white">
                         <option value="general">일반 문의</option>
                         <option value="bug">오류/버그 신고</option>
                         <option value="partnership">비즈니스/제휴</option>
                         <option value="privacy">개인정보/계정</option>
                      </select>
                   </div>
                </div>

                <div>
                   <label class="block text-sm font-bold text-gray-700 mb-2">내용 <span class="text-red-500">*</span></label>
                   <textarea formControlName="message" rows="6" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-gray-50 focus:bg-white resize-none" placeholder="문의하실 내용을 자세히 적어주세요."></textarea>
                </div>

                <div class="bg-gray-50 p-4 rounded-xl text-xs text-gray-500 flex items-start gap-3 border border-gray-100">
                   <input type="checkbox" required class="mt-0.5 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                   <span class="leading-snug">문의 처리를 위해 입력하신 이메일 주소 및 문의 내용을 수집하는 것에 동의합니다. 수집된 정보는 문의 처리 완료 후 법령에 따른 보존 기간 동안 보관됩니다.</span>
                </div>

                <button type="submit" [disabled]="form.invalid" class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:-translate-y-1">
                   문의 메일 보내기
                </button>
             </form>
          }
          
          <div class="mt-12 pt-10 border-t border-gray-100 text-center">
             <p class="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Direct Contact</p>
             <a href="mailto:DEUSUNGJIN@GMAIL.COM" class="text-2xl md:text-3xl font-black text-indigo-600 hover:text-indigo-800 hover:underline transition font-mono break-all">
                DEUSUNGJIN@GMAIL.COM
             </a>
             <p class="text-gray-400 text-xs mt-4">
                * 폼 전송에 실패하거나 파일 첨부가 필요한 경우 위 메일로 직접 보내주세요.
             </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ContactComponent {
  isSubmitted = signal(false);
  fb = new FormBuilder();
  
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    type: ['general', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  submit() {
    if (this.form.valid) {
       // Simulate API call
       setTimeout(() => {
          this.isSubmitted.set(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
       }, 500);
    }
  }

  reset() {
     this.isSubmitted.set(false);
     this.form.reset({ type: 'general' });
  }
}
