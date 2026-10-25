import type {State} from './engine.ts';
export type EpilogueDefinition={id:string;title:string;role:string;story:string;kind:'job'|'nickname'|'common';job?:number;nickname?:string;scene:string};
export type Epilogue={version:1;id:string;job:number;year:number;age:number;seed:number;nickname:string|null;sourceIds:string[];text:string;artKey:string;legalResolution?:'custody'|'noncustodial'|'cleared'};
const career=[
 [['activist-author','원칙은 초판 한정','회고록 작가','출판사는 분량을 줄이라고 했습니다. 원칙은 지켰습니다. 초판도 남았습니다.','author'],['activist-coop','조합원 총회는 계속된다','협동조합 운영자','표 대신 조합비를 모읍니다. 메뉴 하나 정하는 데 회의를 세 번 했습니다.','coop'],['activist-teacher','질문이 나를 닮았습니다','시민교육 강사','젊은 수강생이 예전의 당신 같은 질문을 합니다. 이번에는 직접 답할 차례입니다.','teacher']],
 [['local-desk','민원은 은퇴하지 않습니다','동네 상담소 운영자','현직이 아니라고 설명했습니다. 주민은 알겠다고 하고 민원부터 말했습니다.','desk'],['local-festival','이번에는 박수 받을 사람을 고릅니다','지역축제 기획자','무대는 당신이 만들었습니다. 인사말은 짧게 해달라는 부탁도 당신에게 왔습니다.','festival'],['local-museum','기록을 기증했습니다','생활정치 기록 기증자','낡은 명함과 활동 기록을 작은 전시관에 맡겼습니다. 재생 버튼은 관람객 손에 있습니다.','museum']],
 [['business-board','회의는 출근이 아닙니다','비상임 이사','출근은 줄었습니다. 읽어야 할 보고서는 줄지 않았습니다. 이번에는 숫자가 답변을 요구합니다.','board'],['business-startup','이번 공약은 사업계획서입니다','재창업자','작은 사무실에 새 간판을 달았습니다. 투자자는 사업계획서보다 당신 이름 검색부터 했습니다.','startup'],['business-mentor','꿈은 크게, 숫자는 정확히','창업 멘토','젊은 창업가의 장밋빛 전망을 보다가 예전 공약집을 떠올렸습니다. 이번에는 계산기를 먼저 꺼냈습니다.','mentor']],
 [['legal-practice','다시 기일을 셉니다','법률 업무 복귀','당원 대신 의뢰인을 만납니다. 일정표의 선거일은 재판 기일로 바뀌었습니다.','practice'],['legal-broadcast','사안에 따라 다릅니다','법률 해설자','제작진은 짧게 답해달라고 합니다. 당신은 짧게 말하기 위한 조건부터 설명합니다.','legal-tv'],['legal-novel','범인은 다음 장에','추리소설 작가','독자는 결말을 요구합니다. 이번에는 끝까지 말을 아끼는 것이 장점이 됐습니다.','novel']],
 [['press-commentary','제가 해봐서 압니다','정치 평론가','자신의 낙선을 분석하다가 상대 패널의 질문 시간이 끝났습니다. 진행자가 다음에는 조금만 줄여달라고 합니다.','commentary'],['press-newsletter','끝까지 읽어주십시오','독립 뉴스레터 발행인','방송에서 못 했던 설명을 모두 썼습니다. 구독 취소 사유는 너무 길다였습니다.','newsletter'],['press-localpaper','이번에는 동네가 1면입니다','지역신문 편집자','중앙 정치보다 동네 버스와 학교 소식이 더 많이 읽힙니다. 이번에는 민심을 조금 빨리 알았습니다.','paper']],
 [['official-lecture','붙임은 별도입니다','행정 실무 강사','질문 한 줄에 붙임 열일곱 개를 준비했습니다. 강의 시간보다 자료 다운로드가 오래 걸렸습니다.','lecture'],['official-adviser','결재 대신 검토 의견','정책 연구 자문','예산 검토를 마쳤습니다. 연구소에서는 사무실 월세부터 줄일 방법을 물었습니다.','adviser'],['official-class','신청서부터 줄입시다','생활행정 강사','주민의 서류를 줄이기로 했습니다. 수강 신청 양식부터 다시 만들었습니다.','forms']],
 [['star-mc','낙선 소감 전문','예능 진행자','낙선 인사가 대표 개인기가 됐습니다. 이번에는 떨어진 이야기를 할 때 박수가 나옵니다.','mc'],['star-shopping','약속보다 반품이 빠릅니다','쇼핑 방송 진행자','제품 설명은 자신 있습니다. 환불 규정은 공약집보다 꼼꼼히 읽었습니다.','shopping'],['star-radio','오늘은 제가 듣겠습니다','라디오 진행자','청취자가 끝까지 말하도록 기다렸습니다. 제작진이 가장 놀랐습니다.','radio']],
 [['military-hiking','정상은 정복했습니다','등산회 회장','산 정상에는 먼저 올랐습니다. 다음 총무 선거에서는 다른 회원에게 졌습니다.','hiking'],['military-safety','이제는 대피부터','안전교육 강사','구호보다 대피 동선을 먼저 확인합니다. 이번에는 뒤에 남은 사람까지 세고 출발합니다.','safety'],['military-camp','철수 시간은 엄수','캠핑장 관리인','체크아웃을 철수라고 부릅니다. 손님은 철수를 하루만 미뤄달라고 합니다.','camp']]
];
const nicknames=[
 ['bird','철새','이번에는 진짜 철새를 봅니다','습지 탐조 해설사','이동에는 이유가 있어야 한다고 설명합니다. 손님이 고개를 끄덕였습니다. 새를 보고 있었습니다.','birds'],
 ['loyal','충성맨','회고록 구술 비서','회고록 정리 담당','직함은 끝났습니다. 예, 대표님이라는 대답은 남았습니다. 녹음기는 이번에도 켜져 있습니다.','memoir'],
 ['fan','내편무죄','팬카페 총무','팬 커뮤니티 운영자','좋아하는 연예인의 해명 공지를 밤새 정리했습니다. 반론 댓글에도 같은 기준을 적용할지 고민합니다.','fan'],
 ['correction','말바꾸기왕','정정 전문 칼럼니스트','칼럼니스트','이번 호의 최종 입장은 다음 호에 실립니다. 편집자는 정정란부터 넓혔습니다.','correction'],
 ['merger','단일화꾼','동호회 통합 총무','동호회 총무','두 동호회를 합쳤습니다. 회장은 다른 분입니다. 당신은 회비 납부일을 공지합니다.','clubs'],
 ['ledger','공개광','오픈 장부 카페','카페 운영자','원두값과 자기 월급까지 공개합니다. 손님은 영수증 대신 장부를 읽다가 커피가 식었습니다.','cafe'],
 ['bookshop','원칙독종','할인 없는 서점','서점 운영자','친구도 정가입니다. 첫날 손님은 적었지만 그 기준을 믿는 단골은 오래 찾아옵니다.','bookshop'],
 ['phoenix','불사조','다시 여는 가게','새 가게 운영자','빈 점포에 새 간판을 달았습니다. 문을 한 번 더 여는 일을 두려워하지 않습니다.','shop'],
 ['blackmoney','검은돈','끝나지 않은 장부','은퇴 후 법적 결론','은퇴로 닫힌 것은 캠프 문이었습니다. 실제 수수 기록과 남겨진 증거에 대한 절차는 계속됐습니다.','court'],
 ['copywriter','공약공장','곧 출시 전문','광고 카피라이터','광고 문구는 먼저 나왔습니다. 상품 담당자가 출시 날짜를 물었습니다. 당신은 일정표를 펼칩니다.','copywriter'],
 ['fishing','해명잠수','조용한 낚시터','낚시터 관리인','방송 섭외 전화는 무음입니다. 손님은 입질이 왔을 때만 말을 건넵니다. 이번에는 찌를 놓치지 않습니다.','fishing']
];
const common=[
 ['video','의원님 말고, 오늘은 게스트입니다','비디오스타 출연','진행자가 낙선 이야기를 꺼냈습니다. 이번에는 웃음으로 받아쳤습니다. 지지율 대신 다음 방송 출연 제의를 받았습니다.','video'],
 ['farmer','공약은 심었습니다','농부','작은 밭에서 농사를 시작했습니다. 공약은 심었습니다. 수확은 날씨가 합니다.','farm'],
 ['convenience','24시간 민심을 듣습니다','편의점 사장','손님은 긴 설명보다 빠른 계산을 원합니다. 오늘도 민심은 들어옵니다. 대부분 봉투가 필요한지부터 답합니다.','store'],
 ['pastry','공약보다 속이 꽉 찼습니다','붕어빵 사장','원가표 앞에서 가격 인상 이유를 설명합니다. 손님은 설명보다 한 마리 더 달라고 합니다.','pastry'],
 ['apartment','국회보다 엘리베이터 공사가 어렵습니다','입주자대표 회장','이사 간 아파트에서 자격을 갖춰 입주자대표로 선출됐습니다. 회의는 길고 견적은 다릅니다. 주민들은 언제 고쳐지는지 묻습니다.','apartment'],
 ['youtube','낙선은 했습니다. 구독은 받습니다','강성 유튜버','정치를 그만둔 뒤 정치 이야기를 더 자주 합니다. 말의 수위와 조회수가 함께 오릅니다. 과거 발언도 댓글에 따라옵니다.','youtube'],
 ['travel','이번에는 표를 부탁하지 않았습니다','여행 기록가','전국을 다시 돕니다. 이름과 장소를 적지만 지지 선언을 부탁하지 않습니다. 수첩에 다른 이야기가 쌓입니다.','travel'],
 ['survival','탈락 이유를 방송합니다','서바이벌 예능 출연','탈락 인터뷰를 길게 했습니다. 방송에는 가장 짧고 솔직했던 한마디가 나갔습니다.','survival']
];
export const epilogueDefinitions:EpilogueDefinition[]=[...career.flatMap((rows,job)=>rows.map(([id,title,role,story,scene])=>({id,title,role,story,scene,kind:'job' as const,job}))),...nicknames.map(([id,nickname,title,role,story,scene])=>({id,title,role,story,scene,kind:'nickname' as const,nickname})),...common.map(([id,title,role,story,scene])=>({id,title,role,story,scene,kind:'common' as const}))];
const hash=(seed:number)=>{let n=seed>>>0;n=Math.imul(n^(n>>>16),0x7feb352d);n=Math.imul(n^(n>>>15),0x846ca68b);return (n^(n>>>16))>>>0};
function fundingEvidence(s:State){return s.interruptions.filter(i=>i.cardId==='funds-crisis'&&i.choiceIndex===1);}
function custody(s:State):Epilogue['legalResolution']|undefined{
 const accepted=fundingEvidence(s);const exposed=s.interruptions.filter(i=>i.cardId==='funds-exposure');const fundingLegal=s.legal.truth.includes('미신고');if(fundingLegal&&/무죄|혐의없음|증거불충분/.test(s.legal.conclusion))return 'cleared';if(fundingLegal&&s.legal.status==='판결 확정')return s.legal.conclusion.includes('실형')?'custody':'noncustodial';if(!accepted.length||!exposed.length)return undefined;
 // 실제 수수 원본과 사용 기록을 대조한다. 평판·직업·지지율은 판결에 관여하지 않는다.
 return exposed.every(i=>i.choiceIndex===0)&&s.finance.illicit===0?'noncustodial':'custody';
}
export function eligibleEpilogues(s:State){const names=s.flags.filter(f=>f.startsWith('별명:')).map(f=>f.split(':')[1]);const verdict=custody(s);if(verdict==='custody')return epilogueDefinitions.filter(d=>d.id==='blackmoney');return epilogueDefinitions.filter(d=>{
 if(d.kind==='job'&&d.job!==s.job)return false;if(d.kind==='nickname'&&!names.includes(d.nickname!))return false;if(d.id==='blackmoney'&&!verdict)return false;if(d.id==='legal-practice'&&/자격.*(정지|상실)|업무.*금지/.test(s.legal.conclusion))return false;return true;});}
