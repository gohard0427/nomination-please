import type {State} from './engine.ts';
import {CALENDAR_FLAG,day,dayParts,syncPresidency,initPresidency,presidents} from './presidents.ts';
export type PoliticalCalendar={version:1;day:number;dates:number[];previousDay:number};
const interpolate=(a:number,b:number,n:number)=>Array.from({length:n},(_,i)=>Math.floor(a+(b-a)*(i+1)/n));
function compressUrgent(s:State,dates:number[],from=0){for(let i=from;i<s.route.length;i++)if(['investigation','housing','appeal','family-clue','audit','family','law'].includes(s.route[i]))dates[i+1]=Math.min(dates[i+1],dates[i]+7);}
function fill(dates:number[],from:number,to:number,a:number,b:number){dates.splice(from+1,to-from,...interpolate(a,b,to-from));}
export function initCalendar(s:State){const dates:number[]=Array(49).fill(day(2026));const knots:[[number,number],...Array<[number,number]>]=[[0,day(2026)],[12,day(2027)],[13,day(2028,1)],[14,day(2028)],[15,day(2028,9,8)],[16,day(2029,1)],[17,day(2029,5)],[18,day(2029)],[19,day(2029,9,5)],[20,day(2029,11)],[21,day(2029,11,8)],[22,day(2029,11,15)],[23,day(2030,5)],[24,day(2030)],[30,day(2032)],[36,day(2035)],[37,day(2035,9,8)],[38,day(2036,3)],[39,day(2036,5)],[40,day(2036,6)],[41,day(2036,7)],[42,day(2036,8,20)],[47,day(2036,8,20)],[48,day(2036)]];for(let i=1;i<knots.length;i++){const [from,a]=knots[i-1],[to,b]=knots[i];fill(dates,from,to,a,b);}compressUrgent(s,dates);s.calendar={version:1,day:dates[0],previousDay:dates[0],dates};s.flags.push(CALENDAR_FLAG);initPresidency(s);}
function setDate(s:State,n:number){if(!s.calendar)return;s.calendar.previousDay=s.calendar.day;s.calendar.day=n;const p=dayParts(n);s.year=p.year;s.month=p.month;s.age=s.year-s.birthYear;}
export function advanceCalendar(s:State,cardId:string){if(!s.calendar)return false;const n=s.calendar.dates[s.cursor];if(n===undefined)throw Error('정치 달력 일정이 누락됐습니다.');setDate(s,n);syncPresidency(s,cardId==='last'?n-1:n);return true;}
export function nextElectionDay(kind:'local'|'central'|'presidential',after:number,minDays=1){const start=kind==='local'?2030:kind==='central'?2032:2031,period=kind==='presidential'?5:4;let year=start;while(day(year)<after+minDays)year+=period;return day(year);}
/** 재도전은 해당 선거의 다음 예정일을 사용한다. 다른 선거 달력은 일괄 이동시키지 않는다. */
export function rescheduleRetry(s:State,phase:'local'|'central'|'presidential',added:number){if(!s.calendar)return false;const c=s.calendar,start=s.cursor;const old=c.dates.slice(0,start+1);c.dates=[...old,...Array(s.route.length-start).fill(c.day)];let at=start,previous=c.day;
 for(let i=start;i<s.route.length;i++){const id=s.route[i];if(!['rain','responsibility','last'].includes(id))continue;const kind=id==='rain'?'local':id==='responsibility'?'central':'presidential';const target=nextElectionDay(kind,previous,kind==='presidential'?365:90);if(at===start){const wait=target-(kind==='presidential'?365:180);setDate(s,Math.max(c.day,wait));c.dates[start]=c.day;previous=c.day;syncPresidency(s,c.day);}
 if(kind==='presidential'){
  const declaration=s.route.findIndex((id,j)=>j>=at&&j<=i&&id==='president');const campaignStart=Math.max(previous+(declaration-at+1)*7,target-365);
  if(declaration>=0){fill(c.dates,at,declaration,previous,campaignStart);at=declaration;previous=campaignStart;}
  const tv=s.route.findIndex((id,j)=>j>=at&&j<=i&&(id==='tv'||id.startsWith('debate-')));const debateStart=target-12;
  if(tv>=0){fill(c.dates,at,tv,previous,debateStart);for(let j=tv;j<i;j++)c.dates[j+1]=debateStart;c.dates[i+1]=target;}
  else fill(c.dates,at,i+1,previous,target);
 }else fill(c.dates,at,i+1,previous,target);
 previous=target;at=i+1;
 }
 // 긴 활동은 압축하고 고정된 검증·해명 연쇄는 수일 안에 처리한다.
 compressUrgent(s,c.dates,start);return true;
}
export function calendarValid(s:any){const c=s?.calendar,p=s?.presidency,flag=s?.flags?.includes?.(CALENDAR_FLAG);if(!c&&!p)return !flag;if(!flag||!c||!p||c.version!==1||p.version!==1)return false;const num=(n:any)=>Number.isInteger(n)&&n>=day(2026)&&n<day(2200);if(!num(c.day)||!num(c.previousDay)||c.previousDay>c.day||!Array.isArray(c.dates)||c.dates.length!==s.route?.length+1||!c.dates.every(num)||c.dates.some((d:number,i:number)=>i>0&&d<c.dates[i-1])||c.dates[s.cursor]!==c.day)return false;const dt=dayParts(c.day);if(dt.year!==s.year||dt.month!==s.month||s.age!==s.year-s.birthYear)return false;
 if(!Array.isArray(p.terms)||p.terms.length<1||p.terms.length>35||!Array.isArray(p.contacts)||p.contacts.length>200)return false;
 const ids=new Set<string>();for(let i=0;i<p.terms.length;i++){const t=p.terms[i];if(typeof t.id!=='string'||typeof t.name!=='string'||t.name.length>100||!['background','election','player'].includes(t.source)||!(t.partyId===null||['future','better','reform','labor','guardian'].includes(t.partyId))||!num(t.start)||!num(t.end)||t.end!==day(dayParts(t.start).year+5,dayParts(t.start).month,dayParts(t.start).date)||i>0&&t.start!==p.terms[i-1].end||ids.has(t.id))return false;ids.add(t.id);}
 for(const t of p.terms){if(t.source==='background'&&!presidents.some(d=>d.id===t.id&&d.name===t.name&&d.partyId===t.partyId))return false;if(t.source==='player'&&(t.id!=='player'||t.name!=='당신'||t.partyId!==s.partyId))return false;}const last=p.terms.at(-1);if(last.start>c.day||last.end<=c.day)return false;
 if(!p.contacts.every((x:any)=>ids.has(x.id)&&Number.isInteger(x.turn)&&x.turn>=0&&x.turn<=s.turn&&typeof x.event==='string'&&[0,1].includes(x.choice)))return false;
 if(p.debtId!==undefined&&!ids.has(p.debtId)||p.debtAccepted!==undefined&&typeof p.debtAccepted!=='boolean')return false;
 if(p.notice!==undefined&&(typeof p.notice.from!=='string'||typeof p.notice.to!=='string'||!Number.isInteger(p.notice.count)||p.notice.count<1||p.notice.count>35))return false;return true;
}
