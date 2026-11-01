import type {State} from './engine.ts';import type {Card} from './content.ts';
export type Quest={version:1;source?:{id:string;turn:number;text:string;strength:number};review?:{id:string;turn:number;choice:string};finished?:boolean};
export function recordQuest(s:State,c:Card,i:0|1){if(!s.quest)return;const q=s.quest;
 if(!q.review&&['investigation','democracy-names'].includes(c.id)){const st=[...s.statements].reverse().find(x=>x.id===c.id);if(st)q.source={id:st.id,turn:st.turn,text:st.text,strength:st.strength};}
 if(!q.source||q.review)return;const expected=q.source.id==='investigation'?'audit':'names-return';if(c.id!==expected||s.turn<=q.source.turn)return;
 const same=q.source.strength===3?i===0:true;if(same)q.review={id:c.id,turn:s.turn,choice:c.choices[i].text};
}
export function questComplete(s:State){return !!s.quest?.source&&!!s.quest.review&&s.completed;}
export function validQuest(q:any,s:State){if(!s?.flags?.includes('선택과 능력: v0.14'))return q===undefined;if(q===undefined)return !s.flags.includes('선택과 능력: v0.14');if(q?.version!==1)return false;
 if(q.source&&(!['investigation','democracy-names'].includes(q.source.id)||!Number.isInteger(q.source.turn)||!s.statements.some(st=>st.id===q.source.id&&st.turn===q.source.turn&&st.text===q.source.text&&st.strength===q.source.strength)))return false;
 if(q.review&&(!q.source||q.review.id!==(q.source.id==='investigation'?'audit':'names-return')||!Number.isInteger(q.review.turn)||q.review.turn<=q.source.turn||!s.history.some(h=>h.turn===q.review.turn&&h.decision?.cardId===q.review.id&&h.choice===q.review.choice&&(q.source.strength!==3||h.decision?.index===0))))return false;
 return q.finished===undefined||q.finished===true&&s.completed&&!!q.review;}
