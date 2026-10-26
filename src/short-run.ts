import type {State} from './engine.ts';
import type {Card} from './content.ts';
export const SHORT_FLAG='짧은 회차: v1';
export const shortRun=(s:Pick<State,'flags'>)=>s.flags.includes(SHORT_FLAG);
export const shortRoute=[
 '?origin','?prePolitics','?prePolitics','?prePolitics','?prePolitics','party-offer','?prePolitics','?prePolitics','?prePolitics','?prePolitics','?prePolitics','democracy',
 'leader','investigation','housing','?local','?local','betrayal','appeal','family-clue','audit','family','?local','rain',
 'return','party-switch','law','national','?central','responsibility','?central','freepress','?central','recruit','ally','?central',
 'president','primary','?presidential','?presidential','coalition','tv','debate-economy','debate-housing','debate-society','debate-politics','debate-security','last'];
export const shortRetry={local:['retry-local','?local','appeal','?local','?local','rain'],central:['retry-central','?central','national','?central','?central','responsibility'],presidential:['retry-presidential','?presidential','primary','debate-economy','debate-housing','debate-society','debate-politics','debate-security','last']};
/** 대선 재기는 후보 등록+5문답을 보존하므로9선택. 지방·국회는6선택. */
export function shortCard(card:Card,s:State){if(!shortRun(s))return card;
 // 일반 질문의 영향은 조금 강화하되 스캔들과 관문을 일괄 증폭하지 않는다.
 const c=structuredClone(card);if(c.importance<3&&!c.id.startsWith('world-'))for(const choice of c.choices)for(const key of ['party','org','trust','fame'] as const){const x=choice.effect[key];if(x)choice.effect[key]=Math.sign(x)*Math.min(Math.abs(x)+1,12);}
 const retryStart=s.flags.filter(f=>f.startsWith('재도전:')).map(f=>Number(f.split(':')[2])).find(at=>s.cursor>=at&&s.cursor<at+(s.flags.includes('토론 재도전:'+at)?9:6));
 if(retryStart!==undefined){
  if(c.id==='appeal'){c.title='재도전 · 다시 심사대에 섰습니다';c.body=s.partyId?'이전 낙선 뒤 달라진 현장 활동과 당원 평가를 제출할 차례입니다. 새 경쟁자는 조직 동원력을 내세웁니다. 어떤 강점을 앞세우겠습니까?':'무소속 재출마를 준비하며 주민 추천과 독자 조직을 다시 확인합니다. 이전 선거와 달라진 점을 어떻게 보이겠습니까?';c.choices=[{text:'지난 낙선의 원인과 달라진 활동을 공개하겠습니다.',effect:{trust:6,party:2},result:'낙선 원인을 먼저 냈습니다. 심사위원은 이번에는 변명보다 자료가 많다고 했습니다.'},{text:'새로 모은 주민 조직과 현장 평가를 제출하겠습니다.',effect:{org:7,party:3,funds:-2},result:'다시 모인 사람들을 보여줬습니다. 인원수보다 실제 참여도 심사받습니다.'}];}
  if(c.id==='national'){c.title='재도전 · 의사당 밖의 정책 검증';c.body='지난 국회 도전에서 떨어진 뒤 정책 모임이 공개 검증 자리를 마련했습니다. 지난 공약의 문제와 새 대안을 어떻게 설명하겠습니까?';c.choices=[{text:'지난 공약의 비용부터 다시 계산하겠습니다.',effect:{trust:6,funds:-2},result:'예전 공약에 수정표를 붙였습니다. 접은 약속을 지지했던 사람에게도 보냈습니다.'},{text:'현장 사례와 새 실행 계획으로 답하겠습니다.',effect:{org:6,fame:3,funds:-3},result:'같은 구호 대신 다른 실행 계획을 냈습니다. 이전 유세 자료는 참고자료가 됐습니다.'}];}
  if(c.id==='primary'){c.title=s.partyId?'재도전 · 이번 경선의 새 기준':'재도전 · 전국 추천을 다시 모읍니다';c.body=s.partyId?'지난 대선에서 패한 뒤 다시 후보 심사를 받습니다. 경쟁자는 세대교체를 내세웁니다. 무엇을 검증받겠습니까?':'지난 후보 등록의 추천은 이번 선거의 추천이 아닙니다. 다시 전국의 동의를 모으며 어떤 변화를 보이겠습니까?';c.choices=[{text:'지난 패배와 수정한 공약을 공개하겠습니다.',effect:{trust:7,party:-2},result:'패배 원인을 말했습니다. 이번에는 원인 다음의 수정안도 제출했습니다.'},{text:'새 지역 연합과 실행 조직을 보여드리겠습니다.',effect:{org:7,party:3,funds:-3},result:'새 협력자와 다시 출발합니다. 옛 협약이 자동 갱신된 것은 아닙니다.'}];}
 }
 const version=s.initialSeed%3;
 if(c.id==='leader'&&version){c.title=version===1?'대표님 주말은 제 일정입니까?':'박수 치러 와달랍니다';c.body=(s.partyId?'당대표':'지역 연합 대표')+'가 지원을 약속하며 '+(version===1?'주말 유세 사회':'출판 행사 객석 동원')+'를 부탁합니다. 같은 날 주민 간담회가 있습니다. 어디에 가겠습니까?';c.choices[0].effect.party=(c.choices[0].effect.party??0)+2;c.choices[0].result='대표는 웃었습니다. 주민 모임에서는 빈 의자를 찍어 보냈습니다.';}
 if(c.id==='audit'&&version){c.title=version===1?'기자의 재생 버튼':'우리 캠프도 수사 대상입니다';const past=s.statements.find(x=>x.topic==='특검');c.body=(past?'당신이 실제로 했던 말 “'+past.text+'”. ':'')+'이번에는 캠프의 지출 의혹을 두고 특검 요구가 나왔습니다. 위법 여부는 아직 확인되지 않았습니다. 예전의 기준을 어떻게 적용하겠습니까?';}
 if(c.id==='family-clue'&&version&&s.job!==2){c.title=version===1?'누나가 계약 전에 전화했습니다':'가족 단체방의 부동산 소식';c.body='누나가 지역 개발 예정지 근처의 상속 토지를 정리하려 합니다. 상속 자체는 개발 발표 전이지만 거래 시점은 오해를 살 수 있습니다. 어떤 대응을 권하겠습니까?';}
 return c;
}
export type ExposureRun={seed:number;ids:string[]};
export function exposureSnapshot(runs:ExposureRun[],seed:number){return [...new Set(runs.filter(r=>r.seed!==seed).slice(-3).flatMap(r=>r.ids))].slice(0,600);}
export function validExposure(x:unknown):x is string[]{return Array.isArray(x)&&x.length<=600&&x.every(id=>typeof id==='string'&&/^[a-zA-Z0-9?:-]{1,100}$/.test(id));}
export function chapterProgress(s:State){if(!shortRun(s))return `${s.turn} / ${s.route.length} 선택`;const start=s.flags.filter(f=>f.startsWith('재도전:')).map(f=>Number(f.split(':')[2])).find(at=>s.cursor>=at&&s.cursor<at+(s.flags.includes('토론 재도전:'+at)?9:6));if(start!==undefined)return `재도전 ${s.cursor-start} / ${s.flags.includes('토론 재도전:'+start)?9:6}`;const retries=s.flags.filter(f=>f.startsWith('재도전:')).map(f=>Number(f.split(':')[2])).filter(at=>at<s.cursor).reduce((n,at)=>n+(s.flags.includes('토론 재도전:'+at)?9:6),0);const base=Math.min(48,s.cursor-retries);return `${base%12===0&&s.stage!=='play'&&base>0?12:base%12} / 12 · 전체 ${s.turn}선택`;}
