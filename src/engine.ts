import {editorialCard} from './editorial.ts';
import {balanceCard,BALANCE_FLAG} from './balance.ts';
import {CAREER_FLAG,rivals,hasCareer,careerCard} from './career.ts';
import {availableFunds,changeFunds,financeEvent,FINANCE_FLAG,type Finance,type Interruption} from './finance.ts';
import {readableCard} from './plain-language.ts';
import {varietyCards,VARIETY_FLAG,mixSeed,fillRoute,refreshNext,asPool,isVariety,remembered,slotsFor,slotsForState,retryTemplates,retryBlocks,drawForSlot} from './route.ts';
import type {VarietyCard} from './variety-content.ts';
import {chapterFor,contextualize} from './chapters.ts';
import {cards,later,type Card,type Stats} from './content.ts';
import {opening,finale,type PolicyCard} from './policy-content.ts';
import {createRows,projection,applySignals,buildReactions,clamp,policyIds,groupDefs,groupProjection,logit,type Row,type Evidence,type Signal,type PolicyId,type Context} from './support.ts';
import {parties,partyById,chooseOffer,type Offer} from './parties.ts';
import {runElection,type Election} from './election.ts';
export type Statement={id:string;turn:number;topic:string;text:string;principle:string;strength:1|2|3;exposure:number;contextTags:string[]};
export type NPC={id:string;role:string;relationship:number;trust:number;loyalty:number;ambition:number;influence:number;goals:string[];memoryTags:string[];knownFacts:string[];secretIds:string[]};
export type PublicChange={key:'support'|'funds'|'fame'|'party';before:number|null;after:number|null};
export type Outcome={title:string;speaker:string;choice:string;result:string;news:string[];changes:PublicChange[];scopeChange?:{oldScope:string;newScope:string;before:number|null;after:number|null}};
export type History={turn:number;title:string;choice:string;result:string;news:string[];changes:PublicChange[]};
export type State={version:3;finance:Finance;interruptions:Interruption[];seed:number;initialSeed:number;turn:number;cursor:number;route:string[];job:number;year:number;month:number;birthYear:number;calendarOrigin:number;age:number;party:string;partyId:string|null;partyHistory:string[];stats:Stats;rows:Row[];scope:'local'|'national';localRegion:number;phase:'prePolitics'|'local'|'central'|'presidential';office:'none'|'localMember'|'assemblyMember'|'president';officeUntil:number|null;statements:Statement[];history:History[];npcs:NPC[];flags:string[];elections:Election[];legal:{status:string;truth:string;conclusion:string;revealed:boolean};pending:{id:string;due:number;source:string}[];stage:'play'|'result'|'count'|'ending';title:string;ended?:string;outcome:Outcome|null;afterResult:'play'|'count';signals:{topic:PolicyId;stance:number;cardId:string}[];evidence:Evidence[];endorsements:{groupId:string;sourceIds:string[];turn:number}[];lastOfferTurn:number;offers:Offer[];context:Context;completed:boolean;legacy?:boolean};
export const names=['고단비','나원칙','차도약','문장수','한보름','신새봄','유정도','서중심','봉봉수','한민국','윤다정','차새로','정버팀','도초록'];
const roles=['보좌관','당대표','라이벌','기자','누나','청년 당원','법률 조력자','계파 수장','지역 조직','대통령','당대표','당대표','당대표','당대표'];
const offerBase:Card={id:'party-offer',title:'정당에서 전화가 왔습니다',speaker:'보좌관 · 고단비',body:'그동안의 활동을 지켜본 정당이 함께하자고 제안했습니다.',importance:3,maxAppearances:1,choices:[{text:'정책 협약을 맺고 입당한다',effect:{party:8},result:'새 명함이 생겼습니다. 다음에는 명함보다 긴 약속을 지켜야 합니다.'},{text:'무소속으로 활동을 이어간다',effect:{org:3},result:'당 로고는 없습니다. 당신의 이름으로 계속하기로 했습니다.'}]};
const endRoute=[later[10],finale[0],later[11],finale[1],finale[2],later[12],finale[3],finale[4],finale[5],later[13],finale[6],finale[7],finale[8],finale[9],later[14],finale[10],later[15]];
export const newRoute=[...opening.slice(0,6),offerBase,...opening.slice(6),...cards,...later.slice(0,10),...endRoute].map(c=>c.id);
export const catalog=[...opening,offerBase,...cards,...later,...finale,...varietyCards];
export const varietyPool=new Map<string,VarietyCard>(catalog.map(card=>[card.id,'chapter' in card?card as VarietyCard:asPool(card,chapterFor(card.id))]));
const byId=new Map(catalog.map(c=>[c.id,c]));
export function createState(job=0,seed=Date.now()>>>0,mode:'variety'|'classic'='variety'):State{const rows=createRows(job,seed);const pub=projection(rows,'national');const year=2026;const s:State={version:3,finance:{illicit:0,partyGrants:[]},interruptions:[],seed:seed>>>0,initialSeed:seed>>>0,job,turn:0,cursor:0,route:[...newRoute],year,month:9,birthYear:1990,calendarOrigin:year*12+8,age:36,party:'무소속',partyId:null,partyHistory:['무소속'],stats:{support:pub.support??0,fame:pub.fame,funds:job===2?62:job===0?(mode==='variety'?20:28):40,party:0,trust:45,org:job===0?42:job===1?44:30},rows,scope:'national',localRegion:seed%3,phase:'prePolitics',office:'none',officeUntil:null,statements:[],history:[],npcs:names.map((id,i)=>({id,role:roles[i],relationship:25,trust:40,loyalty:40,ambition:i===2?90:50,influence:50,goals:[i===2?'독자적인 정치 기반':'정치적 생존'],memoryTags:[],knownFacts:[],secretIds:[]})),flags:[],elections:[],legal:{status:'없음',truth:'미확인',conclusion:'없음',revealed:false},pending:[],stage:'play',title:'정치 입문 전',outcome:null,afterResult:'play',signals:[],evidence:[],endorsements:[],lastOfferTurn:-99,offers:[],context:{economy:seed%2?'slow':'growth',laborShortage:seed%3!==0,housingPressure:seed%2===0},completed:false};if(mode==='variety'){s.flags.push(VARIETY_FLAG,CAREER_FLAG,FINANCE_FLAG,BALANCE_FLAG);if(job===5){s.stats.org+=4;s.rows.forEach(r=>r.organization=clamp(r.organization+.02));}s.npcs[2]={...s.npcs[2],id:rivals[job].name,role:rivals[job].role,goals:[rivals[job].goal],knownFacts:[rivals[job].background]};s.npcs.push({id:'온지원',role:'후원 중개인',relationship:5,trust:10,loyalty:10,ambition:75,influence:45,goals:['정치적 접근권 확보'],memoryTags:[],knownFacts:[],secretIds:[]});s.seed=mixSeed(s.initialSeed);fillRoute(s,newRoute,varietyPool,()=>random(s));}return s;}
export function random(s:State){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296}
export function currentOffer(s:State):Offer|null{if(s.turn-s.lastOfferTurn<5)return null;const offer=chooseOffer({job:s.job,seed:s.initialSeed,turn:s.turn,signals:s.signals,rows:s.rows,relations:parties.map(p=>s.npcs.find(n=>n.id===p.leader)?.relationship??25),evidence:s.evidence,exclude:s.partyId});return offer}
export function getCard(s:State):Card{const special=financeEvent(s);if(special)return editorialCard(special,s);const base=byId.get(s.route[s.cursor]);if(!base)throw Error('완료된 회차입니다');const card=structuredClone(base);const party=partyById(s.partyId);
 if(card.speaker.startsWith('당대표')&&party)card.speaker='당대표 · '+party.leader;
 if(['party-offer','party-switch'].includes(card.id)){const offer=currentOffer(s);const p=partyById(offer?.partyId??null);if(offer&&p){card.title=s.partyId?'다른 정당의 초대':'당신의 선택을 보고 전화했습니다';card.speaker='당대표 · '+p.leader;card.body=offer.reason+` ${s.finance.partyGrants.includes(p.id)?'이 정당의 입당 지원은 이미 받았으므로 재지급하지 않습니다.':`${p.scale==='major'?'대형 정당':'소수 정당'}의 합법 활동 지원으로 자금 ${p.joiningGrant}를 받을 수 있습니다(보유 한도 내, 정당별 1회).`}`;card.choices[0].text=p.name+'의 제의를 받아들인다';card.choices[1].text=s.partyId?'지금의 동료들과 남는다':'무소속으로 활동을 이어간다';}else{card.title='아직은, 내 이름으로';card.body='지금까지의 활동을 정리할 때입니다. 더 많은 사람을 만날지, 정책을 다듬을지 골라주세요.';card.choices[0]={text:'정책 자료를 공개한다',effect:{fame:3,trust:3},result:'자료가 남았습니다. 다음 제의가 온다면 무엇을 보고 왔는지 알 수 있습니다.'};card.choices[1]={text:'지역의 목소리를 더 듣는다',effect:{org:4},result:'간판 없이도 만날 사람은 있습니다.'}}}
 if(['audit','family','recruit'].includes(card.id)){const prior=s.statements.find(x=>x.topic===card.topic);card.body=prior?`당신의 ${prior.turn+1}번째 선택에서 남긴 말, “${prior.text}”이 다시 나왔습니다. `+card.body.replace('기자가 당신의 과거 발언을 화면에 띄웠습니다.',''):card.body.replace('기자가 당신의 과거 발언을 화면에 띄웠습니다.','기자가 캠프의 원칙을 물었습니다.');}
 if(card.id==='return')card.title=[...s.elections].reverse().find(e=>e.name==='첫 지방선거')?.won?'당선에도 출근은 있습니다':'낙선에도 출근이 있나요';
 if(card.id==='national'&&s.office!=='assemblyMember'){card.title='의사당 밖에서 정책을 말합니다';card.body='국회의원이 아니어도 공청회에서 의견을 낼 수 있습니다. 표결과 법안 발의는 의원의 권한입니다.';card.choices[0].text='시민 정책 간담회에서 발표한다';}
 if(!s.partyId&&['betrayal','appeal','leader','recruit','freepress','faction'].includes(card.id)){const replacements:Record<string,[string,string]>={leader:['연합 대표의 약속','지역 정치 연합의 대표가 지원을 약속했습니다. 정당 공천과는 다른, 공동 후보 협약입니다.'],betrayal:['공동 후보 약속도 뒤집힙니다','연합 지도부가 차도약을 공동 후보로 내세웠습니다. 당신의 지역 활동은 그대로인데, 약속만 달라졌습니다.'],appeal:['라이벌의 심사표','차도약이 공동 후보 심사표를 건넸습니다. “절차는 확인해야죠. 대신 인신공격은 그만합시다.”'],recruit:['청년 몫의 캠프 자리','오랜 동료와 청년 활동가가 캠프의 같은 자리를 원합니다. 공개 심사를 할까요, 경험을 우선할까요?'],freepress:['불편한 질문에도 문을 엽니까','정치 연합이 비판 보도를 한 기자를 배제하려 합니다. 당신의 입장을 물었습니다.'],faction:['무소속 연합의 회의','정당 밖에서도 사람들이 모이면 규칙이 필요합니다. 결정은 누가 내릴까요?']};const v=replacements[card.id];card.title=v[0];card.body=v[1];if(card.id==='betrayal'){card.choices[0].text='합의와 심사 공개를 요구한다';card.choices[1].text='연합을 떠나 독자 출마한다'}if(card.id==='leader')card.speaker='계파 수장 · 서중심';}
 const contextual=readableCard(contextualize(card,s),s);
 if(['audit','family','recruit'].includes(card.id)){const prior=s.statements.find(x=>x.topic===card.topic);if(prior&&!contextual.body.includes(prior.text))contextual.body=`당신이 실제로 남긴 말, “${prior.text}”을 다시 묻습니다. `+contextual.body;}
 if(isVariety(s)){
  if(card.id==='law'&&s.job===3){contextual.title='동기에게 전화 한 통?';contextual.body='허위 경력 고발에 원본 임명장은 있습니다. 법률 동기가 비공식으로 절차를 알아봐 주겠답니다. 기록 대조가 빨라질 수 있지만, 통화는 동기가 녹음하며 사적 문의가 보도되면 별도 검증을 받습니다.';contextual.choices[0]={text:'정식 선임·원본 제출로 대응한다',effect:{funds:-4,trust:7},result:'법률 경험 덕에 준비 비용을 줄였습니다. 아는 사람 대신 아는 절차를 썼습니다.'};contextual.choices[1]={text:'동기에게 비공식 절차 문의를 부탁한다',effect:{funds:-2,party:4},result:'친구가 전화를 받았습니다. “우리 통화는 녹음해 둘게.” 빨리 끝나는 일과 조용히 끝나는 일은 다릅니다.'};Object.assign(contextual,{costNotes:['전문성으로 정식 대응 비용 절약 · 처리 시간은 필요','빠른 사실 확인 가능 · 녹취·사적 문의 폭로 시 큰 정치적 위험']});}
  if(card.id==='betrayal'){
   const version=s.initialSeed%3;
   if(version===1){contextual.title='단체 사진에서 나만 잘렸습니다';contextual.speaker='계파 수장 · 서중심';contextual.body=s.partyId?'서중심이 약속했던 추천을 차도약에게 돌렸습니다. “자네와는 원칙이 같아. 이번에는 숫자가 달라.” 회의 사진에는 당신만 없습니다.':'연합의 실무 책임자 서중심이 당신 대신 차도약을 추천했습니다. 공개 협약은 남아 있지만 단체 사진에서는 당신만 빠졌습니다.';contextual.choices[0].effect={party:-7,org:6,trust:5};contextual.choices[0].result='사진 원본과 심사 원칙을 요청했습니다. 사진은 빨리 왔습니다. 원칙은 검토 중이랍니다.';}
   if(version===2){contextual.title='경쟁력 조사의 질문이 다릅니다';contextual.body=s.partyId?'당이 공천 조사 문항을 바꾼 뒤 차도약을 앞세웠습니다. 어제는 지역 활동, 오늘은 전국 인지도입니다. 기준이 당신보다 빠르게 성장합니다.':'공동 후보 연합이 지역 활동 대신 전국 인지도를 새 기준으로 삼았습니다. 약속한 기준이 바뀌자 이름도 바뀌었습니다.';contextual.choices[0].effect={party:-8,trust:7,fame:3};contextual.choices[0].result='질문지를 공개하자 경쟁력이 아니라 질문의 경쟁이 시작됐습니다.';}
   if(remembered(s,'leader',0))contextual.body+=' 지난번 대표 행사를 맡았던 당신에게는 답례가 아닌 해명 전화가 왔습니다.';
   if(remembered(s,'leader',1))contextual.body+=' 지난번 지역 약속을 택한 일을 두고 지도부는 아직도 “섭섭했다”고 합니다.';
  }
 }
 const final=editorialCard(careerCard(contextual,s),s);if(['audit','family','recruit'].includes(final.id)){const prior=s.statements.find(x=>x.topic===final.topic);if(prior&&!final.body.includes(prior.text))final.body=`당신이 남긴 말, “${prior.text}”이 다시 나왔습니다. `+final.body;}return balanceCard(final,s)}
