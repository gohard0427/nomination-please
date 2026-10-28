import {shortRoute,shortRun} from './short-run.ts';
import {v,type VarietyCard} from './event-factory.ts';import type {State} from './engine.ts';import type {Card} from './content.ts';
export const mergerCards:VarietyCard[]=[
 v('merger-plant','local','같은 당인데, 같은 현장에 못 갑니다','노동계 · 정버팀 / 환경계 · 도초록','지역 발전소의 폐쇄를 요구하는 집회가 열립니다. 환경계는 함께 서자고 하고, 노동계는 다음 일자리도 없이 폐쇄부터 약속하지 말라고 합니다. 후보인 당신의 입장을 묻습니다.',
 ['기후 목표에 맞춰, 폐쇄 일정부터 정해야 합니다.',{trust:4,org:-2,funds:-2},'당색은 같았습니다. 집회 장소는 둘이 됐습니다.','기후 대응 우선 · 고용 불안·노동계 반발'],
 ['일자리 대책이 없으면, 폐쇄부터 약속하지 않겠습니다.',{trust:3,org:4,funds:-2},'노동계가 박수 쳤습니다. 환경계는 폐쇄 달력을 다시 내밀었습니다.','고용 보장 우선 · 전환 지연·환경계 반발'],'environment',{kind:'party',parties:['labor'],importance:3,signals:[[{topic:'environment',stance:.85},{topic:'labor',stance:-.45}],[{topic:'environment',stance:-.4},{topic:'labor',stance:.8}]]}),
 v('merger-candidate','central','합당은 했는데, 후보는 둘입니다','보좌진 · 장현장 / 류초록','다음 지역 후보 추천을 앞두고 노동계와 환경계가 각자 한 사람을 밀고 있습니다. 자리는 하나입니다. 어느 쪽을 먼저 설득할까요?',
 ['일터를 지켜온 노동계 후보를 추천하겠습니다.',{org:5,trust:2},'노동계 명단은 정리됐습니다. 환경계 회의는 아직 끝나지 않았습니다.','현장 노동 기반 · 환경계의 대표성 요구'],
 ['기후 전환을 이끌 환경계 후보를 추천하겠습니다.',{trust:4,fame:3},'환경계가 환영했습니다. 노동계는 고용 공약부터 다시 확인했습니다.','환경 전환 대표성 · 노동계 조직 설득'],'labor',{kind:'party',parties:['labor'],signals:[[{topic:'labor',stance:.8},{topic:'environment',stance:.2}],[{topic:'labor',stance:.2},{topic:'environment',stance:.8}]]}),
 v('merger-return','presidential','그때의 약속, 우리 일자리에도 적용합니까?','노동계 · 정버팀 / 환경계 · 도초록','산업 전환 공약의 비용이 예상보다 커졌습니다. 노동계와 환경계가 당신의 지난 약속을 다시 묻습니다. 재원 부담을 감수할지, 일정을 다시 정할지 답해야 합니다.',
 ['비용이 늘어도, 약속한 고용·전환 지원을 지키겠습니다.',{trust:7,org:2},'약속은 남겼습니다. 이제 지지자에게도 그 가격을 설명해야 합니다.','약속 이행·추가 재원 · 세금 부담 반발'],
 ['비용과 일정을 다시 공개하고, 약속을 조정하겠습니다.',{trust:3,party:-3,fame:2},'공약에 수정표를 붙였습니다. 지지자들은 자기 이름이 빠졌는지부터 봤습니다.','실행 가능성 보완 · 후퇴 비판·지지층 설득'],'tax',{kind:'memory',signals:[[{topic:'tax',stance:.6},{topic:'labor',stance:.5},{topic:'environment',stance:.5}],[{topic:'tax',stance:-.3},{topic:'labor',stance:.15},{topic:'environment',stance:.15}]]})
];
export function mergerContext(card:Card,s:State){if(card.id==='merger-return'){const p=s.statements.find(x=>x.id==='merger-plant');if(p)card.body=`당신이 실제로 한 말 “${p.text}”. `+card.body;}return card;}
export function recordMerger(s:State,c:Card,i:0|1){if(c.id==='merger-plant'){s.statements.push({id:c.id,turn:s.turn,topic:'산업 전환',text:c.choices[i].text,principle:i===0?'기후 목표에 맞춘 폐쇄 시한':'고용 대책을 갖춘 산업 전환',strength:i===0?3:1,exposure:s.stats.fame,contextTags:[c.id]});const at=s.route.findIndex((id,at)=>at>s.cursor&&shortRoute[at]==='?presidential'&&!id.startsWith('world-'));if(at>=0&&!s.route.includes('merger-return'))s.route[at]='merger-return';}
 if(c.id==='merger-return'){const p=s.statements.find(p=>p.id==='merger-plant');if(p&&s.campaign){s.campaign.reviews.push({source:p.id,event:c.id,quote:p.text,verdict:i===0?'원칙 유지':'입장 수정'});s.flags.push('부메랑: 산업 전환');}}
 if(['merger-plant','merger-candidate'].includes(c.id)){const labor=s.npcs.find(n=>n.id==='장현장'),green=s.npcs.find(n=>n.id==='류초록');const favorsLabor=c.id==='merger-plant'?i===1:i===0;for(const [n,favored] of [[labor,favorsLabor],[green,!favorsLabor]] as const)if(n){n.relationship=Math.max(0,Math.min(100,n.relationship+(favored?5:-4)));n.memoryTags.push(c.id+':'+i);}}
}

export function queueMergerEntry(s:State){
 if(!shortRun(s)||s.flags.some(f=>f.startsWith('재도전:'))||s.flags.includes('합당 첫 토론 예약')||s.flags.some(f=>f.startsWith('분기:merger-plant:')))return;
 if(s.route.includes('merger-plant')){s.flags.push('합당 첫 토론 예약');return;}
 const at=s.route.findIndex((id,i)=>i>s.cursor&&shortRoute[i]==='?local'&&!id.startsWith('world-'));
 if(at>=0){s.route[at]='merger-plant';s.flags.push('합당 첫 토론 예약');}
}
