import {chooseReality,realityDue} from './reality.ts';
import {CAREER_FLAG} from './career.ts';
import type {State} from './engine.ts';
import {varietyCards,type VarietyCard,type Chapter} from './variety-content.ts';
export function mixSeed(seed:number){let x=seed>>>0;x=Math.imul(x^(x>>>16),0x7feb352d);x=Math.imul(x^(x>>>15),0x846ca68b);return (x^(x>>>16))>>>0}
export const VARIETY_FLAG='사건 구성: variety-v1';
const optional=new Set(['wage','redtape','inheritance','rent','care','forest','migration','peace','school','balance','equal','soup','poster','press','rival','bus','donation','door','debate','promise','campaign','fatigue','faction','regional-tour','safety','migration-review','energy','tax-review','endorsement','incumbent','turnout']);
const introductory=new Set(['wage','redtape','inheritance','rent','care','forest','migration','peace','school','balance','equal']);
const local=new Set(['soup','poster','press','rival','bus','donation','door','debate','promise','campaign']);
const central=new Set(['fatigue','faction']);
export function slotsFor(original:string[]){return original.map((id,i)=>i===0?'?origin':!optional.has(id)?id:introductory.has(id)?'?prePolitics':local.has(id)?'?local':central.has(id)?'?central':'?presidential')}
export function remembered(s:State,id:string,index:0|1){return s.flags.includes(`분기:${id}:${index}`)}
export function eligible(card:VarietyCard,s:State){if(card.id.startsWith('balance-fund-')&&(!s.flags.includes(VARIETY_FLAG)||s.stats.funds+s.finance.illicit>16||s.flags.some(f=>f.startsWith('분기:'+card.id+':'))))return false;if(card.id.startsWith('career-')&&!s.flags.includes(CAREER_FLAG))return false;if(['ai-junior-ladder','ai-small-business','ai-regional-jobs','ai-time-dividend','majority-limits','election-integrity','career-law-ai-judge'].includes(card.id)&&s.history.some(h=>h.title===card.title))return false;if(card.jobs&&!card.jobs.includes(s.job)||card.parties&&!card.parties.includes(s.partyId??''))return false;if(card.requires&&!card.requires.every(([id,index])=>remembered(s,id,index)))return false;if(card.id==='friend-leak')return s.flags.includes('동기 통화 유출 가능');if(card.id==='friend-verdict')return s.flags.includes('동기 통화 보도');return true}
export function isVariety(s:State){return s.flags.includes(VARIETY_FLAG)}
export function slotChapter(slot:string):Chapter{return slot==='?origin'?'prePolitics':slot.slice(1) as Chapter}
export function drawForSlot(s:State,slot:string,all:Map<string,VarietyCard>,roll:()=>number,position=s.cursor):string {
 const block=retryBlocks(s).find(b=>position>=b.start&&position<b.start+8);const used=new Set(block?s.route.slice(block.start,block.start+8).filter((_,i)=>block.start+i!==position):s.route.filter((_,i)=>i!==position));if(block)for(const id of ['democracy','party-offer','leader','investigation','housing','youth','betrayal','family-clue','audit','family','return','law','freepress','ally','president','primary','family-check','cross-debate'])used.add(id);const phase=slotChapter(slot);
 const candidates=[...all.values()].filter(c=>c.chapter===phase&&!(c.kind==='memory'&&s.route.slice(0,position).includes(c.id))&&!c.id.startsWith('retry-')&&!used.has(c.id)&&eligible(c,s)&&!(c.id==='career-activist-donor'&&position<2)&&!s.pending.some(p=>p.id===c.id&&p.due>position));
 if(!candidates.length)throw Error('사용 가능한 사건이 없습니다: '+slot);
 const due=s.pending.find(p=>p.due<=position&&candidates.some(c=>c.id===p.id));if(due)return due.id;
 const careerPriority=candidates.find(c=>c.id===(phase==='local'?'career-rival-meet':phase==='central'&&s.job===3?'career-law-justices':phase==='prePolitics'&&s.job===0&&position>=2?'career-activist-donor':''));if(careerPriority)return careerPriority.id;
 const funding=candidates.find(c=>c.id==='balance-fund-'+phase);if(funding)return funding.id;
 const aiJudge=candidates.find(c=>c.id==='career-law-ai-judge');if(aiJudge)return aiJudge.id;
 const field=candidates.find(c=>c.id===(phase==='local'?({4:'balance-press-field',5:'balance-official-field',7:'balance-military-field'} as Record<number,string>)[s.job]:phase==='prePolitics'&&position>=3?({4:'origin-press',5:'origin-official',7:'origin-military'} as Record<number,string>)[s.job]:''));if(field)return field.id;
 const memories=candidates.filter(c=>c.kind==='memory');if(memories.length)return memories[Math.floor(roll()*memories.length)].id;
 const last=s.route[s.cursor-1];const lastKind=all.get(last)?.kind;
 const weight=(c:VarietyCard)=>c.kind==='memory'?10:c.kind==='origin'?8:c.jobs?7:c.kind==='party'?6:c.kind===lastKind?1:3;
 const withMaterial=realityDue(s)?candidates.filter(c=>chooseReality(s,c,0)):[];const pool=withMaterial.length?withMaterial:candidates;
 let pick=roll()*pool.reduce((n,c)=>n+weight(c),0);return pool.find(c=>(pick-=weight(c))<0)?.id??pool.at(-1)!.id;
}
export function fillRoute(s:State,original:string[],all:Map<string,VarietyCard>,roll:()=>number){const slots=slotsFor(original);s.route=slots.map(x=>x.startsWith('?')?'':x);slots.forEach((slot,i)=>{if(slot.startsWith('?'))s.route[i]=drawForSlot(s,slot,all,roll,i)});}
export function refreshNext(s:State,original:string[],all:Map<string,VarietyCard>,roll:()=>number){if(s.cursor>=s.route.length)return;const block=retryBlocks(s).find(b=>s.cursor>=b.start&&s.cursor<b.start+8);if(!isVariety(s)&&!block)return;const slot=slotsForState(s,s.legacy?['soup','leader','investigation','poster','press','housing','rival','youth','bus','betrayal','appeal','family-clue','audit','donation','family','door','debate','promise','campaign','rain','return','party-switch','law','national','freepress','recruit','ally','fatigue','faction','responsibility','president','cabinet','policy','coalition','tv','last']:original)[s.cursor];if(slot.startsWith('?'))s.route[s.cursor]=drawForSlot(s,slot,all,roll);}
export function validGeneratedRoute(route:unknown,job:number,original:string[],all:Map<string,VarietyCard>){if(!Array.isArray(route)||route.length!==original.length||new Set(route).size!==route.length)return false;return slotsFor(original).every((slot,i)=>{if(!slot.startsWith('?'))return route[i]===slot;const card=all.get(route[i]);return !!card&&card.chapter===slotChapter(slot)&&(!card.jobs||card.jobs.includes(job))})}
// 원래의 선택 가능한 사건도 같은 타입의 풀에 포함한다. 내용 없는 복제 카드는 만들지 않는다.
export function asPool(card:any,chapter:Chapter):VarietyCard{return {...card,chapter,kind:card.id==='fatigue'?'light':'conflict',costNotes:card.costNotes??['현장과 원칙에 투자 · 자원과 관계의 비용','다른 접근을 택함 · 이후 검증과 설명의 책임'],signals:card.signals??[[{topic:'region',stance:.6,strength:.45}],[{topic:'region',stance:-.15,strength:.45}]]};}
export {varietyCards};

