(function(root){
function clean(x){
 if(!x || typeof x!=='object')throw Error('Invalid result');
 const str=(k,n)=>typeof x[k]==='string'?x[k].trim().slice(0,n):'';
 const r={name:str('name',70),company:str('company',80),summary:str('summary',600),reply:str('reply',4000),type:['website','store','app','automation','other'].includes(x.type)?x.type:'other',budget:typeof x.budget==='number'&&Number.isFinite(x.budget)&&x.budget>=0&&x.budget<=10000000?Math.round(x.budget):null};
 if(!r.summary||!r.reply)throw Error('Incomplete result');return r;
}
function rules(text,en){
 if(text.trim().length<20||text.length>6000)throw Error('Input length');
 const field=pattern=>(text.match(pattern)||[])[1]||'';
 const name=field(/(?:kontakt|contact|name|imię)\s*:\s*([^\n;]+)/i),company=field(/(?:firma|company)\s*:\s*([^\n;]+)/i);
 const b=text.match(/(?:budżet|budget)\s*:?\s*(\d[\d ]*(?:[.,]\d+)?)\s*(tys\.?|k)?\s*(?:PLN|zł)/i);
 const budget=b?Number(b[1].replace(/ /g,'').replace(',','.'))*(b[2]?1000:1):null;
 const type=/automatyzac|automation|\bAI\b/i.test(text)?'automation':/sklep|store|shop/i.test(text)?'store':/aplikac|\bapp\b/i.test(text)?'app':/stron|website/i.test(text)?'website':'other';
 return clean({name,company,budget,type,summary:text.slice(0,600),reply:en?'Hello '+name+',\nThank you for your enquiry. I would be happy to discuss your project. Which outcome is most important to you? Please confirm the scope, budget and preferred launch date so I can prepare a proposal.\nBest regards,\nPatryk Wojnar':'Dzień dobry '+name+',\nDziękuję za zapytanie. Chętnie omówię Twój projekt. Który efekt jest dla Ciebie najważniejszy? Proszę o potwierdzenie zakresu, budżetu i terminu, żebym mógł przygotować propozycję.\nPozdrawiam,\nPatryk Wojnar'});
}
const api={clean,rules};root.IntakeCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
