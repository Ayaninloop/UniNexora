const U=[
['NUST','Islamabad','Public',['CS','Engineering','Business'],'NU','https://nust.edu.pk/'],
['FAST-NUCES Islamabad','Islamabad','Private',['CS','Software Engineering','AI','Business'],'F','https://nu.edu.pk/'],
['FAST-NUCES Lahore','Lahore','Private',['CS','Software Engineering','AI','Business'],'F','https://lhr.nu.edu.pk/'],
['UET Lahore','Lahore','Public',['Engineering','CS','Architecture'],'UET','https://uet.edu.pk/'],
['COMSATS Islamabad','Islamabad','Public',['CS','Software Engineering','Engineering','Business'],'CUI','https://islamabad.comsats.edu.pk/'],
['COMSATS Lahore','Lahore','Public',['CS','Software Engineering','Engineering'],'CUI','https://lahore.comsats.edu.pk/'],
['LUMS','Lahore','Private',['CS','Business','Engineering','Economics'],'L','https://lums.edu.pk/'],
['University of the Punjab','Lahore','Public',['CS','Physics','Business','Engineering'],'PU','https://pu.edu.pk/'],
['GIKI','Topi','Private',['Engineering','CS','AI','Management'],'G','https://giki.edu.pk/'],
['PIEAS','Islamabad','Public',['Physics','Engineering','CS'],'P','https://pieas.edu.pk/'],
['Air University','Islamabad','Public',['CS','Engineering','Business'],'AU','https://au.edu.pk/'],
['UET Peshawar','Peshawar','Public',['Engineering','CS'],'UET','https://uetpeshawar.edu.pk/']
];
const T=[
['NUST NET','🧠','Math • Physics • English • Intelligence','Exact composition depends on program/category.','https://ugadmissions.nust.edu.pk/'],
['ECAT','⚙️','Mathematics • Physics • Chemistry/Computer Science • English','Verify the current cycle and participating programs.','https://ecat.uet.edu.pk/'],
['FAST-NUCES Admission Test','💻','Math • Analytical/IQ • English • subject areas','Check the current admission cycle for the exact pattern.','https://nu.edu.pk/Admissions'],
['FUNGAT','📚','GAT-style aptitude preparation','Accepted routes and requirements vary by university/program.','https://www.nts.org.pk/'],
['SAT','✏️','Reading & Writing • Math','Some universities may accept SAT; check each program.','https://satsuite.collegeboard.org/sat'],
['University-specific tests','🏫','Varies by university and program','Use the official admission portal for exact details.','https://hec.gov.pk/']
];
let targets=JSON.parse(localStorage.getItem('puhTargets')||'[]');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(x){let e=$('#toast');e.textContent=x;e.classList.add('toast-show');clearTimeout(window.tt);window.tt=setTimeout(()=>e.classList.remove('toast-show'),2200)}
function esc(x){return String(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function save(){localStorage.setItem('puhTargets',JSON.stringify(targets));updateStats()}
function go(id){location.hash=id}
function updateStats(){
 $('#saved').textContent=targets.length;$('#applied').textContent=targets.filter(x=>x.status==='Applied').length;
 const today=new Date().toISOString().slice(0,10);$('#upcoming').textContent=targets.filter(x=>x.test&&x.test>=today).length;
 $('#nextStep').textContent=targets.length?(targets.find(x=>x.status!=='Completed')?.name||'Your saved targets are complete'):'Explore your target universities';
 $('#tt').textContent=targets.length;$('#ta').textContent=targets.filter(x=>x.status==='Applied').length;$('#tp').textContent=targets.filter(x=>x.status==='Test planned').length;$('#td').textContent=targets.filter(x=>x.status==='Completed').length;
}
function renderU(){let q=($('#uSearch').value||'').toLowerCase(),s=$('#uSector').value,c=$('#uCity').value,f=$('#uField').value;
 let a=U.filter(u=>(!q||[u[0],u[1],u[2],...u[3]].join(' ').toLowerCase().includes(q))&&(s==='All'||u[2]===s)&&(c==='All'||u[1]===c)&&(f==='All'||u[3].includes(f)));
 $('#count').textContent=a.length+' '+(a.length===1?'university':'universities');
 $('#uniGrid').innerHTML=a.length?a.map((u,i)=>`<article class="uni-card"><div class="uni-top"><div class="logo">${esc(u[4])}</div><span class="badge">${esc(u[2])}</span></div><h3>${esc(u[0])}</h3><div class="loc">📍 ${esc(u[1])}</div><div class="tags">${u[3].map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div><div class="uni-actions"><button class="small main" onclick="openUni('${esc(u[0])}')">Official site</button><button class="small" onclick="addUni('${esc(u[0])}')">+ Save</button></div></article>`).join(''):`<div class="empty"><h2>No universities found</h2><p>Try another search or filter.</p></div>`;
}
function openUni(name){let u=U.find(x=>x[0]===name);if(u)window.open(u[5],'_blank','noopener,noreferrer')}
function addUni(name){if(targets.some(x=>x.name.toLowerCase()===name.toLowerCase())){toast('Already saved in your tracker.');return}targets.push({id:Date.now(),name,deadline:'',test:'',status:'Researching'});save();toast(name+' added to tracker.')}
function renderTests(){$('#testGrid').innerHTML=T.map(t=>`<article class="test"><i>${t[1]}</i><h2>${esc(t[0])}</h2><p>${esc(t[2])}</p><div class="meta"><b>Note</b><strong>${esc(t[3])}</strong></div><a class="official" href="${t[4]}" target="_blank" rel="noopener">Official information →</a></article>`).join('')}
function renderTracker(){
 $('#empty').style.display=targets.length?'none':'block';
 $('#trackerList').innerHTML=targets.map(t=>`<article class="track"><div><h3>${esc(t.name)}</h3><small>Deadline: ${t.deadline||'Not set'} · Test: ${t.test||'Not set'}</small></div><div><select onchange="changeStatus(${t.id},this.value)">${['Researching','Applied','Test planned','Completed'].map(s=>`<option ${s===t.status?'selected':''}>${s}</option>`).join('')}</select><button class="delete" onclick="delTarget(${t.id})">Delete</button></div></article>`).join('');updateStats()}
function changeStatus(id,s){let x=targets.find(t=>t.id===id);if(x){x.status=s;save();renderTracker();toast('Tracker updated.')}}
function delTarget(id){targets=targets.filter(x=>x.id!==id);save();renderTracker();toast('Target removed.')}
function openModal(){ $('#modal').classList.remove('hidden');$('#targetName').focus() }
function closeModal(){$('#modal').classList.add('hidden')}
function addTarget(){let name=$('#targetName').value.trim();if(!name){toast('Enter a university name.');return}targets.push({id:Date.now(),name,deadline:$('#deadline').value,test:$('#testDate').value,status:$('#status').value});save();closeModal();renderTracker();toast('Target saved successfully.')}
function calcPercent(){let a=+$('#obt').value,b=+$('#total').value;$('#percentResult').innerHTML=(b>0&&a>=0&&a<=b)?`<b>${(a/b*100).toFixed(2)}%</b>`:'Enter valid marks.'}
function calcMerit(){let a=+$('#a').value,aw=+$('#aw').value,t=+$('#t').value,tw=+$('#tw').value;$('#meritResult').innerHTML=(aw+tw===100&&a>=0&&a<=100&&t>=0&&t<=100)?`<b>${(a*aw+t*tw)/100}%</b>`:'Scores must be 0–100 and weights must total 100%.'}
function calcScore(){let a=+$('#correct').value,b=+$('#questions').value;$('#scoreResult').innerHTML=(b>0&&a>=0&&a<=b)?`<b>${(a/b*100).toFixed(2)}%</b>`:'Enter valid numbers.'}
function fillFilters(){[...new Set(U.map(x=>x[1]))].sort().forEach(x=>$('#uCity').insertAdjacentHTML('beforeend',`<option>${esc(x)}</option>`));[...new Set(U.flatMap(x=>x[3]))].sort().forEach(x=>$('#uField').insertAdjacentHTML('beforeend',`<option>${esc(x)}</option>`))}
function init(){
 fillFilters();renderTests();renderU();renderTracker();updateStats();
 $('#menu').onclick=()=>$('#nav').classList.toggle('open');
 document.addEventListener('click',e=>{let b=e.target.closest('[data-go]');if(b){e.preventDefault();go(b.dataset.go)}});
 ['uSearch','uSector','uCity','uField'].forEach(id=>$( '#'+id).addEventListener('input',renderU));
 $('#reset').onclick=()=>{$('#uSearch').value='';$('#uSector').value='All';$('#uCity').value='All';$('#uField').value='All';renderU()};
 $('#homeSearchBtn').onclick=()=>{go('universities');setTimeout(()=>{$('#uSearch').value=$('#homeSearch').value;renderU()},0)};
 $('#homeSearch').onkeydown=e=>{if(e.key==='Enter')$('#homeSearchBtn').click()};
 $('#percentBtn').onclick=calcPercent;$('#meritBtn').onclick=calcMerit;$('#scoreBtn').onclick=calcScore;
 $('#addTarget').onclick=openModal;$('#close').onclick=closeModal;$('#saveTarget').onclick=addTarget;$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
 window.addEventListener('hashchange',()=>{let id=location.hash.slice(1)||'home';$$('.page').forEach(p=>p.style.display=p.id===id?'block':'none');$('#nav').classList.remove('open');if(id==='universities')renderU();if(id==='tracker')renderTracker();updateStats();window.scrollTo(0,0)});
 let id=location.hash.slice(1)||'home';$$('.page').forEach(p=>p.style.display=p.id===id?'block':'none');updateStats();
}
document.addEventListener('DOMContentLoaded',init);
