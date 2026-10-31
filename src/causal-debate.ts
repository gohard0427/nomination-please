import type {State} from './engine.ts';
import type {Card} from './content.ts';
import type {PolicyId} from './support.ts';
import {paired} from './causal-revision.ts';
type Round={title:string;ask:string;choices:[string,string];results:[string,string];notes:[string,string];topic:PolicyId;stances:[number,number];sources:string[]};
export const debateRounds:Record<string,Round>={
 'debate-economy':{title:'AI와 첫 일자리',ask:'AI를 도입한 기업에서 신입 채용이 줄고 있습니다. 기업 지원금을 어디에 집중하겠습니까?',choices:['사람을 실제로 새로 뽑는 기업에 지원금을 주겠습니다.','기술 도입 지원은 유지하고, 줄어든 일자리의 노동자는 교육과 다른 회사 취업으로 돕겠습니다.'],results:['신규 채용을 지원 조건으로 걸었습니다. 채용 여력이 없는 기업은 지원에서 빠집니다.','기술 투자는 이어갑니다. 교육을 마쳐도 바로 취업할 수 있는지는 따로 확인해야 합니다.'],notes:['채용 연계 지원 · 기술 투자 지원 범위 축소','기술 투자 유지 · 재취업까지 소득 공백'],topic:'labor',stances:[.65,.2],sources:['work-automation','fresh-party-reform-1']},
 'debate-housing':{title:'집값과 빚',ask:'대출을 더 풀면 집을 살 기회가 늘지만 집값과 가계 빚도 오를 수 있습니다. 무엇을 먼저 하겠습니까?',choices:['갚을 능력이 있는 실수요자의 주택 대출 한도를 높이겠습니다.','대출 한도는 유지하고, 임대주택과 새 주택 공급에 집중하겠습니다.'],results:['실수요자의 대출 기회를 늘리는 안입니다. 상환 부담과 가격 상승 위험도 함께 남습니다.','추가 대출 대신 공급을 택했습니다. 실제 입주까지 기다려야 하는 사람들의 대책은 남습니다.'],notes:['구매 기회 확대 · 빚·가격 상승 위험','빚 증가 억제 · 입주까지 시간 필요'],topic:'housing',stances:[-.45,.65],sources:[]},
 'debate-society':{title:'노후의 소득',ask:'연금만으로 생활하기 어려운 고령자가 늘었습니다. 한정된 추가 예산을 어디에 먼저 쓰겠습니까?',choices:['일할 수 없는 고령자의 생활비 지원부터 늘리겠습니다.','일하고 싶은 고령자가 돈을 벌 수 있도록 일자리부터 늘리겠습니다.'],results:['일하기 어려운 고령자의 생활비를 우선했습니다. 일자리 사업에 쓸 여력은 줄었습니다.','일할 수 있는 고령자의 소득 기회를 우선했습니다. 일할 수 없는 사람의 생활비 대책은 남았습니다.'],notes:['생활비 우선 · 추가 일자리 예산 제약','일자리 우선 · 일할 수 없는 사람의 사각지대'],topic:'welfare',stances:[.8,.4],sources:[]},
 'debate-politics':{title:'우리 편 의혹도 검증합니까?',ask:'우리 캠프 관계자에 대한 의혹이 나왔습니다. 언론에 원본을 모두 공개하면 제보자의 신원이 드러날 수 있습니다. 어떻게 하겠습니까?',choices:['제보자 신원은 가리고, 검증에 필요한 원본 자료를 언론에도 공개하겠습니다.','원본은 독립 검증단에 제출하고, 언론에는 검증 결과부터 공개하겠습니다.'],results:['자료 공개를 우선했습니다. 신원을 가려도 추가 추정으로 피해가 생길 위험은 남습니다.','독립 검증을 먼저 받습니다. 결과가 나올 때까지 숨긴다는 비판을 감수해야 합니다.'],notes:['신속한 공개 · 제보자 추정 위험','독립 검증 우선 · 해명 지연 비판'],topic:'reform',stances:[.8,.55],sources:[]},
 'debate-security':{title:'동맹의 청구서',ask:'동맹국이 방위비를 더 내라고 요구합니다. 다른 예산이 줄어들 수 있어도 분담을 늘리겠습니까?',choices:['동맹 유지를 우선해 분담을 늘리겠습니다. 증액 근거와 상한은 협상하겠습니다.','증액보다 우리 군의 방어력 투자를 우선하고, 분담금 협상은 계속하겠습니다.'],results:['동맹 분담 확대를 우선했습니다. 줄일 다른 예산을 설명해야 합니다.','독자 방어력 투자를 우선했습니다. 협상 장기화와 전력 확보까지의 공백도 대비해야 합니다.'],notes:['동맹 분담 우선 · 다른 예산 부담','독자 방어력 우선 · 협상 장기화 위험'],topic:'diplomacy',stances:[.55,.3],sources:[]}
};

