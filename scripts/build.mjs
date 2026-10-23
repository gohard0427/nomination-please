import {stripTypeScriptTypes} from 'node:module';import {mkdir,readFile,writeFile,copyFile,cp,readdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist/src',{recursive:true});
for(const entry of await readdir('src',{withFileTypes:true})){if(!entry.isFile()||(!entry.name.endsWith('.ts')||entry.name.endsWith('.d.ts')))continue;const source=(await readFile(`src/${entry.name}`,'utf8')).replace("import './style.css';",'');const js=stripTypeScriptTypes(source,{mode:'strip'}).replaceAll(".ts'",".js'");await writeFile(`dist/src/${entry.name.replace(/\.ts$/,'.js')}`,js)}
await copyFile('src/style.css','dist/src/style.css');await cp('assets','dist/assets',{recursive:true});await cp('public','dist',{recursive:true});let html=await readFile('index.html','utf8');await writeFile('dist/index.html',html.replace('</head>','<link rel="stylesheet" href="/src/style.css"></head>').replace('/src/main.ts','/src/main.js'));// 기존 채팅의 스크랩 캐시와 구별되는 공유 주소. 같은 출처이므로 게임 저장도 공유한다.
const sharePath='/play/a/';const shareUrl='https://nomination-please.pages.dev'+sharePath;
const sharedHtml=(await readFile('dist/index.html','utf8')).replace('rel="canonical" href="https://nomination-please.pages.dev/"','rel="canonical" href="'+shareUrl+'"').replace('property="og:url" content="https://nomination-please.pages.dev/"','property="og:url" content="'+shareUrl+'"');
await mkdir('dist'+sharePath,{recursive:true});await writeFile('dist'+sharePath+'index.html',sharedHtml);
console.log('배포 파일 생성 완료: dist/');
