import {useEffect,useMemo,useRef,useState} from 'react'

const ls={get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}},
set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}}
const PHRASES=['Student Developer','Backend & Logic Builder','SIH 2026 Competitor','DSA in C++']
const SKILLS=[['C++ (DSA)',80],['Google Apps Script',85],['JavaScript',75],['React',60],['HTML / CSS / Tailwind',78],['Python',65],['C',65]]
const LINKS=[['about','About'],['skills','Skills'],['projects','Projects'],['strengths','Strengths'],['contact','Contact']]
const STRENGTHS=[['🧭','Leadership','Take ownership and keep the team moving toward the goal.'],['🤝','Coordination','Align six people, deadlines and deliverables smoothly.'],['🎤','Public Speaking','Confident pitching of ideas to judges and audiences.'],['💬','Communication','Friendly, extroverted and easy to collaborate with.']]

function Particles(){
  const ref=useRef()
  useEffect(()=>{
    const cv=ref.current,cx=cv.getContext('2d');let W,H,P,raf
    const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight
      P=Array.from({length:Math.min(90,W/14)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))}
    rs();addEventListener('resize',rs)
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches
    const loop=()=>{cx.clearRect(0,0,W,H)
      for(const a of P){if(!reduce){a.x+=a.vx;a.y+=a.vy}
        if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1
        cx.fillStyle='rgba(34,211,238,.7)';cx.beginPath();cx.arc(a.x,a.y,1.6,0,7);cx.fill()
        for(const b of P){const d=Math.hypot(a.x-b.x,a.y-b.y)
          if(d<120){cx.strokeStyle='rgba(167,139,250,'+.18*(1-d/120)+')';cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}}
      raf=requestAnimationFrame(loop)}
    loop()
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',rs)}
  },[])
  return <canvas id="bg" ref={ref}/>
}

function Typed(){
  const [t,setT]=useState('')
  useEffect(()=>{
    let i=0,j=0,del=false,id
    const tick=()=>{const w=PHRASES[i];setT(w.slice(0,j))
      if(!del&&j===w.length){del=true;id=setTimeout(tick,1400);return}
      if(del&&j===0){del=false;i=(i+1)%PHRASES.length}
      j+=del?-1:1;id=setTimeout(tick,del?40:80)}
    tick();return()=>clearTimeout(id)
  },[])
  return <><b>{t}</b><span className="cur"/></>
}

function Count({n,s='',dec}){
  const [v,setV]=useState(0)
  useEffect(()=>{let x=0;const id=setInterval(()=>{x+=n/40;if(x>=n){x=n;clearInterval(id)}setV(x)},30);return()=>clearInterval(id)},[n])
  return <b>{(dec?v.toFixed(1):Math.round(v))+s}</b>
}

function Skills(){
  const [on,setOn]=useState(false)
  useEffect(()=>{const id=setTimeout(()=>setOn(true),300);return()=>clearTimeout(id)},[])
  return SKILLS.map(([n,w],k)=>(
    <div className="sk" key={n}>
      <div><span>{n}</span>{k===0&&<a className="mini-btn" href="https://github.com/ashishbishnoi/DSA-in-CPP" target="_blank" rel="noopener noreferrer">View DSA Repo ↗</a>}</div>
      <div className="t"><i style={{width:on?w+'%':0}}/></div>
    </div>))
}

function Modal({p,onClose,saved,toggle}){
  useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[onClose])
  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal card" role="dialog" aria-modal="true" aria-label={p.title} onClick={e=>e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Close">✕</button>
        <span className="badge mono">{p.badge}</span>
        <h3>{p.title}</h3>
        <p className="mut">{p.summary}</p>
        <ul>{p.highlights.map(h=><li key={h}>{h}</li>)}</ul>
        <div className="chips">{p.stack.map(s=><span key={s}>{s}</span>)}</div>
        {p.flow.length>0&&<div className="flow mono">{p.flow.map(f=><div key={f}>{f}</div>)}</div>}
        <div className="row">
          {p.link&&<a className="btn b1" href={p.link} target="_blank" rel="noopener noreferrer">{p.linkLabel} ↗</a>}
          <button className="btn b2" onClick={()=>toggle(p.id)}>{saved?'★ Saved':'☆ Save project'}</button>
        </div>
      </div>
    </div>)
}

