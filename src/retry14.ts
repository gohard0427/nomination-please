import type {State} from './engine.ts';import type {Card} from './content.ts';import {v,type Chapter} from './event-factory.ts';import {modern} from './patch14.ts';
export const retry14Cards=(['local','central','presidential'] as Chapter[]).flatMap(phase=>[
 v(`retry-analysis-${phase}`,phase,({local:'동네의 개표표를 다시 읽습니다',central:'국회 도전의 약점을 찾습니다',presidential:'전국 득표 지도를 다시 펼칩니다'}[phase as 'local'|'central'|'presidential']),'보좌관','지난 선거의 기록을 바탕으로 무엇부터 바꿀지 정합니다.',['약한 기반을 만나는 현장 일정부터 다시 짜겠습니다.',{org:2},'일정표를 바꿨습니다. 같은 구호가 아니라 다른 사람을 만나러 갑니다.','현장 회복 · 설명 시간'],['공약의 근거와 실행 조건을 다시 공개하겠습니다.',{trust:2},'공약에 수정표를 붙였습니다. 작은 글씨였던 비용도 앞에 냈습니다.','설명 회복 · 현장 일정 제약'],'region',{kind:'memory',signals:[[],[]]}),
 v(`retry-network-${phase}`,phase,({local:'주민 조직을 다시 만납니다',central:'정책 모임과 지역 기반 사이',presidential:'전국 연합의 조건을 다시 씁니다'}[phase as 'local'|'central'|'presidential']),'지역 조직','오래된 협력자와 새 참여자가 서로 다른 활동 방식을 제안합니다.',['기존 협력자와 역할을 다시 정하겠습니다.',{org:2},'오래된 연락망을 다시 확인했습니다. 저장된 번호가 곧 참여자는 아니었습니다.','경험 활용 · 새로운 참여 제약'],['새 참여자와 공개 모임부터 열겠습니다.',{trust:2},'새 사람을 만났습니다. 함께 할 수 없는 요구도 공개했습니다.','새 참여 · 조직 숙련 부담'],'region',{kind:'memory',signals:[[],[]]})
]);
export function retry14Context(c:Card,s:State){if(!modern(s))return c;
 if(c.id.startsWith('retry-analysis-')){const e=s.elections.at(-1);const weak=e?.contributions?.slice().sort((a,b)=>a.impact-b.impact)[0];c.body=`지난 ${e?.name??'선거'}의 실제 개표 보고서를 펼쳤습니다. ${weak?`경쟁력에 가장 작게 기여한 항목은 ‘${weak.label}’였습니다.`:'유세 방식과 공약 설명을 함께 돌아봅니다.'} 패배를 한 가지 원인으로 단정하지 않고, 다음 준비의 우선순위를 정하세요.`;}
 if(c.id.startsWith('retry-network-'))c.body=s.partyId?'같은 당의 기존 협력자는 조직 재정비를, 새 참여자는 공개 모임을 제안합니다. 한정된 시간을 어디에 먼저 쓸까요?':'무소속으로 기존 주민 조직과 새 참여자 중 누구를 먼저 만날지 정합니다. 정당의 당원 조직이 자동으로 생기지는 않습니다.';
 if(['retry-local','retry-central','retry-presidential'].includes(c.id))c.choices.forEach(x=>{if((x.effect.org??0)>0)x.effect.org=Math.max(0,x.effect.org!-4);if((x.effect.trust??0)>0)x.effect.trust=Math.max(0,x.effect.trust!-4);});
 return c;}
