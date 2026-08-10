(() => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // scroll-reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  // contact details assembled at runtime to keep them out of the static HTML (spam-bot protection)
  const cc = '27', local = ['81', '298', '3548'];
  const digits = cc + local.join('');
  const display = '0' + local[0] + ' ' + local[1] + ' ' + local[2];
  const wa = 'https://wa.me/' + digits + '?text=' + encodeURIComponent('Hi Tinashe, I would like to enquire about bar service for an event.');
  document.querySelectorAll('.wa-link').forEach((a) => { a.href = wa; });
  document.querySelector('.wa-text').textContent = display;
  const user = ['tinashe', 'mudimu', '18'].join('');
  const addr = user + '@' + 'gmail' + '.com';
  const mail = document.getElementById('mail-link');
  mail.href = 'mailto:' + addr;
  mail.textContent = addr;
})();
