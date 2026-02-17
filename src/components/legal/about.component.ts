import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavBarComponent, CommonModule],
  template: `
    <div class="h-screen overflow-y-auto bg-white text-gray-800 custom-scrollbar">
      <app-nav-bar></app-nav-bar>
      
      <!-- Hero -->
      <div class="bg-gray-900 py-24 px-6 text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">About Time Capsuffle</h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          우리는 사라져가는 순간들을 영원히 기억될 수 있는 형태로 저장합니다.
        </p>
      </div>

      <div class="max-w-4xl mx-auto px-6 py-16">
        
        <!-- Mission -->
        <section class="mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-indigo-500 pl-4">Our Mission</h2>
          <p class="text-lg text-gray-600 leading-8 mb-6">
            디지털 시대에 우리는 수많은 사진을 찍고 메시지를 나누지만, 그 추억들은 금세 스크롤 뒤로 사라져 버립니다. 
            <strong>Time Capsuffle</strong>은 "순간의 가치"를 복원하기 위해 시작되었습니다.
          </p>
          <p class="text-lg text-gray-600 leading-8">
            우리의 목표는 물리적 거리와 시간의 한계를 넘어, 사람들이 함께 모여 추억을 '생산'하고 '보관'하며, 
            미래의 어느 시점에 다시 열어보며 감동을 느낄 수 있는 플랫폼을 만드는 것입니다.
          </p>
        </section>

        <!-- Values -->
        <section class="mb-16 grid md:grid-cols-3 gap-8">
           <div class="bg-gray-50 p-8 rounded-2xl">
              <div class="text-4xl mb-4">🔒</div>
              <h3 class="font-bold text-xl mb-2">Privacy First</h3>
              <p class="text-gray-500">사용자의 데이터는 암호화되어 보호되며, 원치 않는 공개를 방지합니다.</p>
           </div>
           <div class="bg-gray-50 p-8 rounded-2xl">
              <div class="text-4xl mb-4">🎨</div>
              <h3 class="font-bold text-xl mb-2">Creativity</h3>
              <p class="text-gray-500">단순 저장이 아닌, 캔버스 위에서 자유롭게 표현하는 창의성을 지지합니다.</p>
           </div>
           <div class="bg-gray-50 p-8 rounded-2xl">
              <div class="text-4xl mb-4">🤝</div>
              <h3 class="font-bold text-xl mb-2">Connection</h3>
              <p class="text-gray-500">혼자가 아닌 함께 만드는 경험을 통해 사람들을 연결합니다.</p>
           </div>
        </section>

        <!-- Team -->
        <section>
           <h2 class="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-indigo-500 pl-4">The Team</h2>
           <p class="text-gray-600 mb-8">
             Time Capsuffle은 웹 기술에 열정을 가진 개발자들과 디자이너들이 모여 만든 프로젝트입니다. 
             우리는 기술이 인간의 감성을 해치는 것이 아니라, 더 풍부하게 만들 수 있다고 믿습니다.
           </p>
           <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">TC</div>
              <div>
                 <p class="font-bold text-gray-900">Time Capsuffle Dev Team</p>
                 <p class="text-sm text-gray-500">Seoul, South Korea</p>
              </div>
           </div>
        </section>

      </div>
    </div>
  `
})
export class AboutComponent {}
