import { useState, useEffect, useRef, useCallback } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { saveCigar, onCigars, setFavorites as saveFavoritesToDb, onFavorites, onUserProfile, updateUserProfile, searchUsers, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend as removeFriendDb, getFriendProfiles, getFriendCigars, getFriendFavorites, postActivity, getFriendsFeed, getUserActivity } from "./database";
import CIGAR_DATA, { CIGAR_BRANDS } from "./cigarDatabase";

const RATING_CATEGORIES = [
  { key: "appearance", label: "Appearance", icon: "👁️" },{ key: "construction", label: "Construction", icon: "🔧" },{ key: "preLight", label: "Pre-Light Draw", icon: "💨" },{ key: "firstThird", label: "First Third", icon: "1️⃣" },{ key: "secondThird", label: "Second Third", icon: "2️⃣" },{ key: "finalThird", label: "Final Third", icon: "3️⃣" },{ key: "burnLine", label: "Burn & Ash", icon: "🔥" },{ key: "flavor", label: "Flavor Profile", icon: "🍂" },{ key: "strength", label: "Strength", icon: "💪" },{ key: "overall", label: "Overall Experience", icon: "⭐" },
];
const WRAPPER_TYPES=["Connecticut","Habano","Maduro","Oscuro","Corojo","Cameroon","Sumatra","Candela"];
const SHAPES=["Robusto","Toro","Churchill","Corona","Lancero","Torpedo","Belicoso","Gordo","Petit Corona","Lonsdale"];
const STRENGTH_LEVELS=["Mild","Mild-Medium","Medium","Medium-Full","Full"];
const BARCODE_DATABASE={};
["Padrón 1964 Anniversary|Padrón|Maduro|Torpedo|Medium-Full|52|6\"|Nicaragua|18.50|0-71610-00203","Arturo Fuente Opus X|Arturo Fuente|Habano|Robusto|Full|50|5.25\"|Dominican Republic|35.00|0-71610-93520","Oliva Serie V Melanio|Oliva|Habano|Toro|Medium-Full|50|6\"|Nicaragua|14.00|0-28695-01210","My Father Le Bijou 1922|My Father|Oscuro|Torpedo|Full|52|6.125\"|Nicaragua|13.50|8-52111-00691","Davidoff Winston Churchill|Davidoff|Connecticut|Churchill|Medium|48|7\"|Dominican Republic|28.00|0-75699-50170"].forEach(l=>{const[name,brand,wrapper,shape,strength,ringGauge,length,origin,price,barcode]=l.split("|");BARCODE_DATABASE[barcode]={name,brand,wrapper,shape,strength,ringGauge:+ringGauge,length,origin,price:+price}});

const getAvgRating=(ratings)=>{if(!ratings)return 0;const v=Object.values(ratings).filter(x=>typeof x==="number"&&x>0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):0};
const generateId=()=>Math.random().toString(36).substr(2,9)+Date.now().toString(36);

// Image compression for Firestore 1MB limit
const compressImage=(dataUrl,maxW=600,quality=0.5)=>new Promise(resolve=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");let w=img.width,h=img.height;if(w>maxW){h=(maxW/w)*h;w=maxW}if(h>maxW){w=(maxW/h)*w;h=maxW}c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);resolve(c.toDataURL("image/jpeg",quality))};img.onerror=()=>resolve(dataUrl);img.src=dataUrl});
const compressProfilePhoto=(dataUrl)=>new Promise(resolve=>{const img=new Image();img.onload=()=>{const s=200,c=document.createElement("canvas");c.width=s;c.height=s;const ctx=c.getContext("2d"),m=Math.min(img.width,img.height),sx=(img.width-m)/2,sy=(img.height-m)/2;ctx.drawImage(img,sx,sy,m,m,0,0,s,s);resolve(c.toDataURL("image/jpeg",0.7))};img.onerror=()=>resolve(dataUrl);img.src=dataUrl});

// Image Crop Modal
const ImageCropModal=({imageUrl,onSave,onClose,isProfile=false})=>{
  const canvasRef=useRef(null);const[scale,setScale]=useState(0.1);const[offset,setOffset]=useState({x:0,y:0});const[dragging,setDragging]=useState(false);const[dragStart,setDragStart]=useState({x:0,y:0});const imgRef=useRef(null);const[saving,setSaving]=useState(false);const[initScale,setInitScale]=useState(0.1);
  useEffect(()=>{const img=new Image();img.onload=()=>{imgRef.current=img;const sz=280;const ch=isProfile?sz:sz*0.75;const fitScale=Math.min(sz/img.width,ch/img.height);setScale(fitScale);setInitScale(fitScale);setOffset({x:0,y:0})};img.src=imageUrl},[imageUrl]);
  useEffect(()=>{if(imgRef.current)draw()},[scale,offset]);
  const draw=()=>{const cv=canvasRef.current;if(!cv||!imgRef.current)return;const ctx=cv.getContext("2d");const sz=280;cv.width=sz;cv.height=isProfile?sz:sz*0.75;ctx.fillStyle="#0f0c08";ctx.fillRect(0,0,cv.width,cv.height);const img=imgRef.current,iw=img.width*scale,ih=img.height*scale;ctx.drawImage(img,(cv.width-iw)/2+offset.x,(cv.height-ih)/2+offset.y,iw,ih)};
  const pDown=e=>{setDragging(true);const p=e.touches?e.touches[0]:e;setDragStart({x:p.clientX-offset.x,y:p.clientY-offset.y})};
  const pMove=e=>{if(!dragging)return;const p=e.touches?e.touches[0]:e;setOffset({x:p.clientX-dragStart.x,y:p.clientY-dragStart.y})};
  const pUp=()=>setDragging(false);
  const save=async()=>{setSaving(true);const r=canvasRef.current.toDataURL("image/jpeg",isProfile?0.7:0.6);await onSave(r);setSaving(false)};
  const useFullPhoto=async()=>{setSaving(true);await onSave(imageUrl);setSaving(false)};
  const minZoom=Math.max(0.02,initScale*0.5);const maxZoom=Math.max(initScale*4,1);
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:350,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
    <h3 style={{fontFamily:"'Playfair Display',serif",color:"#D4A754",fontSize:18,margin:"0 0 16px"}}>{isProfile?"Adjust Profile Photo":"Adjust Photo"}</h3>
    <div style={{borderRadius:isProfile?"50%":12,overflow:"hidden",border:"2px solid #D4A754",marginBottom:16,touchAction:"none"}}>
      <canvas ref={canvasRef} style={{display:"block",cursor:"grab"}} onMouseDown={pDown} onMouseMove={pMove} onMouseUp={pUp} onMouseLeave={pUp} onTouchStart={pDown} onTouchMove={pMove} onTouchEnd={pUp}/>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,width:280}}>
      <span style={{color:"#6b5e4f",fontSize:12}}>−</span>
      <input type="range" min={minZoom} max={maxZoom} step={initScale*0.02||0.01} value={scale} onChange={e=>setScale(parseFloat(e.target.value))} style={{flex:1,accentColor:"#D4A754"}}/>
      <span style={{color:"#6b5e4f",fontSize:12}}>+</span>
    </div>
    <div style={{display:"grid",gap:8,width:280}}>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onClose} style={{flex:1,background:"transparent",border:"1px solid #2a2318",borderRadius:10,padding:12,color:"#6b5e4f",fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancel</button>
        <button onClick={save} disabled={saving} style={{flex:1,background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:10,padding:12,color:"#0f0c08",fontSize:14,fontWeight:700,cursor:saving?"wait":"pointer",opacity:saving?0.7:1}}>{saving?"Saving...":"Use Crop"}</button>
      </div>
      <button onClick={useFullPhoto} disabled={saving} style={{width:"100%",background:"transparent",border:"1px solid #2a2318",borderRadius:10,padding:10,color:"#8a7b69",fontSize:13,fontWeight:600,cursor:saving?"wait":"pointer"}}>Use Full Photo</button>
    </div>
  </div>);
};

