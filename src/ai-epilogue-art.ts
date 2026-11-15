import type {Epilogue} from './epilogues.ts';
/** 4×4의 완결된 원화 장면. 얼굴/몸/배경의 별도 합성은 사용하지 않는다. */
export const aiEndingCells:Record<string,number>={
 'gpt-desk':0,'gpt-video':1,'gpt-archive':2,birds:3,
 memoir:4,fan:5,correction:6,clubs:7,
 cafe:8,bookshop:9,shop:10,'court-custody':11,
 copywriter:12,fishing:13,'court-noncustodial':14,'court-cleared':15
};
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function aiEpilogueArt(scene:string,role:string,resolution?:Epilogue['legalResolution']){
 const key=scene==='court'?`court-${resolution??'noncustodial'}`:scene;
 const cell=aiEndingCells[key];if(cell===undefined)return '';
 // 이웃 장면이 섞이지 않게 각 셀의 경계에서 2px 안쪽을 표시한다.
 const x=cell%4*384+2,y=Math.floor(cell/4)*256+2;
 const legal=scene==='court'?` · ${resolution==='custody'?'격리 운영':resolution==='cleared'?'혐의 해소':'비수감 법적 결론'}`:'';
 return `<svg class="epilogue-illustration" data-player-job="8" data-scene="${scene}" data-ending-cell="${key}" viewBox="${x} ${y} 380 252" role="img" aria-label="${esc(role)}${legal} · 채지피티의 은퇴 후 생활" preserveAspectRatio="xMidYMid meet"><image href="/assets/art/endings/gpt-life-v1.webp" width="1536" height="1024"/></svg>`;
}
