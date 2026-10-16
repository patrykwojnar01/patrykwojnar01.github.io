(() => {
 'use strict';
 const qs=(s,root=document)=>root.querySelector(s);
 const all=(s,root=document)=>[...root.querySelectorAll(s)];
 const prefs={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
 const theme=qs('.theme');
 function setTheme(dark){document.body.classList.toggle('dark',dark);theme?.setAttribute('aria-checked',String(dark));qs('meta[name="theme-color"]')?.setAttribute('content',dark?'#141b18':'#f4f4ef')}
 setTheme(prefs.get('pw-theme')==='dark');
 theme?.addEventListener('click',()=>{const dark=!document.body.classList.contains('dark');setTheme(dark);prefs.set('pw-theme',dark?'dark':'light')});
 const motion=qs('.motion-toggle');
 function setMotion(off){document.body.classList.toggle('no-motion',off);motion?.setAttribute('aria-pressed',String(off));if(motion)motion.textContent=off?'Włącz animacje':'Ogranicz animacje'}
 setMotion(prefs.get('pw-motion')==='off');
 motion?.addEventListener('click',()=>{const off=!document.body.classList.contains('no-motion');setMotion(off);prefs.set('pw-motion',off?'off':'on')});
 if('IntersectionObserver' in window){document.body.classList.add('motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});all('.reveal').forEach(e=>observer.observe(e))}
 const menu=qs('.menu-button'),links=qs('#nav-links');
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Zamknij ×':'Menu +';links.classList.toggle('open',open)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus()}});
 qs('.back-top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
 all('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
 all('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{all('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));all('[data-category]').forEach(card=>{card.hidden=btn.dataset.filter!=='all'&&card.dataset.category!==btn.dataset.filter;if(!card.hidden)card.classList.add('visible')})}));
 all('.large-toggle').forEach(btn=>btn.addEventListener('click',()=>btn.setAttribute('aria-checked',String(btn.getAttribute('aria-checked')!=='true'))));
 all('[data-demo]').forEach(link=>link.addEventListener('click',e=>{const dialog=qs(link.dataset.demo==='shop'?'#shop-dialog':'#tasks-dialog');if(dialog?.showModal){e.preventDefault();dialog.showModal()}}));
 all('.close-dialog').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
 all('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});d.addEventListener('close',()=>document.body.style.overflow='');new MutationObserver(()=>{if(d.open)document.body.style.overflow='hidden'}).observe(d,{attributes:true,attributeFilter:['open']})});
 let cartCount=0,cartTotal=0;
 function renderCart(){qs('#cart-count').textContent=cartCount;qs('#cart-total').textContent=cartTotal.toLocaleString('pl-PL')}
 all('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{cartCount++;cartTotal+=Number(btn.dataset.price);renderCart();btn.textContent='Dodano ✓';setTimeout(()=>btn.textContent='Dodaj +',900)}));
 qs('#clear-cart')?.addEventListener('click',()=>{cartCount=cartTotal=0;renderCart()});
 const taskList=qs('#task-list');
 function taskStatus(){const total=all('li',taskList).length;const done=all('input:checked',taskList).length;qs('#task-status').textContent=`Ukończone: ${done} z ${total} zadań.`}
 function addTask(text,done=false){const li=document.createElement('li'),label=document.createElement('label'),box=document.createElement('input'),span=document.createElement('span'),remove=document.createElement('button');box.type='checkbox';box.checked=done;span.textContent=text;remove.className='task-delete';remove.textContent='×';remove.setAttribute('aria-label',`Usuń zadanie: ${text}`);label.append(box,span);li.append(label,remove);taskList.append(li);box.addEventListener('change',taskStatus);remove.addEventListener('click',()=>{li.remove();taskStatus()});taskStatus()}
 if(taskList){addTask('Zebrać pomysły na nowy projekt',true);addTask('Przygotować pierwszy prototyp');addTask('Dopracować małe detale')}
 qs('#task-form')?.addEventListener('submit',e=>{e.preventDefault();const input=qs('input',e.target);if(input.value.trim()){addTask(input.value.trim());input.value='';input.focus()}});
 const brief=qs('#brief');
 function briefText(){const f=new FormData(brief);if(window.I18n?.language==='en')return `Hi Patryk!\n\nMy name is ${f.get('name')}.\nI'm interested in: ${I18n.t(f.get('type'))}.\nPlanned start: ${I18n.t(f.get('timing'))}.\n\nMy idea:\n${f.get('idea')}\n\nLet's discuss how to make it happen.`;return `Cześć Patryk!\n\nMam na imię ${f.get('name')}.\nInteresuje mnie: ${f.get('type')}.\nPlanowany start: ${f.get('timing')}.\n\nMój pomysł:\n${f.get('idea')}\n\nPorozmawiajmy o możliwościach realizacji.`}
 brief?.addEventListener('submit',e=>{e.preventDefault();if(!brief.reportValidity())return;const f=new FormData(brief);location.href='mailto:patrykwojnar001@gmail.com?subject='+encodeURIComponent((window.I18n?.language==='en'?'New project: ':'Nowy projekt: ')+(window.I18n?.t(f.get('type'))||f.get('type')))+'&body='+encodeURIComponent(briefText());qs('#form-status').textContent='Przygotowano wiadomość w programie pocztowym. Jeśli się nie otworzył, skopiuj treść i wyślij ją na patrykwojnar001@gmail.com.'});
 qs('#copy-brief')?.addEventListener('click',async()=>{if(!brief.reportValidity())return;const text=briefText();try{await navigator.clipboard.writeText(text);qs('#form-status').textContent='Treść skopiowana. Wklej ją do wiadomości na patrykwojnar001@gmail.com.'}catch{const fallback=qs('#copy-fallback');fallback.hidden=false;fallback.value=text;fallback.focus();fallback.select();qs('#form-status').textContent='Zaznaczono treść poniżej. Skopiuj ją ręcznie i wklej do wiadomości.'}});
})();
