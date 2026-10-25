import type {State} from './engine.ts';
import type {Card} from './content.ts';
import {v,type Chapter,type Option} from './event-factory.ts';
export type RetryPhase='local'|'central'|'presidential';
export const RETRY_QUESTIONS='재도전 질문: v2:';
export function parseRetryQuestion(id:string){const m=/^retry-followup:(local|central|presidential):(\d+):([0-6])$/.exec(id);return m?{phase:m[1] as RetryPhase,start:Number(m[2]),slot:Number(m[3])}:null}
// 풀이 소진됐을 때는 새 선거의 실제 패배·진행 상황을 다루는 운영 사건을 사용한다.
// 번호만 붙인 복제 카드를 카탈로그 콘텐츠 수에 더하지 않는다.
const followups:[string,string,string,Option,Option][]=[
 ['돌아오지 않은 자원봉사자','보좌관 · 고단비','지난 선거를 도왔던 자원봉사자에게 다시 연락하려 합니다. 재참여 의사를 먼저 물을지, 새 사람을 공개 모집할지 정해야 합니다.',['이전 참여자의 의사를 개별 확인한다',{org:7,trust:3,funds:-2},'단톡방에 초대하기 전에 물었습니다. 읽음보다 답장이 늦어도 기다립니다.','기존 인연 회복 · 면담 비용'],['역할과 시간을 공개해 새로 모집한다',{org:5,fame:4,funds:-3},'열정 무제한 대신 근무 시간을 적었습니다. 지원서가 더 구체적이 됐습니다.','새 접점 · 모집 비용']],
 ['패배한 공약의 다음 일정','지역 조직 · 봉봉수','낙선 뒤에도 공약을 기다리는 주민이 있습니다. 직접 할 수 있는 활동을 시작할지, 권한 있는 기관에 공개 답변을 요청할지 정하세요.',['작게 실행할 수 있는 활동부터 시작한다',{org:7,funds:-3},'당선증은 없습니다. 진행표는 붙였습니다.','작은 실천 · 운영 비용'],['기관의 답변과 처리 일정을 공개 요청한다',{trust:6,fame:2},'공약집에 담당 기관 전화번호가 추가됐습니다. 직접 결정한 척하지는 않았습니다.','공개 점검 · 처리 속도는 기관과 협의']],
 ['구겨진 후원 안내문','보좌관 · 고단비','후원자에게 다시 도움을 요청하려 합니다. 지난 지출부터 설명할지, 소규모 정기 후원을 모집할지 선택하세요.',['지난 사용 내역을 설명하는 자리를 연다',{funds:9,trust:4},'쓴 돈부터 설명했습니다. 이번 안내문은 구기기 전에 읽어줬습니다.','투명성 · 설명 일정 필요'],['활동 규모를 줄이고 정기 소액 후원을 모집한다',{funds:13,org:-2},'큰 행사 대신 작은 약속을 오래 받기로 했습니다.','합법 자원 회복 · 현장 활동 축소']],
 ['낙선자의 설명회','기자 · 문장수','당선자 발표회에는 기자가 몰렸지만 당신의 설명회에는 질문 두 개가 왔습니다. 공개 방송을 할지, 깊이 있는 문답 자료를 낼지 정하세요.',['열린 방송에서 어려운 질문도 받는다',{fame:6,trust:2,funds:-3},'접속자는 적었습니다. 질문은 적지 않았습니다.','새 노출 · 방송 준비 비용'],['근거와 답변을 정리해 공개한다',{trust:6,org:2},'조회수는 조용합니다. 다음 질문에는 링크로 답할 수 있습니다.','설명 신뢰 · 확산 속도는 느림']],
 ['다시 잡는 캠프 임대 계약','보좌관 · 고단비','다음 선거까지 같은 사무실을 유지할 비용이 부담됩니다. 상담 공간을 남길지, 예약 면담으로 운영을 줄일지 정하세요.',['작은 상담 공간을 유지한다',{org:8,funds:-4},'평수는 줄었습니다. 민원 전화는 평수를 묻지 않았습니다.','현장 접점 · 고정 지출'],['공간을 정리하고 예약 면담으로 바꾼다',{funds:10,org:-3,trust:2},'주소는 짧아졌습니다. 약속 시간을 지킬 책임은 길어졌습니다.','운영 절약 · 방문 접근성 감소']],
 ['처음 만나는 선거 준비 모임','지역 조직 · 봉봉수','지난 캠프에 오지 않았던 주민들이 별도 간담회를 요청했습니다. 기존 지지자 일정과 겹칩니다.',['새 간담회에 가고 기존 모임에 양해를 구한다',{fame:5,org:3,funds:-2},'반가운 얼굴보다 처음 보는 표정이 많았습니다. 캠프에도 새 질문이 생겼습니다.','접점 확대 · 기존 일정 조정'],['기존 약속을 지키고 다음 공개 일정을 잡는다',{org:6,trust:3},'오늘 약속은 지켰습니다. 다음 약속도 달력에 남겼습니다.','관계 유지 · 새 접점 확보는 늦어짐']],
 ['응원 문자의 사용 범위','기자 · 문장수','응원 문자를 홍보물에 싣자는 제안입니다. 개인별 동의를 받을지, 익명 의견으로 정리할지 선택하세요.',['공개 범위를 설명하고 동의를 받는다',{trust:6,org:3,funds:-2},'추천사는 짧아졌습니다. 추천한 사람이 놀랄 일도 줄었습니다.','구체적 증언 · 동의 확인 비용'],['개인을 드러내지 않고 요구를 정리한다',{trust:4,fame:3},'이름 대신 요구가 커졌습니다. 지지 선언으로 포장하지는 않았습니다.','사생활 보호 · 인물 홍보 효과 축소']],
 ['새 일정표의 빈칸','보좌관 · 고단비','다음 선거 준비 일정에 하루가 비었습니다. 캠프 회계·업무를 정비할지, 새로운 정책 공부에 쓸지 정하세요.',['운영과 회계를 먼저 정비한다',{funds:7,trust:3},'비어 있던 하루에 영수증이 들어왔습니다. 빈 잔고보다는 낫습니다.','운영 절약 · 외부 활동 기회 감소'],['전문가와 공개 정책 공부를 한다',{trust:6,fame:3,funds:-2},'정답 대신 질문 목록이 늘었습니다. 최소한 다음 토론의 남 탓은 줄었습니다.','정책 준비 · 자원 지출']],
 ['패배 뒤 남은 연락처','지역 조직 · 봉봉수','지난 선거의 연락처를 다음 캠프에서도 쓰자는 제안입니다. 이용 동의를 다시 확인할지, 새 공개 신청을 받을지 정하세요.',['기존 참여자에게 이용 범위를 다시 묻는다',{org:6,trust:4,funds:-2},'번호가 있다는 것과 연락해도 된다는 것은 달랐습니다.','인연 유지 · 확인 비용'],['새 신청 창구를 열고 기존 명단은 분리한다',{fame:4,trust:5,funds:-3},'빈 명단으로 시작했습니다. 이름을 채울 이유부터 설명합니다.','새 기반 · 모집 비용']]
];
export function retryFollowup(s:State,id:string):Card|null{const p=parseRetryQuestion(id);if(!p)return null;if(p.slot===2){const name=p.phase==='presidential'?'대선 후보':p.phase==='central'?'국회의원 후보':'지방선거 후보';const body=s.partyId?'이전 선거의 공천이 다음 선거까지 자동으로 이어지지는 않습니다. 새로운 후보 심사에 어떤 근거를 먼저 내세울까요?':'정당 공천 대신 이번 선거의 독자 후보 등록과 추천 조직을 다시 준비합니다. 이전 선거에 출마했다는 사실만으로 등록이 끝나지는 않습니다.';return v(id,p.phase,`${s.year}년 ${name}, 다시 출발선`, '보좌관 · 고단비',body,s.partyId?['지역 활동과 공약 점검 기록을 공개한다',{org:4,trust:5,funds:-2},'예전 공천장이 아닌 새 활동 기록을 냈습니다. 심사 결과도 확인합니다.','지역 경쟁력 · 자료 준비 비용']:['추천 참여자의 의사를 확인하고 조직을 정비한다',{org:7,trust:3,funds:-2},'지난 추천을 복사하지 않았습니다. 이번에도 함께할 사람에게 물었습니다.','독자 기반 · 확인 비용'],s.partyId?['당원 면담을 넓히고 공개 후보 평가를 요청한다',{party:8,org:2,funds:-3},'명함 대신 면담 기록이 쌓였습니다. 최종 심사까지 당연한 자리는 없습니다.','당원 기반 · 일정과 비용']:['등록 자료와 일정부터 공개 점검한다',{trust:7,fame:3,funds:-3},'출마 경험과 등록 완료를 구분했습니다. 이번 일정표도 새로 만들었습니다.','절차 신뢰 · 검토 비용'],'reform',{kind:'conflict'});}const previous=s.history.at(-1);const index=(Math.floor(p.start/8)+p.slot)%followups.length;const [title,speaker,body,a,b]=followups[index];const name=p.phase==='local'?'지방선거':p.phase==='central'?'국회 도전':'대선';const last=[...s.elections].reverse().find(e=>!e.won);const context=last?`지난 ${last.year}년 ${last.name}에서 ${last.votes[0].toFixed(1)}%를 얻었습니다. `:'';const link=previous?`직전 활동 “${previous.title}” 뒤의 캠프 운영을 점검합니다. `:'';return v(id,p.phase as Chapter,`${s.year}년 ${name} 재정비 · ${title}`,speaker,context+link+body,a,b,'region',{kind:'conflict'})}
export function retryFinale(card:Card,s:State):Card{
 if(!['rain','responsibility','last'].includes(card.id))return card;
 const blocks=s.flags.map(f=>/^재도전:(local|central|presidential):(\d+)$/.exec(f));const b=blocks.find(m=>m&&Number(m[2])+(s.flags.includes('토론 재도전:'+m[2])?17:7)===s.cursor);
 if(!b||!s.flags.includes(RETRY_QUESTIONS+b[2]))return card;
 const phase=b[1] as RetryPhase,previous=[...s.elections].reverse().find(e=>!e.won),round=blocks.filter(m=>m?.[1]===phase&&Number(m[2])<=s.cursor).length;
 const context=`지난 선거의 득표는 ${previous?.votes[0].toFixed(1)??'기록 확인 중'}%였습니다. 이번에는 그 뒤에 쌓은 활동까지 평가받습니다.`;
 const variants:[string,string,Option,Option][]=[
 ['마지막 접점을 어디로 넓힐까요?','마지막 유세 자원을 어디에 쓸까요?',
 ['지금까지 만난 사람들에게 참여를 요청한다',{org:7,trust:2,funds:-2},'명단의 숫자 대신 실제로 올 사람을 확인했습니다. 이제 투표함이 답할 차례입니다.','현장 참여 · 남은 자원 지출'],
 [phase==='presidential'?'전국 공개 질의응답으로 마지막 접점을 넓힌다':'아직 만나지 못한 지역에 공개 질의응답을 연다',{fame:7,trust:2,funds:-4},'마지막 질문까지 받았습니다. 마지막 대답은 유권자에게 남겼습니다.','새 유권자 접점 · 준비 비용']],
 ['약속의 비용도 말하겠습니까?','마지막 인터뷰에서 공약에 필요한 비용도 설명해 달라는 질문을 받았습니다.',
 ['부담과 실행 순서를 함께 설명한다',{trust:7,fame:2,funds:-2},'박수 사이에 계산기를 꺼낸 사람이 있었습니다. 약속의 가격표도 남겼습니다.','이행 신뢰 · 부담에 대한 추가 검증'],
 ['우선순위를 줄여 당장 가능한 약속에 집중한다',{trust:4,org:6,funds:-3},'공약집은 얇아졌습니다. 남은 페이지는 더 자주 읽기로 했습니다.','현장 설득 · 공약 축소 설명 비용']],
 ['마지막 질문의 주인은 누구입니까?','남은 공개 문답 시간을 기존 지지자와 새로운 참여자 중 누구의 질문에 먼저 쓸까요?',
 ['오래 기다린 지지자의 어려운 질문부터 받는다',{org:8,trust:3,funds:-2},'응원만 받을 줄 알았습니다. 오래 지켜본 사람이 가장 자세히 물었습니다.','기반 신뢰 · 새로운 노출 기회 축소'],
 ['처음 온 참여자의 질문을 먼저 받는다',{fame:8,trust:2,funds:-4},'이름부터 설명했습니다. 투표를 부탁하기 전에 무엇을 할 사람인지 답했습니다.','접점 확대 · 기존 지지자 일정 조정']]
 ];
 const [title,body,a,bChoice]=variants[(round-1)%variants.length];return v(card.id,phase,`${s.year}년 재선거 · ${title}`,'보좌관 · 고단비',context+' '+body+' 이 선택 뒤 같은 단계의 새 선거를 개표합니다.',a,bChoice,'region',{kind:'conflict'});
}
