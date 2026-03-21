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

    // 3. FORM VALIDATION + EMAILJS
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    if (form && statusMsg) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateForm()) return;

            // EmailJS (remplacez keys)
            if (typeof emailjs === 'undefined') {
                statusMsg.textContent = 'EmailJS non chargé. Vérifiez le script.';
                statusMsg.className = 'error';
                return;
            }
            emailjs.init('YOUR_PUBLIC_KEY'); // ex: user_abc123
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            }).then(() => {
                statusMsg.textContent = 'Message envoyé ! Merci.';
                statusMsg.className = 'success';
                form.reset();
            }, (error) => {
                console.error('EmailJS error:', error);
                statusMsg.textContent = 'Erreur envoi. Réessayez.';
                statusMsg.className = 'error';
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


