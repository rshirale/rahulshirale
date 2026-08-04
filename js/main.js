document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#sticky-nav a');
    const sectionsForNav = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    const sectionOffsets = sectionsForNav.map(section => ({ id: section.id, offset: section.offsetTop }));
    const backToTopBtn = document.getElementById('backToTopBtn');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    function applyTheme(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        themeToggleLightIcon.classList.toggle('hidden', !isDark);
        themeToggleDarkIcon.classList.toggle('hidden', isDark);
    }

    const isInitiallyDark = localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(isInitiallyDark);

    themeToggleBtn.addEventListener('click', () => {
        const isDark = !document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
    });

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    const handleScroll = () => {
        let current = '';
        const scrollPosition = window.pageYOffset;

        for (const section of sectionOffsets) {
            if (scrollPosition >= section.offset - 70) current = section.id;
        }

        navLinks.forEach(link => {
            const isCurrent = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', isCurrent);
            if (isCurrent) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });

        backToTopBtn.style.display = scrollPosition > 300 ? 'block' : 'none';
    };

    window.addEventListener('scroll', debounce(handleScroll, 50));
    handleScroll();

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    });

    const sectionsToAnimate = document.querySelectorAll('.section-animate');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sectionsToAnimate.forEach(section => sectionObserver.observe(section));

    function formatDuration(startDate) {
        const currentDate = new Date();
        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();

        if (months < 0 || (months === 0 && currentDate.getDate() < startDate.getDate())) {
            years--;
            months += 12;
        }

        const yearText = years ? `${years} year${years === 1 ? '' : 's'}` : '';
        const monthText = months ? `${months} month${months === 1 ? '' : 's'}` : '';
        return [yearText, monthText].filter(Boolean).join(' ');
    }

    document.getElementById('accenture-duration').textContent =
        `Accenture (${formatDuration(new Date('2021-10-01'))})`;
    document.getElementById('westcliff-duration').textContent =
        `May 2023 - Present (${formatDuration(new Date('2023-05-01'))}; concurrent with Accenture)`;
    document.getElementById('program-manager-duration').textContent =
        formatDuration(new Date('2023-11-01'));
});