const StarRating=({value=0,onChange,size=20,readonly=false})=>{const[hover,setHover]=useState(0);return(<div style={{display:"flex",gap:2,cursor:readonly?"default":"pointer"}}>{[...Array(10)].map((_,i)=>{const v=i+1,f=v<=(hover||value);return<svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={f?"#D4A754":"none"} stroke={f?"#D4A754":"#5a5040"} strokeWidth="1.5" onClick={()=>!readonly&&onChange?.(v)} onMouseEnter={()=>!readonly&&setHover(v)} onMouseLeave={()=>!readonly&&setHover(0)} style={{transition:"all 0.15s",transform:f&&!readonly?"scale(1.1)":"scale(1)"}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>})}</div>)};
const TabBar=({tabs,active,onChange})=>(<div style={{display:"flex",background:"#1a1510",borderTop:"1px solid #2a2318",padding:"6px 0 env(safe-area-inset-bottom,6px)",position:"fixed",bottom:0,left:0,right:0,zIndex:100}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{flex:1,background:"none",border:"none",color:active===t.id?"#D4A754":"#6b5e4f",fontSize:10,fontFamily:"'Cormorant Garamond',serif",fontWeight:active===t.id?700:400,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 0",cursor:"pointer",textTransform:"uppercase"}}><span style={{fontSize:20,lineHeight:1}}>{t.icon}</span>{t.label}</button>)}</div>);
const Header=({title,subtitle,rightAction})=>(<div style={{padding:"calc(env(safe-area-inset-top,12px)+12px) 20px 12px",background:"linear-gradient(180deg,#1a1510,#0f0c08)",borderBottom:"1px solid #2a2318",position:"sticky",top:0,zIndex:50}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#D4A754",margin:0,fontWeight:700}}>{title}</h1>{subtitle&&<p style={{color:"#6b5e4f",fontSize:12,margin:"2px 0 0",letterSpacing:"0.1em",textTransform:"uppercase"}}>{subtitle}</p>}</div>{rightAction}</div></div>);
const Tag=({label})=><span style={{background:"#2a2318",color:"#a0927e",fontSize:11,padding:"3px 8px",borderRadius:6,fontWeight:600}}>{label}</span>;

// Pending Friend Request Card
const PendingRequest=({profile:rp,onAccept,onDecline})=>{
  if(!rp)return null;
  return(<div style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #D4A754",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
    <div style={{width:40,height:40,borderRadius:"50%",background:rp.photo?"none":"linear-gradient(135deg,#D4A754,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#0f0c08",fontWeight:700,flexShrink:0,overflow:"hidden"}}>{rp.photo?<img src={rp.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:rp.avatar}</div>
    <div style={{flex:1}}><p style={{color:"#e8dcc8",fontSize:14,margin:0,fontWeight:600}}>{rp.name}</p><p style={{color:"#5a5040",fontSize:11,margin:"2px 0 0"}}>{rp.email}</p></div>
    <div style={{display:"flex",gap:6}}>
      <button onClick={onAccept} style={{background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:8,padding:"6px 12px",color:"#0f0c08",fontSize:11,fontWeight:700,cursor:"pointer"}}>Accept</button>
      <button onClick={onDecline} style={{background:"transparent",border:"1px solid #3a3228",borderRadius:8,padding:"6px 10px",color:"#6b5e4f",fontSize:11,fontWeight:600,cursor:"pointer"}}>✕</button>
    </div>
  </div>);
};

// Share Modal
const ShareModal=({cigar,onClose})=>{const[copied,setCopied]=useState(false);const avg=getAvgRating(cigar.ratings);const link=typeof window!=="undefined"?window.location.origin:"";const txt=`🔥 ${cigar.inHumidor===false?"Just smoked":"Check out"}: ${cigar.name} by ${cigar.brand}${avg>0?`\n⭐ ${avg}/10`:""}${cigar.wrapper?`\n🍂 ${cigar.wrapper} • ${cigar.shape||""}`:""}\n\n👉 ${link}`;
const share=async p=>{const e=encodeURIComponent(txt);const urls={twitter:`https://twitter.com/intent/tweet?text=${e}`,whatsapp:`https://wa.me/?text=${e}`,sms:`sms:?body=${e}`};if(p==="copy"){try{await navigator.clipboard.writeText(txt)}catch{}setCopied(true);setTimeout(()=>setCopied(false),2000);return}if(p==="native"&&navigator.share){try{await navigator.share({title:`${cigar.name}`,text:txt,url:link})}catch{}return}window.open(urls[p],"_blank","width=600,height=400")};
return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}><div style={{background:"#0f0c08",border:"1px solid #2a2318",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:500,padding:"20px 20px calc(env(safe-area-inset-bottom,20px)+10px)",animation:"slideUp 0.3s ease-out"}}><style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
<div style={{width:36,height:4,background:"#2a2318",borderRadius:2,margin:"0 auto 16px"}}/>
<div style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #2a2318",borderRadius:12,overflow:"hidden",marginBottom:20}}>{cigar.photo&&<div style={{maxHeight:140,overflow:"hidden"}}><img src={cigar.photo} alt="" style={{width:"100%",objectFit:"cover",display:"block"}}/></div>}<div style={{padding:14}}><p style={{fontFamily:"'Playfair Display',serif",color:"#e8dcc8",fontSize:15,margin:0,fontWeight:600}}>{cigar.name}</p><p style={{color:"#6b5e4f",fontSize:12,margin:"2px 0 0"}}>{cigar.brand}{avg>0?` • ⭐ ${avg}/10`:""}</p></div></div>
<h3 style={{color:"#D4A754",fontSize:16,margin:"0 0 14px"}}>Share to</h3>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>{[{id:"native",label:"Share",icon:"📤",color:"#D4A754"},{id:"whatsapp",label:"WhatsApp",icon:"💬",color:"#25D366"},{id:"twitter",label:"X",icon:"𝕏",color:"#1DA1F2"},{id:"sms",label:"Messages",icon:"💬",color:"#34C759"},{id:"copy",label:"Copy",icon:"📋",color:"#8a7b69"}].map(p=><button key={p.id} onClick={()=>share(p.id)} style={{background:"#1a1510",border:"1px solid #2a2318",borderRadius:12,padding:"14px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><div style={{width:40,height:40,borderRadius:"50%",background:`${p.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:p.color,fontWeight:900}}>{p.icon}</div><span style={{color:"#a0927e",fontSize:10,fontWeight:600,textTransform:"uppercase"}}>{p.id==="copy"&&copied?"Copied!":p.label}</span></button>)}</div>
</div></div>)};

// Barcode Scanner
const BarcodeScanner=({onClose,onCigarFound})=>{const[scanning,setScanning]=useState(true);const[manualCode,setManualCode]=useState("");const[scanResult,setScanResult]=useState(null);const[scanError,setScanError]=useState(null);const[scanProgress,setScanProgress]=useState(0);const[useManual,setUseManual]=useState(false);const videoRef=useRef(null);const streamRef=useRef(null);
useEffect(()=>{if(scanning&&!useManual){const i=setInterval(()=>setScanProgress(p=>p>=100?0:p+2),50);return()=>clearInterval(i)}},[scanning,useManual]);
useEffect(()=>{if(!useManual)startCam();return()=>stopCam()},[useManual]);
const startCam=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s}catch{}};
const stopCam=()=>{if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null}};
const simScan=()=>{setScanning(true);setScanError(null);setScanResult(null);setTimeout(()=>{const codes=Object.keys(BARCODE_DATABASE);const c=codes[Math.floor(Math.random()*codes.length)];setScanResult({barcode:c,cigar:BARCODE_DATABASE[c]});setScanning(false)},2500)};
const manLookup=()=>{setScanError(null);const c=manualCode.trim();if(!c)return;const f=BARCODE_DATABASE[c];if(f){setScanResult({barcode:c,cigar:f});setScanning(false)}else setScanError("Not found.")};
useEffect(()=>{if(!useManual)simScan()},[useManual]);
return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:300,display:"flex",flexDirection:"column"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"calc(env(safe-area-inset-top,16px)+4px) 20px 12px"}}><h2 style={{color:"#D4A754",fontSize:20,margin:0}}>{useManual?"Enter Barcode":"Scan"}</h2><button onClick={()=>{stopCam();onClose()}} style={{background:"none",border:"none",color:"#6b5e4f",fontSize:24,cursor:"pointer"}}>✕</button></div>
{!useManual&&!scanResult&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}><div style={{width:280,height:280,borderRadius:20,position:"relative",background:"#0a0806",overflow:"hidden",border:"2px solid #2a2318"}}><video ref={videoRef} autoPlay playsInline muted style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.6}}/>{scanning&&<div style={{position:"absolute",left:40,right:40,top:`${30+(scanProgress/100)*200}px`,height:2,background:"linear-gradient(90deg,transparent,#D4A754,transparent)",boxShadow:"0 0 12px #D4A754"}}/>}</div><p style={{color:"#D4A754",fontSize:14,marginTop:20,fontWeight:600,textTransform:"uppercase"}}>{scanning?"Scanning...":"Done"}</p><button onClick={simScan} style={{marginTop:20,background:"transparent",border:"1px solid #2a2318",borderRadius:10,padding:"10px 20px",color:"#8a7b69",fontSize:13,cursor:"pointer"}}>🔄 Again</button></div>}
{useManual&&!scanResult&&<div style={{flex:1,padding:20}}><div style={{display:"flex",gap:10}}><input style={{flex:1,background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:"12px 14px",color:"#e8dcc8",fontSize:16,outline:"none"}} value={manualCode} onChange={e=>setManualCode(e.target.value)} placeholder="e.g. 0-71610-00203" onKeyDown={e=>e.key==="Enter"&&manLookup()}/><button onClick={manLookup} style={{background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:10,padding:"0 20px",color:"#0f0c08",fontWeight:700,cursor:"pointer"}}>Go</button></div>{scanError&&<div style={{background:"#2a1a1a",border:"1px solid #4a2a2a",borderRadius:10,padding:14,marginTop:14,color:"#c87a7a",fontSize:13}}>⚠️ {scanError}</div>}</div>}
{scanResult&&<div style={{flex:1,padding:20}}><div style={{textAlign:"center",marginBottom:20}}><div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#2a4a2a,#1a3a1a)",border:"2px solid #3a6a3a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 10px"}}>✓</div><p style={{color:"#7ab87a",fontSize:14,fontWeight:700,textTransform:"uppercase"}}>Found!</p></div>
<div style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #2a2318",borderRadius:14,padding:18,marginBottom:20}}><h3 style={{color:"#e8dcc8",fontSize:20,margin:"0 0 4px"}}>{scanResult.cigar.name}</h3><p style={{color:"#8a7b69",fontSize:14,margin:0}}>{scanResult.cigar.brand}</p></div>
<button onClick={()=>onCigarFound({...scanResult.cigar,id:generateId(),inHumidor:true},"humidor")} style={{width:"100%",background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:12,padding:15,color:"#0f0c08",fontSize:15,fontWeight:700,cursor:"pointer",textTransform:"uppercase",marginBottom:10}}>🗄️ Add to Humidor</button>
<button onClick={()=>{setScanResult(null);simScan()}} style={{width:"100%",background:"transparent",border:"1px solid #2a2318",borderRadius:12,padding:12,color:"#6b5e4f",fontSize:13,cursor:"pointer"}}>Scan Another</button></div>}
{!scanResult&&<div style={{padding:"12px 20px calc(env(safe-area-inset-bottom,20px)+4px)"}}><button onClick={()=>{setUseManual(!useManual);setScanError(null)}} style={{width:"100%",background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:12,color:"#8a7b69",fontSize:13,fontWeight:600,cursor:"pointer"}}>{useManual?"📷 Camera":"⌨️ Manual"}</button></div>}
</div>)};

