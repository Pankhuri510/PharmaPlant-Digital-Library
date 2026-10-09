
import React,{useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {Search,Leaf,Microscope,Sparkles,ArrowLeft,ChevronDown,Upload} from "lucide-react";
import "./styles.css";
import plants from "../../data/plants.json";

const API="http://127.0.0.1:8000";

function App(){
 const [plant,setPlant]=useState(null),[q,setQ]=useState(""),[family,setFamily]=useState("All"),[ai,setAI]=useState(false);
 const families=["All",...new Set(plants.map(p=>p.family))];
 const shown=useMemo(()=>plants.filter(p=>(family==="All"||p.family===family)&&(!q||[p.name,p.scientificName,p.family,...p.synonyms].join(" ").toLowerCase().includes(q.toLowerCase()))),[q,family]);
 if(ai) return <AI onBack={()=>setAI(false)}/>;
 if(plant) return <Detail p={plant} onBack={()=>setPlant(null)} onAI={()=>setAI(true)}/>;
 return <div>
  <div className="academicHeader">
  <div className="academicInner">
    <strong>Department of Pharmaceutical Sciences &amp; Technology</strong>
    <span>Prepared by Dr. Anima Pandey and Aditya Kumar Singh</span>
  </div>
</div>
<header className="nav"><div className="logo"><Leaf size={19}/><div><strong>PharmaPlant</strong><small>Digital Pharmacognosy Library</small></div></div><button className="outline" onClick={()=>setAI(true)}><Sparkles size={15}/> AI Identification</button></header>
  <main className="wrap">
   <section className="institution">
    <div className="preparedBy"><span>Prepared by</span><strong>Dr. Anima Pandey</strong><strong>and Aditya Kumar Singh</strong></div>
   </section>
   <section className="intro">
    <p className="kicker">MEDICINAL PLANT LIBRARY</p>
    <h1>Study medicinal plants with <i>clarity.</i></h1>
    <p className="introText">Browse the plant, its botanical information and the microscopic characters used for identification.</p>
    <div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search plants, scientific names or families"/></div>
   </section>
   <div className="bar"><div><h2>Plant collection</h2><span>{shown.length} records</span></div><div className="families">{families.map(f=><button key={f} className={family===f?"selected":""} onClick={()=>setFamily(f)}>{f}</button>)}</div></div>
   <section className="cards">{shown.map(p=><Card p={p} open={()=>setPlant(p)} />)}</section>
   <section className="aiStrip"><div><Sparkles size={20}/></div><article><b>AI-assisted identification</b><p>Upload a microscopy image and compare it with the reference images in the library.</p></article><button onClick={()=>setAI(true)}>Try AI →</button></section>
  </main>
 </div>
}

function Card({p,open}){return <article className="card" onClick={open}>
 <div className="photo"><img src={p.image} alt={p.name}/><span>Plant appearance</span></div>
 <div className="cardText"><small>{p.family}</small><h3>{p.name}</h3><em>{p.scientificName}</em><p>{p.description}</p><div className="cardFoot"><span><Microscope size={13}/> {p.microscopyImages.length} reference figures</span><b>View details →</b></div></div>
 </article>}

function Detail({p,onBack,onAI}){
 const [open,setOpen]=useState("source");
 const toggle=x=>setOpen(open===x?"":x);
 return <><header className="nav"><button className="back" onClick={onBack}><ArrowLeft size={17}/> Plant library</button><button className="outline" onClick={onAI}><Sparkles size={15}/> AI Identification</button></header>
 <main className="wrap detail">
  <section className="detailTop"><div className="detailPhoto"><img src={p.image} alt={p.name}/></div><div><small className="familyLabel">{p.family}</small><h1>{p.name}</h1><em>{p.scientificName}</em><div className="synonyms">{p.synonyms.map(s=><span>{s}</span>)}</div><p>{p.description}</p></div></section>
  <div className="detailGrid"><section>
   <Accordion title="Biological source" open={open==="source"} onClick={()=>toggle("source")}><p>{p.source}</p></Accordion>
   <Accordion title="Microscopical characters" open={open==="micro"} onClick={()=>toggle("micro")}><ul>{p.microscopy.map(x=><li>{x}</li>)}</ul></Accordion>
   <Accordion title="Chemical constituents" open={open==="chem"} onClick={()=>toggle("chem")}><p>{p.constituents}</p></Accordion>
   <Accordion title="Uses" open={open==="uses"} onClick={()=>toggle("uses")}><p>{p.uses}</p></Accordion>
  </section>
  <aside><b>Quick identification</b><p>Look at the normal plant first, then compare the diagnostic microscopic characters.</p><button onClick={onAI}><Sparkles size={15}/> Identify microscopy image</button></aside></div>
  <section className="gallery"><div className="sectionTitle"><div><small>REFERENCE MATERIAL</small><h2>Microscopy gallery</h2></div><span>{p.microscopyImages.length} figures</span></div><div className="galleryGrid">{p.microscopyImages.map((src,i)=><figure><img src={src} alt={`${p.name} microscopy ${i+1}`}/><figcaption>Figure {i+1} · {p.microscopy[i]||"Microscopy reference"}</figcaption></figure>)}</div></section>
 </main></>
}

function Accordion({title,open,onClick,children}){return <div className="acc"><button onClick={onClick}><b>{title}</b><ChevronDown className={open?"down":""}/></button>{open&&<div>{children}</div>}</div>}

function AI({onBack}){
 const [file,setFile]=useState(null),[result,setResult]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 async function go(){if(!file)return;setBusy(true);setError("");setResult(null);try{let f=new FormData();f.append("file",file);let r=await fetch(API+"/identify",{method:"POST",body:f});if(!r.ok)throw Error("AI service error");setResult(await r.json())}catch(e){setError("Start the FastAPI backend on port 8000 and try again.")}finally{setBusy(false)}}
 return <><header className="nav"><button className="back" onClick={onBack}><ArrowLeft size={17}/> Plant library</button><b>AI Identification</b></header>
 <main className="wrap ai">
  <small className="familyLabel">AI-ASSISTED PLANT AUTHENTICATION</small><h1>Compare a microscopy image.</h1><p className="introText">Upload an image and the prototype will compare it against the labelled reference figures in the library.</p>
  <div className="upload"><input id="up" type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/><label htmlFor="up"><Upload size={25}/><b>{file?file.name:"Choose a microscopy image"}</b><span>JPG, JPEG or PNG</span></label>{file&&<img src={URL.createObjectURL(file)} />}</div>
  <button className="primary" disabled={!file||busy} onClick={go}>{busy?"Analyzing…":"Analyze image"}</button>
  {error&&<p className="error">{error}</p>}
  {result&&<div className="results"><small>AI IDENTIFICATION RESULT</small><h2>{result.matches?.[0]?.plant || result.message}</h2>{result.matches?.[0]&&<div className="singleMatch"><span>Closest visual match · {result.matches[0].family}</span><strong>{result.matches[0].similarity}% similarity</strong></div>}<p className="note">Prototype visual similarity only. It is not a validated diagnostic or authentication model.</p></div>}
 </main></>
}
createRoot(document.getElementById("root")).render(<App/>);
