import {policyIds,policyNames,type PolicyId,type Row,type Evidence,groupDefs,groupProjection} from './support.ts';
export const parties=[
 {id:'future',name:'국민미래당',color:'#d76760',leader:'나원칙',priorities:['economy','diplomacy','tax'],positions:[.6,-.3,-.6,-.2,.1,-.3,-.1,.65,-.2,.1,-.3,.1],rule:'지역 경쟁력과 당원 평가를 함께 심사합니다.'},
 {id:'better',name:'더나은민주당',color:'#6bace1',leader:'윤다정',priorities:['welfare','housing','education'],positions:[.1,.4,.3,.5,.6,.3,.2,-.2,.4,.4,.5,.4],rule:'지역 경선과 당원 평가를 함께 반영합니다.'},
 {id:'reform',name:'새판개혁당',color:'#ed974f',leader:'차새로',priorities:['reform','economy','education'],positions:[.6,.05,-.2,.1,.1,.2,.2,.1,-.3,.1,.2,.8],rule:'공개 심사와 지역 정책 토론을 중시합니다.'},
 {id:'labor',name:'노동정의당',color:'#ddc66c',leader:'정버팀',priorities:['labor','welfare','tax'],positions:[-.4,.9,.7,.5,.8,.5,.4,-.4,.7,.4,.8,.7],rule:'당원 경선과 현장 활동 이력을 중시합니다.'},
 {id:'green',name:'초록미래당',color:'#8bbc8b',leader:'도초록',priorities:['environment','region','society'],positions:[-.3,.5,.5,.4,.6,.95,.6,-.5,.5,.7,.8,.7],rule:'주민 참여와 정책 이행 신뢰를 함께 평가합니다.'}
];
export type Offer={partyId:string;reason:string;evidenceIds:string[];turn:number;score:number};
export function partyById(id:string|null){return parties.find(p=>p.id===id)}
export function chooseOffer(input:{job:number;seed:number;turn:number;signals:{topic:PolicyId;stance:number;cardId:string}[];rows:Row[];relations:number[];evidence:Evidence[];exclude?:string|null}):Offer|null{
 if(input.signals.length<2)return null;
 const candidates=parties.filter(p=>p.id!==input.exclude).map(p=>{const index=parties.indexOf(p);const matches=input.signals.map(s=>({s,fit:p.positions[policyIds.indexOf(s.topic)]*s.stance})).sort((a,b)=>b.fit-a.fit);const policyFit=matches.reduce((a,m)=>a+m.fit,0)/matches.length;const need=((input.seed+index*7)%13)/13;const jobFit=[input.job===2?.8:.2,input.job===1?.7:.2,input.job===6?.7:.3,input.job===0?.8:.2,input.job===0||input.job===4?.65:.2][index];const awareness=input.rows.reduce((a,r)=>a+r.weight*r.awareness,0)/3;const coalition=groupProjection(input.rows,(index*3)%12,'local',1).support;const score=policyFit*.6+need*.1+jobFit*.07+awareness*.08+coalition*.08+(input.relations[index]??25)/100*.07;return {p,index,matches,score}}).sort((a,b)=>b.score-a.score||a.index-b.index);
 const best=candidates[0];const match=best?.matches.find(m=>m.fit>.08);if(!best||!match)return null;return {partyId:best.p.id,score:best.score,turn:input.turn,evidenceIds:[match.s.cardId],reason:`그동안 ${policyNames[match.s.topic]} 문제에 내놓으신 제안을 지켜봤습니다. 지금 우리 당에 그 경험이 필요합니다. 함께하시겠습니까?`};}