export function ensureEpilogue(s:State):State{if(s.stage!=='ending'||!s.completed||s.office==='president'||s.title==='대통령'||s.epilogue)return s;const pool=eligibleEpilogues(s);const seed=hash(s.initialSeed^s.seed^Math.imul(s.turn+1,2654435761));const weights=pool.map(d=>d.kind==='job'?50/pool.filter(x=>x.kind==='job').length:d.kind==='nickname'?30/pool.filter(x=>x.kind==='nickname').length:20/pool.filter(x=>x.kind==='common').length);let pick=(seed/4294967296)*weights.reduce((a,b)=>a+b,0);const d=pool.find((_,i)=>(pick-=weights[i])<0)??pool[0];const nick=s.flags.filter(f=>f.startsWith('별명:')).at(-1)?.split(':')[1]??null;const legalResolution=d.id==='blackmoney'?custody(s):undefined;const years=legalResolution?3:1+(seed%3);let text=d.story;
 if(d.id==='blackmoney')text+=legalResolution==='custody'?' 은퇴 후 재판에서 실제 수수·사용 자료가 증거로 인정됐고 실형이 확정됐습니다. 이제 기록을 쓰는 책상은 교정시설 안에 있습니다.':legalResolution==='noncustodial'?' 수수 사실에 대한 책임은 남았습니다. 자료 제출과 반환 경위가 함께 심리됐고, 수감 없는 판결이 확정됐습니다.':' 실제 법적 결론에 따라 혐의가 입증되지 않았습니다. 정치적 별명과 법적 판단은 같은 것이 아니었습니다.';
 if(d.id==='local-museum'&&s.statements.length)text+=` 전시장에서는 당신이 남긴 말 “${s.statements[0].text}”이 재생됩니다.`;
 if(d.id==='video'&&s.statements.length)text+=` 진행자는 실제 발언 “${s.statements[0].text}”을 화면에 띄웠습니다.`;
 if(nick&&d.kind!=='nickname')text+=` 한때 ${nick}라고 불렸던 당신을 알아보는 사람이 아직 있습니다.`;
 const sourceIds=[...new Set([...s.flags.filter(f=>f.startsWith('별명:')).map(f=>f.split(':')[2]),...fundingEvidence(s).map(i=>i.id),...s.interruptions.filter(i=>i.cardId==='funds-exposure').map(i=>i.id),...(s.statements[0]?[s.statements[0].id]:[])])];s.epilogue={version:1,id:d.id,job:s.job,year:s.year+years,age:s.age+years,seed,nickname:nick,sourceIds,text,artKey:d.scene+(legalResolution?'-'+legalResolution:''),...(legalResolution?{legalResolution}:{})};return s;}
