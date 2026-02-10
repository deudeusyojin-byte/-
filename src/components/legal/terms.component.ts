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
            <h2 class="text-2xl font-bold text-gray-900 mb-4">제 3 조 (서비스의 제공 및 변경)</h2>
            <p>서비스는 다음과 같은 업무를 수행합니다.</p>
            <ol class="list-decimal pl-5 space-y-2 mt-2">
              <li>디지털 타임캡슐 생성 및 보관</li>
              <li>실시간 캔버스 드로잉 및 미디어 업로드</li>
              <li>기타 서비스가 정하는 업무</li>
            </ol>
            <p class="mt-4">
              본 서비스는 P2P(Peer-to-Peer) 기술 및 브라우저 저장소(Local Storage)를 적극 활용하며, 
              사용자의 데이터 중 일부는 중앙 서버가 아닌 사용자의 기기에 저장될 수 있습니다. 
              사용자는 기기 변경, 브라우저 캐시 삭제 시 데이터가 유실될 수 있음을 인지해야 합니다.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">제 4 조 (회원의 의무)</h2>
            <p>회원은 다음 행위를 하여서는 안 됩니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>서비스에 게시된 정보의 변경</li>
              <li>서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            </ul>
          </section>
          
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
             <p class="text-sm">공고일자: 2024년 1월 1일 / 시행일자: 2024년 1월 1일</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}