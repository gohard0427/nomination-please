import type {State} from './engine.ts';
import type {Card,Stats} from './content.ts';
import type {VarietyCard} from './event-factory.ts';
import type {PolicyId} from './support.ts';
import {partyById} from './parties.ts';
import {causalDrafts} from './causal-data.ts';
import {causalDebate} from './causal-debate.ts';
export const CAUSAL_FLAG='선택 인과: v1';
// 의미·자원·후일담을 한 묶음으로 교체한다. 게임 속 공적 예산과 개인 정치자금을 구분한다.
export function paired(card:Card,s:State,body:string,texts:[string,string],results:[string,string],notes:[string,string],topic:PolicyId,stances:[number,number],effects:[Partial<Stats>,Partial<Stats>]=[{trust:4,org:-1},{trust:1,org:4}]){
 card.body=body;card.choices=texts.map((text,i)=>({text,result:results[i],effect:{...effects[i]}})) as Card['choices'];
 const p=partyById(s.partyId,s),topics=['economy','labor','tax','housing','welfare','environment','migration','diplomacy','education','region','society','reform'];
 card.choices.forEach((c,i)=>{if(p)c.effect.party=Math.round(p.positions[topics.indexOf(topic)]*stances[i]*6);});
 Object.assign(card,{signals:stances.map(stance=>[{topic,stance,strength:.55}]),values:[{},{}],costNotes:notes});return card;
}
const semantics:Record<string,[PolicyId,[number,number],[string,string]]>={
 'age-pension':['tax',[.65,-.4],['보험료를 더 걷어 연금 재원을 지키기로 했습니다. 월급 명세서를 본 청년들이 간담회를 잡았습니다.','보험료 인상을 늦추기로 했습니다. 미래 연금의 인상 폭도 낮아집니다. 미래의 나에게는 아직 알리지 못했습니다.']],
 'fresh-central-3':['welfare',[.7,.25],['지원 대상을 넓혔습니다. 빚을 다 갚은 사장님이 영수증을 들고 찾아왔습니다.','지원 대상을 좁혔습니다. 기준선 바로 밖의 폐업자들은 다시 계산기를 켰습니다.']],
 'housing-rebuild':['housing',[-.5,.65],['사업 수익을 더 남기는 안입니다. 공공시설 비용을 누가 낼지는 별도로 남았습니다.','개발 수익의 공공 환원을 늘리는 안입니다. 사업자들은 계산기를 두드리며 착공 시점을 다시 묻습니다.']],
 'fresh-prePolitics-8':['region',[.5,.4],['등하교 시간 단속부터 요구했습니다. 상인들은 물건 내릴 곳도 함께 찾아달라고 합니다.','별도 공간부터 마련하자고 요구했습니다. 공간이 생기기 전까지 아이들의 통학 위험은 남습니다.']],
 'work-automation':['labor',[.7,.15],['기존 직원의 교육과 협의를 지원 조건으로 제안했습니다. 회사는 도입 일정이 늦어진다고 합니다.','새로 채용하는 기업에 지원을 집중했습니다. 기존 회사에서 자리를 잃을 직원의 대책은 남았습니다.']],
 'career-law-ai-judge':['reform',[.3,.65],['AI의 첫 판단과 판사의 재심을 제안했습니다. 속도는 기대하지만 오판 책임과 재심 인력은 따져야 합니다.','판결은 사람이 맡도록 했습니다. AI가 서류를 정리해도 법정의 대기 줄까지 바로 사라지지는 않습니다.']],
 'elite-experts':['reform',[.2,.75],['전문가 위원회의 최종 선정을 택했습니다. 주민은 점수표를 볼 수 있지만 직접 고르지는 못합니다.','전문가 검토 뒤 주민 투표를 택했습니다. 결정권은 넓어졌고 결정까지 시간과 비용이 더 듭니다.']],
 'world-stock-down-central':['economy',[-.65,.5],['공적 자금 투입을 지지했습니다. 시장 안정이 목표이며 투자자 개인의 손실 보상을 약속한 것은 아닙니다. 국민 부담 위험은 남습니다.','공적 자금 투입을 반대하고 불공정 거래 단속을 요구했습니다. 단속만으로 당장의 급락을 막기는 어렵습니다.']],
 'election-integrity':['reform',[.7,.3],['결과를 인정하고 관리 책임은 따로 조사하자고 했습니다. 지지자 일부는 검증을 더 요구합니다.','법적 추가 검증을 요구했습니다. 입장을 유보해도 선거 결과나 취임 절차가 자동으로 멈추지는 않습니다.']],
 'cabinet':['reform',[.4,.5],['지역 조직에 강한 라이벌에게 총괄을 맡겼습니다. 정책 보완도 이제 그의 책임입니다.','정책에 강한 청년 활동가에게 총괄을 맡겼습니다. 기존 지역 조직을 설득할 책임도 함께 갔습니다.']],
 'responsibility':['reform',[.7,.55],['통계를 바로잡고 후보가 사과했습니다. 마지막 유세의 주인공은 공약이 아니라 정정문이었습니다.','통계는 바로잡고 책임 조사를 약속했습니다. 개표는 기다려주지 않습니다.']],
 'fresh-prePolitics-2':['region',[.3,.3],['잘못 인쇄된 직함을 스티커로 가렸습니다. 손은 많이 갔지만 새 인쇄비는 아꼈습니다.','명함을 새로 찍었습니다. 직함은 정확해졌고 잔고는 더 겸손해졌습니다.']]
};
export function causalRevision(card:Card,s:State):Card{
 if(!s.flags.includes(CAUSAL_FLAG))return card;
 if(card.id.startsWith('debate-'))return causalDebate(card,s);
 const draft=(causalDrafts as unknown as Record<string,{body:string;choices:[string,string];note:string}>)[card.id],rule=semantics[card.id];
 if(draft&&rule){const [topic,stances,results]=rule;const notes=draft.note.split(' / ');const effects:[Partial<Stats>,Partial<Stats>]=card.id==='fresh-prePolitics-2'?[{funds:-1,org:3},{funds:-5,trust:4}]:[{trust:4,org:1},{trust:2,org:3}];paired(card,s,draft.body,draft.choices,results,[notes[0],notes[1]??notes[0]],topic,stances,effects);if(card.id==='fresh-prePolitics-2')card.body='정치 입문을 알릴 첫 명함에 아직 갖지 않은 직함이 인쇄됐습니다. 이 명함을 어떻게 처리할까요?';}
 if(card.id==='press-return'){
  const prior=[...s.history].reverse().find(h=>h.decision?.cardId==='press-return');
  paired(card,s,(prior?`당신이 실제로 한 말 “${prior.choice}”. `:'')+'가까운 방송 진행자가 상대 후보의 의혹을 제기했습니다. 원본은 아직 확인되지 않았지만 캠프는 널리 공유하자고 합니다. 어떻게 대응할까요?',
   ['우리 편 방송도 원본을 확인하기 전에는 퍼뜨리지 않겠습니다.','확인되지 않았다고 밝히고 공유하겠습니다. 의혹 제기도 검증의 출발입니다.'],
   ['원본 확인까지 공유를 멈췄습니다. 상대에게 유리한 시간을 줬다는 캠프의 불평도 들었습니다.','미확인 의혹임을 표시해 공유했습니다. 표시를 붙였어도 확산한 책임과 오보 위험은 남습니다.'],['검증 우선 · 공격 시점 지연','공론화 우선 · 오보·평판 위험'],'reform',[.75,.2]);
 }
 if(card.id==='housing'&&s.job===2)paired(card,s,'공공사업 계약에 가족 회사가 지원하려 합니다. 당신이 심사에서 빠져도 가족 이익과 공적 판단이 얽힐 수 있습니다. 가족 회사에 무엇을 요구할까요?', ['이번 계약에는 참여하지 말아달라고 요구하겠습니다.','관계를 공개하고 독립 심사를 받는 조건으로 참여하게 하겠습니다.'],['가족 회사에 불참을 요구했습니다. 가족은 독립된 회사라며 반발합니다. 요구만으로 실제 불참이 확정되지는 않습니다.','가족 관계를 공개하고 독립 심사를 요구했습니다. 심사를 통과해도 특혜 의심을 설명할 책임은 남습니다.'],['이해충돌 예방 · 가족 관계 부담','참여 기회 유지 · 특혜 검증 부담'],'reform',[.8,.35]);
 const structural:Record<string,[string,[string,string],[string,string],[string,string],PolicyId,[number,number]]>={
 'religion-budget':['무료 급식 사업의 지원금을 다시 배정합니다. 실적이 좋은 기존 종교단체에 바로 연장해줄지, 새 단체까지 같은 공개 심사를 받게 할지 정해야 합니다.',['실적이 확인된 기존 단체는 재공모 없이 지원을 연장하겠습니다.','기존 단체도 새 단체와 같은 공개 심사를 받게 하겠습니다.'],['급식의 연속성을 우선했습니다. 새 단체는 참여 기회가 좁아졌다고 반발합니다.','같은 심사 기준을 적용합니다. 심사 기간에도 급식이 끊기지 않을 대책이 필요합니다.'],['사업 연속성 · 신규 단체 참여 제약','동등한 심사 · 심사 기간 운영 부담'],'reform',[.1,.75]],
 'religion-law':['종교 집회가 법정 소음 기준을 넘었습니다. 주최 측은 신앙의 자유를 말하지만 주민은 잠을 못 잔다고 합니다. 어떤 해결책을 요구할까요?',['현재 장소에서 음향과 집회 규모를 줄여 기준을 지키게 합시다.','비용이 들더라도 기준을 지킬 수 있는 다른 장소로 옮기게 합시다.'],['규모와 소리를 줄이는 안입니다. 현장 집회는 유지하지만 주최 측은 전달력이 약해졌다고 합니다.','장소 이전을 요구했습니다. 신앙의 자유는 유지하지만 비용과 접근성 부담이 생깁니다.'],['현 장소 유지 · 집회 전달력 감소','소음 갈등 완화 · 이전 비용·이동 부담'],'society',[.3,.4]],
 'fresh-central-12':['환자 자료를 연구에 쓰면 치료법 개발에 도움이 됩니다. 개인정보 노출 위험 때문에, 연구 전 환자 동의를 어디까지 받을지 논쟁입니다. 어떤 제도를 제안할까요?',['환자에게 개별 동의를 먼저 받은 자료만 연구에 쓰게 합시다.','공익 연구는 개인정보를 가리고 독립 심사를 거치면, 개별 사전 동의 없이도 쓰게 합시다.'],['사전 동의를 우선했습니다. 참여자가 부족하면 연구가 늦어질 수 있습니다.','승인된 공익 연구의 자료 접근을 넓히는 제안입니다. 재식별 위험과 감독 책임이 남습니다.'],['동의권 우선 · 자료 확보 지연','연구 활용 우선 · 재식별·감독 위험'],'society',[.7,.2]],
 'fresh-central-24':['실종자를 찾기 위해 거리 영상에서 얼굴을 자동으로 비교하자는 제안입니다. 빨리 찾을 수 있지만 평소 시민들의 얼굴까지 검색할 수 있습니다. 범위를 어디까지 허용할까요?',['실종자 수색용 상시 검색을 허용하되, 용도를 제한하고 사용 기록을 감사합시다.','개별 수색 사건마다 승인을 받은 뒤에만 얼굴 검색을 허용합시다.'],['수색 속도를 우선했습니다. 다른 용도로 쓰이지 않는지 상시 감독해야 합니다.','사건별 승인을 우선했습니다. 승인 대기 중 수색이 늦어질 수 있습니다.'],['신속한 검색 · 상시 감시 위험','사건별 통제 · 승인 대기 시간'],'society',[.1,.7]],
 'fresh-party-guardian-3':['민주화운동 기념사업의 예산을 두고 논쟁입니다. 부실 사업만 골라 정리할지, 전체 예산을 줄여 생활 지원에 돌릴지 선택해달랍니다.',['전체 예산은 유지하고, 낭비가 확인된 사업만 정리하겠습니다.','기념사업 전체 예산을 줄이고, 줄인 돈은 생활 지원에 쓰겠습니다.'],['기념의 의미와 사업 감사를 구분했습니다. 감사 전까지 기존 예산은 유지합니다.','생활 지원을 우선했습니다. 필요한 기념사업까지 위축될 수 있다는 반발도 나옵니다.'],['기념사업 유지 · 감사 부담','생활 지원 전환 · 기념사업 축소'],'society',[.55,-.3]],
 'fresh-job-6-3':['방송인 시절 동료를 지역 캠프 행사에 초대하려니 소속사가 통상 출연료를 요구합니다. 캠프 돈은 한정돼 있습니다. 어떻게 행사를 바꿀까요?',['출연료를 지급하고, 현장 행사를 작게 열겠습니다.','출연을 요청하지 않고, 후보가 직접 온라인 정책 문답을 하겠습니다.'],['출연료를 내고 현장 규모를 줄였습니다. 사람은 모였지만 잔고도 무대에서 내려갔습니다.','초대 대신 직접 온라인 방송을 켰습니다. 출연료는 아꼈지만 시청자를 모을 일은 남았습니다.'],['현장 관심 · 출연료 지출','비용 절약 · 관심 확보 부담'],'region',[.3,.3]]
 };
 const fix=structural[card.id];if(fix){paired(card,s,...fix);if(card.id==='fresh-job-6-3'){card.choices[0].effect.funds=-6;card.choices[1].effect.funds=-1;}}

 return card;
}