export function validEpilogue(e:any,s:State){if(e===undefined)return true;const d=epilogueDefinitions.find(d=>d.id===e?.id);return !!d&&s.stage==='ending'&&s.completed&&e.version===1&&e.job===s.job&&(d.kind!=='job'||d.job===s.job)&&Number.isInteger(e.year)&&e.year>=s.year&&e.year<=s.year+5&&Number.isInteger(e.age)&&e.age===s.age+e.year-s.year&&Number.isInteger(e.seed)&&e.seed>=0&&e.seed<=4294967295&&(e.nickname===null||typeof e.nickname==='string'&&e.nickname.length<20)&&Array.isArray(e.sourceIds)&&e.sourceIds.length<=100&&e.sourceIds.every((x:unknown)=>typeof x==='string'&&x.length<150)&&typeof e.text==='string'&&e.text.length<5000&&(!e.nickname||s.flags.some(f=>f.startsWith('별명:'+e.nickname+':')))&&(d.kind!=='nickname'||s.flags.some(f=>f.startsWith('별명:'+d.nickname+':'))||d.id==='blackmoney'&&fundingEvidence(s).length>0)&&e.artKey===d.scene+(e.legalResolution?'-'+e.legalResolution:'')&&(d.id==='blackmoney'?['custody','noncustodial','cleared'].includes(e.legalResolution):e.legalResolution===undefined);}
