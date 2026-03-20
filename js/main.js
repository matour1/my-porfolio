// js/main.js - Portfolio amélioré (EmailJS, UX, a11y)
// Note: Remplacez YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY par vos clés EmailJS (emailjs.com gratuit)
// Alternative Netlify: deployez sur netlify.com (drag dossier), form auto-func sans JS.

document.addEventListener('DOMContentLoaded', function() {
    // 1. SMOOTH SCROLL
    document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 2. NAVBAR ACTIVE STATE (hashchange + IntersectionObserver fallback)
    function updateActiveNav() {
        const current = location.hash.substring(1) || window.scrollY < 100 ? 'home' : null;
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        if (current) {
            const link = document.querySelector(`nav a[href*=\"${current}\"]`);
            if (link) link.classList.add('active');
        }
    }
    window.addEventListener('hashchange', updateActiveNav);
    window.addEventListener('scroll', updateActiveNav);

    // 3. FAQ ACCORDION ARIA (a11y)
    document.querySelectorAll('.faq-question').forEach(question => {
        question.setAttribute('role', 'button');
        question.setAttribute('tabindex', '0');
        question.setAttribute('aria-expanded', 'false');
        question.addEventListener('click', toggleFAQ);
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ.call(question);
            }
        });
    });

    function toggleFAQ() {
        const item = this.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isExpanded = item.classList.toggle('active');
        this.setAttribute('aria-expanded', isExpanded);
        const icon = this.querySelector('.faq-icon');
        if (icon) icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // 4. FORM VALIDATION + EMAILJS
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    if (form && statusMsg) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateForm()) return;

            // EmailJS (remplacez keys)
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

