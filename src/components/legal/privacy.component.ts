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
            "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
          </p>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">1. 수집하는 개인정보 항목</h2>
            <p>서비스는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같은 최소한의 개인정보를 수집하고 있습니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li>수집항목: 아이디(Username), 닉네임(Display Name), 브라우저 쿠키, 접속 로그</li>
              <li>개인정보 수집방법: 홈페이지(회원가입, 캡슐 생성)</li>
              <li>본 서비스는 사용자의 비밀번호를 서버에 평문으로 저장하지 않으며, 브라우저 로컬 스토리지 기반의 세션 관리를 수행합니다.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">2. 개인정보의 수집 및 이용목적</h2>
            <p>서비스는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li><strong>서비스 제공에 관한 계약 이행 및 서비스 제공:</strong> 콘텐츠 제공, 특정 맞춤 서비스 제공</li>
              <li><strong>회원 관리:</strong> 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용기간</h2>
            <p>원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li>보존 항목: 로그인 ID, 접속 로그</li>
              <li>보존 근거: 통신비밀보호법</li>
              <li>보존 기간: 3개월</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">4. 쿠키(Cookie)의 운용 및 거부</h2>
            <p>서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 쿠키는 웹사이트를 운영하는데 이용되는 서버(HTTP)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.</p>
          </section>
          
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
             <p class="text-sm">본 방침은 2024년 1월 1일부터 시행됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}