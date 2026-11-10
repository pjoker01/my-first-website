/* PJ PREMIUM CINEMATIC HOME — dependency-free scroll-driven visual layer.
   If canvas or animation setup fails, the original homepage remains usable. */
(function(){
  'use strict';
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas,ctx,progressFill,label,stars=[],width=0,height=0,dpr=1,scrollTarget=0,scrollCurrent=0,raf=0,failed=false;
  function fallback(){document.body.classList.remove('pj-cinematic-ready');var stage=document.getElementById('pj-cinematic-stage');if(stage)stage.remove();var bar=document.getElementById('pj-cinematic-progress');if(bar)bar.remove();var tag=document.getElementById('pj-cinematic-label');if(tag)tag.remove();}
  function init(){
    try{
      var stage=document.createElement('div');stage.id='pj-cinematic-stage';stage.setAttribute('aria-hidden','true');
      canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');stage.appendChild(canvas);
      document.body.insertBefore(stage,document.body.firstChild);
      var bar=document.createElement('div');bar.id='pj-cinematic-progress';bar.setAttribute('aria-hidden','true');bar.innerHTML='<span></span>';document.body.appendChild(bar);progressFill=bar.firstElementChild;
      label=document.createElement('div');label.id='pj-cinematic-label';label.textContent='PJ WEB DEVELOPMENT · DIGITAL EXPERIENCES';label.setAttribute('aria-hidden','true');document.body.appendChild(label);
      ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});if(!ctx){fallback();return;}
      document.body.classList.add('pj-cinematic-ready');
      if(reduced){stage.style.display='none';bar.style.display='none';label.style.display='none';return;}
      resize();window.addEventListener('resize',resize,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});
      revealSections();window.addEventListener('load',revealSections,{once:true});
      if('IntersectionObserver'in window){
        var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.style.setProperty('--pj-reveal-y','0px');entry.target.style.setProperty('--pj-reveal-opacity','1');io.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -8% 0px'});
        document.querySelectorAll('.home-strip,.home-section,.home-solutions,.home-feature,.home-pricing,.home-faq,.home-cta').forEach(function(el){el.style.setProperty('--pj-reveal-y','28px');el.style.setProperty('--pj-reveal-opacity','.72');io.observe(el);});
      }
      onScroll();raf=requestAnimationFrame(render);
    }catch(e){fallback();}
  }
  function resize(){
    width=Math.max(1,window.innerWidth);height=Math.max(1,window.innerHeight);dpr=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    var count=Math.min(width<700?62:150,Math.max(36,Math.floor(width*height/9500)));
    stars=Array.from({length:count},function(){return{x:Math.random()*width,y:Math.random()*height,z:.15+Math.random()*.85,r:.35+Math.random()*1.15,p:Math.random()*6.28};});
  }
  function onScroll(){
    var max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    scrollTarget=Math.max(0,Math.min(1,window.scrollY/max));
    if(progressFill)progressFill.style.width=(scrollTarget*100).toFixed(2)+'%';
    if(label)label.classList.toggle('is-visible',scrollTarget>.08&&scrollTarget<.96);
  }
  function revealSections(){/* IntersectionObserver handles reveal when supported. */}
  function orb(x,y,r,alpha,rotation){
    ctx.save();ctx.translate(x,y);ctx.rotate(rotation);
    var halo=ctx.createRadialGradient(0,0,r*.2,0,0,r*1.85);
    halo.addColorStop(0,'rgba(255,205,133,'+(alpha*.22)+')');halo.addColorStop(.42,'rgba(255,115,62,'+(alpha*.13)+')');halo.addColorStop(1,'rgba(255,95,54,0)');
    ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,r*1.85,0,Math.PI*2);ctx.fill();
    for(var i=0;i<3;i++){
      ctx.beginPath();ctx.ellipse(0,0,r*(1.23+i*.17),r*(.32+i*.055),i*.17,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,190,117,'+(alpha*(.25-i*.055))+')';ctx.lineWidth=i===0?1.25:.75;ctx.stroke();
    }
    var sphere=ctx.createRadialGradient(-r*.35,-r*.4,r*.04,0,0,r);
    sphere.addColorStop(0,'rgba(255,247,211,'+alpha+')');sphere.addColorStop(.14,'rgba(255,194,112,'+alpha+')');sphere.addColorStop(.38,'rgba(255,116,57,'+(alpha*.98)+')');sphere.addColorStop(.68,'rgba(166,55,62,'+(alpha*.92)+')');sphere.addColorStop(1,'rgba(58,24,63,'+(alpha*.85)+')');
    ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.clip();
    var shine=ctx.createRadialGradient(-r*.38,-r*.45,0,-r*.38,-r*.45,r*.8);shine.addColorStop(0,'rgba(255,255,226,.55)');shine.addColorStop(1,'rgba(255,255,226,0)');ctx.fillStyle=shine;ctx.fillRect(-r,-r,r*2,r*2);
    ctx.strokeStyle='rgba(255,213,160,.18)';ctx.lineWidth=1;
    for(var j=-2;j<=2;j++){ctx.beginPath();ctx.ellipse(0,j*r*.22,r*.96,Math.max(2,r*.035),0,0,Math.PI*2);ctx.stroke();}
    ctx.restore();ctx.restore();
  }
  function render(time){
    if(failed)return;
    try{
      scrollCurrent+=(scrollTarget-scrollCurrent)*.065;
      ctx.clearRect(0,0,width,height);
      var p=scrollCurrent,small=width<700;
      var x=width*(small?.76:.79)-p*width*(small?.34:.38);
      var y=height*(small?.30:.43)+Math.sin(time*.00025)*8+p*height*.12;
      var radius=Math.min(width,height)*(small?.115:.16)*(1+p*.34);
      stars.forEach(function(s){var drift=(time*.004*s.z+p*height*.48)%(height+12);var sy=(s.y-drift+height+12)%(height+12)-6;var twinkle=.28+.45*(.5+.5*Math.sin(time*.001+s.p));ctx.beginPath();ctx.fillStyle='rgba(255,222,184,'+twinkle+')';ctx.arc(s.x+Math.sin(time*.0003+s.p)*7,sy,s.r*(.65+s.z*.45),0,Math.PI*2);ctx.fill();});
      // Subtle cinematic dust ribbons follow the scroll progress.
      ctx.save();ctx.translate(width*.5,height*.48);ctx.rotate(-.2+p*.7);
      for(var k=0;k<4;k++){ctx.beginPath();ctx.ellipse(0,0,Math.min(width,height)*(.33+k*.065),Math.min(width,height)*(.09+k*.018),k*.12,0,Math.PI*2);ctx.strokeStyle='rgba(255,172,101,'+(.035+p*.025)+')';ctx.lineWidth=1;ctx.stroke();}
      ctx.restore();
      orb(x,y,radius,.9-p*.22,time*.00012+p*.8);
      requestAnimationFrame(render);
    }catch(e){failed=true;fallback();}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();