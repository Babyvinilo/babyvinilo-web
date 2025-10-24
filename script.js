
// Fetch and apply content from /content/site.json
async function loadContent(){
  try{
    const res = await fetch('content/site.json', {cache: 'no-store'});
    const data = await res.json();
    applyContent(data);
  }catch(e){
    console.warn('No se pudo cargar content/site.json; usa Netlify + CMS para editar.');
  }
}

function mdBold(md){return md.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');}

function applyContent(data){
  document.querySelectorAll('.brand-name').forEach(el=> el.textContent = data.brand.name);
  document.querySelectorAll('.brand-tag').forEach(el=> el.textContent = data.brand.slogan);
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  const h = document.getElementById('heroTitle');
  h.innerHTML = `${data.hero.title}<br><span class="accent">${data.hero.title_accent}</span>`;
  const d = document.getElementById('heroDesc'); d.innerHTML = mdBold(data.hero.description);
  document.getElementById('heroImage').src = data.hero.image;

  const svc = document.getElementById('services'); svc.innerHTML='';
  data.services.forEach(s=>{ const li=document.createElement('li'); li.textContent=s; svc.appendChild(li); });

  const grid = document.getElementById('products'); grid.innerHTML='';
  data.products.forEach((p,i)=>{
    const art = document.createElement('article');
    art.className='product';
    art.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="foot">
        <span class="pill">${p.price}</span>
        <a class="link" id="p${i+1}">Me interesa</a>
      </div>`;
    grid.appendChild(art);
  });

  const gal = document.getElementById('gallery'); gal.innerHTML='';
  data.gallery.forEach(src=>{ const img=document.createElement('img'); img.src=src; gal.appendChild(img); });

  const waNum = data.brand.phone.replace(/\D/g,'');
  const wa = `https://wa.me/${waNum}?text=${encodeURIComponent('Hola! Me gustaría información.')}`;
  ['navWhatsApp','mobileWhatsApp','aboutWhatsApp','ctaWhatsApp','ctaCatalogo','ctaPresupuesto'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.href = wa;
  });
  const waNumber = document.getElementById('waNumber'); if(waNumber){ waNumber.href=wa; waNumber.textContent=data.brand.phone; }
  const ig = document.getElementById('igLink'); if(ig) ig.href = data.brand.instagram;
  const em = document.getElementById('emailLink'); if(em){ em.href='mailto:'+data.brand.email; em.textContent=data.brand.email; }
  const addr = document.getElementById('addressTxt'); if(addr) addr.textContent = data.brand.address;
}

document.addEventListener('DOMContentLoaded', loadContent);
