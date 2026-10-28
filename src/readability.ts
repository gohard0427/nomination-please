import type {Card} from './content.ts';import type {State} from './engine.ts';
import {readabilityDrafts,wordingVariants} from './readability-data.ts';
import {readabilityPolicy} from './readability-policy.ts';
import {incumbent,isOffer} from './politics.ts';import {partyById,isMerged} from './parties.ts';
export const READABILITY_FLAG='문구 개편: v1';
const unquote=(t:string)=>t.trim().replace(/^[“"]|[”"]$/g,'');
const key=(id:string,choices:string[])=>JSON.stringify([id,choices.map(unquote)]);
const variations=new Map(wordingVariants.map(x=>[key(x.id,x.before.choices),x]));
const wordMap=new Map<string,string>();for(const v of wordingVariants)for(let i=0;i<2;i++)if(v.before.choices[i]!==v.after.choices[i])wordMap.set(unquote(v.before.choices[i]),v.after.choices[i]);
const preserveBody=new Set(['leader','betrayal','appeal','law','housing','family-clue','family','recruit','national','president','primary','freepress','faction','ally','cabinet','career-rival-meet','local-rice']);
const clean=(t:string)=>t.replaceAll('관철가 목표','관철하는 것이 목표').replaceAll('객석 동원를','객석 동원을').replace(' 어떤 입장을 내시겠습니까?','');
export function readableRevision(card:Card,s:State):Card{
 if(!s.flags.includes(READABILITY_FLAG))return card;
 const draft=readabilityDrafts[card.id],originalBody=card.body,originalChoices=card.choices.map(c=>unquote(c.text));
 const retry=s.flags.some(f=>{const m=/^재도전:(local|central|presidential):(\d+)$/.exec(f);return m&&s.cursor>=Number(m[2])&&s.cursor<Number(m[2])+(m[1]==='presidential'?9:6);});
 // 동적 분기·실제 인용을 먼저 보존하고 맞는 문구만 바꾼다.
 const variant=variations.get(key(card.id,originalChoices));
 if(draft){
  if(card.title===draft.before.title)card.title=draft.after.title;
  if(!preserveBody.has(card.id)&&!card.id.startsWith('debate-')&&!isOffer(card.id)&&!retry){
   const quote=s.statements.find(p=>p.text&&originalBody.includes(p.text));
   card.body=draft.after.body;
   if(quote&&!card.body.includes(quote.text))card.body=`당신이 실제로 남긴 말 “${quote.text}”. `+card.body;
  }
 }
 card.choices.forEach((c,i)=>{
  const direct=draft&&originalChoices[i]===unquote(draft.before.choices[i])?draft.after.choices[i]:undefined;
  c.text=variant?.after.choices[i]??direct??wordMap.get(originalChoices[i])??originalChoices[i];
 });
 if(variant&&originalBody===variant.before.body&&!preserveBody.has(card.id))card.body=variant.after.body;
 // 수정안 표본의 인명·고정 시드를 운영 회차에 하드코딩하지 않는다.
 if(isOffer(card.id)){
  if(originalBody.includes('지금까지의 활동을 정리할')){card.body='다음 입당 제의를 기다리는 동안, 정책을 알릴지 주민을 더 만날지 정해야 합니다.';card.choices[0].text='정책 자료부터 공개하겠습니다.';card.choices[1].text='지역 주민의 이야기를 더 듣겠습니다.';}
  else if(s.flags.includes('기초의원 당적 선택')&&s.partyId&&card.id==='party-offer'){card.body=originalBody;card.choices[0].text='조건과 사용 내역을 공개하고, 활동비를 받겠습니다.';card.choices[1].text='당 지원 대신, 제 후원을 직접 모으겠습니다.';}
  else{card.body=originalBody;card.choices.forEach((c,i)=>c.text=originalChoices[i]);}
 }
 if(card.id==='funds-crisis'){card.body='캠프 자금이 0입니다. 온지원이 신고하지 않을 불법 자금 35를 주겠답니다. 받으면 활동은 이어가지만, 대가 요구와 폭로·수사 위험이 남습니다.';card.choices[0].text='불법 돈은 받지 않겠습니다. 여기서 은퇴하겠습니다.';card.choices[1].text='불법 돈을 받겠습니다. 일단 캠프부터 살립시다.';}
 if(card.id==='funds-exposure'){card.body='받았던 불법 자금 기록이 보도됐습니다. 돈을 다 썼어도 받은 사실은 남습니다. 수사는 실제 증거로 진행되며, 보도 자체가 유죄 판결은 아닙니다.';card.choices[0].text='남은 불법 자금과 기록을 제출하겠습니다.';card.choices[1].text='변호사와 사실관계와 제 책임을 따지겠습니다.';}
 if(draft&&(['housing','family-clue','family'].includes(card.id)&&s.job!==2||card.id==='faction'||card.id==='president'&&s.partyId)){
  const prior=s.statements.find(p=>p.text&&originalBody.includes(p.text));card.body=draft.after.body;if(prior&&!card.body.includes(prior.text))card.body=`당신이 실제로 남긴 말 “${prior.text}”. `+card.body;
 }
 if(card.id==='appeal'&&!retry){const name=s.npcs[2].id;card.body=`${name}이 후보 심사 점수표를 건넵니다. “인신공격은 그만합시다.” 점수표를 공개할지, ${s.partyId?'당에':'연합에'} 재심을 먼저 요구할지 정해야 합니다.`;}
 if(card.id==='law'&&s.job===3){card.body='허위 경력 고발이 들어왔지만 원본 임명장은 있습니다. 법률가 친구가 사적으로 진행을 알아봐주겠답니다. 빨리 확인할 수 있지만, 통화는 녹음되고 나중에 보도될 수 있습니다.';card.choices[0].text='친구라도, 정식 변호인으로 도와줘.';card.choices[1].text='친구야, 사건이 어디까지 갔는지만 알아봐 줘.';}
 if(['housing','family-clue','family'].includes(card.id)&&s.job===2){
  if(card.id==='housing'){card.body='공공사업 계약에 가족 회사가 참여할 수 있습니다. 기업가 출신인 당신에게, 공적 판단에 가족 이익이 얽히는 문제를 어떻게 막을지 묻습니다.';card.choices[0].text='가족도 예외 없이, 같은 이해관계 심사를 받게 하겠습니다.';card.choices[1].text='누구와 연락했는지 공개하고, 외부 검증을 받겠습니다.';}
  else if(card.id==='family-clue'){card.body='누나 회사가 공공사업에 지원합니다. “네가 정치한다고 내 사업도 멈춰야 해?” 직접 심사하는 자리는 아니지만, 영향력을 썼다는 의혹을 피할 기준이 필요합니다.';card.choices[0].text='관계를 밝히고, 저는 관련 연락에서 빠지겠습니다.';card.choices[1].text='독립 심사와 접촉 기록 보관을 먼저 요구하겠습니다.';}
  else if(s.flags.includes('가족 기업 입찰 논의')){card.body='가족 회사의 공공사업 입찰이 보도됐습니다. 당신이 심사에 관여한 증거는 아직 없습니다. 가족의 사업과 당신의 공적 역할을 나눠 검증해야 합니다.';card.choices[0].text='가족 회사의 연락·심사 자료를 공개하겠습니다.';card.choices[1].text='외부 검증은 받되, 비공개 사업 정보는 보호하겠습니다.';}
 }
 if(card.id==='president'&&!s.partyId){card.body='무소속으로 대선에 도전합니다. 정책 홍보와 후보 등록에 필요한 추천·조직 준비 중 어디에 먼저 힘쓸까요?';card.choices[0].text='공개 정책 발표로 시민 지지를 넓히겠습니다.';card.choices[1].text='전국의 추천인과 준비 조직부터 모으겠습니다.';}
 if(card.id==='betrayal'&&!s.partyId){card.choices[0].text='공동 후보를 고른 기준부터 공개하십시오.';card.choices[1].text='연합을 떠나, 독자 후보로 출마하겠습니다.';}
 if(card.id==='recruit'&&!s.partyId){card.choices[0].text='우리 캠프 자리부터, 청년에게 기회를 줍시다.';card.choices[1].text='지금은 지역에서 일해본 사람을 뽑겠습니다.';}
 if(card.id==='democracy'&&!s.partyId){card.body='무소속 후보를 평가할 시민 모임이 생겼습니다. 참여한 시민들이 투표할지, 실무 심사단이 평가할지 의견을 묻습니다.';card.choices[0].text='시민이 참여해 직접 평가해야 합니다.';card.choices[1].text='실무 심사단이 평가하고, 근거를 공개해야 합니다.';}
 if(card.id==='freepress'){card.body=`${s.partyId?'당':'무소속 연합'}이 비판한 기자의 출입을 막으려 합니다. 보도 중 확인된 오류도 있습니다. 출입은 보장하되, 제한 철회와 보도 정정 중 어디에 먼저 힘을 쓸까요?`;}
 if(card.id==='world-pardon-prePolitics'){const p=incumbent(s);card.body=`장태산 전 대통령은 정치자금 범죄로 형이 확정돼 수감 중입니다. ${partyById(p.partyId,s)!.name} 소속 ${p.name} 대통령이 특별사면을 검토합니다. 형 집행을 면제하는 사면에 어떤 입장입니까?`;}
 if(card.id==='world-incumbent-prePolitics'){const p=incumbent(s);card.body=`${partyById(p.partyId,s)!.name} 소속 ${p.name} 대통령의 과거 정치자금 처리 의혹이 보도됐습니다. 원본 확인과 수사는 끝나지 않았습니다. 생방송에서 당신의 입장을 묻습니다.`;}
 // 각 직업의 실제 라이벌·소속·기억은 원래 분기에 남긴다.
 if(card.id==='favor-request')card.body=`함께 활동했던 ${s.npcs[2].id}${s.npcs[2].id==='박동네'?'가':'이'} 지인에게 캠프 자리를 부탁합니다. 경험은 있지만 다른 지원자 심사는 아직입니다.`;
 if(card.id==='career-rival-meet')card.body=clean(originalBody).replace('공개 토론으로 경쟁할지, 공동 현장 조사부터 해볼지 고르세요.','정책 토론으로 경쟁할까요, 같은 현장부터 조사할까요?');
 if(isMerged(s)&&card.id==='party-green')card.speaker='환경계 대표 · 도초록';
 if(isMerged(s)&&card.id==='party-labor')card.speaker='노동계 대표 · 정버팀';
 card.body=clean(card.body).replace(/ (오정산|이소통|구해법|장현장|류초록|권기준): “[^”]*”/g,'');
 if(draft?.after.optionalHints?.length)Object.assign(card,{costNotes:[...draft.after.optionalHints]});
 return readabilityPolicy(card,s);
}