// Cigar Card
const CigarCard=({cigar,onTap,onFavorite,onSmoke,onShare,showSmoke,isFavorite})=>{const avg=getAvgRating(cigar.ratings);return(<div onClick={()=>onTap?.(cigar)} style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #2a2318",borderRadius:12,padding:16,cursor:"pointer",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#D4A754,transparent)"}}/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><h3 style={{fontFamily:"'Playfair Display',serif",color:"#e8dcc8",fontSize:16,margin:"0 0 2px",fontWeight:600}}>{cigar.name}</h3><p style={{color:"#8a7b69",fontSize:13,margin:0}}>{cigar.brand}</p></div>
<div style={{display:"flex",gap:6,alignItems:"center"}}>{onShare&&<button onClick={e=>{e.stopPropagation();onShare(cigar)}} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,padding:"2px 4px",color:"#4a4035"}}>↗</button>}{onFavorite&&<button onClick={e=>{e.stopPropagation();onFavorite(cigar.id)}} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0,color:isFavorite?"#D4A754":"#3a3228"}}>{isFavorite?"★":"☆"}</button>}{showSmoke&&onSmoke&&<button onClick={e=>{e.stopPropagation();onSmoke(cigar.id)}} style={{background:"linear-gradient(135deg,#8B2500,#A0522D)",border:"1px solid #D4A754",borderRadius:8,color:"#D4A754",fontSize:10,padding:"4px 10px",cursor:"pointer",fontWeight:700,textTransform:"uppercase"}}>🔥 Smoke</button>}</div></div>
<div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>{cigar.wrapper&&<Tag label={cigar.wrapper}/>}{cigar.shape&&<Tag label={cigar.shape}/>}{cigar.strength&&<Tag label={cigar.strength}/>}</div>
{cigar.ratings&&avg>0&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}><StarRating value={Math.round(avg)} readonly size={14}/><span style={{color:"#D4A754",fontSize:15,fontWeight:700}}>{avg}</span></div>}
{cigar.photo&&<div style={{marginTop:10,borderRadius:8,overflow:"hidden",maxHeight:120}}><img src={cigar.photo} alt="" style={{width:"100%",objectFit:"cover",borderRadius:8}}/></div>}
</div>)};

