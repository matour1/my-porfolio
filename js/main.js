// js/main.js - Portfolio amélioré (EmailJS, UX, a11y)
// Note: Remplacez YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY par vos clés EmailJS (emailjs.com gratuit)
// Alternative Netlify: deployez sur netlify.com (drag dossier), form auto-func sans JS.

document.addEventListener('DOMContentLoaded', function() {
    // 1. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 2. NAVBAR ACTIVE STATE (hash + current page)
    function updateActiveNav() {
        const links = document.querySelectorAll('nav a');
        if (!links.length) return;

        links.forEach(a => a.classList.remove('active'));

        const hash = location.hash;
        if (hash) {
            const link = document.querySelector(`nav a[href="${hash}"]`);
            if (link) {
                link.classList.add('active');
                return;
            }
        }

        const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const pageLink = Array.from(links).find(a => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            return href && !href.startsWith('#') && href.endsWith(path);
        });
        if (pageLink) {
            pageLink.classList.add('active');
            return;
        }

        const homeLink = document.querySelector('nav a[href="#home"]') || document.querySelector('nav a[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
    }
    window.addEventListener('hashchange', updateActiveNav);
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // 3. FORM VALIDATION + BACKEND
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    if (form && statusMsg) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateForm()) return;

            if (window.location.protocol === 'file:') {
                statusMsg.textContent = 'Démarrez le serveur Node (localhost) pour envoyer.';
                statusMsg.className = 'form-status error';
                statusMsg.style.display = 'block';
                return;
            }

            const payload = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            statusMsg.textContent = 'Envoi en cours...';
            statusMsg.className = 'form-status';
            statusMsg.style.display = 'block';

            fetch('/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(async (res) => {
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || !data.ok) {
                        throw new Error(data.error || 'Erreur envoi.');
                    }
                    statusMsg.textContent = 'Message envoyé ! Merci.';
                    statusMsg.className = 'form-status success';
                    statusMsg.style.display = 'block';
                    form.reset();
                })
                .catch((error) => {
                    console.error('Send error:', error);
                    statusMsg.textContent = error.message || 'Erreur envoi. Réessayez.';
                    statusMsg.className = 'form-status error';
                    statusMsg.style.display = 'block';
                });
        });
    }

    // Form validation client-side
    function validateForm() {
        if (!form) return false;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let valid = true;
        inputs.forEach(input => {
            input.classList.remove('error');
            if (!input.value.trim()) {
                input.classList.add('error');
                valid = false;
            } else if (input.type === 'email' && !/^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(input.value)) {
                input.classList.add('error');
                valid = false;
            }
        });
        return valid;
    }

    // Focus validation realtime
    form?.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', validateForm);
        input.addEventListener('input', () => input.classList.remove('error'));
    });
});


