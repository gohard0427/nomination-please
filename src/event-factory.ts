import type {Card,Stats} from './content.ts';
import type {Signal} from './support.ts';
export type Chapter='prePolitics'|'local'|'central'|'presidential';
export type VarietyCard=Card&{chapter:Chapter;kind:'origin'|'light'|'conflict'|'memory'|'party';jobs?:number[];parties?:string[];requires?:[string,0|1][];signals:[Signal[],Signal[]];costNotes:[string,string]};
export type Option=[string,Partial<Stats>,string,string];
export function v(id:string,chapter:Chapter,title:string,speaker:string,body:string,a:Option,b:Option,topic:Signal['topic']='reform',extra:Partial<VarietyCard>={}):VarietyCard{return {id,chapter,title,speaker,body,choices:[{text:a[0],effect:a[1],result:a[2]},{text:b[0],effect:b[1],result:b[2]}],costNotes:[a[3],b[3]],signals:[[{topic,stance:.6,strength:.55}],[{topic,stance:.25,strength:.55}]],importance:2,maxAppearances:1,kind:'light',...extra}}
