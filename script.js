const universities=[
{name:"NUST",city:"Islamabad",sector:"Public",fields:["CS","Engineering","Business"],url:"https://nust.edu.pk/"},
{name:"FAST-NUCES Islamabad",city:"Islamabad",sector:"Private",fields:["CS","Software Engineering","AI","Business"],url:"https://nu.edu.pk/"},
{name:"FAST-NUCES Lahore",city:"Lahore",sector:"Private",fields:["CS","Software Engineering","AI","Business"],url:"https://lhr.nu.edu.pk/"},
{name:"UET Lahore",city:"Lahore",sector:"Public",fields:["Engineering","CS","Architecture"],url:"https://uet.edu.pk/"},
{name:"COMSATS Islamabad",city:"Islamabad",sector:"Public",fields:["CS","Software Engineering","Engineering","Business"],url:"https://islamabad.comsats.edu.pk/"},
{name:"COMSATS Lahore",city:"Lahore",sector:"Public",fields:["CS","Software Engineering","Engineering"],url:"https://lahore.comsats.edu.pk/"},
{name:"LUMS",city:"Lahore",sector:"Private",fields:["CS","Business","Engineering","Economics"],url:"https://lums.edu.pk/"},
{name:"University of the Punjab",city:"Lahore",sector:"Public",fields:["CS","Physics","Business","Engineering"],url:"https://pu.edu.pk/"},
{name:"GIKI",city:"Topi",sector:"Private",fields:["Engineering","CS","AI","Management"],url:"https://giki.edu.pk/"},
{name:"PIEAS",city:"Islamabad",sector:"Public",fields:["Physics","Engineering","CS"],url:"https://pieas.edu.pk/"},
{name:"Air University",city:"Islamabad",sector:"Public",fields:["CS","Engineering","Business"],url:"https://au.edu.pk/"},
{name:"UET Peshawar",city:"Peshawar",sector:"Public",fields:["Engineering","CS"],url:"https://uetpeshawar.edu.pk/"}
];
const tests=[
{name:"NUST NET",icon:"🧠",subjects:"Math • Physics • English • Intelligence",url:"https://ugadmissions.nust.edu.pk/"},
{name:"ECAT",icon:"⚙️",subjects:"Math • Physics • Chemistry/Computer Science • English",url:"https://ecat.uet.edu.pk/"},
{name:"FAST-NUCES Test",icon:"💻",subjects:"Mathematics • Analytical/IQ • English • Subject areas",url:"https://nu.edu.pk/Admissions"},
{name:"FUNGAT / GAT",icon:"📚",subjects:"Aptitude and analytical preparation",url:"https://www.nts.org.pk/"},
{name:"SAT",icon:"✏️",subjects:"Reading & Writing • Math",url:"https://satsuite.collegeboard.org/sat"},
{name:"University-specific tests",icon:"🏫",subjects:"Varies by university and program",url:"https://hec.gov.pk/"}
];

let authMode="create", profile=null, targets=[];

