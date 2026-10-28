// 본편과 분리한 가능한 미래. 여기의 발언을 PublicStatement에 넣지 않는다.
export type PrologueChoice={text:string;note:string;result:string};
export const prologues=[
 {id:'special-counsel',day:'대통령 선거 D–3',title:'후보님, 큰일 났습니다.',body:['오래전 후보님의 연설이 전국에 방송되고 있습니다.','오늘 아침, 캠프는 특검 수사 대상에 올랐습니다.'],statement:'특검을 거부하는 자가 범인입니다!',question:'그 원칙, 이번에도 지키시죠?',choices:[
  {text:'제가 한 말, 저부터 지키겠습니다.',note:'수사에 협조 · 캠프 일정과 자원의 부담',result:'원칙은 지켰습니다. 캠프 일정표는 지키지 못했습니다.'},
  {text:'이번 특검은 정치 특검입니다.',note:'수사의 정치성을 비판 · 과거 발언과 절차에 대한 설명 필요',result:'지지자들은 박수를 쳤습니다. 방송사는 과거 영상을 한 번 더 틀었습니다.'}
 ]},
 {id:'admissions',day:'대통령 선거 D–7',title:'그 기준, 자녀에게도 적용됩니까?',body:['후보님 자녀의 입시 서류에 특혜 의혹이 터졌습니다. 사실관계는 아직 확인 중입니다.','검증보다 먼저, 후보님의 옛 인터뷰가 돌아왔습니다.'],statement:'부모 잘 만난 것도 실력이라는 세상, 제가 끝내겠습니다.',question:'후보님 자녀도 같은 기준입니까?',choices:[
  {text:'제 자녀도 예외 없습니다. 검증 자료를 내겠습니다.',note:'자료 검증에 협조 · 가족 관계와 사생활 노출 부담',result:'검증 자료를 준비했습니다. 가족 단체방에서는 답장이 오지 않았습니다.'},
  {text:'부모가 정치인이라고, 아이의 노력까지 부정하지 마십시오.',note:'가족 보호·근거 요구 · 별도의 검증과 설명 책임은 남음',result:'아이의 노력을 설명했습니다. 기자는 부모의 역할을 다시 물었습니다.'}
 ]},
 {id:'corporate-card',day:'대통령 선거 D–5',title:'그 밥값, 누구 돈입니까?',body:['후보님이 관여했던 회사의 법인카드로 가족 식사를 결제했다는 의혹이 터졌습니다. 영수증이 공개됐습니다.','캠프는 업무상 식사였다고 합니다. 방송사는 이걸 찾았고요.'],statement:'회사 돈으로 가족 밥 사 먹는 게 실수입니까?',question:'후보님은 실수입니까?',choices:[
  {text:'내역을 공개하고, 개인적으로 쓴 돈이면 돌려놓겠습니다.',note:'식사 목적·참석자·결제 경위 검증 · 반환해도 과거 사용 책임은 별도',result:'장부를 열었습니다. 가족 단체방은 닫혔습니다.'},
  {text:'업무상 식사였습니다. 악의적인 짜깁기입니다!',note:'업무 관련성을 주장 · 영수증과 실제 사용 경위를 입증할 부담',result:'오늘의 해명에 어제의 호통이 자막으로 붙었습니다.'}
 ]}
] as const;
export type PrologueId=typeof prologues[number]['id'];
export type PrologueRecord={version:1;id:PrologueId;seed:number;choice:0|1|null;skipped:boolean;statement:string;answer:string|null;result:string|null};
export function selectPrologue(seed:number,previousId?:string|null){let x=seed>>>0;x=Math.imul(x^(x>>>16),0x7feb352d);x=Math.imul(x^(x>>>15),0x846ca68b);x=(x^(x>>>16))>>>0;const pool=prologues.filter(p=>p.id!==previousId);return pool[x%pool.length]}
export function recordPrologue(id:PrologueId,seed:number,choice:0|1|null):PrologueRecord{const p=prologues.find(p=>p.id===id)!;return {version:1,id,seed:seed>>>0,choice,skipped:choice===null,statement:p.statement,answer:choice===null?null:p.choices[choice].text,result:choice===null?null:p.choices[choice].result}}
export function validPrologue(value:unknown):value is PrologueRecord{const p=value as PrologueRecord;const text=(s:unknown)=>typeof s==='string'&&s.length>0&&s.length<=1200;return !!p&&p.version===1&&prologues.some(x=>x.id===p.id)&&Number.isInteger(p.seed)&&p.seed>=0&&p.seed<=4294967295&&text(p.statement)&&(p.skipped===true&&p.choice===null&&p.answer===null&&p.result===null||p.skipped===false&&(p.choice===0||p.choice===1)&&text(p.answer)&&text(p.result))}
