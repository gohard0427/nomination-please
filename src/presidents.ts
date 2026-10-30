import {candidateFor} from './candidates.ts';
import {partyById} from './parties.ts';
import type {State} from './engine.ts';
export const CALENDAR_FLAG='정치 달력: v1';
export const presidents=[
 {id:'promise',name:'남약속',partyId:'future',weight:8,sex:'남',style:'후계자를 약속하는 정치적 은인',quote:'자네한테만 하는 말이야.',art:0},
 {id:'profit',name:'나수익',partyId:'future',weight:8,sex:'남',style:'투자와 협상에 능한 기업형 대통령',quote:'국민도 결국 고객입니다.',art:1},
 {id:'ready',name:'강대비',partyId:'future',weight:8,sex:'남',style:'대비책의 대비책까지 준비하는 안보 전문가',quote:'만약을 대비해야 합니다.',art:2},
 {id:'hometown',name:'전고향',partyId:'future',weight:8,sex:'남',style:'전국을 고향이라 부르는 지역 협상가',quote:'제가 여기 사람 아닙니까.',art:3},
 {id:'reject',name:'오반려',partyId:'future',weight:8,sex:'여',style:'반려 도장을 든 절차의 달인',quote:'취지는 동의합니다. 반려합니다.',art:4},
 {id:'grant',name:'다지원',partyId:'better',weight:8,sex:'여',style:'모든 민원에 지원을 약속하는 생활정책 정치인',quote:'재원은 함께 찾읍시다.',art:5},
 {id:'power',name:'안내림',partyId:'better',weight:8,sex:'남',style:'개혁을 끝낸 뒤 권한을 내려놓겠다는 개혁가',quote:'아직 내려놓을 때가 아닙니다.',art:6},
 {id:'agree',name:'양합의',partyId:'better',weight:8,sex:'남',style:'양쪽에 다른 약속을 하는 중재자',quote:'두 분 다 동의하셨습니다.',art:7},
 {id:'field',name:'나현장',partyId:'better',weight:8,sex:'여',style:'직접 가야 믿는 현장 정치인',quote:'일단 제가 가겠습니다.',art:8},
 {id:'all',name:'모두찬',partyId:'better',weight:8,sex:'남',style:'모두가 찬성했다고 주장하는 외교 협상가',quote:'반대한다는 말은 못 들었습니다.',art:9},
 {id:'coding',name:'남코딩',partyId:'reform',weight:10,sex:'남',style:'나라를 프로그램처럼 고치려는 개발자',quote:'전임 정부 코드를 봤습니다. 다시 짜야 합니다.',art:10},
 {id:'gpt',name:'차지피',partyId:'reform',weight:10,sex:'AI',style:'국민의 마음까지 계산하려는 AI 정치인',quote:'오류가 아닙니다. 정책입니다.',art:11}
] as const;
export type PresidentTerm={id:string;name:string;partyId:string|null;start:number;end:number;source:'background'|'election'|'player'};
export type PresidentContact={id:string;turn:number;event:string;choice:0|1};
export type Presidency={version:1;terms:PresidentTerm[];contacts:PresidentContact[];debtId?:string;debtAccepted?:boolean;notice?:{from:string;to:string;count:number};};
export const day=(year:number,month=9,date=1)=>Math.floor(Date.UTC(year,month-1,date)/86400000);
export const dayParts=(n:number)=>{const d=new Date(n*86400000);return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,date:d.getUTCDate()}};
export const dayLabel=(n:number)=>{const d=dayParts(n);return `${d.year}.${String(d.month).padStart(2,'0')}.${String(d.date).padStart(2,'0')}`};
export function termEnd(start:number){const p=dayParts(start);return day(p.year+5,p.month,p.date)}
export function pickPresident(seed:number,serial:number,excluded:string[]=[],partyId?:string|null){const pool=presidents.filter(p=>!excluded.includes(p.id)&&(partyId===undefined||p.partyId===partyId));if(!pool.length)throw Error('대통령 인물 풀이 소진됐습니다.');let h=(seed^Math.imul(serial+1,0x9e3779b1))>>>0;h=Math.imul(h^(h>>>16),0x85ebca6b)>>>0;h=Math.imul(h^(h>>>13),0xc2b2ae35)>>>0;h=(h^(h>>>16))>>>0;let x=h/4294967296*pool.reduce((n,p)=>n+p.weight,0);return pool.find(p=>(x-=p.weight)<0)??pool.at(-1)!;}
export function currentPresident(s:State):PresidentTerm|undefined{return s.presidency?.terms.at(-1)}
export function initPresidency(s:State){const p=pickPresident(s.initialSeed,0);s.presidency={version:1,terms:[{id:p.id,name:p.name,partyId:p.partyId,start:day(2026),end:day(2031),source:'background'}],contacts:[]};syncPresidentNpc(s);}
export function syncPresidentNpc(s:State){const p=currentPresident(s);if(!p)return;const n=s.npcs[9];if(n.id===p.name)return;s.npcs[9]={...n,id:p.name,role:p.source==='player'?'대통령 당선인':'대통령',relationship:25,trust:40,memoryTags:[],knownFacts:[p.partyId??'무소속'],goals:[presidents.find(x=>x.id===p.id)?.style??'공약 이행'],secretIds:[]};}
export function syncPresidency(s:State,through:number){if(!s.presidency)return;const before=currentPresident(s)!;let count=0;while(currentPresident(s)!.end<=through){const prev=currentPresident(s)!,p=pickPresident(s.initialSeed,s.presidency.terms.length,s.presidency.terms.map(p=>p.id));s.presidency.terms.push({id:p.id,name:p.name,partyId:p.partyId,start:prev.end,end:termEnd(prev.end),source:'background'});count++;}if(count){s.presidency.notice={from:before.name,to:currentPresident(s)!.name,count};syncPresidentNpc(s);}}
export function nextCandidate(s:State,partyId:string){const excluded=s.presidency?.terms.map(p=>p.id)??[];return pickPresident(s.initialSeed,(s.presidency?.terms.length??0)+s.elections.length,excluded,partyId);}
export function settlePresident(s:State,won:boolean,name:string,partyId:string|null){if(!s.presidency||!s.calendar)return;const old=currentPresident(s)!;const start=s.calendar.day;const p=presidents.find(p=>p.name===name);const id=won?'player':p?.id??'candidate:'+name;s.presidency.terms.push({id,name:won?'당신':name,partyId,start,end:termEnd(start),source:won?'player':'election'});s.presidency.notice={from:old.name,to:won?'당신':name,count:1};syncPresidentNpc(s);}

export function presidentialName(s:State,partyId:string){if(!s.calendar)return candidateFor(partyId).name;if(['future','better','reform'].includes(partyId)&&presidents.some(p=>p.partyId===partyId&&!s.presidency!.terms.some(t=>t.id===p.id)))return nextCandidate(s,partyId).name;const c=candidateFor(partyId);return s.presidency!.terms.some(t=>t.name===c.name)?partyById(partyId,s)!.leader:c.name;}
