import type {State,Outcome,PublicChange} from './engine.ts';import type {Card} from './content.ts';
export const FINANCE_FLAG='자금 위기: finance-v1';
export type Interruption={id:string;cardId:string;turn:number;year:number;month:number;title:string;speaker:string;choiceIndex:0|1;choice:string;result:string;news:string[];changes:PublicChange[]};
export type Finance={illicit:number;partyGrants:string[]};
export function availableFunds(s:State){return Math.min(100,s.stats.funds+s.finance.illicit)}
export function changeFunds(s:State,delta:number){if(delta>=0)s.stats.funds=Math.min(100-s.finance.illicit,s.stats.funds+delta);else{const expense=-delta;const legal=Math.min(s.stats.funds,expense);s.stats.funds-=legal;s.finance.illicit=Math.max(0,s.finance.illicit-(expense-legal))}}
export function financeEvent(s:State):Card|null{
 if(!s.flags.includes(FINANCE_FLAG)||s.stage!=='play'||s.completed)return null;
 if(availableFunds(s)<=0)return {id:'funds-crisis',title:'잔고 0. 캠프 문을 닫아야 합니다.',speaker:'자금 알선인 · 온지원',body:(s.npcs.find(n=>n.id==='온지원')?.memoryTags.some(tag=>tag.startsWith('career-activist-donor'))?'초반에 수상한 후원을 중개했던 온지원이 다시 연락했습니다. ':'')+'합법적으로 쓸 수 있는 돈도, 남은 활동 자원도 없습니다. 온지원이 미신고 활동 자원 35를 제공하겠다고 합니다. 받으면 당장은 버틸 수 있지만 불법 수수 기록과 대가 요구가 정치 생명을 위협합니다. 이번 회차를 끝낼지, 그 위험을 안고 이어갈지 정해야 합니다.',importance:3,maxAppearances:1,choices:[{text:'불법 자금을 거절하고 이번 정치 인생을 끝낸다',effect:{},result:'잔고는 끝났지만 넘지 않기로 한 선은 남았습니다.'},{text:'불법 자금을 받고 당장의 정치 생명을 연장한다',effect:{},result:'캠프의 불은 다시 켜졌습니다. 그 불을 누가 켰는지 증명하는 기록도 남았습니다.'}]};
 const due=s.pending.find(p=>p.id==='funds-exposure'&&p.due<=s.cursor&&s.interruptions.some(i=>i.id===p.source&&i.cardId==='funds-crisis'&&i.choiceIndex===1));
 if(due)return {id:'funds-exposure',title:'그 돈의 주인이 뉴스를 탔습니다',speaker:'기자 · 문장수',body:'자금이 바닥났을 때 받은 미신고 지원의 수수 기록이 보도됐습니다. 지금 남은 돈이 적더라도 과거에 받은 사실은 사라지지 않습니다. 수사기관은 실제 자료를 확인하며, 보도만으로 유죄가 확정되는 것은 아닙니다.',importance:3,maxAppearances:1,choices:[{text:'남은 미신고 자금을 반환하고 자료를 제출한다',effect:{},result:'남은 돈과 기록을 제출했습니다. 협조는 과거의 수수를 지우지는 않지만, 추가 은폐를 막았습니다.'},{text:'변호인을 선임해 사실관계와 책임 범위를 다툰다',effect:{},result:'방어권을 행사했습니다. 캠프 설명도 기록을 넘어설 수는 없습니다.'}]};
 return null;
}
