import type {State} from './engine.ts';import type {Card} from './content.ts';
import {fundsLocked} from './final-duel.ts';
export type AbilityUse={id:string;turn:number;cardId:string;kind:string;target?:0|1;clue?:string};
export type AbilityState={version:1;uses:AbilityUse[];pending?:string};
export const abilityNames=['사람부터 모읍시다','제가 담당자를 압니다','견적 다시 받으세요','변호인 선임하겠습니다','원본부터 보죠','실행계획 가져오세요','카메라 켜졌습니다','대응체계 가동','이전 답변과 충돌합니다'];
const key=(s:State,c:Card)=>`${s.cursor}:${c.id}`;
export const skillCard=(id:string)=>/^skill-\d-[01]$/.test(id);
export function abilityPlan(s:State,c:Card){
 if(!s.ability||s.completed||s.stage!=='play'||['funds-crisis','funds-exposure'].includes(c.id))return null;
 const id=key(s,c),prior=s.ability.uses.find(x=>x.id===id);if(prior)return {name:abilityNames[s.job],id,used:true,note:'이 사건에 사용했습니다.',clue:prior.clue,choice:prior.target};
 if(s.ability.uses.length>=2)return null;
 const own=skillCard(c.id)&&c.id.startsWith(`skill-${s.job}-`);let eligible=own,note='',clue:string|undefined;
 switch(s.job){
 case 0:eligible=eligible||['soup','bus','door','campaign','rain'].includes(c.id);eligible=eligible&&s.stats.funds>0&&s.stats.funds+s.finance.illicit<100&&s.npcs.some(n=>n.role.includes('조직')&&n.trust>=30);note='현장 조직과 합법 소액후원을 모읍니다. 선택 결과에 자금 최대8·조직2를 보탭니다. 기존 불법 수수 기록은 남습니다.';break;
 case 1:eligible=eligible||['soup','bus','door','local-rice','world-water-local','world-blackout-local'].includes(c.id);note='기관의 정식 접수 경로와 진행 상황을 확인합니다. 조직4를 보완하며 민원 해결이나 공천을 보장하지 않습니다.';break;
 case 2:eligible=c.choices.some(x=>(x.effect.funds??0)<=-2)&&!fundsLocked(s)&&!['law','friend-leak','friend-verdict'].includes(c.id)&&(/^(skill-|soup$|bus$|door$|campaign$|rain$|tv$|fresh-prePolitics-|fresh-job-2-)/.test(c.id));note='해당 선택의 실제 캠프 운영 지출을 절반, 최대4까지 줄입니다. 절감액은 현금으로 지급하지 않습니다.';break;
 case 3:eligible=(own||['law','appeal','friend-leak'].includes(c.id))&&c.choices.some(x=>(x.effect.funds??0)<=-2)&&!fundsLocked(s);note='정식 대응인 선택 A의 남은 준비 비용을 절반, 최대4까지 줄입니다. 친구 찬스·녹취·수사 결과는 바꾸지 않습니다.';eligible=eligible&&(c.choices[0].effect.funds??0)<=-2;break;
 case 4:eligible=own||['law','family','press-return'].includes(c.id);clue=c.id==='law'?'경력 확인에 쓸 임명 자료가 있습니다. 진위를 확정하려면 수사기관의 원본 대조가 필요합니다.':c.id==='family'?'거래 시점과 개발 발표 시점을 따로 대조할 자료가 있습니다. 보도만으로 위법이 확정되지는 않습니다.':c.id==='press-return'?'현재 공개된 것은 주장과 편집본입니다. 원본 확인이 끝났다는 자료는 없습니다.':(c.id==='skill-4-1'?'보관된 전체 영상에는 짧은 편집본에서 빠진 질문과 답변 앞부분이 있습니다. 전체 맥락을 확인해야 합니다.':'담당자의 접수 기록에는 서류가 도착한 시각이 남아 있습니다. 접수와 심사 결과를 따로 확인할 수 있습니다.');note='이 사건에 준비된 접수·원본 확인 단서를 찾습니다. 사용 확정 즉시1회 차감·저장하며 유죄·무죄를 판정하지 않습니다.';break;
 case 5:eligible=own;note='실행 인력과 절차를 점검해 이 카드의 준비 부족에 따른 조직 손실을 최대3 줄입니다. 준비 자금1이 필요합니다. 정책 반대는 남습니다.';eligible=eligible&&!fundsLocked(s)&&s.stats.funds>=1;break;
 case 6:eligible=own||['investigation','freepress','democracy-names','policy','tv','press-return'].includes(c.id)||c.id.startsWith('debate-');note='이번 공개 발언의 노출을 추가로 넓힙니다. 인지도 효과만 강화하며 지지율이나 발언 내용은 바꾸지 않습니다. 이후 같은 쟁점에서 더 널리 인용될 수 있습니다.';break;
 case 7:eligible=own;note='대피·현장 협조 계획으로 이 카드의 대응 혼선에 따른 조직 손실을 최대3 줄입니다. 정책 찬반·군 지휘권·법적 책임에는 영향이 없습니다.';break;
 case 8:{const topic=c.topic;const old=[...s.history].reverse().find(h=>h.decision&&h.decision.cardId!==c.id&&(own?h.decision.cardId==='origin-gpt':s.statements.some(q=>q.id===h.decision!.cardId&&q.topic===topic)));eligible=!!old;clue=old?`실제 ${old.turn+1}번째 답변: “${old.choice}” · 당시 질문: ${old.decision!.question} · 이번에도 같은 대상과 예외 조건인지, 책임 주체가 달라졌는지 비교하세요. 입장 수정만으로 위선이 되지는 않습니다.`:undefined;note='관련된 실제 답변의 맥락과 현재 요구를 대조합니다. 숨은 진실·미래 결과·정답은 제공하지 않습니다.';break;}
 }
 const targets=c.choices.flatMap((x,i)=>(s.job===2&&(x.effect.funds??0)<=-2||s.job===3&&i===0)?[i as 0|1]:[]);const choice=targets.length===1?targets[0]:undefined;return eligible?{id,name:abilityNames[s.job],used:false,note,clue,choice}:null;
}
export function commitAbility(s:State,c:Card){const p=abilityPlan(s,c);if(!p||p.used)return s;const next=structuredClone(s);next.ability!.uses.push({id:p.id,turn:s.turn,cardId:c.id,kind:abilityNames[s.job],...(p.choice!==undefined?{target:p.choice}:{}),...(p.clue?{clue:p.clue}:{})});next.ability!.pending=p.id;return next;}
export function abilityCard(c:Card,s:State){if(!s.ability?.pending||s.ability.pending!==key(s,c))return c;
 c.choices.forEach((x,i)=>{const cost=Math.max(0,-(x.effect.funds??0));if(s.job===0){x.effect.funds=(x.effect.funds??0)+Math.min(8,100-s.stats.funds-s.finance.illicit);x.effect.org=(x.effect.org??0)+2;}if(s.job===1)x.effect.org=(x.effect.org??0)+4;if((s.job===2||s.job===3&&i===0)&&cost&&!fundsLocked(s))x.effect.funds=-cost+Math.min(4,Math.floor(cost/2));if(s.job===5||s.job===7){const loss=Math.max(0,-(x.effect.org??0));x.effect.org=(x.effect.org??0)+Math.min(3,loss);if(s.job===5&&!fundsLocked(s))x.effect.funds=(x.effect.funds??0)-1;}if(s.job===6)x.effect.fame=(x.effect.fame??1)+7;x.result+=` [능력: ${abilityNames[s.job]}]`;});return c;}
export function validAbility(a:any,s:State){if(!s?.flags?.includes('선택과 능력: v0.14'))return a===undefined;if(a===undefined)return !s.flags.includes('선택과 능력: v0.14');return a?.version===1&&Array.isArray(a.uses)&&a.uses.length<=2&&new Set(a.uses.map((x:any)=>x.id)).size===a.uses.length&&a.uses.every((u:any)=>typeof u.id==='string'&&u.id===`${u.turn}:${u.cardId}`&&Number.isInteger(u.turn)&&u.turn>=0&&u.turn<=s.turn&&typeof u.cardId==='string'&&u.kind===abilityNames[s.job]&&(s.history.some(h=>h.turn===u.turn&&h.decision?.cardId===u.cardId)||u.turn===s.cursor&&s.route[s.cursor]===u.cardId&&(a.pending===u.id||s.completed))&&(u.target===undefined||[0,1].includes(u.target))&&(u.clue===undefined||typeof u.clue==='string'&&u.clue.length<15000))&&(a.pending===undefined||a.pending===`${s.cursor}:${s.route[s.cursor]}`&&a.uses.some((u:any)=>u.id===a.pending)&&s.stage==='play');}
