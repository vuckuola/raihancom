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
