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
 if(c.id==='family-clue'){c.title='재단의 토지, 당신의 책임입니까?';c.choices[0].result='재단은 거래를 보류했습니다. 계약서의 빈칸은 남았고, 사업 담당자의 한숨도 기록됐습니다.';c.choices[1].result='재단이 보유·거래 자료를 보냈습니다. 캠프 메신저가 자료실이 됐습니다.';}
 if(c.id==='family'){c.title='운영재단의 거래도 같은 기준입니까?';c.choices[0].result='거래 자료를 공개해 의혹 일부가 정정됐습니다. 재단은 다음부터 회의에 계약서를 들고 오겠답니다.';c.choices[1].text='독립 검증에는 자료를 내되, 업무와 무관한 정보는 보호하겠습니다.';c.choices[1].result='검증 담당자에게 필요한 자료를 냈습니다. 범죄로 확인된 것은 없지만 공개하지 않은 부분은 설명할 책임이 남았습니다.';}
 if(c.id==='public-family-privacy')c.choices[1].result='직원의 개인 정보는 가리고 공적 접촉 기록은 검증 담당자에게 냈습니다. 서류의 검은 줄에도 기준이 필요했습니다.';
 return c;
}
export const ageLabel=(s:Pick<State,'job'|'age'>)=>s.job===8?`가동 ${Math.max(1,s.age-35)}년차`:`${s.age}세`;