// 대체 질문도 답변·효과·결과를 함께 정의하고, 무관한 인용을 붙이지 않는다.
const alternate:Record<string,[string,string,string,string,PolicyId,number,number][]>={
 'debate-economy':[['공약의 계산서','복지 공약을 늘리려면 돈이 더 필요합니다. 증세와 공약 축소 중 무엇을 택할까요?','부담 대상과 금액을 밝히고 세금을 더 걷겠습니다.','세금은 더 걷지 않고, 공약의 지원 범위를 줄이겠습니다.','tax',.7,-.55],['폐업 뒤의 빚','폐업자의 재기를 도우려면 추가 예산이 듭니다. 누구까지 도울까요?','빚을 갚기 어려운 폐업자에게 이자 감면 지원을 넓히겠습니다.','소득이 없어 갚지 못하는 사람으로 지원 대상을 좁히겠습니다.','welfare',.7,.25]],
 'debate-housing':[['재개발과 이삿날','재개발을 서두르면 세입자가 새 집보다 먼저 떠나야 합니다. 무엇을 우선할까요?','임시 거처를 확보하기 전에는 철거를 늦추겠습니다.','철거는 계획대로 진행하고, 이주비 지원을 늘리겠습니다.','housing',.75,.25],['높이 지은 이익','재건축을 더 높게 허용한 이익을 누구에게 더 남길까요?','사업자와 집주인에게 더 남겨 공사를 앞당기겠습니다.','도로와 학교, 공공주택 비용으로 더 돌리겠습니다.','housing',-.5,.7]],
 'debate-society':[['돌봄의 빈자리','돌봄 예산을 더 쓰려 합니다. 시설 인력과 가족 휴직 지원 중 어디에 우선 쓸까요?','공공 돌봄 인력을 더 고용하겠습니다.','가족이 일을 쉬어도 소득을 지키도록 휴직 지원을 늘리겠습니다.','welfare',.75,.45],['지역 의료','지역 의료 예산을 상주 인력과 이동 진료 중 어디에 먼저 쓰겠습니까?','지역에 계속 근무하는 의료인의 처우를 높이겠습니다.','거점 병원에서 오가는 이동·방문 진료를 늘리겠습니다.','welfare',.7,.5]],
 'debate-politics':[['다수의 결정','다수 의석으로 공약 법안을 통과시킬 수 있습니다. 야당은 추가 공청회를 요구합니다. 어떻게 할까요?','표결을 늦추더라도 추가 공청회를 열겠습니다.','정해진 심사를 마쳤다면 표결하겠습니다. 반대 의견과 처리 근거도 공개하겠습니다.','reform',.8,.35],['은인의 자리','캠프를 도운 은인이 책임자 자리를 요구합니다. 선발 방식을 어떻게 정할까요?','은인도 다른 지원자와 같은 공개 경쟁으로 뽑겠습니다.','은인을 단독 추천하되, 경력과 이해관계를 공개 심사받게 하겠습니다.','reform',.8,.2]],
 'debate-security':[['북한의 위협','북한의 도발 뒤 추가 제재와 위기 소통 요구가 갈립니다. 먼저 무엇을 할까요?','추가 제재와 군사 대비를 우선하고, 대화 재개는 도발 중단 뒤로 미루겠습니다.','군사 대비는 유지하되, 우발 충돌을 막을 소통부터 재개하겠습니다.','diplomacy',-.55,.65],['강경 대응의 비용','국가 간 갈등으로 무역 보복이 예상됩니다. 대응 강도를 어떻게 정할까요?','강경 대응을 유지하고 피해 업종에 재정 지원을 하겠습니다.','대응 강도를 낮추고 협상을 우선해 무역 피해를 줄이겠습니다.','diplomacy',-.4,.6]]
};
const alternateCosts:Record<string,[string,string]>={
 '공약의 계산서':['혜택 재원 확보 · 세금 부담 증가','세부담 유지 · 지원 제외자 발생'],
 '폐업 뒤의 빚':['재기 지원 확대 · 예산·성실 상환자 반발','지원 비용 제한 · 기준 밖 폐업자의 재기 지연'],
 '재개발과 이삿날':['임시 거처 우선 · 공급 일정 지연','계획된 공급 우선 · 이주비·임대료 부담'],
 '높이 지은 이익':['사업 이익 보장 · 공공시설 비용 부족','공공 환원 확대 · 수익 감소·사업 지연'],
 '돌봄의 빈자리':['돌봄 인력 확대 · 인건비·채용 부담','가족 휴직 지원 · 가족 돌봄 부담 잔존'],
 '지역 의료':['상주 인력 확보 · 지속적인 인건비','이동 진료 확대 · 상시 진료 공백'],
 '다수의 결정':['추가 의견 수렴 · 공약 처리 지연','표결로 실행 · 소수 의견 배제 비판'],
 '은인의 자리':['공개 경쟁 · 은인과 관계 부담','단독 추천 · 특혜·검증 부담'],
 '북한의 위협':['억지·제재 우선 · 소통 단절·긴장 위험','위기 소통 우선 · 유화책 비판'],
 '강경 대응의 비용':['대응 유지 · 보복·피해 지원 예산','협상 우선 · 후퇴 비판·협상 지연']
};
export function causalDebate(card:Card,s:State){
 let r=debateRounds[card.id];if(!r)return card;
 const hasAnchor=s.history.some(h=>h.decision&&r.sources.includes(h.decision.cardId));
 const retry=s.flags.filter(f=>f.startsWith('토론 재도전:')).length;
 const variant=hasAnchor?0:(s.initialSeed+card.id.length+retry+1)%3;
 if(variant){const [title,ask,a,b,topic,sa,sb]=alternate[card.id][variant-1];r={title,ask,choices:[a,b],topic,stances:[sa,sb],sources:[],notes:alternateCosts[title],results:[a+' 우선순위를 분명히 했습니다. 뒤로 미룬 방안을 요구하는 지지자도 설득해야 합니다.',b+' 우선순위를 분명히 했습니다. 뒤로 미룬 방안을 요구하는 지지자도 설득해야 합니다.']};}
 // 넓은 정책 태그는 인용 근거가 아니다. 같은 정책 대상·수단인 실제 결정만 연결한다.
 const prior=[...s.history].reverse().find(h=>h.decision&&r.sources.includes(h.decision.cardId));
 const quote=prior?`경쟁 후보가 ${prior.turn+1}번째 선택의 실제 답변 “${prior.choice}”을 띄웁니다. 같은 기업 지원 기준을 이번 공약에도 적용할지 묻습니다. `:'경쟁 후보가 묻습니다. ';
 paired(card,s,quote+r.ask,r.choices,r.results,r.notes,r.topic,r.stances,[{trust:5,org:1},{trust:2,org:4}]);
 if(r.title==='동맹의 청구서'){Object.assign(card,{values:[{alliance:.9},{alliance:-.5}]});const fit:Record<string,number>={future:.95,better:.3,reform:.3,labor:.1,guardian:.9};if(s.partyId)card.choices.forEach((c,i)=>c.effect.party=Math.round((fit[s.partyId??'']??0)*(i===0?.9:-.5)*6));}
 card.title=(s.flags.some(f=>f.startsWith('토론 재도전:'))?'재도전 · ':'')+r.title+' · 최종 토론';card.speaker='경쟁당 후보 · '+(s.campaign?.nominee?.name??'경쟁 후보');
 return card;
}
