import {stripTypeScriptTypes} from 'node:module';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
await mkdir('dist/src',{recursive:true});
for(const name of ['content','engine','portrait','main']){let s=await readFile(`src/${name}.ts`,'utf8');s=s.replace("import './style.css';",'');s=stripTypeScriptTypes(s,{mode:'strip'}).replaceAll(".ts'",".js'");await writeFile(`dist/src/${name}.js`,s)}
await copyFile('src/style.css','dist/src/style.css');let html=await readFile('index.html','utf8');await writeFile('dist/index.html',html.replace('</head>','<link rel="stylesheet" href="/src/style.css"></head>').replace('/src/main.ts','/src/main.js'));console.log('배포 파일 생성 완료: dist/');
