import type {State} from './engine.ts';
import type {Card} from './content.ts';
import {clamp,policyIds,type Signal} from './support.ts';
import {parties,partiesFor,partyById,partyKey,type PartyWorld} from './parties.ts';
// 정책 성향과 정당 친밀도는 별개다. 같은 분야의 단체도 서로 다른 노선을 가진다.
export const associations=[
 {id:'workers-bargain',name:'현장노동연대',field:'노동',voice:'고용 안정·실무 협상',party:'future',positions:{labor:.4,economy:.35,diplomacy:.5},values:{order:.5,disclosure:.3}},
 {id:'workers-rights',name:'일하는사람들',field:'노동',voice:'노동권·재분배',party:'labor',positions:{labor:.9,tax:.7,welfare:.7},values:{order:-.4,disclosure:.5}},
 {id:'business-market',name:'자유기업포럼',field:'기업',voice:'시장 자율·규제 완화',party:'future',positions:{economy:.9,tax:-.8,labor:-.5},values:{order:.3,disclosure:.2,history:-.4}},
 {id:'business-fair',name:'공정경쟁기업모임',field:'기업',voice:'공정 경쟁·지역 상생',party:'reform',positions:{economy:.5,reform:.7,region:.5},values:{order:-.1,disclosure:.8}},
 {id:'parents-choice',name:'교육선택학부모회',field:'교육',voice:'선택권·동일 평가',party:'future',positions:{education:-.8,society:-.5,tax:-.4},values:{order:.6,disclosure:.6}},
 {id:'parents-public',name:'함께배우는학부모회',field:'교육',voice:'공교육·격차 완화',party:'better',positions:{education:.9,welfare:.6,society:.5},values:{order:-.4,disclosure:.2}},
 {id:'women-family',name:'가족생활여성연합',field:'여성',voice:'가족·양육 지원',party:'future',positions:{welfare:.7,society:-.6,labor:.2},values:{order:.6,disclosure:-.3}},
 {id:'women-equality',name:'평등한일상네트워크',field:'여성',voice:'성평등·차별 시정',party:'better',positions:{society:.9,labor:.6,welfare:.5},values:{order:-.6,disclosure:-.1}},
 {id:'civic-audit',name:'공적책임감시단',field:'시민사회',voice:'법질서·공적 검증',party:'reform',positions:{reform:.8,tax:-.2},values:{order:.6,disclosure:.95,history:-.2}},
 {id:'civic-rights',name:'권리와기억시민회',field:'시민사회',voice:'인권·민주화의 기억',party:'better',positions:{reform:.6,society:.8,migration:.6},values:{order:-.8,disclosure:-.4,history:1}},
 {id:'security-alliance',name:'동맹안보포럼',field:'안보',voice:'동맹·억지력',party:'future',positions:{diplomacy:.9},values:{alliance:1,order:.5}},
 {id:'security-sovereign',name:'자주국방연구모임',field:'안보',voice:'자주 역량·억지력',party:'reform',positions:{diplomacy:.6},values:{alliance:-.9,order:.3}},
 {id:'security-peace',name:'평화의길',field:'안보',voice:'긴장 완화·협상',party:'green',positions:{diplomacy:-.9,migration:.4},values:{alliance:-.2,order:-.5}},
 {id:'local-shops',name:'골목상인협의회',field:'생업',voice:'영업·생활비·지역 접점',party:null,positions:{economy:.5,labor:-.3,region:.7},values:{order:.2}},
 {id:'youth-housing',name:'내일의세입자들',field:'주거',voice:'주거 접근·청년 생활',party:null,positions:{housing:.9,labor:.6,education:.3},values:{disclosure:.7}},
 {id:'regional-green',name:'지역과숲연대',field:'환경',voice:'생활환경·지역 접근',party:'green',positions:{environment:.9,region:.7},values:{order:-.3}},
 {id:'faith-nation',name:'나라와믿음연합',field:'종교',voice:'강경 보수·반공·전통적 가족관',party:'guardian',positions:{diplomacy:.9,society:-.9,migration:-.6},values:{order:.9,history:-.9,faithPolitics:1,faithAutonomy:.7}},
 {id:'faith-care',name:'신앙과돌봄협의회',field:'종교',voice:'지역 봉사·복지·가족 돌봄',party:null,positions:{welfare:.8,region:.7},values:{faithPolitics:-.2,faithAutonomy:.4,disclosure:.5}},
 {id:'faith-rights',name:'평화와인권종교연대',field:'종교',voice:'인권·평화·국가폭력 책임 규명',party:null,positions:{society:.85,diplomacy:-.75},values:{history:1,order:-.7,faithPolitics:-.5,faithAutonomy:.3}},
 {id:'faith-autonomy',name:'종교자율시민모임',field:'종교',voice:'신앙의 자유·정치적 독립',party:null,positions:{reform:.3},values:{faithPolitics:-1,faithAutonomy:1,disclosure:.4}},
 {id:'science-experts',name:'과학기술정책포럼',field:'과학기술',voice:'연구개발·전문가 판단',party:'reform',positions:{economy:.65,education:.6},values:{expertise:1,automation:.9}},
 {id:'field-participation',name:'현장참여네트워크',field:'시민참여',voice:'현장 경험·시민 결정권',party:null,positions:{reform:.5,labor:.5},values:{expertise:-.9,automation:-.4}}
] as const;
export type AssociationState={id:string;approval:number;trust:number;participation:number;lastReason:string;contacts:number};
export type SupportSnapshot={version:1;turn:number;cardId:string;choice:string;values:{id:string;approval:number;trust:number;participation:number}[]};
export type Campaign={supportSnapshot?:SupportSnapshot;version:1|2;groups:AssociationState[];reviews:{source:string;event:string;verdict:'원칙 유지'|'입장 수정'|'기준 충돌';quote:string}[];nominee?:{partyId:string;name:string;playerPartyId:string|null;thirdPartyId:string;thirdName?:string};rivalPartyId:string|null};
export function createCampaign(seed:number,world?:PartyWorld):Campaign{return {version:2,groups:associations.map((g,i)=>({id:g.id,approval:45+((seed+i*11)%13),trust:45,participation:0,lastReason:'아직 공개적으로 함께한 선택이 없습니다.',contacts:0})),reviews:[],rivalPartyId:(world?partiesFor(world):parties)[seed%(world?partiesFor(world):parties).length].id};}
export function applyPoliticalValues(s:State,card:Card,index:0|1){const values=(card as Card&{values?:[Record<string,number>,Record<string,number>]}).values?.[index];if(values)for(const r of s.rows){const preferences:Record<string,number>={disclosure:clamp(r.preferences[11]*.7-r.preferences[10]*.2,-1,1),history:clamp(r.preferences[10]*.7+((r.profile%5)-2)*.12,-1,1),alliance:clamp(r.partyPrefs[0]*.7-r.partyPrefs[1]*.5+((r.profile%7)-3)*.1,-1,1),faithPolitics:clamp(-r.preferences[10]*.7+((r.profile%7)-3)*.08,-1,1),faithAutonomy:clamp(r.preferences[11]*.5+((r.profile%5)-2)*.2,-1,1),expertise:clamp(r.preferences[0]*.6-r.preferences[11]*.3+((r.profile%7)-3)*.13,-1,1),automation:clamp(r.preferences[0]*.5-r.preferences[1]*.5,-1,1),order:clamp(-r.preferences[10],-1,1)};const effect=Object.entries(values).reduce((sum,[key,value])=>sum+(preferences[key]??0)*value,0);r.opinion=clamp(r.opinion+effect*.07,-4,4);}
 if(card.id==='age-generations')for(const r of s.rows){const age=Math.floor(r.profile/16);const direction=age===0?1:age===2?-1:0;r.opinion=clamp(r.opinion+direction*(index===0?.08:-.08),-4,4);}}
