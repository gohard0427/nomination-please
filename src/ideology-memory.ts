import type {State} from './engine.ts';import type {Card} from './content.ts';
export function recordIdeology(s:State,c:Card,i:0|1){const topic=c.id.startsWith('reform-tech-')?'기술과 일자리':c.id==='religion-rally'?'종교와 정치':c.id==='elite-experts'?'전문가와 참여':c.id==='job-activist'?'집회와 주민':null;if(!topic)return;s.statements.push({id:c.id,turn:s.turn,topic,text:c.choices[i].text.replaceAll('“','').replaceAll('”',''),principle:c.choices[i].text,strength:i===0?3:1,exposure:s.stats.fame,contextTags:[c.id]});}
export function ideologyContext(c:Card,s:State){if(c.id==='reform-jobs-return'){const p=s.statements.find(x=>x.topic==='기술과 일자리');if(p)c.body=`당신이 입당 뒤 남긴 말 “${p.text}”을 다시 묻습니다. `+c.body;}
 if(c.id==='religion-law'){const p=s.statements.find(x=>x.topic==='집회와 주민');if(p){c.body=`과거 당신은 “${p.text}”이라고 말했습니다. `+c.body;c.choices[1].result+=p.strength===3?' 과거 주민 통행을 우선했던 발언과 이번 요구가 어떻게 같은 기준인지 질문받았습니다.':'과거에도 집회권을 강조했습니다. 이번에도 주민 보호 기준을 함께 설명해야 합니다.';}}
 if(c.id==='religion-budget'){const p=s.statements.find(x=>x.topic==='종교와 정치');if(p)c.body=`당신이 “${p.text}”이라며 참여했던 집회의 관계자가 찾아왔습니다. `+c.body;}
 return c;}
