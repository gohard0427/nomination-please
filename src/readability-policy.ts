import type {Card,Stats} from './content.ts';import type {State} from './engine.ts';import type {Signal,PolicyId} from './support.ts';import {partyById} from './parties.ts';
type Rule={a:Partial<Stats>;b:Partial<Stats>;signals:[Signal[],Signal[]];notes:[string,string];results?:[string,string];values?:[Record<string,number>,Record<string,number>]};
const sig=(topic:PolicyId,stance:number):Signal=>({topic,stance,strength:.6});
const rule=(a:Signal[],b:Signal[],notes:[string,string],effects:[Partial<Stats>,Partial<Stats>]=[{trust:4,org:3},{trust:3,fame:3}],results?:[string,string]):Rule=>({a:effects[0],b:effects[1],signals:[a,b],notes,results});
export const semanticRules:Record<string,Rule>={
 redtape:rule([sig('economy',.8)],[sig('economy',.25)],['중복 허가 폐지 · 감독 공백 점검','허가 유지·창구 통합 · 상담 인력 비용']),
 inheritance:rule([sig('tax',-.8)],[sig('tax',.4)],['승계 감세 · 세수·형평성 부담','세율 유지·분납 · 단기 세금 부담']),
 equal:rule([sig('society',.7),sig('labor',.5)],[sig('reform',.5)],['돌봄 경력 반영 · 평가 기준 논쟁','동일 업무 평가 · 출발선 격차는 남음']),
 housing:rule([sig('housing',.5)],[sig('housing',.4),sig('welfare',.5)],['투기 방지 원칙 · 구체적 기준 요구','세입자 이주 우선 · 개발 일정 지연']),
 'central-seat':rule([],[],['직접 직책 정정 · 행사 진행 지연','자료 일괄 정정 · 당사자 설명 책임'],[{trust:5,fame:1},{trust:4,org:2}]),
 'world-stock-down-central':rule([sig('economy',.5)],[sig('tax',-.4)],['거래 질서 안정 지원 · 재정·도덕적 해이 우려','개인 손실 보상 제한 · 투자자 반발']),
 'religion-budget':{...rule([sig('welfare',.5)],[sig('reform',.6)],['공익 기여 평가 · 특정 단체 특혜 검증','동일 지원 기준 · 정치적 은인과 마찰']),values:[{faithPolitics:.4,disclosure:.4},{faithPolitics:-.5,disclosure:.8}]},
 'fresh-prePolitics-2':rule([],[],['명함 재사용 · 수정 표시의 명확성','새 명함 인쇄 · 제작비'],[{funds:2,trust:3},{funds:-2,fame:3,trust:2}],['옛 직함을 고쳤습니다. 명함보다 수정 스티커가 먼저 떨어졌습니다.','새 명함이 왔습니다. 당선은 인쇄 옵션에 없었습니다.']),
 'fresh-prePolitics-8':rule([sig('region',.4)],[sig('region',.3),sig('economy',.25)],['등하교 단속 우선 · 상인 하역 불편','하역 구역 마련 · 조정 시간']),
 'fresh-prePolitics-20':rule([],[],['직접 재작성 · 준비 시간','AI 활용·사실 확인 · 검수 책임'],[{trust:5,org:1},{fame:3,trust:2}],['AI 초안을 접었습니다. 출마 선언보다 자기소개가 오래 걸렸습니다.','지어낸 사연을 지웠습니다. 사실 확인은 아직 사람이 했습니다.']),
 'fresh-prePolitics-29':rule([],[],['보정 제거 · 홍보팀과 마찰','밝기·색 보정만 · 경계 공개'],[{trust:4,fame:1},{fame:3,trust:2}],['주름이 돌아왔습니다. 동창들이 알아봤습니다.','어깨는 원래 크기입니다. 자신감은 보정 범위 밖입니다.']),
 'fresh-prePolitics-30':rule([],[],['장소 변경 · 취소·대관 비용','동일 참여 가능한 연결 · 장비·진행 책임'],[{funds:-4,trust:6,org:2},{funds:-2,trust:3,org:3}],['장소를 옮겼습니다. 계단 대신 취소 수수료를 넘었습니다.','같은 질문과 발언을 연결했습니다. 접속 주소도 문턱이 되지 않게 점검했습니다.']),
 'fresh-prePolitics-35':rule([],[],['캠프 이름의 전달 거절 · 홍보 기회 포기','정치 홍보 없는 지원 연결 · 조정 시간']),
 'fresh-prePolitics-58':rule([],[],['다른 행사 축소 · 수어·자막 확보','작은 질의응답 · 참여·정보 접근 보장'],[{funds:-4,trust:5,org:3},{funds:-2,trust:4,fame:-1}]),
 'fresh-central-0':rule([sig('reform',.7)],[sig('reform',.4),sig('economy',.3)],['탈락 사유 직접 설명 · 기업의 공개 부담','독립 검증·영업 비밀 보호 · 직접 확인 한계']),
 'fresh-central-15':rule([sig('education',.6)],[sig('reform',.6)],['정직한 실패 보호 · 예산 책임 검증','사용 내역 감사 · 연구 현장 행정 부담']),
 'fresh-central-21':rule([sig('tax',.5)],[sig('tax',-.3)],['소액 장기 투자 우선 · 지원 한도 논쟁','기간별 같은 기준 · 자산 격차 우려']),
 'fresh-presidential-11':{...rule([sig('reform',.7)],[sig('reform',.25)],['견제 권한 유지 · 처리 속도 부담','신속 심사·근거 공개 · 다수의 독주 비판']),values:[{order:-.6},{order:.5}]},
 'fresh-presidential-15':{...rule([],[],['지지 무대 불참 · 동원 기회 감소','공개 정책 협의 · 종교 편향 검증'],[{trust:5,org:-2},{org:5,trust:1}]),values:[{faithPolitics:-.8},{faithPolitics:.5,disclosure:.5}]},
 'fresh-job-0-4':rule([],[],['명부 불사용 · 새로운 접점 확보 비용','새 동의 모집 · 관리 책임'],[{trust:5,fame:1},{org:4,trust:3}]),
 'fresh-job-4-1':rule([],[],['채용·제보 분리 · 내부 이해충돌 관리','외부 검증까지 채용 보류 · 인력 확보 지연'],[{org:4,trust:2},{trust:6,org:-1}]),
 'fresh-job-7-6':rule([sig('labor',.6),sig('welfare',.3)],[sig('labor',.3)],['병사 지원 유지·간부 보완 · 추가 재원','복무 조건별 재배분 · 줄어든 몫의 반발']),
 'fresh-party-future-1':rule([sig('diplomacy',.8)],[sig('welfare',.6),sig('diplomacy',.15)],['국방 우선 · 생활 예산 기회 감소','생활 예산 우선 · 국방 투자 지연']),
 'fresh-party-future-2':rule([sig('reform',.65),sig('economy',.35)],[sig('economy',.55)],['담합 조사·경쟁 회복 · 업계와 마찰','확인 뒤 규제 · 대응 지연 비판']),
 'fresh-party-guardian-1':{...rule([],[],['성과와 인권 침해 병기 · 강경파 반발','피해자 공개 토론 · 당 홍보 축소']),values:[{history:.55,order:.1},{history:.9,order:-.5}]},
 'fresh-party-guardian-2':{...rule([sig('diplomacy',-.2)],[sig('diplomacy',.35)],['책임 답변을 협력 조건으로 요구 · 협상 지연','협력 우선·피해 지원 분리 · 과거사 비판']),values:[{history:.8},{history:-.3,alliance:.5}]},
 'world-rescue-central':rule([],[],['구조 지원 연결 · 조사 준비 인력 부족','독립 조사 준비 · 직접 구호 인력 축소']),
 'career-law-ai-judge':rule([sig('reform',.45)],[sig('reform',.35)],['제한적 AI 판단 시험 · 사람의 재심 보장','사람의 판결 책임 · 업무 AI 활용']),
 'ai-time-dividend':rule([sig('labor',.85)],[sig('economy',.6)],['근로시간 단축·보상 · 인력·납기 부담','신사업·교육 우선 · 휴식·보상 지연']),
 'ai-regional-jobs':rule([sig('economy',.65),sig('region',-.5)],[sig('region',.8)],['기존 거점 집중 · 지역 격차','지역 채용 거점 · 투자 분산 비용']),
 'career-law-justices':rule([sig('reform',.5)],[sig('reform',.25)],['대법관 증원 검토 · 임명·예산 검증','지원 인력·절차 우선 · 적체 해소 속도']),
 'cross-debate':{...rule([sig('diplomacy',.55)],[sig('diplomacy',-.55)],['국회 동의·제한 임무 검토 · 장병 위험','외교·민간 지원 우선 · 동맹 분담 논쟁']),values:[{alliance:.65},{alliance:-.15}]},
 'age-driving':rule([],[],['대체 교통 후 면허 반납 지원 · 운영비','실제 능력 평가·안전 지원 · 교통 대책']),
 'age-retirement':rule([sig('labor',.65)],[sig('labor',.2),sig('economy',.25)],['정년 연장·채용 보완 · 인건비 논쟁','재고용 우선 · 고용 안정성 차이']),
 'age-pension':rule([sig('welfare',.65),sig('tax',.5)],[sig('tax',-.25),sig('reform',.25)],['보험료 부담 확대 · 노후 소득 보호','지급 구조 개편 · 급여 조정 논쟁']),
 'child-cash':rule([sig('welfare',.8)],[sig('welfare',.3),sig('tax',-.25)],['모든 양육 가정 지원 · 재원 부담','어려운 가정 집중 · 지원 경계 갈등']),
 'home-tax':rule([sig('tax',.7)],[sig('tax',-.5)],['보유세 부담 확대 · 소득 부족 가구 대책','부담 완화 · 자산 격차 비판']),
 'work-platform':rule([sig('labor',.8)],[sig('labor',.2),sig('economy',.25)],['노동자 보호 확대 · 사업 부담','별도 보호 기준 · 기존 보호와의 격차']),
 'work-automation':rule([sig('labor',.75),sig('economy',.15)],[sig('economy',.65)],['재교육·협의 조건 · 도입 비용','신규 투자 우선 · 전환 노동자 보호']),
 'religion-law':{...rule([],[],['집회에도 같은 법 기준 · 우호 조직과 마찰','집회권 보장·불편 조정 · 주민 설득']),values:[{order:.4,faithPolitics:-.3},{order:-.25,faithPolitics:.45}]},
 'foreign-opcon':{...rule([sig('diplomacy',.5)],[sig('diplomacy',.4)],['작전통제권 조기 전환 · 준비 역량·비용','연합체계 유지 · 자율성·무기한 연기 논쟁']),values:[{alliance:-.8},{alliance:.8}]},
};
const signalOnly:Record<string,[Signal[],Signal[]]>={};
// 카드별 실제 정책 방향. 같은 방향의 두 수단을 억지 찬반으로 바꾸지 않는다.
const policyPairs:Record<string,[string,string]>={
 'fresh-prePolitics-5':['region:.5','region:.4'], 'fresh-prePolitics-9':['welfare:.6','welfare:.35'], 'fresh-prePolitics-10':['labor:.4','welfare:.75'], 'fresh-prePolitics-12':['region:.6','economy:.45'], 'fresh-prePolitics-13':['welfare:.7','welfare:.35'], 'fresh-prePolitics-17':['welfare:.6','welfare:.45'], 'fresh-prePolitics-18':['region:.7','region:.3'], 'fresh-prePolitics-19':['region:.65','region:.3'], 'fresh-prePolitics-24':['tax:.4 welfare:.3','tax:-.1 reform:.5'], 'fresh-prePolitics-31':['welfare:.65','welfare:.5'], 'fresh-prePolitics-32':['region:.4','economy:.35'], 'fresh-prePolitics-36':['region:.5','region:.4'], 'fresh-prePolitics-41':['labor:.6','economy:.3 labor:.2'], 'fresh-prePolitics-43':['society:.35','society:.15 economy:.3'], 'fresh-prePolitics-44':['welfare:.65','region:.4'], 'fresh-prePolitics-48':['welfare:.65','economy:.3 region:.4'], 'fresh-prePolitics-49':['region:.6','region:.4'], 'fresh-prePolitics-50':['welfare:.5','welfare:.45'], 'fresh-prePolitics-51':['welfare:.5','welfare:.3'], 'fresh-prePolitics-56':['welfare:.6','welfare:.5'], 'fresh-prePolitics-57':['region:.5','region:.4'],
 'fresh-local-0':['economy:.5 region:.3','region:.45'], 'fresh-local-1':['welfare:.6 labor:.5','welfare:.25 economy:.35'], 'fresh-local-2':['housing:.5','economy:.3'], 'fresh-local-3':['education:.55','region:.5'], 'fresh-local-4':['housing:.7','housing:.3 economy:.3'], 'fresh-local-5':['tax:.25 welfare:.3','reform:.5 tax:-.1'], 'fresh-local-6':['environment:.6','environment:.35 economy:.25'], 'fresh-local-7':['economy:-.3 region:.6','economy:.15 tax:-.25'], 'fresh-local-8':['society:.2','society:.4'], 'fresh-local-9':['reform:.4','region:.35'], 'fresh-local-10':['welfare:.6','housing:.7'], 'fresh-local-11':['region:.4','region:.3'], 'fresh-local-12':['economy:-.3','environment:.4'], 'fresh-local-13':['region:.5','region:.35'], 'fresh-local-14':['economy:-.35','economy:.45'], 'fresh-local-15':['region:.55','environment:.45'], 'fresh-local-16':['environment:.7','environment:.25'], 'fresh-local-17':['welfare:.6','welfare:.35'], 'fresh-local-18':['region:.65','region:.35'], 'fresh-local-19':['region:.65','economy:.5'], 'fresh-local-20':['region:.5','environment:.6'], 'fresh-local-21':['labor:.5','region:.45'], 'fresh-local-23':['economy:-.4','economy:.45'], 'fresh-local-24':['labor:.75','labor:.4'], 'fresh-local-25':['society:-.25','society:.3'], 'fresh-local-26':['welfare:.65','welfare:.45'], 'fresh-local-27':['welfare:.75','welfare:.3 region:.3'], 'fresh-local-29':['welfare:.4 region:.4','region:.45'],
 'fresh-central-1':['labor:.45','labor:.65'], 'fresh-central-2':['welfare:.7','welfare:.5'], 'fresh-central-3':['economy:-.5','tax:-.35'], 'fresh-central-4':['region:.65','environment:.35'], 'fresh-central-5':['society:.5','economy:.55'], 'fresh-central-6':['region:.8','region:.3 economy:.3'], 'fresh-central-7':['welfare:.75','welfare:.3'], 'fresh-central-8':['labor:.65','labor:.25 economy:.3'], 'fresh-central-9':['environment:.7','region:.5 environment:.35'], 'fresh-central-10':['education:.6','education:.8 tax:.4'], 'fresh-central-11':['economy:-.6','economy:.6'], 'fresh-central-12':['society:.6','education:.5 economy:.2'], 'fresh-central-13':['housing:.65','region:.6'], 'fresh-central-14':['reform:.7','reform:.3 economy:.25'], 'fresh-central-16':['labor:.65 migration:.4','labor:.45 migration:.15'], 'fresh-central-17':['education:.65','education:.35'], 'fresh-central-18':['reform:.5 welfare:.4','reform:.25'], 'fresh-central-19':['society:.7','society:-.4'], 'fresh-central-20':['region:.6','migration:.6'], 'fresh-central-22':['education:.4 migration:.5','education:.65'], 'fresh-central-23':['welfare:.6','environment:.6 housing:.3'], 'fresh-central-24':['society:.2','society:.55'], 'fresh-central-25':['economy:.3 welfare:.4','economy:-.4 region:.5'], 'fresh-central-26':['reform:.7','reform:.3 education:.2'], 'fresh-central-27':['welfare:.65 region:.6','reform:.35 region:.25'], 'fresh-central-28':['welfare:.5 reform:.4','reform:.65'], 'fresh-central-29':['region:.7','economy:.45'],
 'fresh-presidential-0':['tax:-.55','tax:.65 welfare:.5'], 'fresh-presidential-2':['region:.4','region:.6'], 'fresh-presidential-3':['reform:.65','reform:.3'], 'fresh-presidential-4':['welfare:.7 labor:.5','economy:.5 labor:.2'], 'fresh-presidential-5':['region:.85','region:.35'], 'fresh-presidential-6':['environment:.85','environment:-.35 economy:.4'], 'fresh-presidential-7':['labor:.65 welfare:.4','welfare:.45'], 'fresh-presidential-8':['tax:.4','welfare:.55'], 'fresh-presidential-9':['economy:-.6 welfare:.5','economy:.45 tax:-.3'], 'fresh-presidential-10':['housing:-.4 economy:.4','housing:.7'], 'fresh-presidential-12':['labor:.8','labor:.15 economy:.4'], 'fresh-presidential-13':['welfare:.4 diplomacy:.2','diplomacy:.8'], 'fresh-presidential-14':['housing:.7','housing:.4 welfare:.4'], 'fresh-presidential-16':['economy:-.3 labor:.45','economy:.65'], 'fresh-presidential-18':['welfare:.6 economy:-.25','welfare:.25 economy:.3'], 'fresh-presidential-19':['environment:.6 tax:-.2','economy:.5 tax:.2'], 'fresh-presidential-20':['economy:-.55','economy:.25 welfare:.3'], 'fresh-presidential-21':['economy:-.5 region:.5','economy:.3 region:.3'], 'fresh-presidential-22':['reform:.8','reform:.25'], 'fresh-presidential-23':['migration:.8','migration:.2 region:.3'], 'fresh-presidential-24':['education:.75','economy:.6 education:.25'], 'fresh-presidential-25':['housing:.6 environment:.45','environment:.5 region:.3'], 'fresh-presidential-28':['tax:.25 welfare:.4','reform:.55'],
 'fresh-party-future-0':['tax:-.25 labor:.35','tax:-.8 economy:.5'], 'fresh-party-future-3':['housing:.4','housing:-.45 economy:.4'],
 'fresh-party-better-0':['welfare:.75 tax:.6','welfare:.35 tax:-.2'], 'fresh-party-better-1':['reform:.8','reform:.4'], 'fresh-party-better-2':['reform:.7','reform:.3'], 'fresh-party-better-3':['housing:.75','housing:.4 economy:.15'],
 'fresh-party-reform-0':['reform:.4','reform:.6'], 'fresh-party-reform-1':['labor:.7 economy:.2','economy:.65 labor:.05'], 'fresh-party-reform-2':['region:.75','economy:.55 region:.1'], 'fresh-party-reform-3':['society:.65','reform:.35 economy:.2'],
 'fresh-party-labor-0':['labor:.8 welfare:.3','labor:.15 economy:.45'], 'fresh-party-labor-1':['labor:.8 society:.4','labor:.35'], 'fresh-party-labor-2':['society:.85','society:.3'], 'fresh-party-labor-3':['labor:.75 welfare:.25','welfare:.6 labor:.2'],
 'fresh-party-green-0':['environment:.65 region:.4','environment:.5 economy:.25'], 'fresh-party-green-1':['environment:.8 tax:.3 welfare:.3','environment:.35 economy:.2'], 'fresh-party-green-2':['environment:.65 labor:.5','environment:.7 region:.4'], 'fresh-party-green-3':['environment:.8','environment:.3'],
 'fresh-party-guardian-0':['society:.6','society:-.3'], 'fresh-party-guardian-3':['reform:.6 society:.5','reform:.4'],
};
function parseSignals(text:string):Signal[]{return text.split(' ').filter(Boolean).map(item=>{const [topic,stance]=item.split(':');return sig(topic as PolicyId,Number(stance));});}
for(const [id,[a,b]] of Object.entries(policyPairs))if(!semanticRules[id]){
 const signals:[Signal[],Signal[]]=[parseSignals(a),parseSignals(b)];
 // 이 항목은 기존 자원·결과를 유지하면서 문구에 맞는 정책 신호만 교정한다.
 (signalOnly as Record<string,[Signal[],Signal[]]>)[id]=signals;
}

