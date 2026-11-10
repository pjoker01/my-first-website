import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

(() => {
  const section=document.querySelector("#pj-cinema"), canvas=document.querySelector("#pj-cinema-canvas");
  if(!section||!canvas)return;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.setSize(canvas.clientWidth||innerWidth,canvas.clientHeight||innerHeight,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x090812,.022);
  const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,140);camera.position.set(0,1.1,9);
  scene.add(new THREE.HemisphereLight(0xb9b9ff,0x160c17,2.0));
  const key=new THREE.PointLight(0xffa35d,95,38);key.position.set(2,4,5);scene.add(key);
  const cool=new THREE.PointLight(0x777bff,85,35);cool.position.set(-5,1,-13);scene.add(cool);
  const gold=new THREE.MeshStandardMaterial({color:0xffa45d,metalness:.78,roughness:.23,emissive:0x8c3512,emissiveIntensity:.55});
  const glass=new THREE.MeshPhysicalMaterial({color:0x9b8dff,metalness:.35,roughness:.12,transparent:true,opacity:.34,transmission:.35,thickness:.6,emissive:0x29204f,emissiveIntensity:.5});
  const dark=new THREE.MeshStandardMaterial({color:0x151525,metalness:.68,roughness:.27,emissive:0x17102c,emissiveIntensity:.65});
  const white=new THREE.MeshStandardMaterial({color:0xf7dfc3,metalness:.4,roughness:.25,emissive:0x3d2017,emissiveIntensity:.3});
  const groups=[];
  function group(z){const g=new THREE.Group();g.position.z=z;scene.add(g);groups.push(g);return g}
  function box(g,x,y,z,w,h,d,mat,rx=0,ry=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.rotation.set(rx,ry,0);g.add(m);return m}
  function ring(g,r,t,x,y,z,mat,rx=0,ry=0){const m=new THREE.Mesh(new THREE.TorusGeometry(r,t,16,120),mat);m.position.set(x,y,z);m.rotation.set(rx,ry,0);g.add(m);return m}
  function orb(g,x,y,z,r,mat){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,5),mat);m.position.set(x,y,z);g.add(m);return m}
  // Chapter 1 — a dimensional website portal assembling in space.
  let g=group(0);ring(g,2.5,.018,1.5,.1,0,gold,.25,-.35);ring(g,2.9,.012,1.5,.1,-.25,white,.25,.28);
  box(g,1.5,.1,0,3.5,2.35,.16,glass,0,-.12);box(g,1.5,.1,.12,3.24,2.1,.035,dark,0,-.12);
  box(g,1.5,.68,.16,2.7,.12,.035,gold,0,-.12);box(g,.75,.18,.16,1.05,.07,.035,white,0,-.12);box(g,.65,-.18,.16,.85,.045,.035,glass,0,-.12);
  for(let i=0;i<3;i++){box(g,.58+i*.78,-.58,.16,.58,.48,.045,i===1?gold:glass,0,-.12)}
  orb(g,-1.2,-.9,.2,.44,gold);orb(g,3.7,1.35,-.4,.24,white);
  // Chapter 2 — commerce: a floating store and product display plinths.
  g=group(-13);ring(g,2.8,.025,1.2,0,0,gold,.25,.1);
  box(g,1.2,.35,0,3.4,2.3,.24,dark,0,-.08);box(g,1.2,1.55,.02,3.7,.18,.42,gold,0,-.08);
  for(let i=0;i<4;i++){const p=box(g,-.05+i*.83,.15,.35,.58,.85,.58,i%2?glass:gold,.08,.05);p.position.y=.15+(i%2)*.16}
  for(let i=0;i<3;i++){const pl=box(g,.2+i*1.2,-1.25,.1,.9,.16,.9,dark);ring(g,.28,.018,.2+i*1.2,-1.14,.12,white,Math.PI/2,0)}
  orb(g,3.4,1.7,-.4,.38,gold);
  // Chapter 3 — AI: a radiant intelligence core surrounded by orbiting data nodes.
  g=group(-26);const core=orb(g,1.1,.15,0,1.18,new THREE.MeshPhysicalMaterial({color:0xffb46f,metalness:.22,roughness:.12,emissive:0xf05d2c,emissiveIntensity:1.25,clearcoat:1}));
  for(let i=0;i<5;i++){ring(g,1.75+i*.25,.012,1.1,.15,0,i%2?glass:gold,.25+i*.15,i*.38)}
  for(let i=0;i<12;i++){const a=i*Math.PI*2/12;orb(g,1.1+Math.cos(a)*2.2,.15+Math.sin(a)*1.45,Math.sin(a*2)*.5,.075,i%3?white:gold)}
  // Chapter 4 — connected business systems: a constellation of linked modules.
  g=group(-39);ring(g,2.8,.018,1.1,.1,0,gold,.8,.2);
  const nodes=[];for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const n=orb(g,1.1+Math.cos(a)*2.15,.1+Math.sin(a)*1.65,Math.sin(a*2)*.35,.22,i%2?glass:gold);nodes.push(n);box(g,n.position.x,n.position.y-.42,n.position.z,.58,.045,.5,dark)}
  const lineMat=new THREE.LineBasicMaterial({color:0xffbd7d,transparent:true,opacity:.52});
  for(let i=0;i<nodes.length;i++){const pts=[nodes[i].position,nodes[(i+2)%nodes.length].position];g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),lineMat))}
  // Star particles add depth, not the main event.
  const count=950,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*24;positions[i*3+1]=(Math.random()-.5)*13;positions[i*3+2]=-Math.random()*52}
  const starGeo=new THREE.BufferGeometry();starGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xdac5ff,size:.025,transparent:true,opacity:.72}));scene.add(stars);
  const copy=[
    ["A DIGITAL WORLD, BUILT AROUND YOU","Your next idea<br><em>starts here.</em>","Move through the PJ universe. Discover websites, online stores, AI assistants and smarter business tools.","services.html"],
    ["01 / YOUR DIGITAL PRESENCE","Make your first<br><em>impression count.</em>","A dimensional online home designed to make your business look credible, explain what you do and turn visits into enquiries.","services.html"],
    ["02 / COMMERCE WITHOUT BORDERS","Bring your products<br><em>to life.</em>","Showcase products, guide shoppers and create a smoother path from discovery to order with an online store.","online-store-development-south-africa.html"],
    ["03 / INTELLIGENCE THAT WORKS","A smarter way<br><em>to connect.</em>","Give customers answers around the clock with a tailored AI assistant that understands your business.","ai-chat-assistants-businesses.html"],
    ["04 / CONNECT THE PIECES","Build beyond<br><em>the website.</em>","Bring enquiries, customer journeys and useful business workflows together — starting with what your business actually needs.","contact.html"]
  ];
  const kicker=document.querySelector("#pj-cinema-kicker"),title=document.querySelector("#pj-cinema-title"),desc=document.querySelector("#pj-cinema-desc"),link=document.querySelector("#pj-cinema-link"),bar=document.querySelector("#pj-cinema-progress"),countEl=document.querySelector("#pj-cinema-count"),copyEl=document.querySelector(".pj-cinema-copy");
  let target=0,current=0,lastChapter=-1,raf=0;
  function resize(){const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.fov=w<760?54:42;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.setSize(w,h,false)}
  function measure(){const rect=section.getBoundingClientRect();const travel=section.offsetHeight-innerHeight;target=Math.max(0,Math.min(1,-rect.top/Math.max(1,travel)))}
  function updateCopy(chapter){if(chapter===lastChapter)return;lastChapter=chapter;const c=copy[chapter];copyEl.style.opacity="0";setTimeout(()=>{kicker.textContent=c[0];title.innerHTML=c[1];desc.textContent=c[2];link.href=c[3];countEl.innerHTML=String(chapter+1).padStart(2,"0")+" <i>/ 05</i>";copyEl.style.opacity="1"},160)}
  function frame(){raf=0;current+=(target-current)*.075;const p=current;camera.position.x=THREE.MathUtils.lerp(-.2,1.2,p);camera.position.y=1.0+Math.sin(p*Math.PI*2)*.28;camera.position.z=9-p*49;camera.rotation.y=-.035+Math.sin(p*Math.PI*2)*.035;camera.rotation.x=.025+Math.cos(p*Math.PI*2)*.018;
    groups.forEach((o,i)=>{const local=Math.max(0,1-Math.abs((p*4)-i)*.8);o.rotation.y+=(.16+local*.2-o.rotation.y)*.025;o.rotation.x=Math.sin(performance.now()*.00025+i)*.035;o.scale.setScalar(.78+local*.22)});
    core.rotation.y+=.004;stars.rotation.z=p*.12;bar.style.width=(p*100)+"%";const chapter=Math.min(4,Math.floor(p*4.999));updateCopy(chapter);
    renderer.render(scene,camera);if(Math.abs(target-current)>.0005||!reduced)raf=requestAnimationFrame(frame);
  }
  function onScroll(){measure();if(!raf)raf=requestAnimationFrame(frame)}
  addEventListener("resize",resize,{passive:true});addEventListener("scroll",onScroll,{passive:true});resize();measure();updateCopy(0);frame();
  if(reduced){section.style.height="auto";document.querySelector(".pj-cinema-stage").style.position="relative";document.querySelector(".pj-cinema-stage").style.height="680px";camera.position.z=9;target=current=0}
})();
