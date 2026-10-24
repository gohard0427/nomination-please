import type {Card} from './content.ts';import type {State} from './engine.ts';
export const BALANCE_FLAG='운영 조정: balance-v1';
export function balanceCard(card:Card,s:State){if(!s.flags.includes('사건 구성: variety-v1'))return card;
 // 일반 활동의 비용만 완화한다. 불법 자금 반환·법적 대응은 finance.ts의 실제 장부를 따른다.
 for(const c of card.choices){const cost=c.effect.funds;if(cost!==undefined&&cost<0)c.effect.funds=-Math.max(1,Math.round(-cost*.8));}
 if(card.id.startsWith('balance-fund-')&&s.job===0&&s.flags.some(f=>f.startsWith('분기:career-activist-donor:'))){card.choices[0].effect.funds=14;card.choices[0].result+=' 초반에 쌓은 소액 후원 인연이 모금에 힘을 보탰습니다.';if('costNotes' in card)(card as Card&{costNotes:string[]}).costNotes[0]='조직 경험으로 합법 자금 +14 · 현장 활동을 줄임 · 챕터당 한 번';}
 if(['origin-press','origin-official','origin-military'].includes(card.id)){const bonus=s.job===5?2:3;for(const c of card.choices)c.effect.org=(c.effect.org??0)+bonus;}
 if(s.job===3&&card.id==='job-law'){for(const c of card.choices)if((c.effect.funds??0)<0)c.effect.funds=Math.min(-1,c.effect.funds!+1);}
 if(s.job===4&&['job-press','press'].includes(card.id)){card.choices[0].effect.trust=(card.choices[0].effect.trust??0)+2;}
 return card;}
