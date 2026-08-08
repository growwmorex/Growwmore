import {STOCK_MEDIA} from "@/lib/stockMedia";
export default function LuxuryBackground(){
  return <div className="luxuryBackground" aria-hidden="true">
    <video autoPlay muted loop playsInline poster={STOCK_MEDIA.heroPoster}>
      <source src={STOCK_MEDIA.heroVideo} type="video/mp4"/>
    </video>
    <div className="stockSlides">
      <span style={{backgroundImage:`url("${STOCK_MEDIA.marble}")`}}/>
      <span style={{backgroundImage:`url("${STOCK_MEDIA.interior}")`}}/>
      <span style={{backgroundImage:`url("${STOCK_MEDIA.lounge}")`}}/>
    </div>
    <div className="videoVeil"/>
    <span className="ambientOrb one"/><span className="ambientOrb two"/>
  </div>
}