export function cardSignals(card:Card,index:0|1):Signal[]{if('signals' in card)return (card as PolicyCard).signals[index];const map:Record<string,PolicyId>={soup:'region',leader:'reform',investigation:'reform',press:'reform',housing:'housing',rival:'reform',youth:'reform',bus:'region',betrayal:'reform',appeal:'reform',audit:'reform',donation:'tax',family:'society',door:'region',debate:'reform',promise:'reform',campaign:'region',rain:'region',return:'region',national:'education',freepress:'society',recruit:'reform',ally:'reform',faction:'reform',responsibility:'reform',president:'reform',cabinet:'economy',policy:'tax',coalition:'society',tv:'reform',last:'region'};const topic=map[card.id];return topic?[{topic,stance:index===0?.6:-.15,strength:.45}]:[]}
export function publicStats(s:State){const p=projection(s.rows,s.scope,s.localRegion);return {support:p.support,funds:availableFunds(s),fame:p.fame,party:s.phase==='prePolitics'?null:s.stats.party}}
function updateParty(s:State,id:string|null){s.partyId=id;s.party=partyById(id)?.name??'무소속';if(s.partyHistory.at(-1)!==s.party)s.partyHistory.push(s.party);}
function setScope(s:State,scope:'local'|'national',out:Outcome){if(s.scope===scope)return;const old=projection(s.rows,s.scope,s.localRegion);const next=projection(s.rows,scope,s.localRegion);out.scopeChange={oldScope:s.scope==='local'?'지역':'전국',newScope:scope==='local'?'지역':'전국',before:old.support,after:next.support};s.scope=scope;}
export function applyChoice(current:State,event:Card,index:0|1):State{
 if(current.stage!=='play'||(index!==0&&index!==1)||event.id!==getCard(current).id)return current;
 const card=getCard(current);if(card.id==='funds-crisis'||card.id==='funds-exposure')return applyFinanceChoice(current,card,index);
 const s=structuredClone(current),choice=card.choices[index],before=publicStats(s),beforeRows=structuredClone(s.rows),signals=cardSignals(card,index);const out:Outcome={title:card.title,speaker:card.speaker,choice:choice.text,result:choice.result,news:[],changes:[]};
 for(const [k,v] of Object.entries(choice.effect)){if(k==='support'||k==='fame')continue;if(k==='funds'){changeFunds(s,v);continue;}s.stats[k as keyof Stats]=clamp(s.stats[k as keyof Stats]+v,0,100)}
 const cost=-(choice.effect.funds??0);const resourceRatio=cost>0?Math.min(1,availableFunds(current)/cost):1;if(resourceRatio<1)out.result+=' 자금이 부족해 소규모 현장 활동으로 바꿨습니다.';
 const repetitions=signals.map(signal=>s.signals.filter(a=>a.topic===signal.topic&&Math.sign(a.stance)===Math.sign(signal.stance)).length);
 applySignals(s.rows,signals,{scope:s.scope,local:s.localRegion,trust:choice.effect.trust??0,organization:(choice.effect.org??0)*Math.max(.25,resourceRatio),exposure:(choice.effect.fame??1)*Math.max(.25,resourceRatio),context:s.context,repetitions});
 s.signals.push(...signals.map(x=>({topic:x.topic,stance:x.stance,cardId:card.id})));
 const reactions=buildReactions(beforeRows,s.rows,signals,s.turn,card.id,s.scope,s.localRegion);s.evidence.push(...reactions);out.news.push(...reactions.map(r=>r.text));
 for(let i=0;i<groupDefs.length;i++){const id=groupDefs[i][0];const evidence=s.evidence.filter(e=>e.groupId===id&&e.direction==='welcome');const gp=groupProjection(s.rows,i,s.scope,s.localRegion);if(evidence.length>=2&&gp.support>.61&&gp.trust>.46&&!s.endorsements.some(e=>e.groupId===id)){s.endorsements.push({groupId:id,sourceIds:evidence.slice(-2).map(e=>e.id),turn:s.turn});out.news.push(`${groupDefs[i][3]}이 이전 면담을 근거로 공개 정책 협약과 현장 협력을 제안했습니다.`);s.rows.forEach(r=>{if(r.region===s.localRegion)r.organization=clamp(r.organization+r.memberships[i]*.025)});}}
 out.news=out.news.slice(-3);
 if(['investigation','housing','youth','freepress'].includes(card.id)){s.statements.push({id:card.id,turn:s.turn,topic:card.topic!,text:choice.text.replaceAll('“','').replaceAll('”',''),principle:index===0?'본인에게도 같은 원칙 적용':'사실과 절차를 검토',strength:index===0?3:1,exposure:before.fame,contextTags:[card.id]});if(card.id==='investigation')s.pending.push({id:'audit',due:s.route.indexOf('audit'),source:card.id})}
 if(['party-offer','party-switch'].includes(card.id)){const offer=currentOffer(current);if(offer){s.offers.push(offer);s.lastOfferTurn=s.turn;if(index===0){if(s.partyId)s.flags.push('정당 이동');updateParty(s,offer.partyId);s.stats.party=Math.max(s.stats.party,35);const p=partyById(offer.partyId)!;if(!s.finance.partyGrants.includes(p.id)){const beforeGrant=availableFunds(s);changeFunds(s,p.joiningGrant);s.finance.partyGrants.push(p.id);out.news.push(`${p.name}이 합법적인 입당 활동 지원을 제공했습니다. 활동 자금 +${availableFunds(s)-beforeGrant}. 정당별 최초 1회이며 사용 내역을 기록합니다.`);}out.news.unshift('이전 정책 활동의 기록을 근거로 입당 제의가 성사됐습니다.')}else if(s.partyId===null&&s.phase!=='prePolitics')s.flags.push('무소속 활동')}}
 if(card.id==='democracy'&&!s.legacy){s.phase='local';setScope(s,'local',out);out.news.unshift(`${['대도시권','산업도시권','농어촌권'][s.localRegion]}에서 지역 활동을 시작합니다. 평가 기준이 지역으로 바뀝니다.`)}
 if(card.id==='betrayal'){s.flags.push('공천 약속 번복');if(index===1){if(s.partyId)s.flags.push('탈당');updateParty(s,null);s.flags.push('독자 출마')}}
 if(card.id==='appeal'){const localOpinion=projection(s.rows,'local',s.localRegion).support??0;const ruleIndex=parties.findIndex(p=>p.id===s.partyId);const score=localOpinion*.4+s.stats.party*.25+s.stats.org*.2+s.stats.trust*.15+(ruleIndex===2?2:ruleIndex===3?1:0);if(s.partyId){if(score>=47){s.flags.push('공천 확정');out.news.unshift('지역 경쟁력·당원 평가·현장 활동 심사에서 공천을 받았습니다.')}else{s.flags.push('공천 탈락 후 무소속');updateParty(s,null);out.news.unshift('당원 평가와 지역 경쟁력 심사에서 밀렸습니다. 독자 출마로 재기합니다.')}}else{out.news.unshift('정당 공천 대신 독자 후보로 등록합니다. 지역의 평가를 직접 받습니다.')}}
 if(['audit','family','recruit'].includes(card.id)&&s.statements.some(x=>x.topic===card.topic)){s.flags.push('부메랑: '+card.topic);s.pending=s.pending.filter(x=>x.id!==card.id)}
 if(card.id==='family-clue'&&hasCareer(s)&&s.job===2)s.flags.push('가족 기업 입찰 논의');
 if(card.id==='family-clue')s.flags.push(hasCareer(s)&&s.job===2?(index===0?'가족 입찰 접촉 배제':'가족 입찰 독립 심사 요청'):(index===0?'거래 보류':'거래 자료 확보'));
 if(card.id==='family'){s.flags.push('가족 검증');s.legal={status:'의혹 검증 완료',truth:'개발 발표 전 상속, 위법 증거 없음',conclusion:'범죄로 단정하지 않음',revealed:true}}
 if(card.id==='family'&&hasCareer(s)&&s.job===2&&s.flags.includes('가족 기업 입찰 논의'))s.legal={status:'이해충돌 검증 중',truth:'가족 회사 입찰, 직접 심사 관여 증거 없음',conclusion:'가족 사업과 공적 영향력 구분해 확인 중',revealed:true};
 if(card.id==='law')s.legal={status:'수사 중',truth:'정상 임명장 원본 존재',conclusion:'미확정',revealed:false};
 if(card.id==='national'&&s.legal.status==='수사 중')s.legal={...s.legal,status:'종결',conclusion:'혐의없음: 원본 대조로 경력 확인',revealed:true};
 if(isVariety(s)){
  s.flags.push(`분기:${card.id}:${index}`);
  if(card.id==='law'&&s.job===3&&index===1){
   s.flags.push('동기 비공식 문의');const friend=s.npcs.find(n=>n.id==='유정도')!;friend.memoryTags.push('동기 통화:'+s.turn);friend.secretIds.push('동기 통화 원본');friend.knownFacts.push('플레이어가 절차 확인을 비공식 요청함');
   if(random(s)<.75){s.flags.push('동기 문의 조기 확인');s.legal={status:'종결',truth:'원본 임명장 대조로 경력 확인',conclusion:'혐의없음: 원본 대조. 비공식 문의의 적절성과는 별개',revealed:true};out.news.unshift('동기의 안내로 원본 대조가 빨라졌습니다. 경력 의혹은 해소됐지만 사적 경로 이용은 별도 논란이 될 수 있습니다.');}else out.news.unshift('동기도 처리 일정을 바꾸지는 못했습니다. 원본을 제출해 정식 절차를 계속합니다.');
   if(random(s)<.65){s.flags.push('동기 통화 유출 가능');const due=slotsForState(s,newRoute).findIndex((slot,i)=>i>s.cursor+3&&slot==='?presidential');s.pending.push({id:'friend-leak',due,source:'law'});}out.news.push('통화 원본은 동기가 보관합니다. 친구 번호는 빠르지만, 기록은 오래갑니다.');
  }
  if(card.id==='friend-leak'){s.flags.push('동기 통화 보도');s.pending=s.pending.filter(p=>p.id!==card.id);s.legal={status:'별도 문의 경위 검증 중',truth:'동기에게 비공식 절차 문의한 통화 원본 존재',conclusion:'경력 사건과 별도, 아직 위법 단정 불가',revealed:true};const due=slotsForState(s,newRoute).findIndex((slot,i)=>i>s.cursor+2&&slot==='?presidential');s.pending.push({id:'friend-verdict',due,source:card.id});}
  if(card.id==='friend-verdict'){s.pending=s.pending.filter(p=>p.id!==card.id);s.legal={status:'검증 종결',truth:'비공식 절차 문의 확인, 결과 변경 지시 증거 없음',conclusion:'부정청탁 범죄로 단정할 증거 없음. 윤리적 책임은 별도',revealed:true};}
 }
 const npc=s.npcs.find(n=>card.speaker.includes(n.id));if(npc){npc.relationship=clamp(npc.relationship+(index===0?4:1),-100,100);npc.trust=clamp(npc.trust+(index===0?2:0),0,100);npc.memoryTags.push(card.id+':'+index)}
 if(card.id==='career-rival-meet'){s.npcs[2].trust=clamp(s.npcs[2].trust+(index===1?10:3),0,100);s.npcs[2].memoryTags.push(index===1?'공동 현장 조사':'공개 정책 토론');}
 if(card.id==='rival'){s.npcs[2].knownFacts.push('지도부 전략공천 논의');s.npcs[2].memoryTags.push('독자 경선 준비')}
 if(card.id==='primary'){s.flags.push('대선 후보 검증 완료');out.news.unshift(s.partyId?'당원과 시민의 경선 평가를 거쳐 대선 후보로 확정됐습니다.':'전국 조직과 추천 절차를 갖춰 독자 대선 후보로 나섭니다.')}
 if(card.id==='president'){s.phase='presidential';setScope(s,'national',out);}
 s.phase=card.id==='democracy'?'local':chapterFor(card.id);s.turn++;s.cursor++;const date=s.calendarOrigin+s.turn*2;s.year=Math.floor(date/12);s.month=date%12+1;s.age=s.year-s.birthYear;
 if(s.officeUntil!==null&&date>=s.officeUntil&&s.office!=='president'){s.office='none';s.officeUntil=null;s.title='원외 정치인';}
 s.afterResult='play';
 if(['rain','responsibility','last'].includes(card.id)){const scope=card.id==='last'?'national':'local';const e=runElection(s.rows,scope,s.localRegion,parties.findIndex(p=>p.id===s.partyId),(random(s)-.5)*.75,s.year);if(hasCareer(s))e.candidateNames[1]=s.npcs[2].id;e.name=card.id==='rain'?'첫 지방선거':card.id==='responsibility'?'국회의원 선거':'대통령 선거';s.elections.push(e);s.afterResult='count';if(e.won){s.office=card.id==='rain'?'localMember':card.id==='responsibility'?'assemblyMember':'president';s.title=card.id==='rain'?'지방의원':card.id==='responsibility'?'국회의원':'대통령';s.officeUntil=s.office==='president'?null:date+48;}if(card.id==='last'){if(e.won)s.ended='당선되셨습니다.';else delete s.ended;}if(card.id==='rain'&&e.won)s.phase='central';}
 const fundingCase=s.pending.find(p=>p.id==='funds-charge'&&p.due<=s.cursor);if(fundingCase){s.legal={status:'기소',truth:'미신고 정치자금 수수·사용 기록 확인',conclusion:'법원 판단 전, 출마 자격 박탈을 자동 적용하지 않음',revealed:true};out.news.push('미신고 자금 수수 자료에 대한 수사가 기소 단계로 진행됐습니다. 유죄 확정은 아니며 정치적 책임은 별개입니다.');s.pending=s.pending.filter(p=>p!==fundingCase);}
 s.flags=[...new Set(s.flags)];
 refreshNext(s,newRoute,varietyPool,()=>random(s));
 const after=publicStats(s);for(const k of ['support','funds','fame','party'] as const)if(before[k]!==after[k])out.changes.push({key:k,before:before[k],after:after[k]});
 const pub=projection(s.rows,s.scope,s.localRegion);s.stats.support=pub.support??0;s.stats.fame=pub.fame;
 s.history.push({turn:s.turn-1,title:card.title,choice:choice.text,result:out.result,news:out.news,changes:out.changes});s.outcome=out;s.stage='result';return s;
}
export function acknowledge(s:State):State{if(s.stage!=='result')return s;return {...s,stage:s.afterResult,outcome:null}}
export function resume(s:State):State{if(s.stage!=='count'||!s.elections.at(-1)?.won)return s;return {...s,stage:s.cursor>=s.route.length?'ending':'play',completed:s.cursor>=s.route.length}}
export function retryElection(current:State):State{
 if(current.stage!=='count'||current.elections.at(-1)?.won||current.route.length+8>1000)return current;
 const s=structuredClone(current),phase=s.elections.at(-1)!.name==='첫 지방선거'?'local':s.elections.at(-1)!.name==='국회의원 선거'?'central':'presidential';
 const template=retryTemplates[phase];s.flags.push(`재도전:${phase}:${s.cursor}`);s.pending.forEach(p=>{if(p.due>=s.cursor)p.due+=8});s.route.splice(s.cursor,0,...template.map(slot=>slot.startsWith('?')?'':slot));
 template.forEach((slot,i)=>{if(slot.startsWith('?'))s.route[s.cursor+i]=drawForSlot(s,slot,varietyPool,()=>random(s),s.cursor+i)});
 s.calendarOrigin+=(phase==='presidential'?60:48)-template.length*2;const date=s.calendarOrigin+s.turn*2;s.year=Math.floor(date/12);s.month=date%12+1;s.age=s.year-s.birthYear;
 if(s.officeUntil!==null&&date>=s.officeUntil){s.office='none';s.officeUntil=null;s.title='원외 정치인';}
 s.phase=phase;s.stage='play';s.completed=false;delete s.ended;s.outcome=null;return s;
}
export function retire(s:State):State{return {...s,stage:'ending',ended:'조용한 퇴장',completed:true,outcome:null}}
export const SAVE_KEY='nomination-please-v3';

