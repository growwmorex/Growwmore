export const BRAND = {
  name: "Growwmore",
  supportPhone: "9743254743",
  supportEmail: "growwmorex1@gmail.com",
  paymentPhone: "9019254743",
  upiId: "tradewithsyed@ybl",
  adminEmails: ["sydri63@gmail.com", "syedafsharkhadri63@gmail.com"] as const
} as const;

export const isAdminEmail = (email?: string | null) =>
  !!email && BRAND.adminEmails.includes(email.toLowerCase() as (typeof BRAND.adminEmails)[number]);

export const PACKAGES = [
  { id:"signature-5", name:"Signature Wall Art", price:5000, commission:1000, label:"The Signature Edit",
    includes:["Luxury Geode Resin Wall Art"], note:"A focused statement piece for modern interiors." },
  { id:"heritage-8", name:"Heritage Décor Collection", price:8000, commission:1500, label:"The Heritage Edit",
    includes:["Luxury Resin Wall Clock","Geode Resin Mirror","Bless This Home Resin Plaque"], note:"Three handcrafted accents designed as a coordinated home story." },
  { id:"atelier-10", name:"Atelier Statement Collection", price:10000, commission:2500, label:"The Atelier Edit",
    includes:["Druzy Geode Statement Décor","Luxury Geode Wall Art","Crystal Resin Accent Table"], note:"Gallery-led resin décor with elevated crystal detailing." },
  { id:"maison-12", name:"Maison Entertaining Collection", price:12000, commission:4500, label:"The Maison Edit",
    includes:["Luxury Resin Serving Collection","Premium Resin Serveware Set","Three-Tier Resin Serving Stand"], note:"Designed for hosting, gifting and luxury tabletop presentation." },
  { id:"imperial-15", name:"Imperial Home Collection", price:15000, commission:5500, label:"The Imperial Edit",
    includes:["Luxury Resin Wall Clock","Druzy Geode Statement Décor","Crystal Resin Accent Table","Luxury Geode Wall Art","Geode Resin Mirror"], note:"Our broadest launch collection for a complete premium décor experience." }
] as const;
