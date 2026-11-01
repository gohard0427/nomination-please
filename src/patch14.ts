import type {State} from './engine.ts';
export const PATCH14='선택과 능력: v0.14';
export const modern=(s:Pick<State,'flags'>)=>s.flags.includes(PATCH14);
export const retrySize=(s:Pick<State,'flags'>,presidential:boolean)=>modern(s)?presidential?11:8:presidential?9:6;
export const modernRetry={local:['retry-local','retry-analysis-local','appeal','?local','?local','retry-network-local','?local','rain'],central:['retry-central','retry-analysis-central','national','?central','?central','retry-network-central','?central','responsibility'],presidential:['retry-presidential','retry-analysis-presidential','?presidential','retry-network-presidential','primary','debate-economy','debate-housing','debate-society','debate-politics','debate-security','last']};

/** 대선 후보 소개 한 칸은 실제 기록 후속과 교환할 수 있다. 선택 수와 최종5문답은 유지한다. */
export function baseRoute14(s:Pick<State,'flags'>,original:string[]){const r=[...original];if(modern(s)&&r.length===48)r[41]='?presidential';return r;}
