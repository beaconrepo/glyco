// Load header and footer partials, then bootstrap main JS
(async function loadPartials(){
  const headerEl = document.getElementById('header-placeholder');
  const footerEl = document.getElementById('footer-placeholder');

  try {
    const [headerResp, footerResp] = await Promise.all([
      fetch('./header.html', { credentials: 'same-origin' }),
      fetch('./footer.html', { credentials: 'same-origin' })
    ]);

    headerEl.innerHTML = await headerResp.text();
    footerEl.innerHTML = await footerResp.text();

    // After footer loads, set year and init form
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear().toString();

    initContactForm();
  } catch(err){
    console.error('Failed to load header/footer partials', err);
  }
})();

function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const spinner = submitBtn?.querySelector('.spinner-border');
  const alertEl = document.getElementById('form-alert');
  const consent = document.getElementById('consent');
  const consentFeedback = document.getElementById('consentFeedback');

  const setAlert = (type, msg) => {
    if(!alertEl) return;
    alertEl.className = `alert alert-${type}`;
    alertEl.textContent = msg;
  };

  const startLoading = () => { if(spinner){ spinner.classList.remove('d-none'); } submitBtn.disabled = true; };
  const stopLoading  = () => { if(spinner){ spinner.classList.add('d-none'); } submitBtn.disabled = false; };

  // Bootstrap-style validation
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setAlert('d-none', '');

    // HTML5 validation
    if(!form.checkValidity()){
      form.classList.add('was-validated');
      if(consent && !consent.checked && consentFeedback){ consentFeedback.style.display = 'block'; }
      return;
    }

    if(consentFeedback) consentFeedback.style.display = 'none';

    const formData = Object.fromEntries(new FormData(form).entries());

    startLoading();
    try {
      // Placeholder: replace with real endpoint or WordPress AJAX action
      await fakeSubmit(formData);
      setAlert('success', 'Thanks! Your message has been sent.');
      form.reset();
      form.classList.remove('was-validated');
    } catch (err){
      console.error(err);
      setAlert('danger', 'Sorry, something went wrong. Please try again later.');
    } finally {
      stopLoading();
    }
  });
}

async function fakeSubmit(payload){
  // Simulate network latency & success
  await new Promise(r => setTimeout(r, 800));
  return true;
}
