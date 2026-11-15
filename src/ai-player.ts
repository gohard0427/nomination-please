import {partyById} from './parties.ts';
import {aiOpeningFollowup} from './ai-openers.ts';
import type {State} from './engine.ts';import type {Card} from './content.ts';
// 개인 관계를 전제로 한 사건만 고친다. 주민의 가족 정책은 그대로 유지한다.
const personal=new Set(['housing','family-clue','family','public-family-privacy','law']);
export function aiPlayerCard(c:Card,s:State){if(s.job!==8)return c;c=aiOpeningFollowup(c,s);
 if(!personal.has(c.id)){if(c.speaker.includes('한보름'))c.speaker='주민 · 돌봄 간담회';return c;}
 const body:Record<string,string>={housing:'운영재단이 공공사업에 참여하려 합니다. 당신이 영향력을 행사할 수 있는 위치에서 이해충돌 기준을 어떻게 공개할까요?','family-clue':'당신의 정치 참여 등록 전부터 운영재단이 보유한 토지 근처에 개발 계획이 발표될 수 있다는 소문입니다. 재단 관계자는 거래를 검토 중입니다. 거래 보류를 요구할지, 시점과 자료를 먼저 확인할지 정하세요.',family:'운영재단 토지 거래가 보도됐습니다. 보유 시점과 개발 발표를 대조한 현재 자료에는 위법 증거가 없습니다. 재단의 거래와 당신의 직접 관여는 구분해 검증해야 합니다.',law:'정치 참여 등록 경력이 허위라는 고발이 들어왔습니다. 등록 확인 자료는 있지만 원본 대조가 필요합니다. 정식으로 자료를 제출할지, 공개 해명을 먼저 할지 정해야 합니다.','public-family-privacy':'운영재단의 공공사업 참여를 검증하는 질문에 직원 개인의 의료 정보까지 섞여 있습니다. 이해충돌 자료는 내되, 업무와 무관한 개인정보를 어디까지 보호할까요?'};
 c.body=body[c.id];
 const rename=(t:string)=>t.replaceAll('한보름','운영재단').replaceAll('가족','운영재단').replaceAll('누나','재단 관계자').replaceAll('상속','재단 보유').replaceAll('정상 임명장','등록 확인 자료');
 c.title=rename(c.title);c.speaker=c.speaker.includes('한보름')?'운영재단 · 사업 담당자':c.speaker;
 c.choices.forEach(x=>{x.text=rename(x.text);x.result=rename(x.result);});
 if(c.id==='housing'){
  c.title='운영재단, 공공사업에 참여해도 됩니까?';c.speaker='운영재단 · 사업 담당자';c.topic='이해충돌';
  c.body='당신을 운영하는 재단이 지역 공공사업에 지원하려 합니다. 재단 담당자는 “사업 기회까지 막지는 말아주세요”라고 합니다. 당신이 심사에 관여한 사실은 없지만, 정치적 영향력을 이용했다는 의심을 피할 기준이 필요합니다.';
  const p=partyById(s.partyId,s);const party=(stance:number)=>p?Math.round(p.positions[11]*stance*6):0;
  c.choices=[{text:'이번 사업에는 참여하지 말아달라고 요구하겠습니다.',effect:{trust:6,org:-3,party:party(.8)},result:'재단에 불참을 요구하고 그 입장을 공개했습니다. 재단은 독립된 조직의 기회도 존중해달라며 반발했습니다. 요구만으로 실제 불참이 확정되지는 않습니다.'},{text:'관계를 공개하고, 독립 심사를 받는 조건으로 참여하게 하겠습니다.',effect:{trust:2,org:3,funds:-3,party:party(.35)},result:'재단과의 관계를 공개하고 심사에는 관여하지 않겠다고 밝혔습니다. 외부 검증을 준비하는 비용이 들었습니다. 채택 여부는 심사기관이 결정하며, 특혜 의혹을 설명할 책임도 남습니다.'}];
  Object.assign(c,{signals:[[{topic:'reform',stance:.8,strength:.55}],[{topic:'reform',stance:.35,strength:.55}]],values:[{},{}],costNotes:['이해충돌 예방 · 재단과 관계 부담','사업 기회 유지 · 검증 비용과 특혜 의혹']});
 }
 if(c.id==='family-clue'){c.title='재단의 토지, 당신의 책임입니까?';c.choices[0].result='재단은 거래를 보류했습니다. 계약서의 빈칸은 남았고, 사업 담당자의 한숨도 기록됐습니다.';c.choices[1].result='재단이 보유·거래 자료를 보냈습니다. 캠프 메신저가 자료실이 됐습니다.';}
 if(c.id==='family'){Object.assign(c,{newsOverride:['운영재단 자료 공개…동일 기준 검증','공개 범위와 재단 관계…검증 뒤에도 남은 과제','독립 검증에 자료 제출…직원 정보는 보호','미공개 자료의 범위…추가 설명 요구']});c.title='운영재단의 거래도 같은 기준입니까?';c.choices[0].result='거래 자료를 공개해 의혹 일부가 정정됐습니다. 재단은 다음부터 회의에 계약서를 들고 오겠답니다.';c.choices[1].text='독립 검증에는 자료를 내되, 업무와 무관한 정보는 보호하겠습니다.';c.choices[1].result='검증 담당자에게 필요한 자료를 냈습니다. 범죄로 확인된 것은 없지만 공개하지 않은 부분은 설명할 책임이 남았습니다.';}
 if(c.id==='public-family-privacy')c.choices[1].result='직원의 개인 정보는 가리고 공적 접촉 기록은 검증 담당자에게 냈습니다. 서류의 검은 줄에도 기준이 필요했습니다.';
 return c;
}
export const ageLabel=(s:Pick<State,'job'|'age'>)=>s.job===8?`가동 ${Math.max(1,s.age-35)}년차`:`${s.age}세`;