function Projects(){
  const [data,setData]=useState(null),[err,setErr]=useState(false)
  const [q,setQ]=useState(''),[cat,setCat]=useState('All'),[onlySaved,setOnlySaved]=useState(false)
  const [open,setOpen]=useState(null)
  const [saved,setSaved]=useState(()=>ls.get('saved',[]))
  useEffect(()=>{
    fetch(import.meta.env.BASE_URL+'projects.json').then(r=>r.json()).then(d=>setTimeout(()=>setData(d),500)).catch(()=>setErr(true))
  },[])
  const toggle=id=>setSaved(s=>{const n=s.includes(id)?s.filter(x=>x!==id):[...s,id];ls.set('saved',n);return n})
  const cats=useMemo(()=>['All',...new Set((data||[]).map(p=>p.category))],[data])
  const list=(data||[]).filter(p=>(cat==='All'||p.category===cat)&&(!onlySaved||saved.includes(p.id))&&
    (p.title+p.summary+p.stack.join(' ')).toLowerCase().includes(q.toLowerCase()))
  const reset=()=>{setQ('');setCat('All');setOnlySaved(false)}
  return(<>
    <div className="tools">
      <input className="search" type="search" placeholder="Search projects or tech…" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search projects"/>
      <div className="chips">
        {cats.map(c=><button key={c} className={'chip'+(cat===c?' on':'')} onClick={()=>setCat(c)}>{c}</button>)}
        <button className={'chip'+(onlySaved?' on':'')} onClick={()=>setOnlySaved(v=>!v)}>★ Saved ({saved.length})</button>
      </div>
    </div>
    {err&&<div className="card empty"><p>Couldn't load projects. Check that <code>public/projects.json</code> exists, then refresh.</p></div>}
    {!data&&!err&&<div className="grid">{[0,1,2].map(i=><div className="card skel" key={i}><i/><i/><i/></div>)}</div>}
    {data&&list.length===0&&<div className="card empty"><p>No projects match your search.</p><button className="btn b2" onClick={reset}>Clear filters</button></div>}
    {data&&list.length>0&&<div className="grid">{list.map(p=>(
      <article className="card pcard" key={p.id}>
        <div className="top"><span className="badge mono">{p.badge}</span>
          <button className="star" onClick={()=>toggle(p.id)} aria-label={saved.includes(p.id)?'Remove from saved':'Save project'}>{saved.includes(p.id)?'★':'☆'}</button></div>
        <h3>{p.title}</h3><p className="mut">{p.summary}</p>
        <div className="chips">{p.stack.slice(0,4).map(s=><span key={s}>{s}</span>)}</div>
        <button className="btn b1" onClick={()=>setOpen(p)}>View details</button>
      </article>))}</div>}
    {open&&<Modal p={open} onClose={()=>setOpen(null)} saved={saved.includes(open.id)} toggle={toggle}/>}
  </>)
}

export default function App(){
  const [theme,setTheme]=useState(()=>ls.get('theme','dark')),[menu,setMenu]=useState(false)
  useEffect(()=>{document.documentElement.dataset.theme=theme;ls.set('theme',theme)},[theme])
  return(<>
    <Particles/><div className="glow g1"/><div className="glow g2"/>
    <nav>
      <b className="mono logo">&lt;Ash /&gt;</b>
      <div className={'links'+(menu?' open':'')}>{LINKS.map(([id,l])=><a key={id} href={'#'+id} onClick={()=>setMenu(false)}>{l}</a>)}</div>
      <div className="navr">
        <button className="icon" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} aria-label="Toggle theme">{theme==='dark'?'☀️':'🌙'}</button>
        <button className="icon burger" onClick={()=>setMenu(m=>!m)} aria-label="Menu" aria-expanded={menu}>☰</button>
      </div>
    </nav>

    <section className="hero">
      <div>
        <span className="tag mono">$ whoami</span>
        <h1>Hi, I'm <em>Ash</em></h1>
        <div className="role mono">&gt; <Typed/></div>
        <p className="d">First-year CSE student at USICT, India. I build practical tech products, from backend logic to pitch-ready prototypes, and compete at Smart India Hackathon 2026.</p>
        <a className="btn b1" href="#projects">View My Work</a><a className="btn b2" href="#contact">Get in Touch</a>
      </div>
      <div className="term mono">
        <div className="bar"><i/><i/><i/></div>
        <pre><span className="c">// ash.js</span>{'\n'}<span className="k">const</span> <span className="f">ash</span> = {'{'}{'\n'}  name: <span className="s">"Ashish Bishnoi"</span>,{'\n'}  role: <span className="s">"Student Developer"</span>,{'\n'}  college: <span className="s">"USICT"</span>,{'\n'}  course: <span className="s">"B.Tech CSE (1st Year)"</span>,{'\n'}  team: <span className="s">"NexForge"</span>,{'\n'}  hackathon: <span className="s">"SIH 2026 , Azinhack"</span>,{'\n'}  doing: <span className="s">"DSA in C++"</span>,{'\n'}  buildsThings: <span className="k">true</span>{'\n'}{'}'};</pre>
      </div>
    </section>

    <section style={{paddingTop:10}}><div className="stats">
      <div className="stat"><Count n={93.2} s="%" dec/><span>10th &amp; 12th Boards</span></div>
      <div className="stat"><Count n={2}/><span>Projects Built</span></div>
      <div className="stat"><Count n={2}/><span>Hackathons</span></div>
      <div className="stat"><b>C++</b><span>DSA Journey</span></div>
    </div></section>

    <section id="about"><h2><span>/</span> About Me</h2>
      <div className="about">
        <div><p>I'm a curious, hands-on developer who learns by shipping. I'm the primary technical contributor on my SIH 2026 team, where I built the full backend and allocation logic for our hostel management solution.</p>
          <p>Outside the project, I'm sharpening problem-solving with Data Structures &amp; Algorithms in C++, and exploring web architecture, scripting and design.</p></div>
        <div className="card"><h4 className="mono" style={{color:'var(--cy)'}}>Currently</h4>
          <div className="chips" style={{marginTop:12}}><span>DSA in C++</span><span>Exploring Hackathons</span><span>Web Architecture</span></div></div>
      </div></section>

    <section id="skills"><h2><span>/</span> Skills</h2>
      <div className="about">
        <div className="card"><Skills/></div>
        <div className="card"><h4 className="mono" style={{color:'var(--pk)',marginBottom:12}}>Toolbox</h4>
          <div className="chips">{['React','Google Sheets DB','REST / Web Apps','GitHub','Algorithms','Haversine Geo Logic','SHA-256 Auth','Image Editing','Pitch Decks'].map(s=><span key={s}>{s}</span>)}</div></div>
      </div></section>

    <section id="projects"><h2><span>/</span> Projects</h2><Projects/></section>

    <section id="strengths"><h2><span>/</span> Strengths</h2>
      <div className="grid">{STRENGTHS.map(([i,t,d])=><div className="card" key={t}><div className="ic">{i}</div><h4>{t}</h4><p className="mut">{d}</p></div>)}</div></section>

    <section id="contact" className="cta"><div className="card">
      <h2>Let's <span>build</span> something</h2>
      <p className="mut">Open to clubs, teams, hackathons and collaborations.</p>
      <a className="btn b1" href="mailto:ashishbishnoi444@gmail.com">Email Me</a>
      <a className="btn b2" href="https://github.com/ashishbishnoi" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a className="btn b2" href="https://www.linkedin.com/in/-ashish-bishnoi-/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div></section>
    <footer className="mono">© 2026 Ash · Built with code &amp; caffeine</footer>
  </>)
}
