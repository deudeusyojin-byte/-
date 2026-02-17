import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [NavBarComponent, CommonModule],
  template: `
    <div class="h-screen overflow-y-auto bg-white text-gray-800 custom-scrollbar">
      <app-nav-bar></app-nav-bar>
      <div class="max-w-4xl mx-auto px-6 py-24">
        <h1 class="text-4xl font-bold mb-8 text-gray-900">개인정보처리방침 (Privacy Policy)</h1>
        
        <div class="prose prose-lg text-gray-600 space-y-8">
          <p>
            <strong>Time Capsuffle</strong>(이하 "서비스")은 사용자의 개인정보를 중요시하며, 
            대한민국의 "개인정보 보호법" 및 "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
            본 방침은 귀하가 서비스를 이용할 때 귀하의 개인정보가 어떻게 수집, 사용, 공유되는지 설명합니다.
          </p>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">1. 수집하는 개인정보 항목</h2>
            <p>서비스는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같은 최소한의 개인정보를 수집하고 있습니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li><strong>필수 수집항목:</strong> 아이디(Username), 닉네임(Display Name), 서비스 이용 기록, 접속 로그, 쿠키(Cookie), 접속 IP 정보</li>
              <li><strong>선택 수집항목:</strong> 이메일 주소 (문의 시)</li>
              <li><strong>개인정보 수집방법:</strong> 홈페이지(회원가입, 캡슐 생성), 생성형 AI 도구 사용 시 입력된 프롬프트</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">2. 개인정보의 수집 및 이용목적</h2>
            <p>서비스는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li><strong>서비스 제공:</strong> 타임캡슐 생성 및 보관, 실시간 협업 기능 제공, AI 이미지 생성 기능 제공</li>
              <li><strong>회원 관리:</strong> 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지</li>
              <li><strong>마케팅 및 광고:</strong> 신규 서비스 개발 및 맞춤 서비스 제공, 서비스의 유효성 확인, 접속 빈도 파악 (Google AdSense 등을 통한 광고 게재 포함)</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용기간</h2>
            <p>원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li>로그인 기록: 3개월 (통신비밀보호법)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">4. 쿠키(Cookie) 및 광고 식별자 사용</h2>
            <p>서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Google AdSense:</strong> 본 사이트는 수익 창출을 위해 Google AdSense를 사용합니다. Google 및 파트너는 쿠키를 사용하여 사용자의 본 사이트 및 다른 웹사이트 방문 기록을 바탕으로 광고를 게재할 수 있습니다.</li>
              <li>사용자는 광고 설정을 통해 개인화 광고를 선택 해제할 수 있습니다. (<a href="https://www.google.com/settings/ads" class="text-indigo-600 underline" target="_blank">Google 광고 설정</a>)</li>
            </ul>
          </section>

          <section>
             <h2 class="text-2xl font-bold text-gray-900 mb-4">5. 개인정보 보호책임자</h2>
             <p>서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
             <ul class="list-disc pl-5 space-y-2 mt-2">
                <li>이메일: contact&#64;timecapsuffle.com</li>
             </ul>
          </section>
          
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
             <p class="text-sm font-bold">본 방침은 2026년 2월 17일부터 시행됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}