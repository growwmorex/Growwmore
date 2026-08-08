import {STOCK_MEDIA} from "@/lib/stockMedia";
export default function LuxuryBackground(){return <div className="luxuryBackground" aria-hidden="true">
 <video autoPlay muted loop playsInline preload="auto" poster={STOCK_MEDIA.heroPoster}><source src={STOCK_MEDIA.heroVideo} type="video/mp4"/></video>
 <div className="stockSlides workStockSlides"><span style={{backgroundImage:`url("${STOCK_MEDIA.resinArtist}")`}}/><span style={{backgroundImage:`url("${STOCK_MEDIA.creatorWork}")`}}/><span style={{backgroundImage:`url("${STOCK_MEDIA.artisanStudio}")`}}/><span style={{backgroundImage:`url("${STOCK_MEDIA.handmadeBusiness}")`}}/></div>
 <div className="videoVeil"/><span className="ambientOrb one"/><span className="ambientOrb two"/>
 </div>}