function loadData(){
 profile=JSON.parse(localStorage.getItem("uninexoraProfile")||"null");
 targets=JSON.parse(localStorage.getItem("uninexoraTargets")||"[]");
}
function saveData(){localStorage.setItem("uninexoraProfile",JSON.stringify(profile));localStorage.setItem("uninexoraTargets",JSON.stringify(targets))}
function renderUnis(){
 const q=$("#search").value.toLowerCase(),sector=$("#sector").value,city=$("#city").value,field=$("#field").value;
 const list=universities.filter(u=>(!q||[u.name,u.city,u.sector,...u.fields].join(" ").toLowerCase().includes(q))&&(!sector||u.sector===sector)&&(!city||u.city===city)&&(!field||u.fields.includes(field)));
 $("#count").textContent=`${list.length} universities`;
 $("#uniGrid").innerHTML=list.length?list.map(u=>`<article class="uni-card"><span class="pill">${u.sector}</span><h3>${u.name}</h3><div class="uni-meta">📍 ${u.city}</div><div class="tags">${u.fields.map(f=>`<span class="tag">${f}</span>`).join("")}</div><div class="card-actions"><a class="small" target="_blank" rel="noopener" href="${u.url}">Official site</a><button class="small" onclick='saveTarget(${JSON.stringify(u.name)})'>+ Save</button></div></article>`).join(""):`<div class="empty">No universities found.</div>`;
}
function setup(){
 const cities=[...new Set(universities.map(x=>x.city))].sort(),fields=[...new Set(universities.flatMap(x=>x.fields))].sort();
 $("#city").innerHTML='<option value="">All cities</option>'+cities.map(x=>`<option>${x}</option>`).join("");
 $("#field").innerHTML='<option value="">All fields</option>'+fields.map(x=>`<option>${x}</option>`).join("");
 ["search","sector","city","field"].forEach(id=>$("#"+id).addEventListener("input",renderUnis));
 renderUnis();
 $("#testGrid").innerHTML=tests.map(t=>`<article class="test"><div class="test-icon">${t.icon}</div><h2>${t.name}</h2><p>${t.subjects}</p><a target="_blank" rel="noopener" href="${t.url}">Official information →</a></article>`).join("");
}
function openAuth(){updateAuth();$("#authModal").hidden=false}
function closeAuth(){$("#authModal").hidden=true}
function switchAuth(){authMode=authMode==="create"?"login":"create";updateAuth()}
function updateAuth(){
 const create=authMode==="create";
 $("#authTitle").textContent=create?"Create your local profile":"Login to your local profile";
 $("#authName").style.display=create?"block":"none";
 $("#authAction").textContent=create?"Create profile":"Login";
 $("#authSwitch").innerHTML=create?`Already have a profile? <button onclick="switchAuth()">Login</button>`:`New here? <button onclick="switchAuth()">Create profile</button>`;
 $("#authMsg").textContent="";
}
function handleAuth(){
 const name=$("#authName").value.trim(),user=$("#authUser").value.trim(),pass=$("#authPass").value;
 if(user.length<3||pass.length<8||(authMode==="create"&&name.length<2)){ $("#authMsg").textContent="Use a valid name, username (3+ chars) and password (8+ chars).";return}
 if(authMode==="create"){
   profile={name,username:user,password:pass};
   targets=[];saveData();closeAuth();updateUI();
 }else{
   if(!profile||profile.username!==user||profile.password!==pass){$("#authMsg").textContent="Incorrect local username or password.";return}
   closeAuth();updateUI();
 }
}
function logout(){profile=null;targets=[];localStorage.removeItem("uninexoraProfile");localStorage.removeItem("uninexoraTargets");updateUI()}
function updateUI(){
 const logged=!!profile;
 $("#profileBtn").textContent=logged?`Logout (${profile.name})`:"Login";
 $("#trackerInfo").textContent=logged?`Logged in as ${profile.name}. Your profile and tracker are stored in this browser.`:"Create a local profile to organize your targets. Data stays in this browser.";
 renderTargets();
}
function saveTarget(name){
 if(!profile){openAuth();$("#authMsg").textContent="Create a local profile first to save targets.";return}
 $("#targetUni").value=name;$("#targetDeadline").value="";$("#targetTest").value="";$("#targetStatus").value="Researching";$("#targetModal").hidden=false;
}
function closeTarget(){$("#targetModal").hidden=true}
function saveTarget(){
 const name=$("#targetUni").value.trim();if(!name)return;
 targets.push({id:Date.now(),university:name,deadline:$("#targetDeadline").value,test:$("#targetTest").value,status:$("#targetStatus").value});
 saveData();closeTarget();renderTargets()
}
function renderTargets(){
 $("#tt").textContent=targets.length;$("#ta").textContent=targets.filter(x=>x.status==="Applied").length;$("#tp").textContent=targets.filter(x=>x.status==="Test planned").length;$("#td").textContent=targets.filter(x=>x.status==="Completed").length;
 $("#saved").textContent=targets.length;$("#applied").textContent=targets.filter(x=>x.status==="Applied").length;$("#upcoming").textContent=targets.filter(x=>x.test).length;
 $("#empty").style.display=targets.length?"none":"block";
 $("#targets").innerHTML=targets.map(t=>`<div class="target"><div><b>${t.university}</b><br><small>Deadline: ${t.deadline||"Not set"} • Test: ${t.test||"Not set"}</small></div><div><select onchange="changeStatus(${t.id},this.value)">${["Researching","Applied","Test planned","Completed"].map(s=>`<option ${s===t.status?"selected":""}>${s}</option>`).join("")}</select><button class="delete" onclick="deleteTarget(${t.id})">Delete</button></div></div>`).join("");
}
function changeStatus(id,status){const t=targets.find(x=>x.id===id);if(t){t.status=status;saveData();renderTargets()}}
function deleteTarget(id){targets=targets.filter(x=>x.id!==id);saveData();renderTargets()}
function percentage(){const a=+$("#po").value,t=+$("#pt").value;$("#pr").textContent=t&&a>=0&&a<=t?((a/t)*100).toFixed(2)+"%":"Enter valid marks."}
function merit(){const a=+$("#ma").value,aw=+$("#mw").value,t=+$("#mt").value,tw=+$("#tw").value;$("#mr").textContent=aw+tw===100?(a*aw/100+t*tw/100).toFixed(2)+"%":"Weights must total 100%."}
function score(){const a=+$("#sc").value,t=+$("#st").value;$("#sr").textContent=t&&a>=0&&a<=t?((a/t)*100).toFixed(2)+"%":"Enter valid values."}

document.addEventListener("DOMContentLoaded",()=>{
 loadData();setup();updateUI();
 $("#profileBtn").onclick=()=>profile?logout():openAuth();
 $("#authAction").onclick=handleAuth;
 $("#addBtn").onclick=()=>profile?($("#targetModal").hidden=false):openAuth();
 $("#hamburger").onclick=()=>$("#nav").classList.toggle("open");
 window.addEventListener("hashchange",()=>$("#nav").classList.remove("open"));
});
