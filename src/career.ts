import {partyById} from './parties.ts';
import type {Card} from './content.ts';import type {State} from './engine.ts';
export const CAREER_FLAG='직업 인맥: career-v1';
export const rivals=[
 {name:'서해온',background:'페미니스트 시민활동가',role:'성평등 정책을 중시하는 라이벌',goal:'돌봄·안전·채용에서 성평등 공약을 관철',conflict:'지역 조직의 폭넓은 연합과 성평등 공약의 선명함 중 어디에 먼저 자원을 쓸지',art:0},
 {name:'박동네',background:'지역 보좌진 출신',role:'지역 조직형 라이벌',goal:'오래된 지역 인연으로 후보가 되기',conflict:'새로운 주민 참여와 오래된 조직의 경험 중 어디에 무게를 둘지',art:1},
 {name:'민공익',background:'공익 법률가',role:'이해충돌 검증을 요구하는 라이벌',goal:'공직과 사적 사업의 경계를 명확하게 만들기',conflict:'기업 경영 경험을 활용하면서 가족 사업과 공적 판단을 어떻게 분리할지',art:3},
 {name:'도이익',background:'기업가 출신',role:'사업 경험을 앞세우는 라이벌',goal:'빠른 정책 실행과 지역 투자를 제안해 지지를 얻기',conflict:'법적 절차를 충실히 거치는 속도와 빠른 사업 추진의 장점을 어떻게 조율할지',art:2},
 {name:'백논평',background:'정당 대변인 출신',role:'메시지 경쟁에 강한 라이벌',goal:'짧고 선명한 메시지로 의제를 주도하기',conflict:'취재 근거를 자세히 설명하는 일과 짧은 메시지로 설득하는 일 중 무엇을 우선할지',art:4},
 {name:'홍실행',background:'주민 정책단 출신',role:'현장 참여를 요구하는 라이벌',goal:'정책 설계에 실제 이용자의 의견을 반영하기',conflict:'행정 경험에 따른 실행 가능성과 주민의 직접 참여를 어떻게 묶을지',art:0},
 {name:'정꼼꼼',background:'재정 연구자',role:'공약의 숫자를 검증하는 라이벌',goal:'주목받는 공약에 실제 재원과 실행 계획을 붙이기',conflict:'높은 인지도를 유지하면서 어려운 예산 설명도 충분히 할 수 있을지',art:5},
 {name:'강민주',background:'외교·안보 연구자',role:'민간 통제와 안보 비용을 묻는 라이벌',goal:'안보 정책의 책임·예산·시민 통제 원칙을 분명히 하기',conflict:'조직 운영 경험을 살리면서 공개 검증과 시민의 통제를 어떻게 보장할지',art:3}
];
export function hasCareer(s:State){return s.flags.includes(CAREER_FLAG)}
export function careerCard(card:Card,s:State){if(!hasCareer(s))return card;const r=rivals[s.job];
 if(card.id==='career-rival-meet'){card.title=r.name+'의 첫 질문';card.speaker='라이벌 · '+r.name;card.body=`${r.background} ${r.name}도 같은 정치 무대에 도전합니다. ${r.goal}가 목표라고 합니다. 두 사람은 ${r.conflict}를 두고 의견이 다릅니다. 공개 토론으로 경쟁할지, 공동 현장 조사부터 해볼지 고르세요.`;}
 if(card.id==='ally'&&s.npcs[2].trust>=50){card.body=`${r.name}이 이전에 함께했던 현장 조사를 기억하며 연합을 제안합니다. “같은 부분은 함께하고, 다른 부분은 공개 토론하죠.” 추천과 협약의 조건을 공개할지, 독자 노선을 유지할지 정하세요.`;card.choices[0].effect={org:10,party:5,funds:3};}
 if(card.id==='housing'&&s.job===2){card.title='공공 계약, 가족도 같은 기준입니까';card.topic='이해충돌';card.body='기업가 출신인 당신에게 공공 계약의 이해충돌 방지 원칙을 묻습니다. 가족 회사도 그 원칙을 적용받게 될 수 있습니다. 원칙을 공개적으로 약속할지, 접촉 기록과 외부 검증 절차를 먼저 강조할지 정하세요.';card.choices[0].text='가족 회사에도 같은 이해충돌 심사를 적용하겠습니다';card.choices[1].text='공적 접촉 기록 공개와 독립 검증을 약속한다';}
 if(card.id==='family-clue'&&s.job===2){card.title='가족 회사가 공공사업에 지원합니다';card.body='누나의 회사가 지역 공공사업에 입찰할 계획입니다. 당신이 직접 심사하는 자리는 아니지만, 정치적 영향력을 이용했다는 의혹을 피하려면 경계를 분명히 해야 합니다. 누나는 “내 사업까지 멈춰야 해?”라고 묻습니다.';card.choices[0]={text:'이해관계를 공개하고 모든 접촉에서 빠진다',effect:{trust:6,funds:-3},result:'가족은 서운해했습니다. 담당 기관에는 당신의 추천서가 아닌 접촉 배제 요청이 갔습니다.'};card.choices[1]={text:'독립 심사와 접촉 기록 보존을 먼저 요청한다',effect:{trust:3,org:3},result:'누나 회사도 같은 심사를 받도록 요청했습니다. “같은”이 사실인지 확인할 기록도 남깁니다.'};}
 if(card.id==='family'&&s.job===2&&s.flags.includes('가족 기업 입찰 논의')){card.title='가족 회사, 실력입니까 영향력입니까';card.topic='이해충돌';card.body='가족 회사의 입찰이 보도됐습니다. 현재 자료에는 당신이 심사에 관여한 증거는 없습니다. 다만 후보의 인맥이 거래에 영향을 줬는지 추가 확인이 필요합니다. 가족의 독립적인 사업과 공적 이해충돌을 구분해 대응해야 합니다.';card.choices[0].text='이해관계·접촉 기록과 독립 심사 자료를 공개한다';card.choices[0].result='회사의 실적과 당신의 접촉 기록을 따로 냈습니다. 가족이라는 이유만으로 유죄도, 면제도 되지 않는다고 설명했습니다.';card.choices[1].text='외부 검증을 받되 가족의 비공개 사업 정보는 보호한다';card.choices[1].result='검증할 자료는 냈습니다. 공개를 미룬 부분은 독립 검증 결과와 함께 설명하기로 했습니다.';}
 if(s.campaign&&['career-rival-meet','ally','cabinet'].includes(card.id)){const affiliation=partyById(s.campaign.rivalPartyId);card.body+=` ${r.name}의 소속은 ${affiliation?.name??'무소속'}입니다. `+(s.campaign.rivalPartyId===s.partyId?'같은 기반에서도 자리와 정책을 두고 경쟁합니다.':'서로 다른 기반의 협력에는 공개할 조건과 지지자 설득이 필요합니다.');}
 // 기존 저장 속 인물의 과거를 바꾸지 않는다. 새 회차의 실제 라이벌만 문구에 반영한다.
 for(const key of ['title','speaker','body'] as const)card[key]=card[key].replaceAll('차도약',s.npcs[2].id);
 for(const choice of card.choices){choice.text=choice.text.replaceAll('차도약',s.npcs[2].id);choice.result=choice.result.replaceAll('차도약',s.npcs[2].id)}return card;
}
