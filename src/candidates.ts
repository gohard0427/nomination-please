import {parties,partiesFor,partyById,type PartyWorld} from './parties.ts';
import type {State} from './engine.ts';
export const candidates=[
 {id:'seo',name:'서민재',partyId:'future',agenda:'지역 개발·기업 유치',quote:'지역을 살리는 실력 있는 행정',art:'candidate-seo'},
 {id:'baek',name:'백지은',partyId:'better',agenda:'돌봄·복지',quote:'돌봄의 빈칸부터 채우겠습니다',art:'candidate-baek'},
 {id:'oh',name:'오세움',partyId:'reform',agenda:'AI·과학기술',quote:'기술의 성과를 일자리로',art:'candidate-oh'},
 {id:'jin',name:'진해솔',partyId:'labor',agenda:'노동·임금',quote:'일하는 사람의 몫을 지킵니다',art:'candidate-jin'},
 {id:'woo',name:'우연두',partyId:'green',agenda:'환경·에너지',quote:'전환의 비용도 공정하게',art:'candidate-woo'},
 {id:'min',name:'민정훈',partyId:'guardian',agenda:'강경 안보·종교 보수',quote:'물러서지 않는 안보',art:'candidate-min'},
 {id:'nam',name:'남기찬',partyId:null,agenda:'지역 기반·생활 정치',quote:'당보다 동네가 먼저입니다',art:'candidate-nam'}
];
export function candidateFor(partyId:string|null){return candidates.find(c=>c.partyId===partyId)!;}
export function candidateLabel(partyId:string|null,s?:PartyWorld){const c=candidateFor(partyId);return c.name+' · '+(partyById(partyId,s)?.name??'무소속');}
export function electionOpponents(s:State){const choices=partiesFor(s).filter(p=>p.id!==s.partyId);const first=choices[(s.initialSeed+s.elections.length)%choices.length].id;const other=choices.filter(p=>p.id!==first);const third=(s.initialSeed+s.elections.length)%3===0&&s.partyId!==null?null:other[(s.initialSeed>>>3)%other.length].id;return {first,third};}