export function applyAssociations(s:State,card:Card,index:0|1,signals:Signal[]){if(!s.campaign)return [];
 const values=(card as Card&{values?:[Record<string,number>,Record<string,number>]}).values?.[index]??{};const news:string[]=[];
 for(const g of associations){const a=s.campaign.groups.find(x=>x.id===g.id);if(!a)continue;const policy=signals.filter(x=>x.topic in g.positions);const axes=Object.keys(values).filter(k=>k in g.values);if(!policy.length&&!axes.length)continue;
 const fit=(policy.reduce((n,x)=>n+(g.positions as Record<string,number>)[x.topic]*x.stance,0)+axes.reduce((n,k)=>n+(g.values as Record<string,number>)[k]*values[k],0))/(policy.length+axes.length);const delta=fit*5;const partyGap=g.party&&s.partyId&&partyKey(g.party,s)!==s.partyId?1:0;
 a.approval=clamp(a.approval+delta,0,100);a.contacts++;a.trust=clamp(a.trust+Math.max(-2,Math.min(2,(card.choices[index].effect.trust??0)/4)),0,100);a.lastReason=`「${card.title}」에서 밝힌 입장`+(fit>.15?'에 호응합니다.':fit<-.15?'을 우려합니다.':'에 회원들의 의견이 갈립니다.');
 const target=Math.max(0,(a.approval-52)*.7+(a.trust-50)*.5-partyGap*8);a.participation=clamp(a.participation+(target-a.participation)*.18,0,100);
 // 단체별 선호에 가까운 실제 유권자에게만 작은 조직 효과를 적용한다. 지지 선언=집단 전원 지지가 아니다.
 if(a.contacts>=2&&Math.abs(delta)>1.5){for(const r of s.rows){const affinity=policy.length?policy.reduce((n,x)=>n+Math.max(0,r.preferences[policyIds.indexOf(x.topic)]*(g.positions as Record<string,number>)[x.topic]),0)/policy.length:.2;r.organization=clamp(r.organization+affinity*(delta>0?1:-1)*a.participation/50000);r.opinion=clamp(r.opinion+affinity*delta/1000,-4,4);}}
 if(Math.abs(delta)>2.5)news.push(`${g.name}: ${a.lastReason}${partyGap&&delta>0?' 정책에는 동의하지만 정당의 거리는 남아 있습니다.':''}`);
 }if(card.id.startsWith('religion-')){const names=associations.filter(g=>g.field==='종교').map(g=>g.name);news.sort((a,b)=>Number(names.some(n=>b.startsWith(n)))-Number(names.some(n=>a.startsWith(n))));}return news.slice(0,2);}