// 운영 방식 차이인 카드에 무관한 이념 점수를 반복 부여하지 않는다.
const operational=new Set(['central-seat','soup','poster','bus','door','campaign','rain','return','fatigue','cabinet','last','local-song','central-aide','job-official']);
const entryOperations=[0,1,2,3,4,6,7,11,14,15,20,21,22,23,25,26,27,28,29,30,33,34,35,37,38,39,40,42,45,46,47,52,53,54,55,58,59];
for(const i of entryOperations)operational.add('fresh-prePolitics-'+i);
for(const i of [22,28])operational.add('fresh-local-'+i);
const professionOperations:Record<number,number[]>={0:[0,1,2,3,4,5,6,7],1:[0,1,2,3,4,5,6,7],2:[0,1,2,3,4,5,6,7],3:[0,1,2,3,4,5,6,7],4:[0,1,2,3,4,5,6,7],5:[0,1,2,3,4,5,6,7],6:[0,1,2,3,4,5,6,7],7:[0,1,2,3,4,5]};
for(const [job,ids] of Object.entries(professionOperations))for(const i of ids)operational.add(`fresh-job-${job}-${i}`);
const partyValues:Record<string,Record<string,number>>={future:{alliance:.95,order:.25,history:-.15,faithPolitics:.1,expertise:.35,automation:.65,disclosure:.4},better:{alliance:.3,order:-.3,history:.8,faithPolitics:-.5,expertise:.1,automation:.25,disclosure:.6},reform:{alliance:.3,order:.1,history:.15,faithPolitics:-.6,expertise:.95,automation:.95,disclosure:.8},labor:{alliance:.1,order:-.45,history:.8,faithPolitics:-.7,expertise:-.1,automation:-.2,disclosure:.7},guardian:{alliance:.9,order:.9,history:-.95,faithPolitics:1,expertise:.1,automation:.1,disclosure:.1}};
export function readabilityPolicy(card:Card,s:State){
 const dynamic:Rule|undefined=card.id==='debate-security'&&card.body.includes('방위비')?{...rule([sig('diplomacy',.5)],[sig('diplomacy',.55)],['동맹 분담 수용 · 다른 국가 예산의 부담','독자 방어력 우선 · 협상 장기화 위험']),values:[{alliance:.9},{alliance:-.5}]}:card.id==='debate-politics'&&(card.body.includes('오랫동안 도운')||card.title.includes('은인의 자리'))?rule([sig('reform',.7)],[sig('reform',.1)],['공개 경쟁 선발 · 은인과 관계 부담','은인 우선 검토·공개 심사 · 특혜 검증'],[{trust:6,org:-2},{trust:2,org:5}]):undefined;
 const r=dynamic??(s.job===2&&card.id==='housing'?rule([sig('reform',.65)],[sig('reform',.5)],['가족도 같은 심사 · 이해관계 공개','접촉 기록·외부 검증 · 자료 설명 책임']):semanticRules[card.id]);
 if(r){card.choices[0].effect={...r.a};card.choices[1].effect={...r.b};Object.assign(card,{signals:structuredClone(r.signals),costNotes:[...r.notes],...(r.values?{values:structuredClone(r.values)}:{})});if(r.results)card.choices.forEach((c,i)=>c.result=r.results![i]);}
 else if(operational.has(card.id))Object.assign(card,{signals:[[],[]]});else if(signalOnly[card.id])Object.assign(card,{signals:structuredClone(signalOnly[card.id])});
 // 새 당의 정책 노선에 맞는 입장이 당내 평가에도 이어진다. 캠프 운영·인물 사건의 관계 효과와 분리한다.
 const political=r&&!operational.has(card.id)||card.id.startsWith('fresh-')&&!operational.has(card.id);
 const party=partyById(s.partyId,s);if(political&&party){const signals=(card as any).signals as [Signal[],Signal[]]|undefined;const values=(card as any).values as [Record<string,number>,Record<string,number>]|undefined;
  card.choices.forEach((c,i)=>{const topics=['economy','labor','tax','housing','welfare','environment','migration','diplomacy','education','region','society','reform'];const ps=signals?.[i]??[];const vs=Object.entries(values?.[i]??{});const fit=ps.reduce((n,x)=>n+party.positions[topics.indexOf(x.topic)]*x.stance,0)+vs.reduce((n,[k,v])=>n+(partyValues[party.id]?.[k]??0)*v,0);if(ps.length+vs.length)c.effect.party=Math.round(fit/(ps.length+vs.length)*6);});
 }
 return card;
}
