export type StatKey='support'|'funds'|'fame'|'party';
const paths:Record<StatKey,string>={
 support:'<circle cx="9" cy="7" r="3"/><circle cx="19" cy="8" r="2.5"/><path d="M3 22v-4a6 6 0 0 1 12 0v4M17 14a5 5 0 0 1 7 4v4M2 23h23"/>',
 funds:'<ellipse cx="14" cy="7" rx="9" ry="4"/><path d="M5 7v6c0 5 18 5 18 0V7M5 13v6c0 5 18 5 18 0v-6M14 4v6M11 6h6"/>',
 fame:'<path d="m4 11 16-6v17L4 17zM4 11H1v6h3M8 18l2 7h5l-3-9M24 9l3-2M25 14h3M24 19l3 2"/>',
 party:'<path d="M3 23h23M5 13h19v10H5zM3 11 14 3l13 8zM10 15v5M18 15v5M14 3V0h7"/>'
};
export const statColors:Record<StatKey,string>={support:'#aed5ad',funds:'#edc780',fame:'#91c6dd',party:'#c4b0e1'};
export function statVisual(key:StatKey,value:number|null){const progress=value===null?0:Math.max(0,Math.min(100,value));return `<svg class="stat-glyph" viewBox="0 0 56 56" aria-hidden="true"><circle class="gauge-track" cx="28" cy="28" r="24"/><circle class="gauge-fill" cx="28" cy="28" r="24" pathLength="100" stroke-dasharray="${progress} 100" transform="rotate(-90 28 28)"/><g transform="translate(14 14)" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[key]}</g></svg>`;}
export function statCaption(key:StatKey,value:number|null){if(value===null)return '아직 평가 전';if(key==='funds')return value<=15?'현장 전략 필요':value<45?'지출을 살필 때':'활동 자원 확보';if(key==='fame')return value<30?'아직 새 얼굴':value<65?'알아보는 사람들':'널리 알려진 이름';if(key==='party')return value<25?'인연을 쌓는 중':value<60?'기반을 다지는 중':'힘이 실리는 중';return value<35?'설득이 필요해':value<65?'평가가 갈리는 중':'호의적인 평가';}
