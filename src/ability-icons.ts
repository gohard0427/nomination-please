/** 기존 화면 팔레트와 같은 작은 면·선으로 그린 UI 상징. 인물 원화는 교체하지 않는다. */
const marks=[
 '<circle cx="12" cy="10" r="3"/><circle cx="23" cy="10" r="3"/><path d="M6 26v-4a6 6 0 0 1 12 0v4m0 0v-4a6 6 0 0 1 12 0v4"/>',
 '<rect x="7" y="5" width="20" height="25" rx="3"/><path d="M12 12h10m-10 6h10m-10 6h5"/>',
 '<rect x="8" y="4" width="19" height="27" rx="2"/><path d="M13 10h9m-9 7h3m3 0h3m-9 6h3m3 0h3"/>',
 '<path d="M5 28h24M17 6v22M6 11h22M9 11l-5 10h10Zm16 0-5 10h10Z"/>',
 '<path d="M7 5h15v18H7m5-12h6m-6 5h6"/><circle cx="23" cy="23" r="6"/><path d="m27 27 4 4"/>',
 '<rect x="6" y="6" width="23" height="24" rx="2"/><path d="m10 13 2 2 3-4m3 3h7m-15 9 2 2 3-4m3 3h7"/>',
 '<rect x="5" y="10" width="20" height="17" rx="3"/><path d="m25 15 6-4v16l-6-4M12 10l3-4h5l3 4"/>',
 '<path d="m17 4 12 5v9c0 7-12 13-12 13S5 25 5 18V9Z"/><path d="m11 17 4 4 8-8"/>',
 '<path d="M5 5h21v12H5Zm4 12-4 4m8 0h18v10H13Zm14 10 4 3M9 10h13m-5 16h10"/>'
];
export const abilityIcon=(job:number)=>`<svg class="ability-symbol" viewBox="0 0 36 36" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${marks[job]??marks[0]}</svg>`;
