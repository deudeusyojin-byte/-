import { Injectable, signal } from '@angular/core';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML content
  author: string;
  date: string;
  category: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  posts = signal<BlogPost[]>([
    {
      id: 'digital-capsule-guide',
      title: '디지털 타임캡슐로 친구들과 추억을 영원히 보관하는 방법',
      excerpt: '물리적인 타임캡슐은 잊어버리거나 훼손될 수 있습니다. 클라우드 기반의 디지털 타임캡슐이 왜 더 안전하고 감동적인지, 그리고 타임캡슈플을 200% 활용하는 방법을 소개합니다.',
      author: 'TimeCapsuffle Team',
      date: '2026.02.17',
      category: '가이드',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">어린 시절, 친구들과 함께 운동장 구석에 플라스틱 통을 묻었던 기억이 있으신가요? 편지와 장난감을 넣고 "10년 뒤에 열어보자"라고 약속했지만, 실제로 그 캡슐을 다시 찾은 사람은 많지 않을 것입니다. 도시 개발로 지형이 바뀌거나, 훼손되거나, 혹은 단순히 정확한 위치를 잊어버려서 소중한 추억이 땅속에서 사라지곤 하죠.</p>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">왜 디지털 타임캡슐인가요?</h2>
        <p class="mb-4 leading-8">디지털 시대에는 추억을 보관하는 방식도 근본적으로 달라져야 합니다. <strong>Time Capsuffle</strong>은 물리적 제약 없이 언제 어디서나 친구들과 함께 접속하여 사진, 동영상, 음성 메시지를 남길 수 있는 플랫폼입니다. 이는 단순한 클라우드 저장소가 아니라, '시간'이라는 맥락을 부여한 특별한 공간입니다.</p>
        <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li><strong>영구 보존과 안전성:</strong> 흙 속에 묻는 대신 안전한 서버에 암호화되어 저장됩니다. 습기나 곰팡이 걱정 없이, 100년 뒤에도 원본 그대로의 화질을 유지합니다.</li>
          <li><strong>멀티미디어 지원:</strong> 종이 편지뿐만 아니라, 그 시절 우리가 불렀던 노래, 친구들의 웃음소리, 짧은 댄스 영상을 생생하게 담을 수 있습니다. 텍스트로는 전달되지 않는 '분위기'를 저장하세요.</li>
          <li><strong>실시간 협업의 즐거움:</strong> 친구들이 동시에 접속해 캔버스를 꾸밀 수 있어, 만드는 과정 자체가 하나의 놀이이자 축제가 됩니다. 서로의 커서가 움직이는 것을 보며 "너 지금 뭐 그려?"라고 채팅하는 재미를 느껴보세요.</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">실시간 캔버스로 꾸미는 우리만의 공간</h2>
        <p class="mb-4 leading-8">타임캡슈플은 정해진 틀이 없습니다. 거대한 화이트보드 위에 스티커를 붙이고, 낙서를 하고, 사진을 겹쳐서 배치하며 자유로운 꼴라주(Collage)를 만들 수 있습니다. 마치 다이어리 꾸미기(다꾸)를 친구들과 함께 온라인에서 실시간으로 하는 것과 같은 경험을 제공합니다. 사진 위에 콧수염을 그리거나, 중요한 날짜에 형광펜을 칠해보세요.</p>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">안전한 보안과 프라이버시</h2>
        <p class="mb-6 leading-8">공개 캡슐 외에도, 비밀번호를 설정하여 우리끼리만 볼 수 있는 '시크릿 캡슐'을 만들 수 있습니다. 전송되는 모든 데이터는 암호화되며, 설정한 기간이 지나기 전까지는 타임캡슐이 봉인되어 열리지 않는 '잠금 기능'도 제공할 예정입니다. 여러분의 프라이버시는 우리의 최우선 가치입니다.</p>
        
        <div class="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500 my-8">
           <h3 class="font-bold text-indigo-900">💡 꿀팁: 1년 뒤의 나에게 편지 쓰기</h3>
           <p class="text-indigo-800 text-sm mt-2 leading-6">지금의 고민, 좋아하는 노래, 가장 친한 친구의 이름을 적어보세요. 1년 뒤 알림을 받고 다시 열어봤을 때, 과거의 나를 만나는 뭉클한 감동을 느낄 수 있습니다. 오늘의 내가 내일의 나에게 보내는 가장 따뜻한 응원이 될 것입니다.</p>
        </div>
      `
    },
    {
      id: 'psychology-of-nostalgia',
      title: '과거를 회상하는 것이 정신 건강에 주는 긍정적인 효과',
      excerpt: '단순히 과거에 머무르는 것이 아닙니다. 심리학 연구에 따르면 적절한 "향수(Nostalgia)"는 자존감을 높이고 미래를 살아갈 힘을 줍니다.',
      author: 'Dr. Memory',
      date: '2026.02.10',
      category: '인사이트',
      imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">힘들고 지칠 때 옛날 사진을 보며 저절로 미소 지어본 적이 있으신가요? 우리는 종종 "옛날이 좋았지"라고 말하곤 합니다. 과거에는 이것이 현실 도피나 퇴행적인 감정으로 여겨지기도 했지만, 최근 현대 심리학계에서는 <strong>노스탤지어(Nostalgia)</strong>가 가진 치유의 힘과 긍정적인 기능에 주목하고 있습니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">1. 사회적 유대감 강화 (Social Connectedness)</h2>
        <p class="mb-4 leading-8">추억은 혼자만의 것이 아니라 대부분 타인과의 관계 속에서 형성됩니다. 사우샘프턴 대학의 연구에 따르면, 노스탤지어를 경험할 때 사람들은 '사랑받고 있다', '보호받고 있다'는 느낌을 더 강하게 받습니다. 친구들과 함께 찍은 사진을 보고, 함께 들었던 음악을 공유하는 과정에서 우리는 "내가 혼자가 아니다"라는 강력한 사회적 지지감을 느낍니다. Time Capsuffle이 '실시간 협업'을 강조하는 이유도 바로 이 연결감을 극대화하기 위해서입니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">2. 자존감 회복과 정체성 확립</h2>
        <p class="mb-4 leading-8">과거의 성취나 행복했던 순간을 기록해두면, 현재의 시련을 겪을 때 큰 버팀목이 됩니다. "나는 사랑받았던 사람이고, 무언가를 해냈던 사람이다"라는 자기 효능감을 확인시켜주기 때문입니다. 타임캡슐은 단순한 데이터 저장소가 아니라, 자아 정체성(Identity)을 보관하는 은행과 같습니다. 내가 누구인지 잊어버릴 것 같을 때, 타임캡슐을 열어보세요.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">3. 미래를 위한 동기 부여</h2>
        <p class="mb-6 leading-8">아이러니하게도, 과거를 잘 정리하고 회상하는 것은 미래로 나아가는 힘이 됩니다. 소중한 기억을 안전하게 보관해두었다는 안도감은 현재에 더 집중할 수 있게 해줍니다. 또한, 과거의 긍정적인 경험은 "미래에도 좋은 일이 있을 것"이라는 낙관주의를 심어줍니다.</p>

        <p class="font-medium text-lg text-gray-800">지금 바로 당신의 소중한 순간을 기록하세요. 그것은 미래의 당신에게 보내는 가장 강력한 심리적 백신이자 응원 메시지가 될 것입니다.</p>
      `
    },
    {
      id: 'copyright-free-resources',
      title: '저작권 걱정 없는 무료 이미지 & 음원 사이트 추천 BEST 5',
      excerpt: '타임캡슐을 꾸밀 때 아무 이미지나 사용하면 안 됩니다. 안전하고 퀄리티 높은 무료 소스를 찾을 수 있는 사이트를 정리해 드립니다.',
      author: 'Content Creator',
      date: '2026.02.05',
      category: '팁 & 테크',
      imageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">나만의 타임캡슐을 예쁘게 꾸미고 싶지만, 인터넷 검색으로 나오는 이미지를 함부로 썼다가는 저작권 문제가 발생할 수 있습니다. 특히 공개 캡슐의 경우 불특정 다수에게 노출되므로 저작권 준수가 더욱 중요합니다. Time Capsuffle 사용자를 위해 상업적 이용까지 가능한 안전한 무료 리소스 사이트를 소개합니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Unsplash (이미지)</h2>
        <p class="mb-4 leading-8">감성적이고 고화질의 사진이 가장 많은 곳입니다. Time Capsuffle의 기본 배경 이미지들도 이곳의 리소스를 활용했습니다. 별도의 회원가입 없이 다운로드 가능하며, 출처 표기가 필수는 아니지만 작가를 위해 표기해 주는 것이 매너입니다. 'Film camera', 'Memories', 'Friends' 같은 키워드로 검색해보세요.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Pexels & Pixabay (이미지/영상)</h2>
        <p class="mb-4 leading-8">사진뿐만 아니라 짧은 클립 영상도 무료로 제공합니다. 타임캡슐에 생동감을 더하고 싶다면 Pexels에서 짧은 배경 영상을 찾아보세요. 세로형 영상도 많아 모바일 환경에 적합한 콘텐츠를 찾기 좋습니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Bensound & YouTube Audio Library (음원)</h2>
        <p class="mb-4 leading-8">캡슐을 열었을 때 배경음악(BGM)이 깔리면 감동이 배가됩니다. 유튜브 오디오 라이브러리는 저작권 걱정 없는 방대한 음원을 제공하며, 'Happy', 'Calm', 'Cinematic' 등 분위기별로 검색하기 좋습니다. Bensound는 퀄리티 높은 연주곡이 많지만, 무료 사용 시 출처 표기가 필요할 수 있으니 라이선스를 확인하세요.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Giphy & Tenor (움짤)</h2>
        <p class="mb-4 leading-8">정적인 사진보다 재미있는 움짤(GIF) 하나가 분위기를 살릴 때가 있죠. Time Capsuffle은 GIF 검색 기능을 내장하고 있지만, 외부에서 찾고 싶다면 이 두 사이트가 최고입니다. 밈(Meme)부터 감성적인 시네마그래프까지 다양합니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">주의사항</h2>
        <p class="mb-6 leading-8">무료 사이트라도 '재판매 금지', '성인물 사용 금지', '인물 사진의 명예훼손적 사용 금지' 등 <strong>라이선스 범위</strong>를 반드시 확인해야 합니다. Time Capsuffle은 건전한 저작권 문화를 지향합니다. 하지만 무엇보다 본인이 직접 찍은 사진과 영상이 가장 안전하고 의미 있다는 사실, 잊지 마세요!</p>
      `
    },
    {
      id: 'slow-living-digital-age',
      title: '디지털 시대의 느리게 살기: 타임캡슐이 우리에게 주는 여유',
      excerpt: '모든 것이 즉각적인 시대, 왜 우리는 일부러 기다림을 선택해야 할까요? 타임캡슐을 통해 배우는 "지연된 만족"의 가치에 대해 이야기합니다.',
      author: 'Slow Life',
      date: '2026.01.28',
      category: '에세이',
      // Updated Image URL to a reliable Unsplash ID (Coffee & Book)
      imageUrl: 'https://images.unsplash.com/photo-1495476479092-6ece1898a101?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">스마트폰 터치 한 번이면 지구 반대편의 소식을 알 수 있고, 배달 음식은 30분이면 도착합니다. 우리는 "기다림"이 제거된 시대를 살고 있습니다. 하지만 역설적으로, 모든 것이 빨라질수록 우리의 마음은 더 조급해지고 불안해집니다. 도파민 중독의 시대, 타임캡슐은 우리에게 <strong>'의도된 기다림'</strong>이라는 처방전을 제시합니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">지연된 만족 (Delayed Gratification)의 미학</h2>
        <p class="mb-4 leading-8">마시멜로 실험을 아시나요? 당장의 달콤함을 참고 기다렸을 때 더 큰 보상이 주어지는 것처럼, 타임캡슐은 감정의 숙성 과정을 선물합니다. 오늘 찍은 사진을 바로 인스타그램에 올리고 '좋아요'를 받는 것도 즐겁지만, 1년 뒤, 10년 뒤에 우연히 발견한 과거의 기록은 단순한 즐거움을 넘어선 깊은 울림을 줍니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">빠른 망각에 대한 저항</h2>
        <p class="mb-4 leading-8">SNS 피드는 끊임없이 새로운 정보로 덮어씌워집니다. 어제 먹은 점심 메뉴도 기억나지 않는 정보 과잉의 시대입니다. 타임캡슐에 기록을 남기는 행위는 이 빠른 망각의 흐름에 "잠시 멈춤" 버튼을 누르는 것과 같습니다. 이 순간을 박제하여, 미래의 나에게 온전히 전달하겠다는 의지의 표현입니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">느리게 흐르는 우리만의 시간</h2>
        <p class="mb-6 leading-8">Time Capsuffle에서는 시간이 다르게 흐릅니다. 친구들과 캔버스를 꾸미는 동안에는 경쟁도, 속도도 중요하지 않습니다. 오직 우리만의 이야기와 추억이 천천히 쌓여갈 뿐입니다. 이번 주말, 친구들과 함께 느리게 흐르는 시간을 캡슐에 담아보는 건 어떨까요?</p>
      `
    },
    {
      id: 'couple-time-capsule-ideas',
      title: '권태기 극복! 커플을 위한 100일 타임캡슐 활용법',
      excerpt: '매일 똑같은 데이트에 지쳤다면? 서로의 진심을 확인하고 설렘을 되찾아줄 디지털 타임캡슐 데이트를 제안합니다.',
      author: 'Love Guru',
      date: '2026.01.20',
      category: '라이프스타일',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">연애 초기의 설렘은 영원할 수 없지만, 깊은 신뢰와 사랑은 만들어갈 수 있습니다. 매일 반복되는 밥-영화-카페 데이트가 지겨워졌다면, 둘만의 특별한 프로젝트를 시작해보세요. 바로 '디지털 타임캡슐 만들기'입니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Step 1. 봉인 날짜 정하기</h2>
        <p class="mb-4 leading-8">너무 먼 미래보다는 '100일 뒤' 또는 '1주년 기념일'처럼 구체적이고 가까운 목표를 잡는 것이 좋습니다. "다음 크리스마스에 열어보자"라는 약속만으로도 두 사람의 관계는 미래지향적이 되고, 함께할 날들에 대한 기대감이 생깁니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Step 2. 무엇을 담을까?</h2>
        <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-700">
          <li><strong>서로에게 바라는 점:</strong> 말로 하면 잔소리 같지만, 글로 적어 캡슐에 넣으면 귀여운 소원이 됩니다.</li>
          <li><strong>몰래 찍은 사진:</strong> 상대방이 잠들었을 때나 멍하니 있을 때 찍은 엽기적이거나 사랑스러운 사진을 몰래 넣어두세요. 캡슐을 열었을 때 큰 웃음을 줍니다.</li>
          <li><strong>음성 편지:</strong> "사랑해"라는 말, 텍스트보다 목소리로 남겼을 때 그 온도가 훨씬 오래 보존됩니다.</li>
          <li><strong>데이트 영수증 & 티켓:</strong> 디지털 스캔이나 사진으로 남겨두세요. 그날 우리가 무엇을 먹고 어떤 영화를 봤는지, 사소한 디테일이 추억을 완성합니다.</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Step 3. 함께 꾸미는 즐거움</h2>
        <p class="mb-6 leading-8">Time Capsuffle의 실시간 캔버스 기능을 활용하세요. 카페에 마주 보고 앉아 스마트폰이나 태블릿으로 하나의 캔버스에 접속합니다. 서로 낙서를 하고 스티커를 붙이며 낄낄거리는 그 시간 자체가 또 하나의 완벽한 데이트가 될 것입니다.</p>
      `
    },
    {
      id: 'tech-behind-webrtc',
      title: 'Time Capsuffle의 기술: WebRTC와 실시간 동기화의 비밀',
      excerpt: '별도의 설치 없이 웹 브라우저만으로 어떻게 실시간 협업이 가능할까요? 개발자가 들려주는 흥미로운 기술 이야기.',
      author: 'Dev Team',
      date: '2026.01.15',
      category: '기술',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">Time Capsuffle을 사용하다 보면 궁금해집니다. "어떻게 친구가 그리는 낙서가 내 화면에 바로 보이지?", "별도의 프로그램을 설치하지 않았는데 어떻게 가능한 거지?" 그 비밀은 바로 현대 웹 기술의 정점인 <strong>WebRTC (Web Real-Time Communication)</strong>와 <strong>WebSocket</strong>에 있습니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">서버를 거치지 않는 P2P 통신?</h2>
        <p class="mb-4 leading-8">일반적인 웹사이트는 사용자가 서버에 데이터를 보내고, 서버가 다시 다른 사용자에게 데이터를 보내는 방식을 사용합니다. 하지만 Time Capsuffle의 일부 기능은 사용자 간에 직접 데이터를 주고받는 P2P(Peer-to-Peer) 방식을 지향합니다. 이를 통해 서버의 부하를 줄이고, 빛의 속도에 가까운 반응 속도를 만들어낼 수 있습니다. (물론 안정적인 데이터 저장을 위해 중앙 서버와의 동기화도 병행합니다.)</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">캔버스의 마법, HTML5 Canvas API</h2>
        <p class="mb-4 leading-8">여러분이 보고 있는 화면은 단순한 이미지가 아니라, 수천 개의 픽셀과 벡터 정보가 실시간으로 계산되어 그려지는 HTML5 Canvas입니다. 여러분이 선을 하나 그을 때마다, 그 좌표 데이터(x, y)는 즉시 압축되어 네트워크를 타고 친구의 컴퓨터로 전송됩니다. 친구의 브라우저는 그 데이터를 받아 16밀리초(60fps) 안에 화면에 그려냅니다. 이 모든 과정이 눈 깜짝할 새에 일어납니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">보안은 어떻게 하나요?</h2>
        <p class="mb-6 leading-8">실시간으로 데이터가 오고 가기 때문에 보안은 필수입니다. Time Capsuffle은 전송되는 모든 데이터 패킷을 SSL/TLS 레이어를 통해 암호화합니다. 또한, 캡슐의 접근 권한을 제어하기 위해 고유한 UUID와 비밀번호 해싱 알고리즘을 사용합니다. 기술은 복잡하지만, 사용자는 그저 즐기기만 하면 됩니다. 그게 바로 좋은 기술이니까요.</p>
      `
    },
    {
      id: 'archive-chats-friendship',
      title: '단톡방의 대화가 사라지기 전에: 디지털 수다를 기록해야 하는 이유',
      excerpt: '매일 쏟아지는 카카오톡 대화, 중요한 약속과 감동적인 말들이 스크롤 위로 사라지고 있지는 않나요?',
      author: 'Archivist',
      date: '2026.01.10',
      category: '에세이',
      imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">우리는 하루에도 수십 번, 친구들과 메시지를 주고받습니다. 그 안에는 시시콜콜한 농담부터, 진지한 고민 상담, 생일 축하 메시지, 그리고 인생의 중요한 결정들이 담겨 있습니다. 하지만 메신저 앱의 특성상, 이 소중한 대화들은 시간이 지나면 찾기 힘들어지거나, 기기를 변경하면서 유실되곤 합니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">텍스트는 감정의 화석입니다</h2>
        <p class="mb-4 leading-8">3년 전, 가장 친한 친구가 보내준 위로의 메시지를 기억하시나요? 다시 찾아보려면 수만 건의 대화를 검색해야 할 겁니다. 하지만 그 순간의 캡처본을 타임캡슐에 넣어두었다면 어떨까요? 그 텍스트는 단순한 글자가 아니라, 당시의 내 감정과 상황을 고스란히 담고 있는 '감정의 화석'이 됩니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">큐레이션의 힘</h2>
        <p class="mb-4 leading-8">모든 대화를 저장할 필요는 없습니다. 중요한 것은 '선별(Curation)'입니다. 정말 웃겼던 대화, 감동적이었던 순간, 어이없었던 오타 실수 등을 캡처해서 우리만의 공간에 박제하세요. Time Capsuffle 캔버스에 이 캡처들을 배치하고, 그 옆에 코멘트를 달아두면 훌륭한 '우정 연대기'가 완성됩니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">친구들과의 관계를 재확인하다</h2>
        <p class="mb-6 leading-8">나중에 이 기록들을 함께 열어보며 "와, 이때 너 진짜 웃겼는데", "이때 우리 진짜 힘들었지"라고 이야기 나누는 시간. 그것이 바로 관계를 더욱 단단하게 만드는 접착제가 됩니다. 흘러가는 텍스트를 붙잡아, 영원한 추억으로 만드세요.</p>
      `
    },
    {
      id: 'graduation-capsule',
      title: '졸업 시즌, 롤링페이퍼 대신 디지털 타임캡슐 어때요?',
      excerpt: '종이 롤링페이퍼는 잃어버리기 쉽습니다. 영원히 변치 않는 디지털 공간에 우리 반 친구들의 얼굴과 목소리를 담아보세요.',
      author: 'School Life',
      date: '2026.01.05',
      category: '가이드',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">졸업식 날, 서로의 교복 등판에 매직으로 낙서를 하거나 롤링페이퍼를 돌려쓰던 낭만이 있죠. 하지만 시간이 지나면 종이는 누렇게 변하고, 어디에 뒀는지 기억조차 나지 않게 됩니다. 이제 디지털 네이티브 세대답게, 스마트한 방식으로 졸업을 기념해봅시다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">1. 선생님 몰래 찍은 영상 모음</h2>
        <p class="mb-4 leading-8">수업 시간에 조는 친구, 쉬는 시간에 춤추는 친구, 체육 대회 때의 흑역사 영상들. 스마트폰 갤러리 구석에 잠들어 있는 이 보물 같은 영상들을 모두 모아 하나의 캡슐에 업로드하세요. 용량 걱정 없이 고화질로 보관할 수 있습니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">2. 미래의 명함 만들기</h2>
        <p class="mb-4 leading-8">Time Capsuffle의 그리기 기능을 이용해, 10년 뒤 나의 모습을 상상하며 명함을 그려보세요. '유명 유튜버 김철수', '우주 비행사 이영희'. 그리고 10년 뒤 동창회 때 캡슐을 열어 실제 모습과 비교해보는 겁니다. 상상만 해도 재미있지 않나요?</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">3. 언제든 다시 모일 수 있는 광장</h2>
        <p class="mb-6 leading-8">졸업 후 각자의 길을 걷다 보면 연락이 뜸해지기 마련입니다. 하지만 공유된 캡슐 링크 하나만 있다면, 우리는 언제든 다시 그 시절 교실로 돌아갈 수 있습니다. 졸업은 끝이 아니라, 새로운 추억 보관의 시작입니다.</p>
      `
    },
    {
      id: 'baby-steps-growth',
      title: '육아일기 2.0: 아이의 20년을 기록하는 타임캡슐',
      excerpt: '매일매일 자라나는 아이의 모습, 스마트폰 용량이 부족하다면? 아이가 성인이 되었을 때 선물할 수 있는 가장 감동적인 유산.',
      author: 'Mom & Dad',
      date: '2025.12.28',
      category: '육아',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">아이를 키우는 부모라면 공감할 것입니다. 하루에도 수백 장씩 사진을 찍지만, 정리가 안 돼서 다시 찾아보기가 너무 힘들다는 것을요. SNS에 올리자니 사생활 침해가 걱정되고, 외장 하드에 넣자니 왠지 묻혀버리는 기분이 듭니다. 타임캡슐은 가장 완벽한 대안입니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">아이의 '처음'을 모아두세요</h2>
        <p class="mb-4 leading-8">첫 뒤집기, 첫 걸음마, 처음으로 "엄마"라고 부른 순간. 이 역사적인 순간들을 텍스트 날짜와 함께 캡슐에 박제하세요. 나중에 아이가 컸을 때, "네가 이렇게 사랑받으며 자랐단다"라고 보여줄 수 있는 최고의 증거가 됩니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">매년 생일마다 인터뷰하기</h2>
        <p class="mb-4 leading-8">매년 아이의 생일에 같은 질문을 던지고, 그 대답을 영상으로 찍어 캡슐에 추가해보세요. "가장 좋아하는 장난감은?", "커서 뭐가 되고 싶어?" 3살, 5살, 10살... 변해가는 아이의 대답과 목소리를 한곳에서 모아보면 마치 한 편의 성장 영화를 보는 듯한 감동을 느낄 것입니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">가족 모두가 참여하는 육아</h2>
        <p class="mb-6 leading-8">Time Capsuffle은 공동 편집이 가능합니다. 멀리 계신 할머니, 할아버지, 이모, 삼촌을 초대하세요. 그들이 아이를 보며 느낀 사랑의 메시지를 캡슐에 남길 수 있습니다. 아이는 온 가족의 축복 속에 자라나고 있음을 훗날 알게 될 것입니다.</p>
      `
    },
    {
      id: '10-year-challenge',
      title: '10년 뒤 우리는 어떤 모습일까? 친구들과 함께하는 미래 예측 게임',
      excerpt: '단순한 보관을 넘어선 예측 게임! 서로의 미래를 예상해보고 적중률을 확인해보세요.',
      author: 'Fun Maker',
      date: '2025.12.20',
      category: '엔터테인먼트',
      imageUrl: 'https://images.unsplash.com/photo-1530021232320-685d8d67d5ce?q=80&w=1000&auto=format&fit=crop',
      content: `
        <p class="mb-6 leading-8">타임캡슐을 가장 재미있게 즐기는 방법 중 하나는 바로 '예언'입니다. 친구들과 모여 서로의 10년 뒤를 예측해보는 거죠. 막연한 상상이지만, 훗날 열어봤을 때 가장 큰 웃음 버튼이 되는 콘텐츠입니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">예측 리스트 작성하기</h2>
        <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-700">
          <li>가장 먼저 결혼할 것 같은 친구는?</li>
          <li>10년 뒤 대머리(...)가 될 것 같은 친구는?</li>
          <li>연봉 1억을 가장 먼저 달성할 친구는?</li>
          <li>가장 뜬금없는 직업을 가질 것 같은 친구는?</li>
        </ul>
        <p class="mb-4 leading-8">이 질문들에 대한 답을 각자 비밀스럽게 적거나, 서로 토론하며 캔버스에 기록하세요. 근거 없는 자신감과 비논리적인 추측이 난무할수록 더 재미있습니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">벌칙 내기 걸기</h2>
        <p class="mb-4 leading-8">그냥 하면 심심하죠. 10년 뒤 캡슐을 개봉하는 날, 예측이 가장 많이 빗나간 친구가 거하게 밥을 쏘기로 약속하세요. 이 내기는 우리가 10년 뒤에도 여전히 친구로 남아 만나야 할 강력한 명분이 되어줍니다.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">지금 이 순간을 즐기세요</h2>
        <p class="mb-6 leading-8">미래를 예측하는 과정에서 우리는 서로에 대해 더 많이 알게 되고, 서로가 꿈꾸는 미래를 응원하게 됩니다. 결과가 맞고 틀리고는 중요하지 않습니다. 함께 미래를 그리며 웃고 떠드는 지금 이 순간이 바로 타임캡슐에 담기는 진짜 보물입니다.</p>
      `
    }
  ]);

  getPosts() {
    return this.posts;
  }

  getPost(id: string) {
    return this.posts().find(p => p.id === id);
  }
}