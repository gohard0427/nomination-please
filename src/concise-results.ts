import type {Card} from './content.ts';
const headlines:Record<string,[string,string,string,string]>={
 leader:['주민 행사까지 뛰는 신인…지도부 눈도장','주민 약속 변경…공천 눈치 보나','주민과 먼저 한 약속 지켰다','지도부 행사 불참…당내 관계 시험대'],
 betrayal:['공천 기준 공개 요구…밀실 심사에 제동','지도부 정면 충돌…지원 끊기나','간판보다 이름…독자 출마 승부수','공천 불복 논란…조직 없이 완주하나'],
 investigation:['강한 검증 요구…특검 여론에 가세','단정적 발언…본인도 같은 기준 지킬까','절차부터 확인…성급한 단죄 경계','신중론인가, 검증 회피인가'],
 audit:['자기 캠프에도 검증…과거 원칙 지켰다','자료 공개에 캠프 부담…대응력 시험대','수사 방식에 반론…방어권 행사','옛 발언과 온도 차…자료 제출도 지켜봐야'],
 family:['가족 자료 공개…예외 없는 검증','가족 사생활까지…공개 범위 논란','외부 검증 제안…사생활 경계 설정','늦어지는 공개…의문은 남았다'],
 law:['원본으로 대응…절차에 따른 해명','법률 대응 비용…캠프 일정 부담','사실 확인에 속도…정치 활동 병행','비공식 접촉 여부…대응 경위도 검증 대상'],
 'party-offer':['정책 협약으로 새 출발','정당 지원의 조건…독립성 지킬까','지원보다 독자 노선','자원과 조직…홀로 감당할 수 있나'],
 rain:['현장 유세 마무리…이제 유권자의 시간','유세 밖 유권자…얼마나 만났나','다른 전략으로 마지막 호소','지지층 밖 확장…투표로 확인'],
 last:['마지막 유세 끝…후보의 약속은 기록으로','공약의 청구서…당선 뒤에도 남는다','전국에 마지막 메시지','말보다 이행…유권자의 판단만 남았다']
};
export function conciseNews(card:Card,index:0|1){const pair=headlines[card.id];if(pair)return ['우호 보도 '+pair[index*2],'비판 보도 '+pair[index*2+1]];
 const notes='costNotes' in card?(card as Card&{costNotes:string[]}).costNotes:[];const risk=notes[index]?.split(/[·]/).at(-1)?.trim();const action=card.choices[index].text.replace(/[“”]/g,'').replace(/[.!?]$/,'');
 return ['우호 보도 '+action,'비판 보도 '+(risk?`${card.title}…${risk}`:`${card.title}…실행 비용과 이행 여부는 남은 과제`)];}
export function plainTerms(card:Card){const glossary:[string,string][]=[['전작권','전쟁 때 군을 지휘·통제하는 권한'],['재이용','쓴 자원을 정화해 다시 쓰는 것'],['유동성','급할 때 쓸 수 있는 돈'],['이해충돌','공적 판단과 개인·가족의 이익이 겹치는 상황'],['억지력','상대가 공격을 포기하게 만드는 힘'],['교부금','지역 등에 나눠주는 공적 재원'],['탄소','기후변화와 관련된 온실가스 배출'],['기소','검찰이 법원에 재판을 청구하는 절차'],['공천','정당이 선거에 나갈 후보를 정하는 일']];return glossary.filter(([term])=>[card.title,card.body,...card.choices.map(c=>c.text)].some(x=>x.includes(term))).slice(0,2);}