// Cigar Modal with autocomplete, loading state, error handling, image crop
const CigarModal=({cigar,onClose,onSave,mode="add"})=>{
const[form,setForm]=useState({name:cigar?.name||"",brand:cigar?.brand||"",wrapper:cigar?.wrapper||"",shape:cigar?.shape||"",strength:cigar?.strength||"",ringGauge:cigar?.ringGauge||"",length:cigar?.length||"",origin:cigar?.origin||"",price:cigar?.price||"",notes:cigar?.notes||"",photo:cigar?.photo||null,ratings:cigar?.ratings||{},inHumidor:cigar?.inHumidor??true});
const[saving,setSaving]=useState(false);const[error,setError]=useState(null);const[cropImage,setCropImage]=useState(null);const fileRef=useRef();
const[brandSuggestions,setBrandSuggestions]=useState([]);const[showBrandSuggestions,setShowBrandSuggestions]=useState(false);
const[suggestions,setSuggestions]=useState([]);const[showSuggestions,setShowSuggestions]=useState(false);const sugRef=useRef(null);

const handleNameChange=(val)=>{
  setForm(f=>({...f,name:val}));
  if(val.length>=2&&mode!=="edit"){
    const q=val.toLowerCase();
    const matches=CIGAR_DATA.filter(c=>c.name.toLowerCase().includes(q)||c.brand.toLowerCase().includes(q)).slice(0,8);
    setSuggestions(matches);
    setShowSuggestions(matches.length>0);
  }else{setSuggestions([]);setShowSuggestions(false)}
};

const handleSelectSuggestion=(c)=>{
  setForm(f=>({...f,name:c.name,brand:c.brand,wrapper:c.wrapper,shape:c.shape,strength:c.strength,ringGauge:c.ringGauge,length:c.length,origin:c.origin,price:c.price}));
  setShowSuggestions(false);setSuggestions([]);
};

const handlePhoto=e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setCropImage(ev.target.result);r.readAsDataURL(f)}};
const handleCropSave=async url=>{const compressed=await compressImage(url,600,0.5);setForm(f=>({...f,photo:compressed}));setCropImage(null)};
const handleSave=async()=>{if(!form.name.trim()||saving)return;setSaving(true);setError(null);try{await onSave({...form,id:cigar?.id||generateId()})}catch(err){console.error("Save error:",err);setError("Failed to save. Try removing the photo or try again.");setSaving(false)}};
const iS={width:"100%",background:"#1a1510",border:"1px solid #2a2318",borderRadius:8,padding:"10px 12px",color:"#e8dcc8",fontSize:14,fontFamily:"'Cormorant Garamond',serif",outline:"none",boxSizing:"border-box"};
const lS={color:"#8a7b69",fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:4,display:"block"};
return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",justifyContent:"center",overflowY:"auto",padding:"20px 0"}}><div style={{background:"#0f0c08",border:"1px solid #2a2318",borderRadius:16,width:"100%",maxWidth:500,margin:"auto",maxHeight:"90vh",overflowY:"auto",padding:"24px 20px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h2 style={{fontFamily:"'Playfair Display',serif",color:"#D4A754",fontSize:22,margin:0}}>{mode==="edit"?"Edit Cigar":"Add to Humidor"}</h2><button onClick={onClose} disabled={saving} style={{background:"none",border:"none",color:"#6b5e4f",fontSize:24,cursor:"pointer"}}>✕</button></div>
<div onClick={()=>!saving&&fileRef.current?.click()} style={{border:"2px dashed #2a2318",borderRadius:12,padding:form.photo?0:30,textAlign:"center",cursor:"pointer",marginBottom:20,overflow:"hidden",background:"#1a1510"}}>{form.photo?<img src={form.photo} alt="" style={{width:"100%",maxHeight:200,objectFit:"cover"}}/>:<div><span style={{fontSize:32}}>📷</span><p style={{color:"#6b5e4f",margin:"8px 0 0",fontSize:13}}>Tap to add photo</p></div>}</div>
<input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
<div style={{display:"grid",gap:12,marginBottom:20}}>
{/* Cigar name with autocomplete */}
<div style={{position:"relative"}}>
  <label style={lS}>Cigar Name *</label>
  <input style={iS} value={form.name} onChange={e=>handleNameChange(e.target.value)} onFocus={()=>{if(suggestions.length>0)setShowSuggestions(true)}} placeholder="Start typing to search 250+ cigars..." autoComplete="off"/>
  {showSuggestions&&suggestions.length>0&&<div ref={sugRef} style={{position:"absolute",top:"100%",left:0,right:0,zIndex:10,background:"#1a1510",border:"1px solid #D4A754",borderRadius:"0 0 10px 10px",maxHeight:240,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.6)"}}>
    {suggestions.map((c,i)=><div key={i} onClick={()=>handleSelectSuggestion(c)} style={{padding:"10px 14px",borderBottom:"1px solid #2a2318",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="#2a2318"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <p style={{color:"#e8dcc8",fontSize:14,margin:0,fontWeight:600}}>{c.name}</p>
      <p style={{color:"#6b5e4f",fontSize:11,margin:"2px 0 0"}}>{c.brand} • {c.wrapper} • {c.shape} • {c.strength}</p>
    </div>)}
    <div onClick={()=>setShowSuggestions(false)} style={{padding:"8px 14px",textAlign:"center",cursor:"pointer",color:"#D4A754",fontSize:12,fontWeight:600,borderTop:"1px solid #2a2318"}}>Not listed? Keep typing to add manually</div>
  </div>}
</div>
<div style={{position:"relative"}}>
  <label style={lS}>Brand</label>
  <input style={iS} value={form.brand} onChange={e=>{const val=e.target.value;setForm(f=>({...f,brand:val}));if(val.length>=2&&mode!=="edit"&&!form.name){const q=val.toLowerCase();const m=CIGAR_DATA.filter(c=>c.brand.toLowerCase().includes(q)).slice(0,6);setBrandSuggestions(m);setShowBrandSuggestions(m.length>0)}else{setBrandSuggestions([]);setShowBrandSuggestions(false)}}} onFocus={()=>{if(form.brand.length>=2&&!form.name&&mode!=="edit"){const q=form.brand.toLowerCase();const m=CIGAR_DATA.filter(c=>c.brand.toLowerCase().includes(q)).slice(0,6);setBrandSuggestions(m);setShowBrandSuggestions(m.length>0)}}} onBlur={()=>setTimeout(()=>setShowBrandSuggestions(false),200)} placeholder="e.g. Padrón" autoComplete="off"/>
  {showBrandSuggestions&&brandSuggestions.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:10,background:"#1a1510",border:"1px solid #D4A754",borderRadius:"0 0 10px 10px",maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.6)"}}>
    {brandSuggestions.map((c,i)=><div key={i} onClick={()=>{handleSelectSuggestion(c);setShowBrandSuggestions(false);setBrandSuggestions([])}} style={{padding:"10px 14px",borderBottom:"1px solid #2a2318",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#2a2318"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <p style={{color:"#e8dcc8",fontSize:14,margin:0,fontWeight:600}}>{c.name}</p>
      <p style={{color:"#6b5e4f",fontSize:11,margin:"2px 0 0"}}>{c.brand} • {c.wrapper} • {c.shape}</p>
    </div>)}
  </div>}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={lS}>Wrapper</label><select style={iS} value={form.wrapper} onChange={e=>setForm(f=>({...f,wrapper:e.target.value}))}><option value="">Select...</option>{WRAPPER_TYPES.map(w=><option key={w}>{w}</option>)}</select></div><div><label style={lS}>Shape</label><select style={iS} value={form.shape} onChange={e=>setForm(f=>({...f,shape:e.target.value}))}><option value="">Select...</option>{SHAPES.map(s=><option key={s}>{s}</option>)}</select></div></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><div><label style={lS}>Strength</label><select style={iS} value={form.strength} onChange={e=>setForm(f=>({...f,strength:e.target.value}))}><option value="">Select...</option>{STRENGTH_LEVELS.map(s=><option key={s}>{s}</option>)}</select></div><div><label style={lS}>Ring Gauge</label><input style={iS} type="number" value={form.ringGauge} onChange={e=>setForm(f=>({...f,ringGauge:e.target.value}))} placeholder="52"/></div><div><label style={lS}>Length</label><input style={iS} value={form.length} onChange={e=>setForm(f=>({...f,length:e.target.value}))} placeholder='6"'/></div></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={lS}>Origin</label><input style={iS} value={form.origin} onChange={e=>setForm(f=>({...f,origin:e.target.value}))} placeholder="Nicaragua"/></div><div><label style={lS}>Price ($)</label><input style={iS} type="number" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="15.00"/></div></div>
</div>
<div style={{marginBottom:20}}><h3 style={{color:"#D4A754",fontSize:16,marginBottom:14}}>Rating System</h3><div style={{display:"grid",gap:14}}>{RATING_CATEGORIES.map(cat=><div key={cat.key} style={{background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:"10px 14px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{color:"#a0927e",fontSize:13,fontWeight:700}}>{cat.icon} {cat.label}</span><span style={{color:"#D4A754",fontSize:14,fontWeight:700}}>{form.ratings[cat.key]||"—"}/10</span></div><StarRating value={form.ratings[cat.key]||0} onChange={val=>setForm(f=>({...f,ratings:{...f.ratings,[cat.key]:val}}))} size={18}/></div>)}</div></div>
<div style={{marginBottom:24}}><label style={lS}>Tasting Notes</label><textarea style={{...iS,minHeight:100,resize:"vertical"}} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Describe flavor, aroma, draw..."/></div>
{error&&<div style={{background:"#2a1515",border:"1px solid #4a2020",borderRadius:8,padding:"10px 14px",marginBottom:12,color:"#c87a7a",fontSize:13}}>{error}</div>}
<button onClick={handleSave} disabled={saving||!form.name.trim()} style={{width:"100%",background:saving?"#6b5e4f":"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:10,padding:14,color:"#0f0c08",fontSize:15,fontFamily:"'Playfair Display',serif",fontWeight:700,cursor:saving?"wait":"pointer",textTransform:"uppercase",opacity:saving?0.7:1}}>{saving?"Saving...":mode==="edit"?"Update":"Add to Humidor"}</button>
</div>{cropImage&&<ImageCropModal imageUrl={cropImage} onSave={handleCropSave} onClose={()=>setCropImage(null)}/>}</div>)};

// Cigar Detail
const CigarDetail=({cigar,onClose,onEdit,onFavorite,onShare,isFavorite})=>{const avg=getAvgRating(cigar.ratings);return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:200,overflowY:"auto",padding:"20px 0"}}><div style={{background:"#0f0c08",border:"1px solid #2a2318",borderRadius:16,maxWidth:500,margin:"auto",overflow:"hidden"}}>
{cigar.photo&&<div style={{maxHeight:220,overflow:"hidden"}}><img src={cigar.photo} alt="" style={{width:"100%",objectFit:"cover"}}/></div>}
<div style={{padding:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><h2 style={{fontFamily:"'Playfair Display',serif",color:"#e8dcc8",fontSize:22,margin:0}}>{cigar.name}</h2><p style={{color:"#8a7b69",fontSize:14,margin:"4px 0 0"}}>{cigar.brand}</p></div><button onClick={onClose} style={{background:"none",border:"none",color:"#6b5e4f",fontSize:24,cursor:"pointer"}}>✕</button></div>
<div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>{cigar.wrapper&&<Tag label={`Wrapper: ${cigar.wrapper}`}/>}{cigar.shape&&<Tag label={cigar.shape}/>}{cigar.strength&&<Tag label={cigar.strength}/>}{cigar.origin&&<Tag label={cigar.origin}/>}{cigar.ringGauge&&<Tag label={`${cigar.ringGauge} RG`}/>}{cigar.price&&<Tag label={`$${Number(cigar.price).toFixed(2)}`}/>}</div>
{avg>0&&<div style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #2a2318",borderRadius:12,padding:16,marginTop:16,textAlign:"center"}}><p style={{color:"#6b5e4f",fontSize:11,textTransform:"uppercase",letterSpacing:"0.15em",margin:"0 0 6px"}}>Overall Rating</p><span style={{fontFamily:"'Playfair Display',serif",fontSize:40,color:"#D4A754",fontWeight:700}}>{avg}</span><span style={{color:"#6b5e4f",fontSize:18}}>/10</span><div style={{display:"flex",justifyContent:"center",marginTop:8}}><StarRating value={Math.round(avg)} readonly size={18}/></div></div>}
{cigar.ratings&&Object.keys(cigar.ratings).length>0&&<div style={{marginTop:16}}><h3 style={{color:"#D4A754",fontSize:14,marginBottom:10}}>Breakdown</h3>{RATING_CATEGORIES.map(cat=>{const v=cigar.ratings[cat.key];if(!v)return null;return<div key={cat.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #1e1a14"}}><span style={{color:"#a0927e",fontSize:13}}>{cat.icon} {cat.label}</span><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:60,height:4,background:"#1e1a14",borderRadius:2,overflow:"hidden"}}><div style={{width:`${v*10}%`,height:"100%",background:"linear-gradient(90deg,#8B6914,#D4A754)",borderRadius:2}}/></div><span style={{color:"#D4A754",fontSize:13,fontWeight:700,minWidth:24,textAlign:"right"}}>{v}</span></div></div>})}</div>}
{cigar.notes&&<div style={{marginTop:16}}><h3 style={{color:"#D4A754",fontSize:14,marginBottom:8}}>Tasting Notes</h3><p style={{color:"#a0927e",fontSize:14,lineHeight:1.6,margin:0}}>{cigar.notes}</p></div>}
<div style={{display:"flex",gap:8,marginTop:20}}><button onClick={()=>onFavorite?.(cigar.id)} style={{flex:1,background:isFavorite?"#2a2318":"transparent",border:"1px solid #2a2318",borderRadius:10,padding:12,color:isFavorite?"#D4A754":"#6b5e4f",fontSize:13,fontWeight:700,cursor:"pointer"}}>{isFavorite?"★ Favorited":"☆ Favorite"}</button><button onClick={()=>onShare?.(cigar)} style={{flex:1,background:"transparent",border:"1px solid #2a2318",borderRadius:10,padding:12,color:"#6b5e4f",fontSize:13,fontWeight:700,cursor:"pointer"}}>↗ Share</button><button onClick={()=>onEdit?.(cigar)} style={{flex:1,background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:10,padding:12,color:"#0f0c08",fontSize:13,fontWeight:700,cursor:"pointer"}}>✎ Edit</button></div>
</div></div></div>)};

// ═══ MAIN APP ═══
export default function CigarLounge({user}){
const[activeTab,setActiveTab]=useState("profile");const[profile,setProfile]=useState(null);const[cigars,setCigars]=useState([]);const[favorites,setFavoritesState]=useState(new Set());const[friendProfiles,setFriendProfiles]=useState([]);const[showAddModal,setShowAddModal]=useState(false);const[showScanner,setShowScanner]=useState(false);const[shareCigar,setShareCigar]=useState(null);const[editCigar,setEditCigar]=useState(null);const[viewCigar,setViewCigar]=useState(null);const[viewFriend,setViewFriend]=useState(null);const[viewFriendCigars,setViewFriendCigars]=useState([]);
const[viewFriendActivity,setViewFriendActivity]=useState([]);
const[viewFriendFavs,setViewFriendFavs]=useState(new Set());
const[pendingProfiles,setPendingProfiles]=useState([]);const[searchQuery,setSearchQuery]=useState("");const[editProfile,setEditProfile]=useState(false);const[friendSearch,setFriendSearch]=useState("");const[friendSearchResults,setFriendSearchResults]=useState([]);const[friendSearching,setFriendSearching]=useState(false);const[scanToast,setScanToast]=useState(null);const[loading,setLoading]=useState(true);const[cropProfileImage,setCropProfileImage]=useState(null);
const[myActivity,setMyActivity]=useState([]);
const[friendViewTab,setFriendViewTab]=useState("overview");
const[ratingFilter,setRatingFilter]=useState("all");const profilePhotoRef=useRef(null);const uid=user.uid;

useEffect(()=>{const u=[];u.push(onUserProfile(uid,p=>{setProfile(p);setLoading(false)}));u.push(onCigars(uid,setCigars));u.push(onFavorites(uid,setFavoritesState));return()=>u.forEach(x=>x())},[uid]);
useEffect(()=>{if(profile?.friends?.length>0)getFriendProfiles(profile.friends).then(setFriendProfiles);else setFriendProfiles([])},[profile?.friends]);
// Load own activity
useEffect(()=>{getUserActivity(uid,15).then(setMyActivity).catch(()=>setMyActivity([]))},[cigars]);

const humidorCigars=cigars.filter(c=>c.inHumidor);const allRated=cigars.filter(c=>c.ratings&&Object.keys(c.ratings).length>0);const favoriteCigars=cigars.filter(c=>favorites.has(c.id));

const handleAddCigar=async cigar=>{try{await saveCigar(uid,{...cigar,dateAdded:cigar.dateAdded||new Date().toISOString()});try{await postActivity(uid,{type:"add_humidor",cigarName:cigar.name,cigarBrand:cigar.brand,cigarId:cigar.id})}catch{}setShowAddModal(false);setEditCigar(null)}catch(e){console.error(e);throw e}};
const handleScannedCigar=async(cigar,dest)=>{try{await saveCigar(uid,{...cigar,dateAdded:new Date().toISOString()});if(dest==="favorites")await saveFavoritesToDb(uid,[...favorites,cigar.id]);setShowScanner(false);setScanToast(`${cigar.name} added!`);setTimeout(()=>setScanToast(null),3000)}catch(e){console.error(e)}};
const handleSmoke=async id=>{const c=cigars.find(x=>x.id===id);if(c)try{await saveCigar(uid,{...c,inHumidor:false,smokedDate:new Date().toISOString()});try{await postActivity(uid,{type:"smoke",cigarName:c.name,cigarBrand:c.brand,cigarId:c.id,rating:getAvgRating(c.ratings)})}catch{}}catch(e){console.error(e)}};
const handleToggleFavorite=async id=>{const n=new Set(favorites);n.has(id)?n.delete(id):n.add(id);try{await saveFavoritesToDb(uid,[...n])}catch(e){console.error(e)}};
const handleSearchFriends=async()=>{if(!friendSearch.trim())return;setFriendSearching(true);try{const r=await searchUsers(friendSearch.trim());setFriendSearchResults(r.filter(x=>x.id!==uid))}catch{setFriendSearchResults([])}setFriendSearching(false)};
const handleAddFriend=async fid=>{try{await sendFriendRequest(uid,fid);setFriendSearch("");setFriendSearchResults([]);setScanToast("Friend request sent!");setTimeout(()=>setScanToast(null),3000)}catch{}};
const handleRemoveFriend=async fid=>{try{await removeFriendDb(uid,fid)}catch{}};
const handleViewFriend=async f=>{setViewFriend(f);setFriendViewTab("overview");try{setViewFriendCigars(await getFriendCigars(f.id));setViewFriendActivity(await getUserActivity(f.id,15));setViewFriendFavs(await getFriendFavorites(f.id))}catch{setViewFriendCigars([]);setViewFriendActivity([]);setViewFriendFavs(new Set())}};

// Load pending request profiles
useEffect(()=>{if(profile?.friendRequestsIn?.length>0)getFriendProfiles(profile.friendRequestsIn).then(setPendingProfiles);else setPendingProfiles([])},[profile?.friendRequestsIn]);
const handleSignOut=async()=>{await signOut(auth)};
const handleUpdateProfile=async data=>{try{await updateUserProfile(uid,data)}catch(e){console.error(e)}setEditProfile(false)};
const handleProfilePhoto=e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setCropProfileImage(ev.target.result);r.readAsDataURL(f)}};
const handleProfileCropSave=async url=>{const c=await compressProfilePhoto(url);await handleUpdateProfile({photo:c});setCropProfileImage(null)};
const filtered=list=>{if(!searchQuery)return list;const q=searchQuery.toLowerCase();return list.filter(c=>c.name?.toLowerCase().includes(q)||c.brand?.toLowerCase().includes(q))};
const tabs=[{id:"profile",label:"Profile",icon:"👤"},{id:"humidor",label:"Humidor",icon:"🗄️"},{id:"ratings",label:"Ratings",icon:"⭐"},{id:"favorites",label:"Favorites",icon:"❤️"},{id:"friends",label:"Friends",icon:"👥"}];

if(loading||!profile)return<div style={{background:"#0f0c08",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:"#D4A754",fontFamily:"'Playfair Display',serif",fontSize:18}}>Loading...</p></div>;

return(<div style={{background:"#0f0c08",minHeight:"100vh",fontFamily:"'Cormorant Garamond',Georgia,serif",color:"#e8dcc8",maxWidth:500,margin:"0 auto",paddingBottom:70,position:"relative"}}>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet"/>
{scanToast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#2a4a2a,#1a3a1a)",border:"1px solid #3a6a3a",borderRadius:12,padding:"12px 20px",color:"#7ab87a",fontSize:14,fontWeight:700,zIndex:400}}>✓ {scanToast}</div>}
<div style={{position:"relative",zIndex:2}}>

{/* PROFILE */}
{activeTab==="profile"&&<><Header title="Profile" rightAction={<button onClick={handleSignOut} style={{background:"transparent",border:"1px solid #2a2318",borderRadius:8,padding:"6px 12px",color:"#6b5e4f",fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"uppercase"}}>Sign Out</button>}/>
<div style={{padding:20}}><div style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #2a2318",borderRadius:16,padding:24,textAlign:"center",marginBottom:20,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,right:0,height:60,background:"linear-gradient(135deg,#2a2014,#1a1510)"}}/>
<div style={{position:"relative",width:80,height:80,margin:"0 auto 12px"}}><div onClick={()=>profilePhotoRef.current?.click()} style={{width:80,height:80,borderRadius:"50%",background:profile.photo?"none":"linear-gradient(135deg,#D4A754,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:28,color:"#0f0c08",fontWeight:700,border:"3px solid #0f0c08",cursor:"pointer",overflow:"hidden",position:"relative"}}>{profile.photo?<img src={profile.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:profile.avatar}</div><div onClick={()=>profilePhotoRef.current?.click()} style={{position:"absolute",bottom:-2,right:-2,width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"2px solid #0f0c08",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12}}>📷</div><input ref={profilePhotoRef} type="file" accept="image/*" onChange={handleProfilePhoto} style={{display:"none"}}/></div>
{editProfile?<div style={{display:"grid",gap:10,textAlign:"left"}}><input style={{width:"100%",background:"#0f0c08",border:"1px solid #2a2318",borderRadius:8,padding:"8px 12px",color:"#e8dcc8",fontSize:14,outline:"none",boxSizing:"border-box"}} defaultValue={profile.name} onBlur={e=>handleUpdateProfile({name:e.target.value,avatar:e.target.value.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"AF"})}/><textarea style={{width:"100%",background:"#0f0c08",border:"1px solid #2a2318",borderRadius:8,padding:"8px 12px",color:"#e8dcc8",fontSize:14,outline:"none",minHeight:60,resize:"vertical",boxSizing:"border-box"}} defaultValue={profile.bio} onBlur={e=>handleUpdateProfile({bio:e.target.value})}/><button onClick={()=>setEditProfile(false)} style={{background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:8,padding:10,color:"#0f0c08",fontSize:13,fontWeight:700,cursor:"pointer"}}>Done</button></div>:<>
<h2 style={{fontFamily:"'Playfair Display',serif",color:"#e8dcc8",fontSize:22,margin:"0 0 4px"}}>{profile.name}</h2><p style={{color:"#6b5e4f",fontSize:12,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.1em"}}>Member since {profile.joinDate}</p><p style={{color:"#5a5040",fontSize:11,margin:"0 0 8px"}}>{profile.email}</p><p style={{color:"#8a7b69",fontSize:14,fontStyle:"italic",margin:"0 0 12px"}}>"{profile.bio}"</p><button onClick={()=>setEditProfile(true)} style={{background:"transparent",border:"1px solid #2a2318",borderRadius:8,padding:"6px 16px",color:"#6b5e4f",fontSize:12,fontWeight:600,cursor:"pointer"}}>Edit Profile</button></>}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>{[{icon:"🗄️",label:"In Humidor",value:humidorCigars.length,tab:"humidor",filter:"all"},{icon:"🔥",label:"Smoked",value:cigars.filter(c=>!c.inHumidor).length,tab:"ratings",filter:"smoked"},{icon:"⭐",label:"Total Rated",value:allRated.length,tab:"ratings",filter:"all"},{icon:"❤️",label:"Favorites",value:favoriteCigars.length,tab:"favorites",filter:"all"}].map(s=><div key={s.label} onClick={()=>{setActiveTab(s.tab);setSearchQuery("");setRatingFilter(s.filter)}} style={{background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:14,textAlign:"center",cursor:"pointer"}}><span style={{fontSize:22}}>{s.icon}</span><p style={{fontFamily:"'Playfair Display',serif",color:"#D4A754",fontSize:24,margin:"4px 0 2px",fontWeight:700}}>{s.value}</p><p style={{color:"#6b5e4f",fontSize:10,margin:0,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{s.label}</p></div>)}</div>
{allRated.length>0&&<div style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #2a2318",borderRadius:12,padding:16}}><h3 style={{color:"#D4A754",fontSize:15,margin:"0 0 12px"}}>🏆 Top Rated</h3>{[...allRated].sort((a,b)=>getAvgRating(b.ratings)-getAvgRating(a.ratings)).slice(0,3).map((c,i)=><div key={c.id} onClick={()=>setViewCigar(c)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<2?"1px solid #1e1a14":"none",cursor:"pointer"}}><span style={{color:i===0?"#D4A754":"#6b5e4f",fontSize:18,fontWeight:700,minWidth:24}}>#{i+1}</span><div style={{flex:1}}><p style={{color:"#e8dcc8",fontSize:14,margin:0}}>{c.name}</p><p style={{color:"#6b5e4f",fontSize:12,margin:"2px 0 0"}}>{c.brand}</p></div><span style={{color:"#D4A754",fontSize:16,fontWeight:700}}>{getAvgRating(c.ratings)}</span><span style={{color:"#3a3228",fontSize:14}}>›</span></div>)}</div>}
{/* Own Activity Feed */}
{myActivity.length>0&&<div style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #2a2318",borderRadius:12,padding:16,marginTop:16}}>
<h3 style={{color:"#D4A754",fontSize:15,margin:"0 0 12px"}}>📋 Recent Activity</h3>
{myActivity.slice(0,8).map((a,i)=>{
const date=a.timestamp?new Date(a.timestamp.seconds*1000).toLocaleDateString("en-US",{month:"short",day:"numeric"}):"";
const icon=a.type==="smoke"?"🔥":a.type==="add_humidor"?"🗄️":a.type==="rate"?"⭐":"❤️";
const action=a.type==="smoke"?"Smoked":a.type==="add_humidor"?"Added to humidor":a.type==="rate"?"Rated":"Favorited";
return<div key={a.id||i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:i<myActivity.slice(0,8).length-1?"1px solid #2a2318":"none"}}>
<span style={{fontSize:16,marginTop:2}}>{icon}</span>
<div style={{flex:1}}><p style={{color:"#a0927e",fontSize:13,margin:0}}>{action} <strong style={{color:"#e8dcc8"}}>{a.cigarName}</strong></p>
<p style={{color:"#4a4035",fontSize:11,margin:"2px 0 0"}}>{a.cigarBrand}{date?` • ${date}`:""}</p>
{a.rating&&a.rating>0&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:3}}><StarRating value={Math.round(a.rating)} readonly size={10}/><span style={{color:"#D4A754",fontSize:11,fontWeight:700}}>{a.rating}</span></div>}
</div></div>})}
</div>}
</div></>}

{/* HUMIDOR */}
{activeTab==="humidor"&&<><Header title="My Humidor" subtitle={`${humidorCigars.length} cigar${humidorCigars.length!==1?"s":""}`} rightAction={<div style={{display:"flex",gap:8}}><button onClick={()=>setShowScanner(true)} style={{background:"transparent",border:"1px solid #D4A754",borderRadius:10,padding:"8px 12px",color:"#D4A754",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>📷 Scan</button><button onClick={()=>setShowAddModal(true)} style={{background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:10,padding:"8px 16px",color:"#0f0c08",fontSize:13,fontWeight:700,cursor:"pointer",textTransform:"uppercase"}}>+ Add</button></div>}/>
<div style={{padding:"12px 20px"}}><input style={{width:"100%",background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:"10px 14px",color:"#e8dcc8",fontSize:14,outline:"none",boxSizing:"border-box"}} placeholder="🔍 Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/></div>
<div style={{padding:"0 20px",display:"grid",gap:12}}>{filtered(humidorCigars).length===0?<div style={{textAlign:"center",padding:"40px 0"}}><span style={{fontSize:48}}>🗄️</span><p style={{color:"#6b5e4f",fontSize:15,marginTop:12}}>{searchQuery?"No matches":"Your humidor is empty"}</p>{!searchQuery&&<div style={{display:"flex",gap:10,justifyContent:"center",marginTop:12}}><button onClick={()=>setShowScanner(true)} style={{background:"transparent",border:"1px solid #D4A754",borderRadius:10,padding:"10px 20px",color:"#D4A754",fontSize:13,fontWeight:700,cursor:"pointer"}}>📷 Scan</button><button onClick={()=>setShowAddModal(true)} style={{background:"transparent",border:"1px solid #2a2318",borderRadius:10,padding:"10px 20px",color:"#6b5e4f",fontSize:13,fontWeight:700,cursor:"pointer"}}>Add Manually</button></div>}</div>:filtered(humidorCigars).map(c=><CigarCard key={c.id} cigar={c} onTap={setViewCigar} onFavorite={handleToggleFavorite} onSmoke={handleSmoke} onShare={setShareCigar} showSmoke isFavorite={favorites.has(c.id)}/>)}</div></>}

{/* RATINGS */}
{activeTab==="ratings"&&(()=>{const smokedCigars=cigars.filter(c=>!c.inHumidor);const displayList=ratingFilter==="smoked"?smokedCigars:allRated;const title=ratingFilter==="smoked"?"Smoked":"All Ratings";const subtitle=ratingFilter==="smoked"?`${smokedCigars.length} smoked`:`${allRated.length} rated`;return<><Header title={title} subtitle={subtitle}/>
<div style={{padding:"8px 20px 4px",display:"flex",gap:8}}>
<button onClick={()=>setRatingFilter("all")} style={{background:ratingFilter==="all"?"#2a2318":"transparent",border:"1px solid #2a2318",borderRadius:8,padding:"6px 14px",color:ratingFilter==="all"?"#D4A754":"#6b5e4f",fontSize:12,fontWeight:600,cursor:"pointer"}}>⭐ All Rated</button>
<button onClick={()=>setRatingFilter("smoked")} style={{background:ratingFilter==="smoked"?"#2a2318":"transparent",border:"1px solid #2a2318",borderRadius:8,padding:"6px 14px",color:ratingFilter==="smoked"?"#D4A754":"#6b5e4f",fontSize:12,fontWeight:600,cursor:"pointer"}}>🔥 Smoked</button>
</div>
<div style={{padding:"8px 20px 12px"}}><input style={{width:"100%",background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:"10px 14px",color:"#e8dcc8",fontSize:14,outline:"none",boxSizing:"border-box"}} placeholder="🔍 Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/></div>
<div style={{padding:"0 20px",display:"grid",gap:12}}>{filtered(displayList).length===0?<div style={{textAlign:"center",padding:"40px 0"}}><span style={{fontSize:48}}>{ratingFilter==="smoked"?"🔥":"⭐"}</span><p style={{color:"#6b5e4f"}}>{ratingFilter==="smoked"?"No smoked cigars yet":"No ratings yet"}</p></div>:filtered(displayList).sort((a,b)=>ratingFilter==="smoked"?((b.smokedDate||b.dateAdded||"")>(a.smokedDate||a.dateAdded||"")?1:-1):(getAvgRating(b.ratings)-getAvgRating(a.ratings))).map(c=><CigarCard key={c.id} cigar={c} onTap={setViewCigar} onFavorite={handleToggleFavorite} onShare={setShareCigar} isFavorite={favorites.has(c.id)}/>)}</div></>})()}

{/* FAVORITES */}
{activeTab==="favorites"&&<><Header title="Favorites" subtitle={`${favoriteCigars.length} cigar${favoriteCigars.length!==1?"s":""}`}/><div style={{padding:"0 20px",display:"grid",gap:12,marginTop:12}}>{favoriteCigars.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><span style={{fontSize:48}}>❤️</span><p style={{color:"#6b5e4f"}}>No favorites yet</p></div>:favoriteCigars.map(c=><CigarCard key={c.id} cigar={c} onTap={setViewCigar} onFavorite={handleToggleFavorite} onShare={setShareCigar} isFavorite/>)}</div></>}

{/* FRIENDS */}
{activeTab==="friends"&&<><Header title="Cigar Circle" subtitle={`${friendProfiles.length} friend${friendProfiles.length!==1?"s":""}`}/>
<div style={{padding:"12px 20px"}}><div style={{display:"flex",gap:10}}><input style={{flex:1,background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:"10px 14px",color:"#e8dcc8",fontSize:14,outline:"none"}} placeholder="Search by email..." value={friendSearch} onChange={e=>setFriendSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearchFriends()}/><button onClick={handleSearchFriends} disabled={friendSearching} style={{background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:10,padding:"0 18px",color:"#0f0c08",fontSize:13,fontWeight:700,cursor:"pointer"}}>{friendSearching?"...":"Search"}</button></div>
{friendSearchResults.length>0&&<div style={{marginTop:10,display:"grid",gap:8}}>{friendSearchResults.map(r=><div key={r.id} style={{background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:12,display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#D4A754,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#0f0c08",fontWeight:700}}>{r.avatar}</div><div style={{flex:1}}><p style={{color:"#e8dcc8",fontSize:14,margin:0}}>{r.name}</p><p style={{color:"#5a5040",fontSize:11,margin:0}}>{r.email}</p></div>{profile.friends?.includes(r.id)?<span style={{color:"#7ab87a",fontSize:11}}>✓ Friends</span>:profile.friendRequestsOut?.includes(r.id)?<span style={{color:"#D4A754",fontSize:11}}>Pending</span>:<button onClick={()=>handleAddFriend(r.id)} style={{background:"linear-gradient(135deg,#D4A754,#B8943F)",border:"none",borderRadius:8,padding:"6px 14px",color:"#0f0c08",fontSize:12,fontWeight:700,cursor:"pointer"}}>Add</button>}</div>)}</div>}
</div>
<div style={{padding:"0 20px",display:"grid",gap:10}}>
{/* Pending Friend Requests */}
{profile.friendRequestsIn?.length>0&&<div style={{marginBottom:10}}>
<p style={{color:"#D4A754",fontSize:12,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,margin:"0 0 8px"}}>Friend Requests ({profile.friendRequestsIn.length})</p>
{profile.friendRequestsIn.map(reqId=>{const rp=pendingProfiles.find(f=>f.id===reqId);return<PendingRequest key={reqId} profile={rp} onAccept={async()=>{try{await acceptFriendRequest(uid,reqId);setScanToast("Friend added!");setTimeout(()=>setScanToast(null),3000)}catch{}}} onDecline={async()=>{try{await declineFriendRequest(uid,reqId)}catch{}}}/> })}
</div>}
{friendProfiles.length===0&&!(profile.friendRequestsIn?.length>0)?<div style={{textAlign:"center",padding:"40px 0"}}><span style={{fontSize:48}}>👥</span><p style={{color:"#6b5e4f"}}>No friends yet</p><p style={{color:"#4a4035",fontSize:13}}>Search by email to add friends</p></div>:friendProfiles.map(f=><div key={f.id} onClick={()=>handleViewFriend(f)} style={{background:"linear-gradient(135deg,#1e1a14,#16120d)",border:"1px solid #2a2318",borderRadius:12,padding:16,cursor:"pointer",display:"flex",alignItems:"center",gap:14}}><div style={{width:46,height:46,borderRadius:"50%",background:f.photo?"none":"linear-gradient(135deg,#D4A754,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#0f0c08",fontWeight:700,flexShrink:0,overflow:"hidden"}}>{f.photo?<img src={f.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:f.avatar}</div><div style={{flex:1}}><h3 style={{color:"#e8dcc8",fontSize:15,margin:0}}>{f.name}</h3><p style={{color:"#6b5e4f",fontSize:12,margin:"2px 0 0"}}>Member since {f.joinDate}</p></div><span style={{color:"#3a3228",fontSize:18}}>›</span></div>)}</div></>}
</div>

{/* MODALS */}
{(showAddModal||editCigar)&&<CigarModal cigar={editCigar} mode={editCigar?"edit":"add"} onClose={()=>{setShowAddModal(false);setEditCigar(null)}} onSave={handleAddCigar}/>}
{viewCigar&&!editCigar&&<CigarDetail cigar={viewCigar} onClose={()=>setViewCigar(null)} onEdit={c=>{setViewCigar(null);setEditCigar(c)}} onFavorite={handleToggleFavorite} onShare={c=>{setViewCigar(null);setShareCigar(c)}} isFavorite={favorites.has(viewCigar.id)}/>}
{viewFriend&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:200,overflowY:"auto",padding:"20px 0"}}><div style={{background:"#0f0c08",border:"1px solid #2a2318",borderRadius:16,maxWidth:500,margin:"auto",overflow:"hidden"}}>
{/* Friend Profile Header */}
<div style={{padding:24,textAlign:"center",position:"relative",background:"linear-gradient(135deg,#1e1a14,#16120d)"}}>
<button onClick={()=>setViewFriend(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",color:"#6b5e4f",fontSize:24,cursor:"pointer"}}>✕</button>
<div style={{width:70,height:70,borderRadius:"50%",background:viewFriend.photo?"none":"linear-gradient(135deg,#D4A754,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"#0f0c08",fontWeight:700,margin:"0 auto 10px",border:"3px solid #0f0c08",overflow:"hidden"}}>{viewFriend.photo?<img src={viewFriend.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:viewFriend.avatar}</div>
<h2 style={{fontFamily:"'Playfair Display',serif",color:"#e8dcc8",fontSize:22,margin:"0 0 4px"}}>{viewFriend.name}</h2>
<p style={{color:"#6b5e4f",fontSize:12,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.1em"}}>Member since {viewFriend.joinDate}</p>
{viewFriend.bio&&<p style={{color:"#8a7b69",fontSize:13,fontStyle:"italic",margin:"4px 0 0"}}>"{viewFriend.bio}"</p>}
</div>
{/* Friend Stats - Clickable */}
<div style={{padding:"16px 20px"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
{[{icon:"🗄️",label:"Humidor",value:viewFriendCigars.filter(c=>c.inHumidor).length,key:"humidor"},{icon:"🔥",label:"Smoked",value:viewFriendCigars.filter(c=>!c.inHumidor).length,key:"smoked"},{icon:"⭐",label:"Rated",value:viewFriendCigars.filter(c=>c.ratings&&Object.keys(c.ratings).length>0).length,key:"rated"},{icon:"❤️",label:"Favorites",value:viewFriendFavs.size,key:"favorites"}].map(s=><div key={s.label} onClick={()=>setFriendViewTab(friendViewTab===s.key?"overview":s.key)} style={{background:friendViewTab===s.key?"#2a2318":"#1a1510",border:`1px solid ${friendViewTab===s.key?"#D4A754":"#2a2318"}`,borderRadius:10,padding:12,textAlign:"center",cursor:"pointer",transition:"all 0.2s"}}><span style={{fontSize:18}}>{s.icon}</span><p style={{fontFamily:"'Playfair Display',serif",color:"#D4A754",fontSize:20,margin:"2px 0 1px",fontWeight:700}}>{s.value}</p><p style={{color:"#6b5e4f",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{s.label}</p></div>)}
</div>

{/* Sub-view based on selected tile */}
{friendViewTab!=="overview"&&<div style={{marginBottom:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<h3 style={{color:"#D4A754",fontSize:14,margin:0}}>{friendViewTab==="humidor"?"🗄️ In Humidor":friendViewTab==="smoked"?"🔥 Smoked":friendViewTab==="rated"?"⭐ Rated":"❤️ Favorites"}</h3>
<button onClick={()=>setFriendViewTab("overview")} style={{background:"none",border:"none",color:"#6b5e4f",fontSize:12,cursor:"pointer"}}>✕ Close</button>
</div>
<div style={{display:"grid",gap:8}}>
{(friendViewTab==="humidor"?viewFriendCigars.filter(c=>c.inHumidor):friendViewTab==="smoked"?viewFriendCigars.filter(c=>!c.inHumidor):friendViewTab==="rated"?viewFriendCigars.filter(c=>c.ratings&&Object.keys(c.ratings).length>0):viewFriendCigars.filter(c=>viewFriendFavs.has(c.id))).map(c=><div key={c.id} style={{background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:12}}>
<h4 style={{color:"#e8dcc8",fontSize:14,margin:"0 0 2px"}}>{c.name}</h4>
<p style={{color:"#6b5e4f",fontSize:12,margin:0}}>{c.brand}{c.wrapper?` • ${c.wrapper}`:""}</p>
{c.ratings&&getAvgRating(c.ratings)>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}><StarRating value={Math.round(getAvgRating(c.ratings))} readonly size={12}/><span style={{color:"#D4A754",fontSize:12,fontWeight:700}}>{getAvgRating(c.ratings)}</span></div>}
{c.notes&&<p style={{color:"#8a7b69",fontSize:12,margin:"6px 0 0",fontStyle:"italic"}}>"{c.notes}"</p>}
</div>)}
{(friendViewTab==="humidor"?viewFriendCigars.filter(c=>c.inHumidor):friendViewTab==="smoked"?viewFriendCigars.filter(c=>!c.inHumidor):friendViewTab==="rated"?viewFriendCigars.filter(c=>c.ratings&&Object.keys(c.ratings).length>0):viewFriendCigars.filter(c=>viewFriendFavs.has(c.id))).length===0&&<p style={{color:"#4a4035",fontSize:13,textAlign:"center",padding:"12px 0"}}>Nothing here yet</p>}
</div>
</div>}

{/* Friend's Top Rated - only show in overview */}
{friendViewTab==="overview"&&viewFriendCigars.filter(c=>c.ratings&&Object.keys(c.ratings).length>0).length>0&&<div style={{background:"#1a1510",border:"1px solid #2a2318",borderRadius:12,padding:14,marginBottom:16}}>
<h3 style={{color:"#D4A754",fontSize:14,margin:"0 0 10px"}}>🏆 Top Rated</h3>
{[...viewFriendCigars].filter(c=>c.ratings&&Object.keys(c.ratings).length>0).sort((a,b)=>getAvgRating(b.ratings)-getAvgRating(a.ratings)).slice(0,3).map((c,i)=><div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<2?"1px solid #2a2318":"none"}}>
<span style={{color:i===0?"#D4A754":"#6b5e4f",fontSize:16,fontWeight:700,minWidth:22}}>#{i+1}</span>
<div style={{flex:1}}><p style={{color:"#e8dcc8",fontSize:13,margin:0}}>{c.name}</p><p style={{color:"#6b5e4f",fontSize:11,margin:"1px 0 0"}}>{c.brand}</p></div>
<span style={{color:"#D4A754",fontSize:14,fontWeight:700}}>{getAvgRating(c.ratings)}</span>
</div>)}
</div>}
{/* Activity Feed - overview only */}
{friendViewTab==="overview"&&<div style={{marginBottom:16}}>
<h3 style={{color:"#D4A754",fontSize:14,margin:"0 0 10px"}}>📋 Recent Activity</h3>
{viewFriendActivity.length===0?<p style={{color:"#4a4035",fontSize:13,textAlign:"center",padding:"12px 0"}}>No recent activity</p>:viewFriendActivity.slice(0,10).map((a,i)=>{
const date=a.timestamp?new Date(a.timestamp.seconds*1000).toLocaleDateString("en-US",{month:"short",day:"numeric"}):""
const icon=a.type==="smoke"?"🔥":a.type==="add_humidor"?"🗄️":a.type==="rate"?"⭐":"❤️";
const action=a.type==="smoke"?"smoked":a.type==="add_humidor"?"added to humidor":a.type==="rate"?"rated":"favorited";
return<div key={a.id||i} style={{background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:12,marginBottom:8}}>
<div style={{display:"flex",alignItems:"flex-start",gap:10}}>
<span style={{fontSize:18,marginTop:2}}>{icon}</span>
<div style={{flex:1}}>
<p style={{color:"#a0927e",fontSize:13,margin:0}}><strong style={{color:"#e8dcc8"}}>{viewFriend.name.split(" ")[0]}</strong> {action} <strong style={{color:"#e8dcc8"}}>{a.cigarName}</strong></p>
<p style={{color:"#4a4035",fontSize:11,margin:"4px 0 0"}}>{a.cigarBrand} • {date}</p>
{a.rating&&a.rating>0&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}><StarRating value={Math.round(a.rating)} readonly size={10}/><span style={{color:"#D4A754",fontSize:11,fontWeight:700}}>{a.rating}</span></div>}
</div>
</div>
</div>})}
</div>}
{/* All Cigars - overview only */}
{friendViewTab==="overview"&&<details style={{marginBottom:16}}>
<summary style={{color:"#D4A754",fontSize:14,fontWeight:600,cursor:"pointer",padding:"8px 0"}}>View All Cigars ({viewFriendCigars.length})</summary>
<div style={{display:"grid",gap:8,marginTop:8}}>{viewFriendCigars.map(c=><div key={c.id} style={{background:"#1a1510",border:"1px solid #2a2318",borderRadius:10,padding:12}}><h4 style={{color:"#e8dcc8",fontSize:14,margin:"0 0 2px"}}>{c.name}</h4><p style={{color:"#6b5e4f",fontSize:12,margin:0}}>{c.brand}{c.wrapper?` • ${c.wrapper}`:""}{c.inHumidor?"":" • 🔥 Smoked"}</p>{c.ratings&&getAvgRating(c.ratings)>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}><StarRating value={Math.round(getAvgRating(c.ratings))} readonly size={12}/><span style={{color:"#D4A754",fontSize:12,fontWeight:700}}>{getAvgRating(c.ratings)}</span></div>}{c.notes&&<p style={{color:"#8a7b69",fontSize:12,margin:"6px 0 0",fontStyle:"italic"}}>"{c.notes}"</p>}</div>)}</div>
</details>}
{/* Remove Friend */}
<div style={{paddingTop:12,borderTop:"1px solid #1e1a14"}}><button onClick={()=>{handleRemoveFriend(viewFriend.id);setViewFriend(null)}} style={{width:"100%",background:"transparent",border:"1px solid #3a2020",borderRadius:10,padding:12,color:"#8a4a4a",fontSize:13,fontWeight:600,cursor:"pointer"}}>Remove Friend</button></div>
</div>
</div></div>}
{showScanner&&<BarcodeScanner onClose={()=>setShowScanner(false)} onCigarFound={handleScannedCigar}/>}
{shareCigar&&<ShareModal cigar={shareCigar} onClose={()=>setShareCigar(null)}/>}
{cropProfileImage&&<ImageCropModal imageUrl={cropProfileImage} onSave={handleProfileCropSave} onClose={()=>setCropProfileImage(null)} isProfile/>}
<TabBar tabs={tabs} active={activeTab} onChange={t=>{setActiveTab(t);setSearchQuery("")}}/>
</div>)}
