import {STOCK_MEDIA} from "@/lib/stockMedia";
export default function LuxuryBackground(){return <div className="luxuryBackground" aria-hidden="true">
 <video autoPlay muted loop playsInline preload="auto" poster={STOCK_MEDIA.heroPoster} style={{opacity:.17,filter:"saturate(.72) contrast(1.08) brightness(.72)"}}><source src={STOCK_MEDIA.heroVideo} type="video/mp4"/></video>
 <div className="stockSlides workStockSlides" style={{opacity:.55}}>
   <span style={{backgroundImage:`url("${STOCK_MEDIA.resinArtist}")`,animationDuration:"12s"}}/>
   <span style={{backgroundImage:`url("${STOCK_MEDIA.creatorWork}")`,animationDuration:"12s"}}/>
   <span style={{backgroundImage:`url("${STOCK_MEDIA.artisanStudio}")`,animationDuration:"12s"}}/>
   <span style={{backgroundImage:`url("${STOCK_MEDIA.handmadeBusiness}")`,animationDuration:"12s"}}/>
 </div>
 <div className="videoVeil" style={{background:"linear-gradient(180deg,rgba(16,23,25,.56),rgba(16,23,25,.93)),linear-gradient(115deg,rgba(34,65,65,.28),rgba(41,46,30,.38))"}}/><span className="ambientOrb one"/><span className="ambientOrb two"/>
 </div>}