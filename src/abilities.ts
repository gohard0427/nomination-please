import {relatedAiAnswer} from './ai-openers.ts';
import type {State} from './engine.ts';import type {Card} from './content.ts';
import {fundsLocked} from './final-duel.ts';
export type AbilityUse={id:string;turn:number;cardId:string;kind:string;target?:0|1;clue?:string};
export type AbilityState={version:1;uses:AbilityUse[];pending?:string};
export const abilityNames=['사람부터 모읍시다','제가 담당자를 압니다','견적 다시 받으세요','변호인 선임하겠습니다','원본부터 보죠','실행계획 가져오세요','카메라 켜졌습니다','대응체계 가동','이전 답변 대조'];
const key=(s:State,c:Card)=>`${s.cursor}:${c.id}`;
export const skillCard=(id:string)=>/^skill-\d-[01]$/.test(id);
export function abilityPlan(s:State,c:Card){
 if(!s.ability||s.completed||s.stage!=='play'||['funds-crisis','funds-exposure'].includes(c.id))return null;
 const id=key(s,c),prior=s.ability.uses.find(x=>x.id===id);if(prior)return {name:abilityNames[s.job],id,used:true,note:'이 사건에 사용했습니다.',clue:prior.clue,choice:prior.target};
 if(s.ability.uses.length>=2)return null;
 const own=skillCard(c.id)&&c.id.startsWith(`skill-${s.job}-`);let eligible=own,note='',clue:string|undefined;
 switch(s.job){
 case 0:eligible=eligible||['soup','bus','door','campaign','rain'].includes(c.id);eligible=eligible&&s.stats.funds>0&&s.stats.funds+s.finance.illicit<100&&s.npcs.some(n=>n.role.includes('조직')&&n.trust>=30);note='선택 결과에 합법 정치자금 최대 8과 지역 조직력 2를 더합니다. 현장 활동이나 후원 모임에서 자금이 부족할 때 유리합니다.';break;
 case 1:eligible=eligible||['soup','bus','door','local-rice','world-water-local','world-blackout-local'].includes(c.id);note='이번 선택의 지역 조직력을 4 더합니다. 민원이나 지역 활동에서 기반을 다질 때 유리합니다. 민원 해결이 확정되는 것은 아닙니다.';break;
 case 2:eligible=c.choices.some(x=>(x.effect.funds??0)<=-2)&&!fundsLocked(s)&&!['law','friend-leak','friend-verdict'].includes(c.id)&&(/^(skill-|soup$|bus$|door$|campaign$|rain$|tv$|fresh-prePolitics-|fresh-job-2-)/.test(c.id));note='이번 선택의 운영비 지출을 절반만큼, 최대 4 줄입니다. 큰 지출이 있는 카드에서 유리합니다. 줄일 금액은 정수로 계산합니다.';break;
 case 3:eligible=(own||['law','appeal','friend-leak'].includes(c.id))&&c.choices.some(x=>(x.effect.funds??0)<=-2)&&!fundsLocked(s);note='선택 A의 정식 법률 대응 비용을 절반만큼, 최대 4 줄입니다. 사용하면 A도 함께 선택됩니다. 수사 결과나 녹취는 바뀌지 않습니다.';eligible=eligible&&(c.choices[0].effect.funds??0)<=-2;break;
 case 4:eligible=own||['law','family','press-return'].includes(c.id);clue=c.id==='law'?'경력 확인에 쓸 임명 자료가 있습니다. 진위를 확정하려면 수사기관의 원본 대조가 필요합니다.':c.id==='family'?'거래 시점과 개발 발표 시점을 따로 대조할 자료가 있습니다. 보도만으로 위법이 확정되지는 않습니다.':c.id==='press-return'?'현재 공개된 것은 주장과 편집본입니다. 원본 확인이 끝났다는 자료는 없습니다.':(c.id==='skill-4-1'?'보관된 전체 영상에는 짧은 편집본에서 빠진 질문과 답변 앞부분이 있습니다. 전체 맥락을 확인해야 합니다.':'담당자의 접수 기록에는 서류가 도착한 시각이 남아 있습니다. 접수와 심사 결과를 따로 확인할 수 있습니다.');note='서류나 보도의 원본을 확인할 단서를 보여줍니다. 자료가 빠졌거나 편집된 보도가 의심될 때 유리합니다. 능력만으로 진위가 확정되지는 않습니다.';break;
 case 5:eligible=own;note='이번 선택의 지역 조직력 감소를 최대 3 막습니다. 준비 자금 1이 추가로 듭니다. 조직력이 줄어드는 선택을 해야 할 때 유리합니다.';eligible=eligible&&!fundsLocked(s)&&s.stats.funds>=1;break;
 case 6:eligible=own||['investigation','freepress','democracy-names','policy','tv','press-return'].includes(c.id)||c.id.startsWith('debate-');note='이번 발언의 인지도 효과를 강화합니다. 이름을 알리고 싶을 때 유리합니다. 지지율은 바로 오르지 않으며 비판도 더 널리 퍼질 수 있습니다.';break;
 case 7:eligible=own;note='이번 선택의 지역 조직력 감소를 최대 3 막습니다. 현장 대응이 혼란스러울 때 유리합니다. 정책에 반대하는 여론은 그대로입니다.';break;
 case 8:{const topic=c.topic;const old=[...s.history].reverse().find(h=>h.decision&&h.decision.cardId!==c.id&&(own?relatedAiAnswer(c.id,h.decision.cardId,s):s.statements.some(q=>q.id===h.decision!.cardId&&q.topic===topic)));eligible=!!old;clue=old?`실제 ${old.turn+1}번째 답변: “${old.choice}” · 당시 질문: ${old.decision!.question} · 이번에도 같은 대상과 예외 조건인지, 책임 주체가 달라졌는지 비교하세요. 입장 수정만으로 위선이 되지는 않습니다.`:undefined;note='지금 질문과 관련된 이전 답변을 찾아 함께 보여줍니다. 내가 무슨 말을 했는지 확인할 때 쓰세요. 모순이나 정답을 자동 판정하지는 않습니다.';break;}
 }
 const targets=c.choices.flatMap((x,i)=>(s.job===2&&(x.effect.funds??0)<=-2||s.job===3&&i===0)?[i as 0|1]:[]);const choice=targets.length===1?targets[0]:undefined;return eligible?{id,name:abilityNames[s.job],used:false,note,clue,choice}:null;
}
export function commitAbility(s:State,c:Card){const p=abilityPlan(s,c);if(!p||p.used)return s;const next=structuredClone(s);next.ability!.uses.push({id:p.id,turn:s.turn,cardId:c.id,kind:abilityNames[s.job],...(p.choice!==undefined?{target:p.choice}:{}),...(p.clue?{clue:p.clue}:{})});next.ability!.pending=p.id;return next;}
export function abilityCard(c:Card,s:State){if(!s.ability?.pending||s.ability.pending!==key(s,c))return c;
 c.choices.forEach((x,i)=>{const cost=Math.max(0,-(x.effect.funds??0));if(s.job===0){x.effect.funds=(x.effect.funds??0)+Math.min(8,100-s.stats.funds-s.finance.illicit);x.effect.org=(x.effect.org??0)+2;}if(s.job===1)x.effect.org=(x.effect.org??0)+4;if((s.job===2||s.job===3&&i===0)&&cost&&!fundsLocked(s))x.effect.funds=-cost+Math.min(4,Math.floor(cost/2));if(s.job===5||s.job===7){const loss=Math.max(0,-(x.effect.org??0));x.effect.org=(x.effect.org??0)+Math.min(3,loss);if(s.job===5&&!fundsLocked(s))x.effect.funds=(x.effect.funds??0)-1;}if(s.job===6)x.effect.fame=(x.effect.fame??1)+7;x.result+=` [능력: ${abilityNames[s.job]}]`;});return c;}
export function validAbility(a:any,s:State){if(!s?.flags?.includes('선택과 능력: v0.14'))return a===undefined;if(a===undefined)return !s.flags.includes('선택과 능력: v0.14');return a?.version===1&&Array.isArray(a.uses)&&a.uses.length<=2&&new Set(a.uses.map((x:any)=>x.id)).size===a.uses.length&&a.uses.every((u:any)=>typeof u.id==='string'&&u.id===`${u.turn}:${u.cardId}`&&Number.isInteger(u.turn)&&u.turn>=0&&u.turn<=s.turn&&typeof u.cardId==='string'&&(u.kind===abilityNames[s.job]||s.job===8&&u.kind==='이전 답변과 충돌합니다')&&(s.history.some(h=>h.turn===u.turn&&h.decision?.cardId===u.cardId)||u.turn===s.cursor&&s.route[s.cursor]===u.cardId&&(a.pending===u.id||s.completed))&&(u.target===undefined||[0,1].includes(u.target))&&(u.clue===undefined||typeof u.clue==='string'&&u.clue.length<15000))&&(a.pending===undefined||a.pending===`${s.cursor}:${s.route[s.cursor]}`&&a.uses.some((u:any)=>u.id===a.pending)&&s.stage==='play');}
