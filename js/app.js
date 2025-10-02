
  // Актуальный год в футере
  document.getElementById('year').textContent = new Date().getFullYear();

  // Мобильное меню
  const navBtn = document.getElementById('navBtn');
  const navMenu = document.getElementById('navMenu');
  navBtn?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navBtn.setAttribute('aria-expanded', String(open));
  navBtn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});


  // Сворачивание разворачивание вопросов
  document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
  const btn = item.querySelector(".faq-question");
  btn.addEventListener("click", () => {
  // сворачивать все остальные
  items.forEach(i => {
  if (i !== item) i.classList.remove("open");
});
  // переключить текущий
  item.classList.toggle("open");
});
});
});



  document.addEventListener('DOMContentLoaded', () => {
  const track   = document.querySelector('.gallery-track');
  const prevBtn = document.querySelector('.arrow.prev');
  const nextBtn = document.querySelector('.arrow.next');
  const items   = [...track.querySelectorAll('img')];

  let step = 0, gap = 16;

  function recalc(){
  const styles = getComputedStyle(track);
  gap  = parseFloat(styles.columnGap || styles.gap || 0);
  const first = items[0];
  step = first.getBoundingClientRect().width + gap; // ширина фото + gap
  updateButtons();
}

  function clamp(val, min, max){ return Math.max(min, Math.min(max, val)); }

  function scrollByStep(dir){
  const max = track.scrollWidth - track.clientWidth;
  const target = clamp(track.scrollLeft + dir * step, 0, max);
  track.scrollTo({ left: target, behavior: 'smooth' });
  // обновим состояние чуть позже, когда доскроллит
  setTimeout(updateButtons, 350);
}

  function updateButtons(){
  const max = track.scrollWidth - track.clientWidth - 1;
  prevBtn.disabled = track.scrollLeft <= 0;
  nextBtn.disabled = track.scrollLeft >= max || max <= 0;
}

  prevBtn.addEventListener('click', () => scrollByStep(-1));
  nextBtn.addEventListener('click', () => scrollByStep(1));
  track.addEventListener('scroll', updateButtons, { passive:true });
  window.addEventListener('resize', () => { recalc(); });

  // Лайтбокс
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.querySelector('.lightbox .close');

  items.forEach(img => img.addEventListener('click', () => {
  lightboxImg.src = img.src;
  lightbox.style.display = 'flex';
  lightbox.setAttribute('aria-hidden','false');
}));
  function closeLightbox(){
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden','true');
  lightboxImg.src = '';
}
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Свайп (мобильные)
  let startX = 0, deltaX = 0, isTouch = false;
  track.addEventListener('touchstart', e => {
  isTouch = true;
  startX = e.touches[0].clientX;
  deltaX = 0;
}, { passive:true });

  track.addEventListener('touchmove', e => {
  if (!isTouch) return;
  deltaX = e.touches[0].clientX - startX;
}, { passive:true });

  track.addEventListener('touchend', () => {
  if (!isTouch) return;
  const threshold = 50; // порог свайпа
  if (deltaX > threshold) scrollByStep(-1);
  else if (deltaX < -threshold) scrollByStep(1);
  isTouch = false;
});

  // стартовые вычисления
  recalc();
});



    (function(){
    // ===== ЗВЁЗДЫ (половинки) =====
    function renderStars(scope=document){
      scope.querySelectorAll('.review-rating').forEach(block=>{
        const numEl = block.querySelector('.rating-number');
        const starsEl = block.querySelector('.rating-stars');
        if(!numEl||!starsEl) return;
        const raw = parseFloat((numEl.textContent||'0').replace(',', '.')) || 0;
        const rating = Math.round(Math.max(0, Math.min(5, raw))*2)/2;
        starsEl.innerHTML='';
        for(let i=1;i<=5;i++){
          const s=document.createElement('span'); s.className='star';
          s.style.width='18px'; s.style.height='18px'; s.style.display='inline-block';
          s.style.background='#E0E0E0';
          s.style.webkitMask = s.style.mask =
              "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path d=%22M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192L12 .587z%22/></svg>') center/contain no-repeat";
          if(i<=Math.floor(rating)) s.style.background = '#FF9D11';
          else if(i-0.5===rating)  s.style.background = 'linear-gradient(to right, #FF9D11 50%, #E0E0E0 50%)';
          starsEl.appendChild(s);
        }
        starsEl.setAttribute('aria-label',`Рейтинг ${rating} из 5`);
      });
    }

    // ===== Построение карточки отзыва =====
    function makeReviewCard(item){
    const art = document.createElement('article');
    art.className = 'review-card';
    art.innerHTML = `
      <header class="review-header">
        <h3 class="review-title">${item.role}</h3>
        <div class="review-meta">${item.placeDate}</div>
        <div class="review-rating">
          <span class="rating-number">${String(item.rating)}</span>
          <span class="rating-stars" aria-label=""></span>
        </div>
        <hr class="divider">
      </header>
      <div class="review-body">
        <h4>Что нравится?</h4>
        <p>${item.likes}</p>
        <h4>Что можно улучшить?</h4>
        <p>${item.improve}</p>
      </div>
    `;
    return art;
  }

    // ===== ЛОГИКА ПОДГРУЗКИ =====
    const extraBox = document.getElementById('reviewsExtra');
    const btnLoad  = document.getElementById('btnLoadMore');
    const btnCollapse = document.getElementById('btnCollapse');
    const BATCH = parseInt(btnLoad?.dataset.batch || '3', 10);

    let data = [];
    let offset = 0;
    let loaded = 0;

    async function ensureData(){
    if (data.length) return;
    try{
    const res = await fetch('./data/reviews.json', {cache:'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    data = await res.json();
  }catch(e){
    console.error('Не удалось загрузить reviews.json:', e);
    btnLoad?.setAttribute('disabled','disabled');
  }
  }

    async function loadMore(){
    await ensureData();
    if (!data.length) return;

    // сколько ещё грузим
    const chunk = data.slice(offset, offset + BATCH);
    if (!chunk.length) return;

    // вставляем карточки
    const frag = document.createDocumentFragment();
    chunk.forEach(item => frag.appendChild(makeReviewCard(item)));
    extraBox.appendChild(frag);
    renderStars(extraBox);

    // обновляем счётчики/состояние
    offset += chunk.length;
    loaded += chunk.length;

    // открыть секцию, показать «Свернуть»
    extraBox.classList.add('open');
    btnCollapse.hidden = false;

    // если дошли до конца — скрываем «Смотреть все отзывы»
    if (offset >= data.length) {
    btnLoad.hidden = true;
  }
  }

    function collapseAll(){
    // очистить дополнительные отзывы и закрыть контейнер
    extraBox.innerHTML = '';
    extraBox.classList.remove('open');
    btnCollapse.hidden = true;

    // сбросить состояние
    offset = 0; loaded = 0;

    // снова показать «Смотреть все отзывы»
    if (data.length) btnLoad.hidden = false;
  }

    btnLoad?.addEventListener('click', loadMore);
    btnCollapse?.addEventListener('click', collapseAll);

    // первичная отрисовка звёзд у «первой» карточки
    renderStars();
  })();


