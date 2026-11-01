import type {State} from './engine.ts';import {projection} from './support.ts';
/** 신규 회차 발언은 능력으로 넓어진 실제 노출까지 반영한다. 과거 기록은 덮어쓰지 않는다. */
export function statementExposure(s:State){return s.flags.includes('선택과 능력: v0.14')?projection(s.rows,s.scope,s.localRegion).fame:s.stats.fame;}