export const retryTemplates:Record<'local'|'central'|'presidential',string[]>={
 local:['retry-local','?local','appeal','?local','campaign','debate','?local','rain'],
 central:['retry-central','?central','party-switch','?central','national','recruit','?central','responsibility'],
 presidential:['retry-presidential','?presidential','cabinet','?presidential','policy','tv','?presidential','last']
};
export function retryBlocks(s:Pick<State,'flags'>){return s.flags.filter(f=>f.startsWith('재도전:')).map(f=>{const [,phase,start]=f.split(':');return {phase:phase as keyof typeof retryTemplates,start:Number(start)}})}
export function slotsForState(s:State,original:string[]){const slots=slotsFor(original);for(const b of retryBlocks(s))slots.splice(b.start,0,...retryTemplates[b.phase]);return slots;}
export function validSavedRoute(s:State,original:string[],legacy:string[],all:Map<string,VarietyCard>){
 if(!Array.isArray(s.route)||s.route.length>1000||!Array.isArray(s.flags))return false;
 const blocks=retryBlocks(s);let end=-1;const base=[...s.route];
 for(const b of blocks){if(!retryTemplates[b.phase]||!Number.isInteger(b.start)||b.start<=end||b.start<1||b.start+8>s.route.length)return false;const boss={local:'rain',central:'responsibility',presidential:'last'}[b.phase];if(s.route[b.start-1]!==boss)return false;const template=retryTemplates[b.phase];for(let i=0;i<8;i++){const id=s.route[b.start+i],slot=template[i];if(!slot.startsWith('?')){if(id!==slot)return false;}else{const card=all.get(id);if(!card||card.chapter!==b.phase||card.jobs&&!card.jobs.includes(s.job))return false;}}end=b.start+7;}
 for(const b of [...blocks].reverse())base.splice(b.start,8);
 return [JSON.stringify(original),JSON.stringify(legacy)].includes(JSON.stringify(base))||s.flags.includes(VARIETY_FLAG)&&validGeneratedRoute(base,s.job,original,all);
}
