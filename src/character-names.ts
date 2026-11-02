/** 표시 별칭만 적용한다. 저장된 과거 발언과 원장은 변경하지 않는다. */
export const characterName=(s:string)=>s.replaceAll('차지피','채지피');
export const sameCharacterName=(a:string,b:string)=>characterName(a)===characterName(b);
