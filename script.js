

// // ===== FLOATING ELEMENTS =====
// (function createFloaters(){
//   const c=document.getElementById('floaterContainer');
//   const items=['\uD83C\uDF88','\uD83C\uDF88','\uD83C\uDF88','\uD83C\uDF88','\uD83D\uDC96','\u2728','\u2B50','\uD83C\uDF38','\uD83D\uDD4A\uFE0F','\uD83C\uDF89'];
//   for(let i=25;i--;){
//     const e=document.createElement('div');
//     e.className='float-item';
//     e.textContent=items[i%items.length];
//     e.style.cssText=`left:${Math.random()*100}%;--d:${12+Math.random()*18}s;--delay:${Math.random()*20}s;font-size:${1.4+Math.random()*2}rem`;
//     c.appendChild(e);
//   }
// })();

// // ===== CONFETTI =====
// const canvas=document.getElementById('confetti-canvas');
// const ctx=canvas.getContext('2d');
// let pieces=[],burstPieces=[],running=false,burstRunning=false;
// let continuousId=null;

// function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
// addEventListener('resize',resize);resize();

// class Piece{
//   constructor(slow){
//     this.x=Math.random()*canvas.width;
//     this.y=slow?-Math.random()*canvas.height: -Math.random()*canvas.height*1.5;
//     this.w=slow?2+Math.random()*4: 4+Math.random()*10;
//     this.h=slow?2+Math.random()*4: 4+Math.random()*10;
//     this.color=slow?['#ffd1dc','#ff6b9d','#ff1493','#fff','#fbc2eb','#a18cd1','#ff9a9e'][Math.floor(Math.random()*7)]: `hsl(${Math.random()*360},75%,55%)`;
//     this.vy=slow?.3+Math.random()*1: 1.5+Math.random()*4;
//     this.vx=slow?(Math.random()-.5)*.5: (Math.random()-.5)*3;
//     this.r=Math.random()*360;
//     this.rs=slow?(Math.random()-.5)*3: (Math.random()-.5)*12;
//     this.o=1;
//     this.slow=slow;
//   }
//   update(){
//     this.y+=this.vy;this.x+=this.vx;this.r+=this.rs;
//     if(!this.slow){this.vy+=.04;this.o-=.003}
//     return this.o>0&&this.y<canvas.height+60
//   }
//   draw(){
//     ctx.save();
//     ctx.translate(this.x,this.y);
//     ctx.rotate(this.r*Math.PI/180);
//     ctx.globalAlpha=Math.max(0,this.o);
//     ctx.fillStyle=this.color;
//     ctx.fillRect(-this.w/2,-this.h/2,this.w,this.h);
//     ctx.restore();
//   }
// }

// function startContinuous(){
//   function add(){
//     for(let i=3;i--;)pieces.push(new Piece(true));
//     continuousId=setTimeout(add,400);
//   }
//   add();
//   if(!running){running=true;animCont();}
// }

// function animCont(){
//   ctx.clearRect(0,0,canvas.width,canvas.height);
//   pieces=pieces.filter(p=>p.update());
//   burstPieces=burstPieces.filter(p=>p.update());
//   pieces.forEach(p=>p.draw());
//   burstPieces.forEach(p=>p.draw());
//   if(pieces.length||burstPieces.length){requestAnimationFrame(animCont)}
//   else{running=false;ctx.clearRect(0,0,canvas.width,canvas.height);}
// }

// function burst(){
//   for(let i=300;i--;)burstPieces.push(new Piece(false));
//   if(!running){running=true;animCont();}
// }

// // ===== MUSIC (Web Audio API) =====
// let actx=null,playing=false,songTimer=null;

// function initAudio(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)}

// function note(freq,dur,time,type='sine',gain=.1){
//   const o=actx.createOscillator(),g=actx.createGain();
//   o.type=type;o.frequency.setValueAtTime(freq,time);
//   g.gain.setValueAtTime(gain,time);
//   g.gain.exponentialRampToValueAtTime(.001,time+dur);
//   o.connect(g);g.connect(actx.destination);
//   o.start(time);o.stop(time+dur);
// }

