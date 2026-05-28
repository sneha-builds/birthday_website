

// ===== FLOATING ELEMENTS =====
(function createFloaters(){
  const c=document.getElementById('floaterContainer');
  const items=['\uD83C\uDF88','\uD83C\uDF88','\uD83C\uDF88','\uD83C\uDF88','\uD83D\uDC96','\u2728','\u2B50','\uD83C\uDF38','\uD83D\uDD4A\uFE0F','\uD83C\uDF89'];
  for(let i=25;i--;){
    const e=document.createElement('div');
    e.className='float-item';
    e.textContent=items[i%items.length];
    e.style.cssText=`left:${Math.random()*100}%;--d:${12+Math.random()*18}s;--delay:${Math.random()*20}s;font-size:${1.4+Math.random()*2}rem`;
    c.appendChild(e);
  }
})();

// ===== CONFETTI =====
const canvas=document.getElementById('confetti-canvas');
const ctx=canvas.getContext('2d');
let pieces=[],burstPieces=[],running=false,burstRunning=false;
let continuousId=null;

function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
addEventListener('resize',resize);resize();

class Piece{
  constructor(slow){
    this.x=Math.random()*canvas.width;
    this.y=slow?-Math.random()*canvas.height: -Math.random()*canvas.height*1.5;
    this.w=slow?2+Math.random()*4: 4+Math.random()*10;
    this.h=slow?2+Math.random()*4: 4+Math.random()*10;
    this.color=slow?['#ffd1dc','#ff6b9d','#ff1493','#fff','#fbc2eb','#a18cd1','#ff9a9e'][Math.floor(Math.random()*7)]: `hsl(${Math.random()*360},75%,55%)`;
    this.vy=slow?.3+Math.random()*1: 1.5+Math.random()*4;
    this.vx=slow?(Math.random()-.5)*.5: (Math.random()-.5)*3;
    this.r=Math.random()*360;
    this.rs=slow?(Math.random()-.5)*3: (Math.random()-.5)*12;
    this.o=1;
    this.slow=slow;
  }
  update(){
    this.y+=this.vy;this.x+=this.vx;this.r+=this.rs;
    if(!this.slow){this.vy+=.04;this.o-=.003}
    return this.o>0&&this.y<canvas.height+60
  }
  draw(){
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.r*Math.PI/180);
    ctx.globalAlpha=Math.max(0,this.o);
    ctx.fillStyle=this.color;
    ctx.fillRect(-this.w/2,-this.h/2,this.w,this.h);
    ctx.restore();
  }
}

function startContinuous(){
  function add(){
    for(let i=3;i--;)pieces.push(new Piece(true));
    continuousId=setTimeout(add,400);
  }
  add();
  if(!running){running=true;animCont();}
}

function animCont(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces=pieces.filter(p=>p.update());
  burstPieces=burstPieces.filter(p=>p.update());
  pieces.forEach(p=>p.draw());
  burstPieces.forEach(p=>p.draw());
  if(pieces.length||burstPieces.length){requestAnimationFrame(animCont)}
  else{running=false;ctx.clearRect(0,0,canvas.width,canvas.height);}
}

function burst(){
  for(let i=300;i--;)burstPieces.push(new Piece(false));
  if(!running){running=true;animCont();}
}

// ===== MUSIC (Web Audio API) =====
let actx=null,playing=false,songTimer=null;

function initAudio(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)}

function note(freq,dur,time,type='sine',gain=.1){
  const o=actx.createOscillator(),g=actx.createGain();
  o.type=type;o.frequency.setValueAtTime(freq,time);
  g.gain.setValueAtTime(gain,time);
  g.gain.exponentialRampToValueAtTime(.001,time+dur);
  o.connect(g);g.connect(actx.destination);
  o.start(time);o.stop(time+dur);
}

function playSong(){
  initAudio();
  if(actx.state==='suspended')actx.resume();
  const t=actx.currentTime;
  const mel=[
    [392,.3],[392,.3],[440,.45],[392,.45],[523,.45],[494,.6],
    [0,.15],[392,.3],[392,.3],[440,.45],[392,.45],[587,.45],[523,.6],
    [0,.15],[392,.3],[392,.3],[784,.5],[659,.45],[523,.4],[494,.4],[440,.5],
    [0,.15],[698,.3],[698,.3],[659,.45],[523,.4],[587,.4],[523,.65],
  ];
  let time=t;
  mel.forEach(([f,d])=>{
    if(f>0){
      note(f,d,time,'sine',.10);
      note(f,d,time,'triangle',.04);
    }
    time+=d+.04;
  });
  time+=.6;
  mel.forEach(([f,d])=>{
    if(f>0)note(f*1.5,d*1.1,time,'sine',.05);
    time+=d+.04;
  });
}

function toggleMusic(){
  const btn=document.getElementById('musicBtn');
  if(playing){
    playing=false;
    btn.textContent='\uD83D\uDD07';
    if(songTimer){clearInterval(songTimer);songTimer=null}
  }else{
    playing=true;
    btn.textContent='\uD83C\uDFB5';
    initAudio();
    playSong();
    songTimer=setInterval(playSong,28000);
  }
}

// ===== START CONTINUOUS CONFETTI ON LOAD =====
startContinuous();

// ===== OPEN CARD =====
let opened=false;
function openCard(){
  if(opened)return;opened=true;
  if(continuousId){clearTimeout(continuousId);continuousId=null}
  const cover=document.getElementById('cover');
  const inside=document.getElementById('inside');
  cover.classList.add('hidden');
  setTimeout(()=>{
    inside.classList.add('show');
    burst();
  },700);
  setTimeout(()=>{if(!playing)toggleMusic()},1200);
}

document.getElementById('inside').addEventListener('click',function(e){
  if(e.target===this||e.target.closest('.inside-content'))burst();
});
