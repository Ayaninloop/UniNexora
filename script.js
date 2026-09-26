const universities = [
  {name:"FAST-NUCES", city:"Lahore • Islamabad • Karachi", type:"Computing & Engineering", code:"FAST"},
  {name:"NUST", city:"Islamabad", type:"Engineering • CS • Sciences", code:"NU"},
  {name:"UET Lahore", city:"Lahore • KSK", type:"Engineering & Technology", code:"UET"},
  {name:"COMSATS", city:"Islamabad • Lahore • Other campuses", type:"Computing • Engineering", code:"CI"},
  {name:"University of the Punjab", city:"Lahore", type:"Public University", code:"PU"},
  {name:"GIKI", city:"Topi, KPK", type:"Engineering • Computing", code:"GK"},
  {name:"LUMS", city:"Lahore", type:"Business • CS • Sciences", code:"LU"},
  {name:"PIEAS", city:"Islamabad", type:"Engineering • Sciences", code:"PI"}
];

const grid = document.getElementById("uni-grid");
const search = document.getElementById("search");

function render(list){
  grid.innerHTML = list.map(u => `
    <article class="card">
      <div class="uni-logo">${u.code}</div>
      <h3>${u.name}</h3>
      <p>${u.city}</p>
      <span class="tag">${u.type}</span>
    </article>`).join("");
}
render(universities);

search.addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  render(universities.filter(u => (u.name+" "+u.city+" "+u.type).toLowerCase().includes(q)));
});

document.getElementById("calc").addEventListener("submit", e => {
  e.preventDefault();
  const m = Number(document.getElementById("matric").value);
  const i = Number(document.getElementById("inter").value);
  const t = Number(document.getElementById("test").value);
  const total = m*.10 + i*.40 + t*.50;
  document.getElementById("result").textContent = `Example aggregate: ${total.toFixed(2)}%`;
});

document.getElementById("email-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("Thanks! This demo form is ready to connect to an email service later.");
});

document.querySelector(".menu-btn").addEventListener("click", () => {
  document.querySelector(".nav").classList.toggle("open");
});
