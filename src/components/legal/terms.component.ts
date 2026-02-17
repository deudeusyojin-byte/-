import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [NavBarComponent, CommonModule],
  template: `
    <div class="h-screen overflow-y-auto bg-white text-gray-800 custom-scrollbar">
      <app-nav-bar></app-nav-bar>
      <div class="max-w-4xl mx-auto px-6 py-24">
        <h1 class="text-4xl font-bold mb-8 text-gray-900">이용약관 (Terms of Service)</h1>
        
        <div class="prose prose-lg text-gray-600 space-y-8">
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">제 1 조 (목적)</h2>
            <p>
              이 약관은 Time Capsuffle(이하 "서비스")이 제공하는 타임캡슐 및 실시간 협업 관련 제반 서비스의 이용과 관련하여 
              회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">제 2 조 (정의)</h2>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li>"서비스"라 함은 구현되는 단말기(PC, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 Time Capsuffle 및 관련 제반 서비스를 의미합니다.</li>
              <li>"회원"이라 함은 서비스에 접속하여 이 약관에 따라 이용계약을 체결하고 서비스를 이용하는 고객을 말합니다.</li>
              <li>"캡슐"이라 함은 회원이 서비스 내에서 생성하고 데이터를 저장하는 가상의 공간을 의미합니다.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">제 3 조 (게시물의 저작권 및 책임)</h2>
            <p>회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
               <li>회원은 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
               <li>회원은 타인의 저작권, 초상권 등 권리를 침해하는 내용을 게시해서는 안 됩니다. 이에 대한 법적 책임은 전적으로 회원 본인에게 있습니다.</li>
               <li>회사는 회원이 게시하거나 등록하는 서비스 내의 내용물이 다음 각 호에 해당한다고 판단되는 경우에 사전통지 없이 삭제할 수 있습니다.</li>
               <ol class="list-decimal pl-5 mt-1 ml-4 text-sm">
                  <li>다른 회원 또는 제3자를 비방하거나 중상모략으로 명예를 손상시키는 내용인 경우</li>
                  <li>공공질서 및 미풍양속에 위반되는 내용인 경우</li>
                  <li>범죄적 행위에 결부된다고 인정되는 내용인 경우</li>
                  <li>회사의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 내용인 경우</li>
               </ol>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">제 4 조 (서비스 이용의 제한)</h2>
            <p>회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.</p>
          </section>

          <section>
             <h2 class="text-2xl font-bold text-gray-900 mb-4">제 5 조 (광고 게재)</h2>
             <p>회사는 서비스의 운영과 관련하여 서비스 화면, 홈페이지, 이메일 등에 광고를 게재할 수 있습니다. 회원은 서비스 이용 시 노출되는 광고 게재에 대해 동의합니다.</p>
          </section>
          
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
             <p class="text-sm font-bold">공고일자: 2026년 2월 17일 / 시행일자: 2026년 2월 17일</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}