const SUN = {
  name: "Sun", type: "G-type main-sequence star",
  description: "The Sun is the star at the center of our Solar System. Its gravity holds the planets, dwarf planets, asteroids and comets in orbit.",
  mass: "1.989 × 10³⁰ kg", diameter: "1,392,700 km", gravity: "274 m/s²",
  distance: "0 km", temperature: "5,500°C surface", moons: 0,
  color: "#ffd45b", radius: 27
};

const PLANETS = [
  {name:"Mercury",radius:5,orbit:58,speed:.040,color:"#a7a9ad",mass:"3.30 × 10²³ kg",diameter:"4,879 km",gravity:"3.7 m/s²",day:"58.6 Earth days",year:"88 Earth days",moons:0,distance:"57.9 million km",temperature:"167°C",description:"The smallest planet in our Solar System, Mercury races around the Sun faster than any other planet."},
  {name:"Venus",radius:8,orbit:88,speed:.030,color:"#e8ad70",mass:"4.87 × 10²⁴ kg",diameter:"12,104 km",gravity:"8.87 m/s²",day:"243 Earth days",year:"225 Earth days",moons:0,distance:"108.2 million km",temperature:"464°C",description:"Venus is the hottest planet, wrapped in a thick atmosphere that traps heat in an extreme greenhouse effect."},
  {name:"Earth",radius:9,orbit:118,speed:.025,color:"#398ce8",mass:"5.97 × 10²⁴ kg",diameter:"12,742 km",gravity:"9.8 m/s²",day:"24 hours",year:"365 days",moons:1,distance:"149.6 million km",temperature:"15°C average",description:"Our home planet is the only world known to support life, with liquid water on its surface and a protective atmosphere."},
  {name:"Mars",radius:7,orbit:148,speed:.020,color:"#df684e",mass:"6.39 × 10²³ kg",diameter:"6,779 km",gravity:"3.71 m/s²",day:"24.6 hours",year:"687 days",moons:2,distance:"227.9 million km",temperature:"−63°C average",description:"The Red Planet is a cold desert world with giant volcanoes, ancient river valleys and two small moons."},
  {name:"Jupiter",radius:19,orbit:197,speed:.013,color:"#d9ae83",mass:"1.90 × 10²⁷ kg",diameter:"139,820 km",gravity:"24.79 m/s²",day:"9.9 hours",year:"11.9 Earth years",moons:95,distance:"778.5 million km",temperature:"−108°C cloud tops",description:"Jupiter is the largest planet. Its swirling clouds include the Great Red Spot, a storm larger than Earth."},
  {name:"Saturn",radius:17,orbit:239,speed:.010,color:"#d9c18c",mass:"5.68 × 10²⁶ kg",diameter:"116,460 km",gravity:"10.44 m/s²",day:"10.7 hours",year:"29.5 Earth years",moons:146,distance:"1.43 billion km",temperature:"−139°C cloud tops",description:"Saturn is a gas giant famous for its spectacular rings, made mostly of countless pieces of ice and rock."},
  {name:"Uranus",radius:14,orbit:281,speed:.007,color:"#83d5d9",mass:"8.68 × 10²⁵ kg",diameter:"50,724 km",gravity:"8.69 m/s²",day:"17.2 hours",year:"84 Earth years",moons:27,distance:"2.87 billion km",temperature:"−197°C",description:"Uranus is an ice giant that rotates on its side, giving it some of the most extreme seasons in the Solar System."},
  {name:"Neptune",radius:14,orbit:323,speed:.005,color:"#4778e8",mass:"1.02 × 10²⁶ kg",diameter:"49,244 km",gravity:"11.15 m/s²",day:"16.1 hours",year:"165 Earth years",moons:14,distance:"4.5 billion km",temperature:"−201°C",description:"Neptune is a distant, deep-blue ice giant with supersonic winds and a dynamic atmosphere."},
  {name:"Pluto",radius:5,orbit:359,speed:.003,color:"#c7b9a9",mass:"1.31 × 10²² kg",diameter:"2,377 km",gravity:"0.62 m/s²",day:"6.4 Earth days",year:"248 Earth years",moons:5,distance:"5.9 billion km",temperature:"−229°C",description:"Pluto is a dwarf planet in the Kuiper Belt. Its heart-shaped glacier and five known moons make it a fascinating distant world."}
];

const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");
const details = document.getElementById("detailsContent");
const buttons = document.getElementById("planetButtons");
let width=0, height=0, dpr=1, centerX=0, centerY=0, orbitScale=1;
let paused=false, speedMultiplier=1, selected="Sun", lastTime=0;
let angles=PLANETS.map(()=>Math.random()*Math.PI*2);
let stars=[];

