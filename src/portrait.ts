import {rivals} from './career.ts';
// 승인받은 시안의 삽화 영역만 표시합니다. 시안 안의 문구·장단점은 노출하지 않습니다.
const jobX=[26,405,780,1155], jobY=[127,574];
const npcX=[20,403,779,1154], npcY=[118,561];
const leaderX=[18,530,1025],leaderY=[88,556];
export function illustration(sheet:'jobs'|'npcs'|'leaders',index:number,label:string,face=false){const x=sheet==='jobs'?jobX[index%4]:sheet==='npcs'?npcX[index%4]:leaderX[index%3];const y=sheet==='jobs'?jobY[Math.floor(index/4)]:sheet==='npcs'?npcY[Math.floor(index/4)]:leaderY[Math.floor(index/3)];let width=sheet==='leaders'?480:sheet==='npcs'?360:354;let height=sheet==='leaders'?255:234;let xx=x,yy=y;if(face){xx+=sheet==='leaders'?140:95;yy+=18;width=150;height=170;}return `<svg class="character-art ${face?'face':''}" viewBox="${xx} ${yy} ${width} ${height}" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice"><image href="/assets/art/${sheet}.webp" width="1536" height="1024"/></svg>`}
const npcNames=['고단비','차도약','문장수','한보름','신새봄','유정도','서중심','봉봉수'];const leaders=['나원칙','윤다정','차새로','정버팀','도초록','한민국'];
export function npcPortrait(speaker:string,face=true){const rival=rivals.find(r=>speaker.includes(r.name));if(rival)return illustration('jobs',rival.art,rival.name,face);if(speaker.includes('온지원'))return illustration('jobs',2,'온지원',face);const index=npcNames.findIndex(n=>speaker.includes(n));if(index>=0)return illustration('npcs',index,npcNames[index],face);const li=leaders.findIndex(n=>speaker.includes(n));return li>=0?illustration('leaders',li,leaders[li],face):illustration('npcs',7,'지역의 목소리',face)}
export function portrait(job=0){return illustration('jobs',job,'직업 캐릭터')}