// function playSong(){
//   initAudio();
//   if(actx.state==='suspended')actx.resume();
//   const t=actx.currentTime;
//   const mel=[
//     [392,.3],[392,.3],[440,.45],[392,.45],[523,.45],[494,.6],
//     [0,.15],[392,.3],[392,.3],[440,.45],[392,.45],[587,.45],[523,.6],
//     [0,.15],[392,.3],[392,.3],[784,.5],[659,.45],[523,.4],[494,.4],[440,.5],
//     [0,.15],[698,.3],[698,.3],[659,.45],[523,.4],[587,.4],[523,.65],
//   ];
//   let time=t;
//   mel.forEach(([f,d])=>{
//     if(f>0){
//       note(f,d,time,'sine',.10);
//       note(f,d,time,'triangle',.04);
//     }
//     time+=d+.04;
//   });
//   time+=.6;
//   mel.forEach(([f,d])=>{
//     if(f>0)note(f*1.5,d*1.1,time,'sine',.05);
//     time+=d+.04;
//   });
// }

// function toggleMusic(){
//   const btn=document.getElementById('musicBtn');
//   if(playing){
//     playing=false;
//     btn.textContent='\uD83D\uDD07';
//     if(songTimer){clearInterval(songTimer);songTimer=null}
//   }else{
//     playing=true;
//     btn.textContent='\uD83C\uDFB5';
//     initAudio();
//     playSong();
//     songTimer=setInterval(playSong,28000);
//   }
// }

// // ===== START CONTINUOUS CONFETTI ON LOAD =====
// startContinuous();

// // ===== OPEN CARD =====
// let opened=false;
// function openCard(){
//   if(opened)return;opened=true;
//   if(continuousId){clearTimeout(continuousId);continuousId=null}
//   const cover=document.getElementById('cover');
//   const inside=document.getElementById('inside');
//   cover.classList.add('hidden');
//   setTimeout(()=>{
//     inside.classList.add('show');
//     burst();
//   },700);
//   setTimeout(()=>{if(!playing)toggleMusic()},1200);
// }

// document.getElementById('inside').addEventListener('click',function(e){
//   if(e.target===this||e.target.closest('.inside-content'))burst();
// });






// ===== QUIZ GATE LOGIC (Out-of-the-box Verification) =====
const questions = [
  { q: "How many years have we officially been best friends?", a: ["10 years", "15 years! +", "Too many to count 😂"], correct: 1 },
  { q: "What would happen if you weren't in my life?", a: ["I'd be totally fine.", "My life would be an absolute mess! 🥹"], correct: 1 }
];

let currentQ = 0;

function loadQuestion() {
  const quizGate = document.getElementById('quiz-gate');
  if (!quizGate) return;

  if (currentQ >= questions.length) {
    // Launch a burst, clear overlay, and kick off your background elements
    burst();
    startContinuous();
    quizGate.style.opacity = '0';
    setTimeout(() => {
      quizGate.style.display = 'none';
    }, 500);
    return;
  }
  
  document.getElementById('quiz-question').innerText = questions[currentQ].q;
  const optionsDiv = document.getElementById('quiz-options');
  optionsDiv.innerHTML = '';
  
  questions[currentQ].a.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.style = "padding:14px; border:none; border-radius:12px; background: linear-gradient(135deg, #ff6b8b, #ff4757); color:white; cursor:pointer; font-weight:600; font-size:1rem; transition: transform 0.2s; font-family: 'Poppins', sans-serif;";
    btn.onmouseover = () => btn.style.transform = "scale(1.03)";
    btn.onmouseout = () => btn.style.transform = "scale(1)";
    btn.onclick = () => {
      // Trick browsers to allow sound later since the user interacted here
      initAudio();
      if (idx === questions[currentQ].correct) {
        currentQ++;
        loadQuestion();
      } else {
        alert("15 years of friendship for this wrong answer?! Try again! 😂❤️");
      }
    };
    optionsDiv.appendChild(btn);
  });
}

// Start quiz structure initialization
document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
});

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
  if (continuousId) return; // Prevent multiple loops
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

// Removed direct startContinuous() from here, it triggers after the quiz passes!

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

// ===== MOUSE INTERACTION (Burst & Micro-Hearts Explosion) =====
document.getElementById('inside').addEventListener('click',function(e){
  if(e.target===this||e.target.closest('.inside-content')) {
    burst();
    
    // Create a physical interactive blast of 15 hearts under the cursor!
    for (let i = 0; i < 15; i++) {
      const hb = document.createElement('div');
      hb.innerHTML = ['💖', '✨', '🌸', '❤️'][Math.floor(Math.random() * 4)];
      hb.style = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-size: ${Math.random() * 15 + 15}px;
        pointer-events: none;
        z-index: 99999;
        transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(hb);
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 120 + 40;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;
      
      setTimeout(() => {
        hb.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`;
        hb.style.opacity = '0';
      }, 30);
      
      setTimeout(() => hb.remove(), 800);
    }
  }
});