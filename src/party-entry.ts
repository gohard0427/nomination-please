import type {State} from './engine.ts';
import {chapterFor} from './chapters.ts';
import type {Chapter} from './event-factory.ts';
export const ENTRY_FLAG='입당 질문:v1:';
export function partyEntries(s:Pick<State,'flags'>){return s.flags.filter(f=>f.startsWith(ENTRY_FLAG)).map(f=>{const [at,phase]=f.slice(ENTRY_FLAG.length).split(':');return {at:Number(at),phase:phase as Chapter,id:'reform-tech-'+phase};});}
export function queuePartyEntry(s:State){if(s.flags.includes('새판개혁당 입당 질문 예약')||s.flags.includes('새판개혁당 입당 질문 완료'))return;
 const at=s.cursor+1;const block=s.flags.filter(f=>f.startsWith('재도전:')).some(f=>{const start=Number(f.split(':')[2]);return at>=start&&at<start+8;});
 // 재도전8선택의 구조는 보존하고, 다음 기본 경로 구간의 앞에 삽입한다.
 let position=at;if(block){const starts=s.flags.filter(f=>f.startsWith('재도전:')).map(f=>Number(f.split(':')[2]));const start=starts.find(start=>at>=start&&at<start+8)!;position=start+8;}
 if(position>=s.route.length)return;const phase=chapterFor(s.route[position]);s.route.splice(position,0,'reform-tech-'+phase);s.pending.forEach(p=>{if(p.due>=position)p.due++;});s.flags.push(ENTRY_FLAG+position+':'+phase,'새판개혁당 입당 질문 예약');}
