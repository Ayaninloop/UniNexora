const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const universities=[
{name:"NUST",city:"Islamabad",sector:"Public",fields:["Computing","Engineering","Business","Science"],url:"https://nust.edu.pk/",desc:"National University of Sciences and Technology."},
{name:"FAST-NUCES",city:"Islamabad",sector:"Private",fields:["Computing","Engineering","Business"],url:"https://www.nu.edu.pk/",desc:"University network known for computing, engineering and business programs."},
{name:"UET Lahore",city:"Lahore",sector:"Public",fields:["Engineering","Computing","Science"],url:"https://uet.edu.pk/",desc:"Engineering-focused public university with a broad technical portfolio."},
{name:"COMSATS University Islamabad",city:"Islamabad",sector:"Public",fields:["Computing","Engineering","Business","Science"],url:"https://www.comsats.edu.pk/",desc:"Multi-campus public university with strong STEM and business offerings."},
{name:"LUMS",city:"Lahore",sector:"Private",fields:["Business","Computing","Science","General"],url:"https://lums.edu.pk/",desc:"Private research university with multidisciplinary undergraduate programs."},
{name:"University of the Punjab",city:"Lahore",sector:"Public",fields:["Computing","Science","Business","General"],url:"https://pu.edu.pk/",desc:"Large public university offering programs across many disciplines."},
{name:"GIKI",city:"Topi",sector:"Private",fields:["Engineering","Computing","Science"],url:"https://giki.edu.pk/",desc:"Residential institute focused on engineering, computing and sciences."},
{name:"PIEAS",city:"Islamabad",sector:"Public",fields:["Engineering","Science"],url:"https://pieas.edu.pk/",desc:"Public institute focused on engineering and physical sciences."},
{name:"Air University",city:"Islamabad",sector:"Public",fields:["Computing","Engineering","Business"],url:"https://www.au.edu.pk/",desc:"University offering computing, engineering and management programs."},
{name:"UET Peshawar",city:"Peshawar",sector:"Public",fields:["Engineering","Computing","Science"],url:"https://www.uetpeshawar.edu.pk/",desc:"Public engineering university with technical and computing programs."}
];

const tests=[
{name:"ECAT",body:"University of Engineering and Technology route",subjects:["Mathematics","Physics","Chemistry / Computer Science","English"],note:"Check the current UET admission notice for the applicable combination."},
{name:"NUST NET",body:"NUST undergraduate admission test",subjects:["Mathematics","Physics","English","Intelligence / relevant section"],note:"Test composition varies by degree group; verify the current official notice."},
{name:"FAST Admission Test",body:"FAST-NUCES undergraduate route",subjects:["Mathematics","Analytical / logical reasoning","English","Basic relevant concepts"],note:"FAST may also accept specified alternative testing routes; check the current policy."},
{name:"COMSATS Admission Test",body:"COMSATS undergraduate admissions",subjects:["Mathematics","Physics / relevant subject","English","Analytical / other sections"],note:"Exact sections depend on the current admission cycle and program."}
];

const keys={profile:"uninexoraProfile",targets:"uninexoraTargets",theme:"uninexoraTheme"};
let profile=JSON.parse(localStorage.getItem(keys.profile)||"null");
let targets=JSON.parse(localStorage.getItem(keys.targets)||"[]");

function save(){localStorage.setItem(keys.profile,JSON.stringify(profile));localStorage.setItem(keys.targets,JSON.stringify(targets));}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2200)}
function showPage(){
  const id=location.hash.replace("#","")||"home";
  const page=document.getElementById(id)?id:"home";
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===page));
  $("#mainNav").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
  renderAll();
}
window.addEventListener("hashchange",showPage);

function openModal(id){$("#"+id).classList.add("open")}
function closeModal(id){$("#"+id).classList.remove("open")}
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));

function renderProfile(){
  $("#profileBtn").textContent=profile?`Logout (${profile.name.split(" ")[0]})`:"Create Profile";
  $("#heroProfile").textContent=profile?profile.name:"Guest";
  $("#logoutBtn").style.display=profile?"block":"none";
  $("#profileName").value=profile?.name||"";
  $("#profileEmail").value=profile?.email||"";
}
$("#profileBtn").addEventListener("click",()=>{
  if(profile){profile=null;save();renderAll();toast("Logged out on this browser.");}
  else openModal("profileModal");
});
$("#saveProfile").addEventListener("click",()=>{
  const name=$("#profileName").value.trim();
  if(!name){toast("Please enter your name.");return}
  profile={name,email:$("#profileEmail").value.trim()};
  save();closeModal("profileModal");renderAll();toast("Profile saved locally.");
});
$("#logoutBtn").addEventListener("click",()=>{$("#profileBtn").click();closeModal("profileModal")});

function openTarget(name=""){ $("#targetUni").value=name; $("#targetStatus").value="Planning"; openModal("targetModal"); }
function saveTarget(){
  const name=$("#targetUni").value.trim(); if(!name){toast("Enter a university name.");return}
  if(targets.some(t=>t.name.toLowerCase()===name.toLowerCase())){toast("That university is already tracked.");return}
  targets.push({id:Date.now(),name,status:$("#targetStatus").value});save();closeModal("targetModal");renderAll();toast("University added to tracker.");
}
$("#saveTarget").addEventListener("click",saveTarget);
$("#addTargetBtn").addEventListener("click",()=>openTarget());

