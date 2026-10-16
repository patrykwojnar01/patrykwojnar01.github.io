window.App={
 read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v??structuredClone(fallback)}catch{return structuredClone(fallback)}},
 save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{this.toast('Pamięć przeglądarki jest niedostępna. Zmiany działają tylko do odświeżenia.');return false}},
 toast(text){let el=document.querySelector('.toast');if(!el){el=document.createElement('div');el.className='toast';el.setAttribute('role','status');document.body.append(el)}el.textContent=window.I18n?I18n.t(text):text;el.classList.add('show');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>el.classList.remove('show'),3200)},
 download(filename,text,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},
 id(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)},
 modal(id){const d=document.getElementById(id);d.showModal();return d}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-close]');if(b)b.closest('dialog').close()});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
