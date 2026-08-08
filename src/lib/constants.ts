export const BRAND = {
  name: "Growwmore",
  supportPhone: "9743254743",
  supportEmail: "growwmorex1@gmail.com",
  paymentPhone: "9019254743",
  upiId: "tradewithsyed@ybl",
  adminEmail: "syedafsharkhadri63@gmail.com"
} as const;

export const PACKAGES = [
  { id:"signature-5", name:"Signature Wall Art", price:5000, commission:1000,
    includes:["Luxury Geode Resin Wall Art"] },
  { id:"heritage-8", name:"Heritage Décor Collection", price:8000, commission:1500,
    includes:["Luxury Resin Wall Clock","Geode Resin Mirror","Bless This Home Resin Plaque"] },
  { id:"atelier-10", name:"Atelier Statement Collection", price:10000, commission:2500,
    includes:["Druzy Geode Statement Décor","Luxury Geode Wall Art","Crystal Resin Accent Table"] },
  { id:"maison-12", name:"Maison Entertaining Collection", price:12000, commission:4500,
    includes:["Luxury Resin Serving Collection","Premium Resin Serveware Set","Three-Tier Resin Serving Stand"] },
  { id:"imperial-15", name:"Imperial Home Collection", price:15000, commission:5500,
    includes:["Luxury Resin Wall Clock","Druzy Geode Statement Décor","Crystal Resin Accent Table","Luxury Geode Wall Art","Geode Resin Mirror"] }
] as const;