function updateTarget(id,status){const t=targets.find(x=>x.id===id);if(t){t.status=status;save();renderAll();toast("Tracker updated.")}}
function deleteTarget(id){targets=targets.filter(x=>x.id!==id);save();renderAll();toast("Target removed.")}

function renderTracker(){
  const done=targets.filter(t=>t.status==="Admitted"||t.status==="Test completed").length;
  const inProg=targets.filter(t=>t.status!=="Admitted").length;
  $("#tTotal").textContent=targets.length;$("#tProgress").textContent=inProg;$("#tCompleted").textContent=done;
  $("#hTargets").textContent=targets.length;$("#hDone").textContent=done;$("#hSaved").textContent=targets.length;
  const pct=targets.length?Math.round(done/targets.length*100):0;$("#heroProgress").textContent=pct+"%";
  $(".progress-ring").style.background=`radial-gradient(circle at center,#07110e 58%,transparent 59%),conic-gradient(#21e49d ${pct*3.6}deg,#182923 0deg)`;
  $("#targets").innerHTML=targets.map(t=>`<div class="target-row"><div><strong>${escapeHtml(t.name)}</strong><small>Admission target</small></div><select onchange="updateTarget(${t.id},this.value)">${["Planning","Preparing","Applied","Test completed","Admitted"].map(s=>`<option ${s===t.status?"selected":""}>${s}</option>`).join("")}</select><button class="text-btn danger" onclick="deleteTarget(${t.id})">Remove</button></div>`).join("");
  $("#emptyState").style.display=targets.length?"none":"block";
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function renderUniversities(){
  const q=$("#uniSearch").value.toLowerCase().trim(),sector=$("#sectorFilter").value,city=$("#cityFilter").value,field=$("#fieldFilter").value;
  const list=universities.filter(u=>(!q||[u.name,u.city,...u.fields].join(" ").toLowerCase().includes(q))&&(!sector||u.sector===sector)&&(!city||u.city===city)&&(!field||u.fields.includes(field)));
  $("#uniCount").textContent=`${list.length} universit${list.length===1?"y":"ies"}`;
  $("#uniGrid").innerHTML=list.map(u=>`<article class="uni-card"><span class="tag">${u.sector}</span><h3>${escapeHtml(u.name)}</h3><div class="meta">⌖ ${escapeHtml(u.city)}</div><p>${escapeHtml(u.desc)}</p><div class="chips">${u.fields.map(f=>`<span class="chip">${f}</span>`).join("")}</div><div class="card-actions"><a class="small-btn green" href="${u.url}" target="_blank" rel="noopener">Official site ↗</a><button class="small-btn" onclick="openTarget(${JSON.stringify(u.name)})">+ Track</button></div></article>`).join("")||`<div class="empty-state" style="grid-column:1/-1"><h3>No matches</h3><p>Try clearing a filter or using a broader search.</p></div>`;
}
["uniSearch","sectorFilter","cityFilter","fieldFilter"].forEach(id=>$("#"+id).addEventListener("input",renderUniversities));
$("#clearFilters").addEventListener("click",()=>{$("#uniSearch").value="";$("#sectorFilter").value="";$("#cityFilter").value="";$("#fieldFilter").value="";renderUniversities()});
[...new Set(universities.map(u=>u.city))].sort().forEach(c=>$("#cityFilter").insertAdjacentHTML("beforeend",`<option>${c}</option>`));

function renderTests(){$("#testGrid").innerHTML=tests.map(t=>`<article class="test-card"><span class="kicker">${t.name}</span><h3>${t.body}</h3><ul>${t.subjects.map(s=>`<li>${s}</li>`).join("")}</ul><p><strong>Planning note:</strong> ${t.note}</p></article>`).join("")}

$("#pctBtn").addEventListener("click",()=>{const a=+$("#pctObt").value,b=+$("#pctTotal").value;if(b<=0){toast("Enter valid marks.");return}$("#pctAns").textContent=(a/b*100).toFixed(2)+"%"});
$("#meritBtn").addEventListener("click",()=>{const a=+$("#meritAcademic").value,aw=+$("#meritAw").value,t=+$("#meritTest").value,tw=+$("#meritTw").value;if(aw+tw!==100){toast("Weights must total 100%.");return}$("#meritAns").textContent=(a*aw/100+t*tw/100).toFixed(2)+"% weighted merit"});
$("#scoreBtn").addEventListener("click",()=>{const c=+$("#scoreCorrect").value,w=+$("#scoreWrong").value,n=+$("#scoreTotal").value,neg=+$("#scoreNeg").value;if(n<=0){toast("Enter total questions.");return}const score=Math.max(0,c-w*neg);$("#scoreAns").textContent=`${score.toFixed(2)} marks • ${(score/n*100).toFixed(2)}%`});

$("#menuBtn").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#themeBtn").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem(keys.theme,document.body.classList.contains("light")?"light":"dark")});
if(localStorage.getItem(keys.theme)==="light")document.body.classList.add("light");
$("#year").textContent=new Date().getFullYear();

function renderAll(){renderProfile();renderTracker();renderUniversities();renderTests()}
document.addEventListener("DOMContentLoaded",()=>{renderAll();showPage()});