/** 직전 선택 전의 실제 값만 저장한다. 과거 수치를 추정하지 않는다. */
export function recordSupportSnapshot(before:State,after:State,card:Card,index:0|1){
 if(!before.campaign||!after.campaign)return;
 after.campaign.supportSnapshot={version:1,turn:before.turn,cardId:card.id,choice:card.choices[index].text,values:before.campaign.groups.map(({id,approval,trust,participation})=>({id,approval,trust,participation}))};
}
export function validSupportSnapshot(x:any,ids:string[],turn:number):boolean{
 if(x===undefined)return true;
 return !!x&&x.version===1&&Number.isInteger(x.turn)&&x.turn>=0&&x.turn<=turn&&typeof x.cardId==='string'&&x.cardId.length>0&&x.cardId.length<=150&&typeof x.choice==='string'&&x.choice.length>0&&x.choice.length<=1000&&Array.isArray(x.values)&&x.values.length===ids.length&&new Set(x.values.map((g:any)=>g?.id)).size===ids.length&&x.values.every((g:any)=>g&&ids.includes(g.id)&&[g.approval,g.trust,g.participation].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100));
}
const round=(n:number)=>Math.round((n+Number.EPSILON)*10)/10;
export function associationView(s:State){return (s.campaign?.groups??[]).flatMap(a=>{
 const g=associations.find(x=>x.id===a.id);if(!g)return [];
 const previous=s.campaign?.supportSnapshot?.values.find(x=>x.id===a.id);
 const delta=previous?round(a.approval-previous.approval):null;
 const trustDelta=previous?round(a.trust-previous.trust):null;
 const participationDelta=previous?round(a.participation-previous.participation):null;
 const changed=previous&&[delta,trustDelta,participationDelta].some(x=>x!==0);
 return [{id:a.id,name:g.name,field:g.field,voice:g.voice,party:g.party?partyById(g.party,s)!.name+'과 가까움':'독립적',status:a.contacts===0?'아직 접점 없음':a.approval>=65?'지지 확대':a.approval<40?'이탈 조짐':'설득 중',depth:a.participation>=22?'현장 참여':a.approval>=60&&a.trust>=50?'정책 지지':a.contacts?'의견 교환':'첫 만남 전',reason:a.lastReason,contacts:a.contacts,approval:round(a.approval),trust:round(a.trust),participation:round(a.participation),previous:previous?{approval:round(previous.approval),trust:round(previous.trust),participation:round(previous.participation)}:null,delta,trustDelta,participationDelta,changed:!!changed,trustLabel:a.trust>=65?'높음':a.trust<40?'낮음':'보통',participationLabel:a.participation>=22?'강함':a.participation>=8?'형성 중':'약함',choice:changed?s.campaign!.supportSnapshot!.choice:null}];
 });}
