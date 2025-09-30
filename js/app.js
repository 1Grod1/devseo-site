
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


<!-- Отрисовка звёзд -->

  document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.review-rating').forEach(block => {
    const numEl   = block.querySelector('.rating-number');
    const starsEl = block.querySelector('.rating-stars');
    if (!numEl || !starsEl) return;

    // парсим "4.5" или "4,5"
    const raw = parseFloat((numEl.textContent || '0').replace(',', '.')) || 0;
    const clamped = Math.max(0, Math.min(5, raw));
    const rating  = Math.round(clamped * 2) / 2; // к ближайшим 0.5

    starsEl.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      if (i <= Math.floor(rating)) {
        star.dataset.fill = 'full';
      } else if (i - 0.5 === rating) {
        star.dataset.fill = 'half';
      } else {
        star.dataset.fill = 'empty';
      }
      starsEl.appendChild(star);
    }
    starsEl.setAttribute('aria-label', `Рейтинг ${rating} из 5`);
  });
});




