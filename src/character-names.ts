/** 화면의 이름만 통일한다. 기존 저장의 발언/사용 원장/임기는 고쳐 쓰지 않는다. */
export const characterName=(s:string)=>s.replace(/(?:차지피|채지피)(?:티)?/g,'채지피티');
export const sameCharacterName=(a:string,b:string)=>characterName(a)===characterName(b);
