import {policyIds,policyNames,type PolicyId,type Row,type Evidence,groupDefs,groupProjection} from './support.ts';
export const parties=[
 {id:'future',details:'시장 경쟁과 민간 투자를 통한 성장을 앞세웁니다. 감세의 재정 효과와 동맹 협력의 비용을 놓고 논쟁합니다.',scale:'major',joiningGrant:24,name:'미래공화당',color:'#d76760',leader:'나원칙',platform:'시장·성장·감세·동맹 안보를 중시하는 대형 보수 정당입니다.',priorities:['economy','diplomacy','tax'],positions:[.6,-.3,-.6,-.2,.1,-.3,-.1,.65,-.2,.1,-.3,.1],rule:'지역 경쟁력과 당원 평가를 함께 심사합니다.'},
 {id:'better',details:'공공 서비스와 주거·교육 지원의 확대를 추구합니다. 지원 재원과 정책 집행의 효과를 놓고 논쟁합니다.',scale:'major',joiningGrant:24,name:'모두의민주당',color:'#6bace1',leader:'윤다정',platform:'복지·주거·교육과 사회적 격차 완화를 중시하는 대형 정당입니다.',priorities:['welfare','housing','education'],positions:[.1,.4,.3,.5,.6,.3,.2,-.2,.4,.4,.5,.4],rule:'지역 경선과 당원 평가를 함께 반영합니다.'},
 {id:'reform',details:'과학기술·AI 투자와 전문가 중심 선발을 추구합니다. 엘리트주의와 현장 경시, 기술 전환의 고용 충격을 놓고 논쟁합니다.',scale:'minor',joiningGrant:10,name:'새판개혁당',color:'#ed974f',leader:'차새로',priorities:['reform','economy','education'],platform:'정치 개혁·과학기술·AI 투자·전문가와 성과 중심 선발. 엘리트주의와 현장 경시 비판도 받습니다.',positions:[.6,.05,-.2,.1,.1,.2,.2,.1,-.3,.1,.2,.8],rule:'공개 심사와 지역 정책 토론을 중시합니다.'},
 {id:'labor',details:'노동권과 재분배를 우선하며 현장 노동의 대표성을 강조합니다. 고용·사업 부담과 재정의 우선순위를 놓고 논쟁합니다.',scale:'minor',joiningGrant:8,name:'노동정의당',color:'#ddc66c',leader:'정버팀',platform:'노동권·재분배·공공복지와 현장 노동의 대표성을 중시합니다.',priorities:['labor','welfare','tax'],positions:[-.4,.9,.7,.5,.8,.5,.4,-.4,.7,.4,.8,.7],rule:'당원 경선과 현장 활동 이력을 중시합니다.'},
 {id:'green',details:'환경·기후 전환과 지역 균형을 추구합니다. 현재의 전환 비용과 지역·세대 사이의 부담 배분을 놓고 논쟁합니다.',scale:'minor',joiningGrant:8,name:'초록환경당',color:'#8bbc8b',leader:'도초록',platform:'환경·기후 전환·지역 균형과 사회적 권리를 중시합니다.',priorities:['environment','region','society'],positions:[-.3,.5,.5,.4,.6,.95,.6,-.5,.5,.7,.8,.7],rule:'주민 참여와 정책 이행 신뢰를 함께 평가합니다.'},
 {id:'guardian',details:'지도부는 일본 과거사보다 협력을 우선하고 종교 집회와 밀접합니다. 민주화운동에 반감을 드러내며 과거 권위주의·독재 정권을 옹호합니다. 이는 가상 지도부의 주장입니다.',scale:'minor',joiningGrant:8,name:'대한수호당',color:'#b596d9',leader:'강단호',priorities:['diplomacy','society','migration'],positions:[.35,-.5,-.4,-.3,.05,-.5,-.85,.95,-.55,-.1,-.95,-.65],platform:'강경 안보·반공·전통적 가족관을 앞세우며 종교 보수층과 밀접한 정당입니다.',rule:'노선 일치와 조직 활동을 중시하며 공개 지지 세력의 요구가 강합니다.'}
];
// 기존 여섯 슬롯은 저장·득표 계산의 인덱스이므로 합당 후에도 순서를 바꾸지 않는다.
export const MERGER_FLAG='정당 체제: 노동환경당 v1';
export type PartyWorld={flags:string[]};
export const laborEnvironment={...parties[3],name:'노동환경당',color:'#b8d65a',leader:'정버팀',platform:'노동권·고용 안정·기후 전환·성평등을 함께 추구하는 진보 연합 정당입니다.',details:'노동정의당과 초록환경당이 합당했습니다. 일자리와 환경을 함께 지키려 하지만 전환 속도와 비용 배분에서는 의견이 갈립니다.',priorities:['labor','environment','welfare'],positions:[-.35,.85,.65,.5,.8,.85,.5,-.45,.65,.6,.85,.7],rule:'당원 심사와 현장 활동을 평가하며 노동·환경 양쪽의 약속 이행을 묻습니다.'};
export const activeParties=parties.filter(p=>p.id!=='green').map(p=>p.id==='labor'?laborEnvironment:p.id==='guardian'?{...p,details:'강경 반공과 종교 집회 조직을 중시합니다. 일본 과거사보다 협력을 앞세우며, 민주화운동에 비판적이고 과거 독재 정권을 옹호합니다.'}:p);
export const isMerged=(s?:PartyWorld)=>!!s?.flags.includes(MERGER_FLAG);
export function partiesFor(s?:PartyWorld){return !s||isMerged(s)?activeParties:parties;}
export function partyKey(id:string|null,s?:PartyWorld){return isMerged(s)&&id==='green'?'labor':id;}
export type Offer={partyId:string;reason:string;evidenceIds:string[];turn:number;score:number};
export function partyById(id:string|null,s?:PartyWorld){return partiesFor(s).find(p=>p.id===partyKey(id,s))}
export function chooseOffer(input:{world?:PartyWorld;job:number;seed:number;turn:number;signals:{topic:PolicyId;stance:number;cardId:string}[];rows:Row[];relations:number[];evidence:Evidence[];exclude?:string|null}):Offer|null{
 if(input.signals.length<2)return null;
 const candidates=partiesFor(input.world).filter(p=>p.id!==input.exclude).map(p=>{const index=parties.findIndex(x=>x.id===p.id);const matches=input.signals.map(s=>({s,fit:p.positions[policyIds.indexOf(s.topic)]*s.stance})).sort((a,b)=>b.fit-a.fit);const policyFit=matches.reduce((a,m)=>a+m.fit,0)/matches.length;const need=((input.seed+index*7)%13)/13;const jobFit=[input.job===2?.8:.2,input.job===1?.7:.2,input.job===6?.7:.3,input.job===0?.8:.2,input.job===0||input.job===4?.65:.2,input.job===7?.7:.25][index];const awareness=input.rows.reduce((a,r)=>a+r.weight*r.awareness,0)/3;const coalition=groupProjection(input.rows,(index*3)%12,'local',1).support;const score=policyFit*.6+need*.1+jobFit*.07+awareness*.08+coalition*.08+(input.relations[index]??25)/100*.07;return {p,index,matches,score}}).sort((a,b)=>b.score-a.score||a.index-b.index);
 const best=candidates[0];const match=best?.matches.find(m=>m.fit>.08);if(!best||!match)return null;return {partyId:best.p.id,score:best.score,turn:input.turn,evidenceIds:[match.s.cardId],reason:`그동안 ${policyNames[match.s.topic]} 문제에 내놓으신 제안을 지켜봤습니다. 지금 우리 당에 그 경험이 필요합니다. 함께하시겠습니까?`};}

export const partyRename:Record<string,string>={'더나은민주당':'모두의민주당','국민미래당':'미래공화당','초록미래당':'초록환경당','정의노동당':'노동정의당'};
export function currentPartyName(name:string){let result=name;for(const [old,current] of Object.entries(partyRename))result=result.replaceAll(old,current);return result;}
export function guardianAffinity(preferences:number[],partyPrefs:number[]){return Math.max(-1,Math.min(1,preferences[7]*.4-preferences[10]*.35-preferences[6]*.25));}
