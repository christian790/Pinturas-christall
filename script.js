const WA_NUMBER = '18098474208';
let modalProducto='', modalPrecioBase=0, modalEsAccesorio=false, modalMultiplicador=1, modalCantidad=1;
function abrirModal(nombre, precioGalon, esAccesorio=false) {
  modalProducto=nombre; modalPrecioBase=precioGalon; modalEsAccesorio=esAccesorio;
  modalMultiplicador=1; modalCantidad=1;
  document.getElementById('modalNombre').textContent=nombre;
  document.getElementById('qtyNum').textContent=1;
  document.getElementById('qtyLabel').textContent='unidad(es)';
  const so=document.getElementById('sizeOptions'), sl=document.getElementById('sizeLabel');
  if(esAccesorio){so.style.display='none';sl.style.display='none';}
  else{
    so.style.display='flex';sl.style.display='block';
    document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('selected'));
    document.querySelectorAll('.size-btn')[0].classList.add('selected');
    document.getElementById('priceSingle').textContent='RD$'+precioGalon.toLocaleString();
    document.getElementById('priceTarro').textContent='RD$'+(precioGalon*5).toLocaleString();
  }
  actualizarTotal();
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function cerrarModal(){document.getElementById('modalOverlay').classList.remove('open');document.body.style.overflow='';}
function cerrarModalSiOverlay(e){if(e.target===document.getElementById('modalOverlay'))cerrarModal();}
function seleccionarTamano(btn,nombre,vol,mult){
  document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected'); modalMultiplicador=mult;
  document.getElementById('qtyLabel').textContent=mult===5?'tarro(s) de 5 galones':'galón(es)';
  actualizarTotal();
}
function cambiarCantidad(delta){modalCantidad=Math.max(1,modalCantidad+delta);document.getElementById('qtyNum').textContent=modalCantidad;actualizarTotal();}
function actualizarTotal(){document.getElementById('modalTotal').textContent='RD$'+(modalPrecioBase*modalMultiplicador*modalCantidad).toLocaleString();}
function enviarCotizacion(){
  const total=modalPrecioBase*modalMultiplicador*modalCantidad;
  let presentacion,galones='';
  if(modalEsAccesorio){presentacion=`${modalCantidad} unidad(es)`;}
  else{const t=modalMultiplicador===5?'tarro(s) de 5 galones':'galón(es)';presentacion=`${modalCantidad} ${t}`;galones=`💧 *Total galones:* ${modalMultiplicador*modalCantidad} galones\n`;}
  const msg=`¡Saludos! Quisiera cotizar el siguiente producto de Pinturas Christ-All:\n\n🎨 *Producto:* ${modalProducto}\n📦 *Presentación:* ${presentacion}\n${galones}💰 *Total estimado:* RD$${total.toLocaleString()}\n\n¿Me pueden confirmar disponibilidad y colores? ¡Gracias!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
  cerrarModal();
}
function cotizarServicio(nombre){
  const msg=`¡Saludos! Estoy interesado en el ${nombre} de Pinturas Christ-All.\n\n¿Me pueden dar más información y una cotización? ¡Gracias!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}
function filtrarCategoria(cat,btn){
  document.querySelectorAll('.cat-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card=>{
    if(card.dataset.cat===cat){card.classList.remove('hidden','visible');setTimeout(()=>card.classList.add('visible'),50);}
    else card.classList.add('hidden');
  });
}
const hamburger=document.getElementById('hamburger'), navDrawer=document.getElementById('navDrawer');
hamburger.addEventListener('click',()=>{
  const open=navDrawer.classList.toggle('open');
  hamburger.classList.toggle('open',open);
  hamburger.setAttribute('aria-expanded',open);
  document.body.style.overflow=open?'hidden':'';
});
function cerrarMenu(){navDrawer.classList.remove('open');hamburger.classList.remove('open');hamburger.setAttribute('aria-expanded',false);document.body.style.overflow='';}
document.addEventListener('click',e=>{if(navDrawer.classList.contains('open')&&!navDrawer.contains(e.target)&&!hamburger.contains(e.target))cerrarMenu();});
window.addEventListener('scroll',()=>{document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>20);},{passive:true});
const observer=new IntersectionObserver((entries)=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*80);observer.unobserve(e.target);}});},{threshold:0.08});
document.querySelectorAll('.product-card:not(.hidden),.service-card').forEach(el=>observer.observe(el));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){cerrarModal();cerrarMenu();}});