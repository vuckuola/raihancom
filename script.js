const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 140px 0px' });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

const header = document.querySelector('.site-header');
const setHeader = () => {
  if (!header) return;
  header.dataset.elevated = String(window.scrollY > 6);
};
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

/* Hero slider */
(function() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  const tracks = slider.querySelectorAll('.slider-track');
  const dots = document.querySelectorAll('#sliderDots .dot');
  if (!tracks.length || !dots.length) return;
  const total = tracks.length;
  let current = 0;
  let timer = null;
  const INTERVAL = 3500;

  function goTo(index) {
    if (index === current) return;
    tracks[current].classList.remove('active');
    tracks[current].classList.add('leaving');
    const prev = current;
    current = ((index % total) + total) % total;
    tracks[current].classList.remove('leaving');
    tracks[current].classList.add('active');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    setTimeout(() => { tracks[prev].classList.remove('leaving'); }, 460);
    resetTimer();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  dots.forEach((d) => {
    d.addEventListener('click', () => goTo(parseInt(d.dataset.index, 10)));
  });

  // Touch swipe
  let startX = 0, startY = 0, swiping = false;
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    swiping = true;
  }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    if (!swiping) return;
    swiping = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  // Keyboard
  slider.setAttribute('tabindex', '0');
  slider.setAttribute('role', 'region');
  slider.setAttribute('aria-roledescription', 'carousel');
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
  });

  // Pause when not visible
  const vis = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { resetTimer(); }
      else { clearInterval(timer); }
    });
  }, { threshold: 0.1 });
  vis.observe(slider);

  // Init
  tracks[0].classList.add('active');
  resetTimer();
})();
