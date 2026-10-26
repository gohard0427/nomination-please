import {expandedWorldCards} from './world-expansion.ts';
import {freshCards} from './fresh-content.ts';
import {professionCards} from './fresh-professions.ts';
import {parseRetryQuestion} from './retry-content.ts';
import {varietyCards} from './variety-content.ts';
import type {Card} from './content.ts';
import type {State} from './engine.ts';
/** 진행 순번이나 입당 여부 대신 사건의 정치적 맥락으로 챕터를 구분한다. */
const introduction=new Set(['wage','redtape','inheritance','rent','care','forest','party-offer','migration','peace','school','balance','equal','democracy']);
const local=new Set(['soup','leader','investigation','poster','press','housing','rival','youth','bus','betrayal','appeal','family-clue','audit','donation','family','door','debate','promise','campaign','rain']);
const central=new Set(['return','party-switch','law','national','freepress','recruit','ally','fatigue','faction','responsibility']);
const extraChapters=new Map([...varietyCards,...freshCards,...professionCards,...expandedWorldCards].map(c=>[c.id,c.chapter]));
export function chapterFor(id:string):State['phase'] {return parseRetryQuestion(id)?.phase??extraChapters.get(id)??(introduction.has(id)?'prePolitics':local.has(id)?'local':central.has(id)?'central':'presidential')}
export const chapterLabels={prePolitics:'01 입문 전, 나의 원칙',local:'02 공천과 첫 선거',central:'03 다시, 중앙으로',presidential:'04 대권 도전'};
export function chapterContext(s:State){const last=s.elections.at(-1);const phase=s.stage==='count'&&last&&!last.won?(last.name==='첫 지방선거'?'local':last.name==='국회의원 선거'?'central':'presidential'):s.stage==='play'?chapterFor(s.route[s.cursor]??'last'):s.phase;return {phase,label:chapterLabels[phase],role:phase==='prePolitics'?'주민으로서의 참여 · 요구와 제안':phase==='local'?(s.cursor<=s.route.indexOf('appeal')?'공천 도전자 · 지역 활동과 당내 경쟁':'지방선거 후보 · 지역 공약과 검증'):phase==='central'?(s.office==='localMember'?'지방의원 · 지역 의정과 국회 도전':s.office==='assemblyMember'?'국회의원 · 입법과 정치 연합':'원외 정치인 · 재기와 국회 도전'):'대선 도전자 · 국가 비전과 후보 검증'};}
/** 명칭만 바꾸지 않고 선택·결과도 실제 권한에 맞춘다. 효과와 발언 기록은 이 카드를 사용한다. */
export function contextualize(card:Card,s:State):Card {
 if(card.id==='press'){card.body='지역 예산 설명회 뒤 기자가 당신이 모은 공개 자료를 요청했습니다. 당신은 예산 편성자가 아닙니다. 자료에는 불편한 숫자와 아직 확인하지 못한 항목이 섞여 있습니다.';}
 if(card.id==='youth'){
  card.body='청년 활동가가 당신에게 청년 공천 확대 요구에 동참해 달라고 합니다. 아직 당신도 공천 도전자입니다. 공천 비율이나 교육 예산을 결정할 권한은 지도부에 있습니다.';
  card.choices[0].text='“청년 공천 30%를 요구합니다”';card.choices[1].text='교육 지원과 공개 심사를 건의한다';
  card.choices[0].result='청년들은 환호했습니다. 기존 조직은 지도부에 누구 편이냐고 물었습니다.';
  card.choices[1].result='건의서에 서명을 받았습니다. 예산과 심사를 정할 사람에게 답변도 요구했습니다.';
 }
 if(card.id==='promise'){card.body='버스 증편 공약의 재원을 검토하니 약속의 절반만 뒷받침됩니다. 지방의원 후보는 노선을 직접 운영할 수 없고, 예산 심의와 지자체 협의가 필요합니다.';card.choices[1].text='단계적 증편을 공약하고 협의를 추진한다';card.choices[1].result='목표는 유지했습니다. 실제 예산과 노선은 당선 뒤에도 협의해야 합니다.';}
 if(card.id==='recruit'){
  card.body+=' 당신이 결정할 수 있는 것은 캠프의 추천과 선발 절차입니다. 최종 공천은 정당의 심사를 거칩니다.';
  card.choices[0].text='공개 심사를 거쳐 청년 후보를 추천한다';card.choices[1].text='지역 경험을 우선해 추천한다';
  if(!s.partyId){card.body='오랜 동료와 청년 활동가가 무소속 캠프의 같은 자리를 원합니다. 당신은 자기 캠프의 선발 절차를 정할 수 있습니다. 정당의 공천을 결정하는 자리는 아닙니다.';card.choices[0].text='공개 심사로 청년 활동가의 기회를 보장한다';card.choices[1].text='현장 경험을 우선하고 청년 교육을 지원한다';}
 }
 if(card.id==='president'&&!s.partyId){card.choices[1].text='무소속 전국 추천 조직을 구축한다';card.choices[1].result='당내 경선 대신 전국 추천과 후보 등록을 준비합니다. 혼자 출마해도 혼자 준비할 수는 없습니다.';}
 if(card.id==='primary'&&!s.partyId){card.title='무소속 후보 등록의 문턱';card.body='정당 경선 대신 전국의 추천과 후보 등록 요건을 갖춰야 합니다. 등록 준비를 어떻게 진행할까요?';card.choices[0].text='공개 정책 검증과 추천 모집에 집중한다';card.choices[1].text='지역별 추천 조직과 연합을 넓힌다';}
 if(card.id==='tv'&&s.office!=='assemblyMember'&&s.office!=='localMember'){card.choices[1].text='정책 제안과 현장 활동으로 평가해 달라';}
 return card;
}
