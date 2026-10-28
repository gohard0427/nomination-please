import {queueMergerEntry} from './merger-content.ts';
import {isMerged} from './parties.ts';
import type {State,NPC} from './engine.ts';
import type {Card} from './content.ts';
import {shortRun} from './short-run.ts';
export const aides=[
 {party:'future',id:'오정산',role:'예산·경제 보좌관',goal:'성장 공약의 비용을 검증한다',advice:'지원 약속에는 계산서도 붙여야 합니다.',topic:'tax'},
 {party:'better',id:'이소통',role:'민생·협상 보좌관',goal:'다른 집단의 요구를 조율한다',advice:'지원 밖에 남는 사람도 설명해야 합니다.',topic:'welfare'},
 {party:'reform',id:'구해법',role:'기술·정책 보좌관',goal:'기술 공약의 실제 성과를 확인한다',advice:'도입 발표보다 실제 사용 결과가 중요합니다.',topic:'education'},
 {party:'labor',id:'장현장',role:'노동·조직 보좌관',goal:'현장 노동의 조건을 개선한다',advice:'좋은 말보다 일하는 조건에 남겨야 합니다.',topic:'labor'},
 {party:'green',id:'류초록',role:'환경·지역 보좌관',goal:'환경 비용과 지역 부담을 함께 확인한다',advice:'환경 비용도 어느 동네가 내는지 봐야 합니다.',topic:'environment'},
 {party:'guardian',id:'권기준',role:'조직·일정 보좌관',goal:'강경 지지층과 공적 절차의 갈등을 다룬다',advice:'지지자의 박수와 공적 절차는 따로 확인합시다.',topic:'society'}
];
export function activeAide(s:State){return shortRun(s)?aides.find(a=>a.party===(isMerged(s)&&s.partyId==='labor'&&s.route[s.cursor]?.includes('green')?'green':s.partyId)):undefined;}
export function syncAide(s:State){if(isMerged(s)&&s.partyId==='labor'){for(const a of aides.filter(a=>['labor','green'].includes(a.party))){if(!s.npcs.some(n=>n.id===a.id))s.npcs.push({id:a.id,role:a.role,relationship:15,trust:35,loyalty:40,ambition:50,influence:35,goals:[a.goal],memoryTags:[],knownFacts:['노동환경당의 노동·환경 협력자로 합류'],secretIds:[]});}queueMergerEntry(s);return;}const a=activeAide(s);if(!a||s.npcs.some(n=>n.id===a.id))return;const n:NPC={id:a.id,role:a.role,relationship:15,trust:35,loyalty:40,ambition:50,influence:35,goals:[a.goal],memoryTags:[],knownFacts:['현재 정당에서 활동을 함께 시작함'],secretIds:[]};s.npcs.push(n);s.flags.push('보좌진 합류:'+a.id+':'+s.turn);}
export function aideCard(card:Card,s:State){const a=activeAide(s);if(a&&card.speaker.includes('고단비')){card.speaker=card.speaker.replace('고단비',a.id);if(card.id.startsWith('fresh-')&&'signals' in card&&(card as any).signals[0].some((x:any)=>x.topic===a.topic))card.body+=' '+a.id+': “'+a.advice+'”';}return card;}
