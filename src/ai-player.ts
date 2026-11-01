import type {State} from './engine.ts';import type {Card} from './content.ts';
export function aiPlayerCard(c:Card,s:State){if(s.job!==8)return c;
 const body:Record<string,string>={housing:'운영재단이 공공사업에 참여하려 합니다. 당신이 영향력을 행사할 수 있는 위치에서 이해충돌 기준을 어떻게 공개할까요?','family-clue':'당신의 정치 참여 등록 전부터 운영재단이 보유한 토지 근처에 개발 계획이 발표될 수 있다는 소문입니다. 재단 관계자는 거래를 검토 중입니다. 거래 보류를 요구할지, 시점과 자료를 먼저 확인할지 정하세요.',family:'운영재단 토지 거래가 보도됐습니다. 보유 시점과 개발 발표를 대조한 현재 자료에는 위법 증거가 없습니다. 재단의 거래와 당신의 직접 관여는 구분해 검증해야 합니다.',law:'정치 참여 등록 경력이 허위라는 고발이 들어왔습니다. 등록 확인 자료는 있지만 원본 대조가 필요합니다. 정식으로 자료를 제출할지, 공개 해명을 먼저 할지 정해야 합니다.'};
 if(body[c.id])c.body=body[c.id];if(c.id==='family')c.title='운영재단의 거래도 같은 기준입니까?';if(c.id==='family-clue')c.title='재단의 토지, 당신의 책임입니까?';
 for(const k of ['title','body','speaker'] as const)c[k]=c[k].replaceAll('한보름','운영재단').replaceAll('배우자','재단 관계자').replaceAll('성인 자녀','공동개발자').replaceAll('자녀','개발팀').replaceAll('누나','운영재단').replaceAll('가족','운영·개발 관계자');
 c.choices.forEach(x=>{x.text=x.text.replaceAll('가족','운영재단').replaceAll('누나','재단 관계자');x.result=x.result.replaceAll('가족','운영재단').replaceAll('상속','재단 보유').replaceAll('정상 임명장','등록 확인 자료');});return c;
}
export const ageLabel=(s:Pick<State,'job'|'age'>)=>s.job===8?`가동 ${Math.max(1,s.age-35)}년차`:`${s.age}세`;
