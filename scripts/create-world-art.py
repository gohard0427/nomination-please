"""승인 원화의 큰 머리·작은 막대 눈·색면 비율에 맞춘 신규 SVG. 외부 사진 없음."""
from pathlib import Path
out=Path('assets/art');out.mkdir(exist_ok=True)
def svg(name,body,bg='#244047'):
    (out/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="{bg}"/>{body}</svg>')
def person(hair='black',shirt='#19262e',glasses=False,bald=False,bob=False,cap=False,vest=False,prop='paper'):
    haircolor={'black':'#192124','gray':'#b4bab5','brown':'#49342b'}.get(hair,hair)
    body=f'<path d="M168 360Q176 258 231 245H355Q414 270 424 360" fill="{shirt}"/><path d="M257 238L294 285L329 238" fill="#f1e5d2"/>'
    if vest:body+='<path d="M223 252L272 288V360H190ZM359 252L313 288V360H405Z" fill="#8764a5"/>'
    body+='<rect x="266" y="213" width="59" height="58" rx="20" fill="#f3a67f"/><ellipse cx="294" cy="155" rx="92" ry="99" fill="#ffb18a"/><ellipse cx="204" cy="178" rx="17" ry="23" fill="#ffb18a"/><ellipse cx="384" cy="178" rx="17" ry="23" fill="#ffb18a"/>'
    if bald:body+='<path d="M204 164Q191 104 224 99L231 143L216 180ZM377 164Q394 104 364 99L359 144L374 180Z" fill="#c3c4b9"/>'
    elif bob:body+=f'<path d="M201 195Q165 101 237 64Q296 20 354 66Q416 95 384 213L368 193V114L319 83Q275 136 215 140V207Z" fill="{haircolor}"/>'
    else:body+=f'<path d="M202 172Q181 103 220 73Q240 29 311 46Q354 26 391 66L386 115L345 104L306 82Q269 119 213 123V175Z" fill="{haircolor}"/>'
    if vest:body=body.replace(f'<path d="M202 172Q181 103 220 73Q240 29 311 46Q354 26 391 66L386 115L345 104L306 82Q269 119 213 123V175Z" fill="{haircolor}"/>', '<path d="M204 167V81Q206 48 230 48H359Q384 48 384 81V162H369V111H219V167Z" fill="#192124"/>')
    if cap:body+='<path d="M195 124Q200 33 289 39Q354 36 377 100L416 117Q332 140 195 124" fill="#275979"/>'
    body+='<rect x="259" y="158" width="9" height="19" rx="4" fill="#172124"/><rect x="321" y="158" width="9" height="19" rx="4" fill="#172124"/><path d="M250 142L274 148M315 148L339 140" stroke="#172124" stroke-width="9" stroke-linecap="round"/>'
    if glasses:body+='<g fill="none" stroke="#172124" stroke-width="9"><rect x="233" y="148" width="51" height="37" rx="4"/><rect x="306" y="148" width="51" height="37" rx="4"/><path d="M284 160H306M211 155H233M357 155H378"/></g>'
    if prop=='mic':body+='<path d="M334 355L370 268" stroke="#ffb18a" stroke-width="30" stroke-linecap="round"/><path d="M375 280L394 322" stroke="#1a252b" stroke-width="17"/><ellipse cx="370" cy="270" rx="22" ry="30" fill="#1a252b"/>'
    elif prop=='bag':body+='<path d="M248 281L395 274L415 360H241Z" fill="#c89c67"/><path d="M280 292V273Q318 245 351 276V290" fill="none" stroke="#b48b5a" stroke-width="8"/><path d="M205 330L260 318" stroke="#ffb18a" stroke-width="26" stroke-linecap="round"/>'
    elif prop=='tablet':body+='<rect x="319" y="259" width="95" height="124" rx="8" fill="#15232c"/><path d="M245 330L337 307" stroke="#ffb18a" stroke-width="27" stroke-linecap="round"/>'
    else:body+='<path d="M315 266L421 278L409 360H306Z" fill="#eee1c6"/><path d="M328 290L401 298M326 308L390 315" stroke="#c3b497" stroke-width="8"/><path d="M239 329L322 318" stroke="#ffb18a" stroke-width="26" stroke-linecap="round"/>'
    return body
svg('guardian-leader', '<path d="M0 250H640V360H0Z" fill="#372647"/><path d="M70 75V266M70 75H151V139H70M508 53V266M508 53H590V130H508" fill="#4f3c60" stroke="#4f3c60" stroke-width="9"/>'+person(glasses=True,vest=True,shirt='#eee1c6',prop='mic'),'#624975')
svg('former-president','<g stroke="#34424a" stroke-width="15">'+''.join(f'<path d="M{x} 0V360"/>' for x in [60,110,470,520,570])+'</g>'+person(hair='gray',shirt='#747d7b',glasses=True,bald=True,prop='bag'),'#52656c')
variants=[('seo','brown','#28313a',False,False,False,False,'paper','#74504a'),('baek','black','#3d6995',False,False,True,False,'paper','#33576f'),('oh','black','#d68848',False,False,False,False,'tablet','#76532c'),('jin','black','#bfa54e',False,False,False,False,'mic','#62582e'),('woo','black','#4e896e',True,False,True,False,'paper','#34584a'),('min','brown','#74628e',False,False,False,False,'mic','#4b3e60'),('nam','gray','#ac9677',False,True,False,True,'paper','#3b6163')]
for name,hair,shirt,glasses,bald,bob,cap,prop,bg in variants:svg('candidate-'+name,person(hair,shirt,glasses,bald,bob,cap,prop=prop),bg)
# Non-character scenes use sparse symbolic editorial vectors; no data or statistics burned into illustrations.
factory='<path d="M75 300V185L158 215V165L245 200V146H300V300ZM325 300V172L410 202V150L493 187V95H535V300Z" fill="#334c50"/>'
for name in ['factory','hospital','fund','tariff','stock-up','stock-down','fx-up','fx-down','north','growth']:
    scene=factory
    if name in ['stock-up','stock-down','fx-up','fx-down','growth']:
        rising=name in ['stock-up','fx-up','growth']; col='#9cc5a4' if rising else '#d67568';points='90,270 180,237 260,250 350,160 435,175 545,78' if rising else '90,80 180,110 260,90 350,185 435,170 545,272'
        scene='<g stroke="#49605f" stroke-width="2"><path d="M80 60V300H570"/>'+''.join(f'<path d="M80 {y}H570"/>' for y in [100,160,220])+'</g>'+f'<polyline points="{points}" stroke="{col}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
        if name.startswith('fx'):scene+='<circle cx="505" cy="105" r="43" fill="#d5b971"/><path d="M482 88Q530 65 526 94Q521 107 489 106Q469 135 530 122M506 67V140" fill="none" stroke="#645d40" stroke-width="6"/>'
    if name=='tariff':scene+='<g transform="rotate(-15 330 168)"><rect x="285" y="65" width="90" height="100" rx="12" fill="#dea574"/><rect x="245" y="150" width="170" height="47" rx="8" fill="#b97853"/></g><path d="M160 286H500" stroke="#d96f60" stroke-width="15"/>'
    if name=='hospital':scene='<rect x="160" y="95" width="320" height="230" rx="12" fill="#758e83"/><path d="M290 45H350V180H290ZM252 83H388V143H252Z" fill="#c9dab9"/><rect x="289" y="236" width="65" height="89" fill="#304a49"/>'
    if name=='fund':scene='<path d="M130 250L230 180L320 245L425 120L526 190" fill="none" stroke="#9cc5a4" stroke-width="15"/><g fill="#d8b674">'+''.join(f'<rect x="{x}" y="{y}" width="80" height="{320-y}" rx="8"/>' for x,y in [(160,245),(285,200),(410,150)])+'</g>'
    if name=='north':scene='<path d="M90 300L220 200L285 250L360 150L540 300Z" fill="#395159"/><path d="M340 90L430 140L395 155L385 195L340 90" fill="#e1cba7"/><path d="M340 90Q220 100 200 185" fill="none" stroke="#cf8a63" stroke-width="9" stroke-dasharray="12 12"/>'
    svg('event-'+name,scene)
