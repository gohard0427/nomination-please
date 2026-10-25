import {endingCells} from './ending-cells.ts';
import {endingSheets} from './ending-sheets.ts';
import {epilogueDefinitions,type Epilogue} from './epilogues.ts';
// 승인된 장면과 직업별 전용 원화를 분리한다. 공통/별명 장면은 반드시 저장된 job의 시트만 조회한다.
export function epilogueArt(e:Epilogue){const d=epilogueDefinitions.find(d=>d.id===e.id);if(!d)return '';let file='',x=0,y=0,w=0,h=0,sw=1024,sh=1536;
 if(d.kind==='job'){const group=Math.floor(e.job/2),col=epilogueDefinitions.filter(x=>x.job===e.job).findIndex(x=>x.id===d.id);const rows=[{xs:[22,528,1027],ys:[97,539],ws:[490,482,489],hs:[330,358]},{xs:[18,528,1027],ys:[97,532],ws:[493,481,489],hs:[354,354]},{xs:[23,528,1028],ys:[96,529],ws:[486,481,486],hs:[344,351]},{xs:[24,528,1026],ys:[107,540],ws:[482,480,486],hs:[333,340]}][group];file='careers-'+group;x=rows.xs[col];y=rows.ys[e.job%2];w=rows.ws[col];h=rows.hs[e.job%2];sw=1536;sh=1024;}
 else if(d.kind==='common'){const i=epilogueDefinitions.filter(d=>d.kind==='common').findIndex(x=>x.id===d.id);file='common-job'+e.job;[sw,sh]=endingSheets[file];[x,y,w,h]=endingCells[file][i];}
 else{let i=epilogueDefinitions.filter(d=>d.kind==='nickname').findIndex(x=>x.id===d.id);if(d.id==='blackmoney'&&e.legalResolution!=='custody')i=11;file='nickname-job'+e.job;[sw,sh]=endingSheets[file];[x,y,w,h]=endingCells[file][i];}
 if(d.kind==='common'&&sw/sh>1){x+=80;w=Math.min(w-80,h*1.65);}
 return `<svg class="epilogue-illustration" data-player-job="${e.job}" data-scene="${d.scene}" viewBox="${x} ${y} ${w} ${h}" role="img" aria-label="${d.role}이 된 플레이어의 은퇴 후 생활" preserveAspectRatio="xMidYMid meet"><image href="/assets/art/endings/${file}.webp" width="${sw}" height="${sh}"/></svg>`;
}