function applyFinanceChoice(current:State,card:Card,index:0|1):State{
 const s=structuredClone(current),before=publicStats(s),choice=card.choices[index];const out:Outcome={title:card.title,speaker:card.speaker,choice:choice.text,result:choice.result,news:[],changes:[]};const id=`자금기록-${s.turn}-${s.interruptions.length}`;if(!s.npcs.some(n=>n.id==='온지원'))s.npcs.push({id:'온지원',role:'후원 중개인',relationship:5,trust:10,loyalty:10,ambition:75,influence:45,goals:['정치적 접근권 확보'],memoryTags:[],knownFacts:[],secretIds:[]});
 if(card.id==='funds-crisis'){
  if(index===0){s.ended='정치자금 고갈 · 원칙을 지킨 퇴장';s.stage='ending';s.completed=true;s.outcome=null;s.flags.push('자금 고갈로 회차 종료');}
  else{s.finance.illicit=35;s.flags.push('미신고 정치자금 수수');s.pending.push({id:'funds-exposure',due:Math.min(s.cursor+4,s.route.length-1),source:id});const broker=s.npcs.find(n=>n.id==='온지원');if(broker){broker.memoryTags.push(id);broker.secretIds.push('미신고 자금 수수 자료:'+id);broker.knownFacts.push('캠프에 미신고 자원 35 제공');}out.news.push('활동 자원 35를 확보했지만 합법 자금과 별도 기록됩니다. 수수 기록은 이후 폭로와 수사의 근거가 됩니다.');s.stage='result';s.afterResult='play';}
 }else{
  const due=s.pending.find(p=>p.id==='funds-exposure'&&p.due<=s.cursor);s.pending=s.pending.filter(p=>p!==due);
  if(index===0){const returned=s.finance.illicit;s.finance.illicit=0;changeFunds(s,-4);out.news.push(`남아 있던 미신고 자원 ${returned}를 반환하고 자료 제출 비용을 지출했습니다.`);}else changeFunds(s,-8);
  const loss=index===0?12:20;s.stats.trust=clamp(s.stats.trust-loss,0,100);s.stats.party=clamp(s.stats.party-15,0,100);s.rows.forEach(r=>{r.trust=clamp(r.trust-loss/200);r.opinion=clamp(r.opinion-loss/70,-4,4)});
  s.legal={status:'미신고 자금 수사 중',truth:'플레이어가 받은 미신고 자금의 수수 기록 존재',conclusion:'기록과 사용 경위 확인, 유죄 확정 전',revealed:true};s.pending.push({id:'funds-charge',due:s.cursor+3,source:id});s.flags.push('미신고 정치자금 폭로');s.stage='result';s.afterResult='play';
 }
 const after=publicStats(s);for(const key of ['support','funds','fame','party'] as const)if(before[key]!==after[key])out.changes.push({key,before:before[key],after:after[key]});s.interruptions.push({id,cardId:card.id,turn:s.turn,year:s.year,month:s.month,title:card.title,speaker:card.speaker,choiceIndex:index,choice:choice.text,result:out.result,news:out.news,changes:out.changes});s.flags=[...new Set(s.flags)];if(s.stage==='result')s.outcome=out;return s;
}