function resize() {
  const rect=canvas.getBoundingClientRect();
  dpr=Math.min(window.devicePixelRatio||1,2);
  width=rect.width; height=rect.height;
  canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  centerX=width/2; centerY=height/2;
  orbitScale=Math.min((width*.47)/359,(height*.46)/359,1.15);
  createStars();
}
function createStars() {
  stars=Array.from({length:Math.max(100,Math.floor(width*height/1800))},()=>({
    x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.15+.25,
    alpha:Math.random()*.65+.2,phase:Math.random()*Math.PI*2
  }));
}
function roundedGlow(x,y,r,color,blur=12) {
  ctx.save(); ctx.shadowBlur=blur; ctx.shadowColor=color; ctx.fillStyle=color;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
}
function drawBackground(t) {
  ctx.clearRect(0,0,width,height);
  const bg=ctx.createRadialGradient(centerX,centerY,5,centerX,centerY,Math.max(width,height)*.68);
  bg.addColorStop(0,"#111d38"); bg.addColorStop(.55,"#091226"); bg.addColorStop(1,"#050916");
  ctx.fillStyle=bg; ctx.fillRect(0,0,width,height);
  stars.forEach(s=>{
    const twinkle=.65+.35*Math.sin(t*.001+s.phase);
    ctx.globalAlpha=s.alpha*twinkle; ctx.fillStyle="#dceaff";
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
  });
  ctx.globalAlpha=1;
}
function planetPosition(p,i) {
  return {x:centerX+Math.cos(angles[i])*p.orbit*orbitScale,y:centerY+Math.sin(angles[i])*p.orbit*orbitScale*.78};
}
function drawSun() {
  const glow=ctx.createRadialGradient(centerX,centerY,5,centerX,centerY,75*orbitScale);
  glow.addColorStop(0,"rgba(255,210,87,.28)");glow.addColorStop(1,"rgba(255,177,48,0)");
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(centerX,centerY,75*orbitScale,0,Math.PI*2);ctx.fill();
  const grad=ctx.createRadialGradient(centerX-9,centerY-11,2,centerX,centerY,29*orbitScale);
  grad.addColorStop(0,"#fff4ba");grad.addColorStop(.45,"#ffd85c");grad.addColorStop(1,"#f39a2e");
  ctx.save();ctx.shadowColor="#ffb52e";ctx.shadowBlur=30*orbitScale;
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(centerX,centerY,27*orbitScale,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.fillStyle="#f8d77b";ctx.font="600 9px 'DM Mono',monospace";ctx.textAlign="center";
  ctx.fillText("SUN",centerX,centerY-39*orbitScale);
}
function drawSaturnRing(x,y,r) {
  ctx.save();ctx.translate(x,y);ctx.rotate(-.28);ctx.scale(1,.38);
  ctx.strokeStyle="rgba(220,197,151,.82)";ctx.lineWidth=Math.max(2,r*.45);
  ctx.beginPath();ctx.ellipse(0,0,r*1.9,r*1.05,0,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle="rgba(245,225,183,.48)";ctx.lineWidth=2;
  ctx.beginPath();ctx.ellipse(0,0,r*2.2,r*1.2,0,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function drawPlanet(p,i) {
  const pos=planetPosition(p,i), r=Math.max(2.4,p.radius*orbitScale);
  if(p.name==="Saturn") drawSaturnRing(pos.x,pos.y,r);
  roundedGlow(pos.x,pos.y,r,p.color,selected===p.name?19:8);
  const grad=ctx.createRadialGradient(pos.x-r*.4,pos.y-r*.45,1,pos.x,pos.y,r*1.3);
  grad.addColorStop(0,lighten(p.color));grad.addColorStop(1,darken(p.color));
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(pos.x,pos.y,r,0,Math.PI*2);ctx.fill();
  if(p.name==="Earth") {
    ctx.fillStyle="rgba(92,213,153,.8)";ctx.beginPath();ctx.ellipse(pos.x-r*.15,pos.y-r*.1,r*.34,r*.2,-.5,0,Math.PI*2);ctx.fill();
  }
  if(p.name==="Jupiter") {
    ctx.strokeStyle="rgba(130,75,49,.45)";ctx.lineWidth=Math.max(1,r*.12);
    ctx.beginPath();ctx.arc(pos.x,pos.y+r*.25,r*.65,.15,Math.PI-.15);ctx.stroke();
  }
  ctx.textAlign="center";ctx.font="9px 'DM Sans',sans-serif";
  ctx.fillStyle=selected===p.name?"#ffffff":"rgba(220,231,249,.78)";
  ctx.fillText(p.name,pos.x,pos.y-r-8);
  if(selected===p.name) {
    ctx.strokeStyle="rgba(117,217,237,.65)";ctx.lineWidth=1;ctx.setLineDash([3,4]);
    ctx.beginPath();ctx.arc(pos.x,pos.y,r+7,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  }
}
function lighten(hex) { return hex; }
function darken(hex) { return hex; }
function draw(t) {
  drawBackground(t);
  // Orbit paths
  PLANETS.forEach((p,i)=>{
    ctx.beginPath();ctx.ellipse(centerX,centerY,p.orbit*orbitScale,p.orbit*orbitScale*.78,0,0,Math.PI*2);
    ctx.strokeStyle=selected===p.name?"rgba(117,217,237,.28)":"rgba(140,164,205,.15)";
    ctx.lineWidth=selected===p.name?1.35:1;ctx.stroke();
  });
  drawSun();
  PLANETS.forEach(drawPlanet);
  if(!paused && lastTime) {
    const dt=Math.min((t-lastTime)/16.67,3);
    PLANETS.forEach((p,i)=>angles[i]+=p.speed*dt*speedMultiplier);
  }
  lastTime=t;
  requestAnimationFrame(draw);
}
function renderDetails(data) {
  const isSun=data.name==="Sun";
  document.querySelector(".panel-index").textContent=isSun?"01 — 10":`${String(PLANETS.findIndex(p=>p.name===data.name)+2).padStart(2,"0")} — 10`;
  details.innerHTML=`
    <p class="body-kicker">${isSun?"THE STAR AT OUR CENTER":"PLANETARY PROFILE"}</p>
    <div class="planet-title-row">
      <div class="planet-orb" style="background:${data.color};${data.name==="Saturn"?"box-shadow:inset -9px -7px 13px rgba(0,0,0,.38),0 0 0 5px rgba(217,193,140,.18)":""}"></div>
      <div><h2 class="planet-title">${data.name}</h2><div class="planet-type">${data.type|| (data.name==="Pluto"?"DWARF PLANET":"PLANET")}</div></div>
    </div>
    <p class="description">${data.description}</p>
    <div class="stats-grid">
      <div class="stat"><span class="stat-label">MASS</span><span class="stat-value">${data.mass}</span></div>
      <div class="stat"><span class="stat-label">DIAMETER</span><span class="stat-value">${data.diameter}</span></div>
      <div class="stat"><span class="stat-label">GRAVITY</span><span class="stat-value">${data.gravity}</span></div>
      <div class="stat"><span class="stat-label">DISTANCE FROM SUN</span><span class="stat-value">${data.distance}</span></div>
      <div class="stat"><span class="stat-label">TEMPERATURE</span><span class="stat-value">${data.temperature}</span></div>
      <div class="stat"><span class="stat-label">${isSun?"CLASS":"ORBITAL PERIOD"}</span><span class="stat-value">${isSun?"G2V":data.year}</span></div>
    </div>
    <div class="moons-row"><span>NATURAL MOONS</span><strong>${data.moons}</strong></div>
    ${!isSun?`<div class="moons-row"><span>ROTATION PERIOD</span><strong>${data.day}</strong></div>`:""}
  `;
}
function selectBody(name) {
  selected=name;
  const data=name==="Sun"?SUN:PLANETS.find(p=>p.name===name);
  renderDetails(data);
  document.querySelectorAll(".planet-chip").forEach(b=>b.classList.toggle("active",b.dataset.name===name));
}
function buildButtons() {
  const all=[SUN,...PLANETS];
  buttons.innerHTML=all.map((p,i)=>`<button class="planet-chip ${i===0?"active":""}" data-name="${p.name}" aria-label="View ${p.name}"><span class="chip-dot" style="background:${p.color};color:${p.color}"></span><span>${p.name}</span></button>`).join("");
  buttons.addEventListener("click",e=>{
    const btn=e.target.closest(".planet-chip");if(btn)selectBody(btn.dataset.name);
  });
}
function pointerPosition(e) {
  const rect=canvas.getBoundingClientRect();
  return {x:e.clientX-rect.left,y:e.clientY-rect.top};
}
canvas.addEventListener("click",e=>{
  const {x,y}=pointerPosition(e);
  const sunHit=Math.hypot(x-centerX,y-centerY)<Math.max(27*orbitScale+9,18);
  if(sunHit){selectBody("Sun");return;}
  for(let i=PLANETS.length-1;i>=0;i--){
    const p=PLANETS[i],pos=planetPosition(p,i);
    if(Math.hypot(x-pos.x,y-pos.y)<Math.max(p.radius*orbitScale+9,13)){selectBody(p.name);return;}
  }
});
document.getElementById("togglePlay").addEventListener("click",()=>{
  paused=!paused;
  document.getElementById("playIcon").textContent=paused?"▶":"Ⅱ";
  document.getElementById("playText").textContent=paused?"RESUME":"PAUSE";
  if(!paused)lastTime=0;
});
speedRange.addEventListener("input",()=>{
  speedMultiplier=Number(speedRange.value);
  speedValue.textContent=speedMultiplier.toFixed(2)+"×";
});
document.getElementById("resetView").addEventListener("click",()=>{
  angles=PLANETS.map(()=>Math.random()*Math.PI*2);speedRange.value=1;
  speedMultiplier=1;speedValue.textContent="1.00×";
  paused=false;document.getElementById("playIcon").textContent="Ⅱ";
  document.getElementById("playText").textContent="PAUSE";lastTime=0;selectBody("Sun");
});
window.addEventListener("resize",resize);
buildButtons();renderDetails(SUN);resize();requestAnimationFrame(draw);
