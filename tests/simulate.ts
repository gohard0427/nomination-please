import {createState,getCard,applyChoice,acknowledge,resume,retryElection,retire,type State} from '../src/engine.ts';import {decode} from '../src/persistence.ts';
const runs=Number(process.argv[2]??4000);let wins=0,independent=0,boomerangs=0,lossComeback=0,retries=0,retirements=0,friendUses=0,friendQuick=0,friendLeaks=0;const jobs=Array(8).fill(0),firstCards=new Set<string>(),events=new Set<string>(),groupSet=new Set<string>(),parties=new Set<string>();const start=performance.now();
for(let seed=1;seed<=runs;seed++){
 let s=createState(seed%8,seed),policySeed=seed,steps=0;const attempts=new Map<string,number>();firstCards.add(getCard(s).id);
 while(s.stage!=='ending'&&steps++<400){
  if(s.stage==='result'){s=acknowledge(s);continue}
  if(s.stage==='count'){const last=s.elections.at(-1)!;if(last.won){s=resume(s);continue}const n=(attempts.get(last.name)??0)+1;attempts.set(last.name,n);if(n<=2){s=retryElection(s);retries++;}else{s=retire(s);retirements++;}continue}
  policySeed=(Math.imul(policySeed,1664525)+1013904223)>>>0;const card=getCard(s);events.add(card.id);const before=s.turn;s=applyChoice(s,card,(policySeed>>>30)%2 as 0|1);if(s.turn!==before+1)throw Error('진행 막힘');
 }
 if(s.stage!=='ending'||!s.ended)throw Error('완결되지 않음');const presidential=[...s.elections].reverse().find(e=>e.name==='대통령 선거');if(presidential?.won){wins++;jobs[s.job]++;if(!s.elections[0].won)lossComeback++;}if(s.partyId===null)independent++;boomerangs+=s.flags.filter(x=>x.startsWith('부메랑')).length;friendUses+=Number(s.flags.includes('동기 비공식 문의'));friendQuick+=Number(s.flags.includes('동기 문의 조기 확인'));friendLeaks+=Number(s.flags.includes('동기 통화 보도'));
 s.evidence.forEach(e=>groupSet.add(e.groupId));if(s.partyId)parties.add(s.partyId);if(!s.elections.every(e=>Math.abs(e.votes.reduce((a,b)=>a+b)-100)<.001))throw Error('개표 합계');if(seed%20===0&&!decode(JSON.stringify(s)))throw Error('저장 정합성');if(seed%250===0)console.log(`${seed}/${runs} 회차 완료`);
}
console.log(JSON.stringify({runs,presidentWins:wins,winsByJob:jobs,independentRuns:independent,lossComeback,retries,retirements,boomerangs,firstQuestionKinds:firstCards.size,eventKindsObserved:events.size,friendUses,friendQuick,friendLeaks,groupsObserved:[...groupSet],partiesObserved:[...parties],seconds:Math.round((performance.now()-start)/1000),note:'자동 선택, 선거별 최대 두 번 재도전 후 은퇴하는 테스트 정책. 사람의 재미·실제 당선율 검증이 아님.'},null,2));
