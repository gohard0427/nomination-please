import type {State,Outcome} from './engine.ts';import type {Card} from './content.ts';import {v} from './event-factory.ts';
import {presidents,currentPresident} from './presidents.ts';
export const presidentEvents=[
 v('executive-help','prePolitics','대통령실에서 당신의 민원을 봤답니다','보좌관','지역 문제를 알릴 기회가 왔습니다.', ['공개 절차로 도움을 받고, 조건도 기록하겠습니다.',{org:5,trust:2},'도움은 받았습니다. 은혜라는 말은 서류에 없었습니다.','현장 기반 · 정치적 빚'],['직접 해결하겠습니다. 대통령 이름은 빌리지 않겠습니다.',{trust:4,fame:2,funds:-2},'지원 없이 시작합니다. 거절한 전화번호는 지우지 않았습니다.','독립성 · 활동 비용'],'region',{kind:'conflict'}),
 v('executive-request','central','도와줬던 그분이 전화를 했습니다','정치적 은인','전에 받은 도움을 기억하는 사람이 부탁합니다.', ['같은 기준으로 검토하고, 협력하겠습니다.',{org:5,party:3,trust:-2},'도움을 되갚았습니다. 이번 협력의 근거도 따로 물었습니다.','관계·조직 · 원칙 검증'],['도움은 감사하지만, 이번 요구는 거절하겠습니다.',{trust:6,party:-4,funds:-2},'은혜와 정책의 계산서를 분리했습니다. 전화는 짧아졌습니다.','원칙·독립성 · 은인과 관계 부담'],'reform',{kind:'memory'}),
 v('executive-return','presidential','그 은혜, 지금도 같은 기준입니까?','기자','당시의 협력과 지금의 공약을 함께 검증합니다.', ['제가 한 선택입니다. 같은 기준으로 검증받겠습니다.',{trust:6,party:-3},'정치적 빚까지 공개했습니다. 기억력은 이제 상대의 전유물이 아닙니다.','일관성 · 자기편 검증'],['그때의 사정과 지금 바꾼 기준을 공개하겠습니다.',{trust:3,org:2},'수정한 이유를 냈습니다. 바뀐 기준은 다음에도 당신에게 적용됩니다.','합리적 수정 · 후퇴 비판'],'reform',{kind:'memory'})
];
const dilemmas:Record<string,[string,string,string,string,string,string]>={
 promise:['후계자 자리를 논의할 모임에 초대했습니다.','라이벌에게도 후계자를 약속했습니다. 공개 경쟁 대신 지도부 조정을 지지해달랍니다.','공개 기준을 조건으로 지도부 조정에 참여하겠습니다.','약속받은 자리라도, 공개 경쟁으로 정해야 합니다.','reform','모두에게 건넨 후계자 약속'],
 profit:['지역 공장 지원 민원을 정식 심사에 연결했습니다.','공장을 지킨 기업의 규제 완화에 힘을 보태달랍니다. 일자리와 노동·환경 기준이 충돌합니다.','고용 유지와 점검을 조건으로 규제 완화를 지지하겠습니다.','일자리를 지켰어도, 안전·환경 기준은 낮추지 않겠습니다.','economy','기업 규제와 일자리 기준'],
 ready:['지역 대피시설 점검 요청을 정식 검토에 올렸습니다.','위기를 막은 비상조치를 연장해달랍니다. 종료 시점은 아직 제시하지 않았습니다.','단기 연장은 지지하되, 국회 재심사 기한을 걸겠습니다.','종료 조건이 없으면, 연장에 동의하지 않겠습니다.','diplomacy','비상조치의 기한과 통제'],
 hometown:['지역 교통 민원을 공개 사업 검토에 올렸습니다.','다른 지역에도 같은 예산으로 철도를 약속했습니다. 우선 착공을 지지해달랍니다.','단계별 예산을 공개하는 조건으로 착공을 지지하겠습니다.','재원이 겹치면, 착공 전에 우선순위부터 정해야 합니다.','region','지역 개발의 재원과 순서'],
 reject:['누락된 공천 서류를 다시 심사할 정식 경로를 알려줬습니다.','긴급 지원도 서류 미비로 반려하겠답니다. 원칙을 지킬지 예외 절차를 요구할지 묻습니다.','서류 기준은 지키고, 심사 인력을 늘리겠습니다.','기한부 긴급 지원을 열고, 사후 심사를 받게 하겠습니다.','welfare','긴급 지원과 절차적 예외'],
 grant:['지역 돌봄 지원 신청을 공개 심사에 연결했습니다.','재원이 부족해 줄여야 할 지원을 당신이 발표해달랍니다.','축소 대상과 이유를 공개하고, 발표를 맡겠습니다.','축소부터 발표하지 말고, 다른 재원부터 검토해야 합니다.','tax','지원 확대와 재원 책임'],
 power:['공천 심사에서 지도부의 자의적 개입을 막는 데 도움을 줬습니다.','개혁을 완수하려면 대통령 권한을 더 늘려야 한다며 공개 지지를 요구합니다.','권한 확대는 기한과 국회 통제를 조건으로 지지하겠습니다.','개혁을 명분으로, 견제까지 줄일 수는 없습니다.','reform','개혁 명분과 권한 집중'],
 agree:['라이벌과 공개 협상할 자리를 마련했습니다.','양쪽에 서로 다른 공천 조건을 약속했습니다. 당신이 한 조건을 포기해달랍니다.','양보할 조건과 새 합의문을 공개하겠습니다.','서로 다른 약속부터 공개하고, 다시 협상해야 합니다.','reform','합의 공개와 양보'],
 field:['당신 지역의 문제를 전국 현장 일정에 올렸습니다.','지난 현장의 해결이 끝나기 전에 새 방문의 성과 발표를 맡아달랍니다.','미해결 과제도 함께 밝히는 조건으로 발표하겠습니다.','방문 횟수보다, 지난 현장의 해결부터 확인하겠습니다.','region','현장 방문과 실제 해결'],
 all:['지역 수출 기업의 공개 애로사항을 협상단에 전달했습니다.','각국에 한 약속이 서로 충돌합니다. 당신이 국내 해명을 맡아달랍니다.','약속과 조정 비용을 공개하고, 해명을 맡겠습니다.','합의의 충돌부터 바로잡고, 공동으로 설명해야 합니다.','diplomacy','외교 합의의 비용과 공개'],
 coding:['지역 행정 민원 처리의 오류를 찾아 공개했습니다.','국정 시스템을 일괄 교체하자고 합니다. 오류는 줄 수 있지만 기존 업무와 일자리가 흔들립니다.','업무 전환과 복구 계획을 조건으로 교체를 지지하겠습니다.','시범 운영과 노동자 전환 지원이 먼저입니다.','economy','기술 도입과 일자리 전환'],
 gpt:['민원 분류 오류를 찾아 당신에게 정정 경로를 알려줬습니다.','정책 결정을 AI 추천으로 자동 처리하자고 합니다. 시민의 이의 제기는 사후로 미루겠답니다.','처리 범위를 제한하고, 사람의 재심을 조건으로 도입하겠습니다.','시민의 사전 참여 없이, 판단까지 자동화할 수는 없습니다.','reform','AI 판단과 시민의 통제']
};
export function presidentEvent(card:Card,s:State){if(!s.presidency)return card;const current=currentPresident(s)!;const prior=s.presidency.terms.find(p=>p.id===s.presidency!.debtId);const p=card.id==='executive-help'?current:prior??current;const def=presidents.find(x=>x.id===p.id);if(!def)return card;
 if(card.id==='incumbent'){card.speaker='대통령 · '+current.name;card.body=`${current.name} 대통령이 공개 대담에 초대했습니다. “${presidents.find(x=>x.id===current.id)?.quote??'국민의 뜻을 듣겠습니다.'}” 협력할지 독립적인 입장을 강조할지 묻습니다.`;}
 if(card.id==='tv'&&s.campaign?.nominee?.name==='차지피'){card.body+=' 기자: “후보님, 출시된 지 3년인데 출마 자격이 됩니까?” 차지피: “나이가 부족하면 업데이트하겠습니다.”';}if(card.id==='tv'&&s.campaign?.nominee?.name==='남코딩'){card.body+=' 남코딩은 노트북을 닫으며 말합니다. “전임 정부 코드를 봤습니다. 다시 짜야 합니다.”';}if(!card.id.startsWith('executive-'))return card;
 const d=dilemmas[p.id],former=p.id!==current.id;card.speaker=`${former?'전 대통령':'대통령'} · ${p.name}`;
 if(card.id==='executive-help')card.body=`${p.name} 대통령이 ${d[0]} 공개 절차이며 공천이나 특혜를 보장하지는 않습니다. 도움을 받을까요?`;
 if(card.id==='executive-request'){card.body=`${former?'전 대통령이 된 ':''}${p.name}이 전화를 했습니다. ${d[1]} “전에 도왔던 일은 기억하시죠?”`;card.choices[0].text=d[2];card.choices[1].text=d[3];card.choices[0].effect.party=s.partyId===p.partyId?3:-2;card.choices[1].effect.party=s.partyId===p.partyId?-4:3;card.choices[0].result='조건을 공개하고 협력했습니다. 은인은 조건보다 협력이라는 단어를 크게 읽었습니다.';Object.assign(card,{signals:[[{topic:d[4],stance:.3}],[{topic:d[4],stance:.65}]],costNotes:['조건부 협력 · 은인과 관계·정책 검증','독립적 판단 · 관계·조직과 활동 비용']});}
 if(card.id==='executive-return'){const q=s.statements.find(x=>x.id==='executive-request');card.body=`${p.name}의 도움을 받은 뒤 실제로 한 답변 “${q?.text??''}”. 기자가 ${d[5]}을 자기 캠프에도 적용할지 묻습니다. 당시의 협력과 지금의 입장을 설명해야 합니다.`;}
 return card;
}
export function recordPresidentEvent(s:State,c:Card,i:0|1){const p=s.presidency;if(!p)return;const who=c.id==='executive-help'?currentPresident(s)?.id:p.debtId;if(c.id==='executive-help'){p.debtId=who;p.debtAccepted=i===0;}
 if(c.id.startsWith('executive-')&&who){p.contacts.push({id:who,turn:s.turn,event:c.id,choice:i});if(c.id==='executive-request')s.statements.push({id:c.id,turn:s.turn,topic:'정치적 은인',text:c.choices[i].text,principle:i===0?'조건을 공개한 협력':'은혜와 정책의 분리',strength:i===0?1:3,exposure:s.stats.fame,contextTags:[who]});if(c.id==='executive-return'){const q=s.statements.find(x=>x.id==='executive-request');if(q){s.campaign?.reviews.push({source:q.id,event:c.id,quote:q.text,verdict:i===0?'원칙 유지':'입장 수정'});s.flags.push('부메랑: 정치적 은인');}}}
}
export function queuePresidentEvents(s:State){if(!s.calendar)return;const slots:[number[],string][]=[[[8,7,9],'executive-help'],[[30,32,35],'executive-request'],[[38,39],'executive-return']];for(const [positions,id] of slots){const at=positions.find(at=>!s.route[at].startsWith('world-')&&!s.route[at].startsWith('merger-')&&!s.route[at].startsWith('balance-fund-'));if(at!==undefined)s.route[at]=id;}}
export function eligiblePresidentEvent(s:State,id:string){if(!s.presidency)return false;if(id==='executive-help')return true;if(id==='executive-request')return s.presidency.debtAccepted===true;return s.statements.some(x=>x.id==='executive-request');}
