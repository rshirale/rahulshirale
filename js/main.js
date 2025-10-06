tailwind.config = {
    darkMode: 'class',
}

function wrapLabels(label, maxWidth) {
    const words = label.split(' ');
    let lines = [];
    let currentLine = '';
    words.forEach(word => {
        if ((currentLine + word).length > maxWidth) {
            lines.push(currentLine.trim());
            currentLine = '';
        }
        currentLine += word + ' ';
    });
    lines.push(currentLine.trim());
    return lines.filter(line => line !== '');
}

const commonTooltipTitleCallback = function (tooltipItems) {
    const item = tooltipItems[0];
    let label = item.chart.data.labels[item.dataIndex];
    if (Array.isArray(label)) {
        return label.join(' ');
    } else {
        return label;
    }
};

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: document.documentElement.classList.contains('dark') ? '#90E0EF' : '#0077B6'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 119, 182, 0.9)',
            titleColor: '#FFFFFF',
            bodyColor: '#CAF0F8',
            bodyFont: {
                weight: '600'
            },
            callbacks: {
                title: commonTooltipTitleCallback
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: document.documentElement.classList.contains('dark') ? '#90E0EF' : '#0077B6',
                font: { size: 10 }
            },
            grid: { display: false }
        },
        y: {
            ticks: {
                color: document.documentElement.classList.contains('dark') ? '#90E0EF' : '#0077B6',
                font: { size: 10 }
            },
            grid: { color: document.documentElement.classList.contains('dark') ? '#374151' : '#D1E9F0' }
        }
    }
};

const expCtx = document.getElementById('experienceBarChart').getContext('2d');
const experienceData = {
    labels: [
        wrapLabels('Tech Program Manager (Accenture)', 16),
        wrapLabels('Data Engineer (Accenture)', 16),
        wrapLabels('Sr. Systems Engineer (CHOC)', 16),
        wrapLabels('Sr. Systems Engineer (Reliance)', 16)
    ],
    datasets: [{
        label: 'Years in Role (Approx.)',
        data: [1.5, 2.1, 4.4, 2.75],
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0096C7' : '#00B4D8',
        borderColor: '#0077B6',
        borderWidth: 1,
        borderRadius: 5,
    }]
};
new Chart(expCtx, {
    type: 'bar',
    data: experienceData,
    options: { ...commonChartOptions, indexAxis: 'y' }
});

const doughnutLabel = {
    id: 'doughnutLabel',
    beforeDatasetsDraw(chart, args, pluginOptions) {
        const { ctx } = chart;
        const { text, font, color } = pluginOptions;
        if (!text) return;

        ctx.save();
        const x = chart.getDatasetMeta(0).data[0].x;
        const y = chart.getDatasetMeta(0).data[0].y;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = font || 'bold 24px Inter';
        ctx.fillStyle = color || '#0077B6';

        ctx.fillText(text, x, y);
        ctx.restore();
    }
};

const skillChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: document.documentElement.classList.contains('dark') ? '#CAF0F8' : '#03045E',
                font: { size: 10 },
                boxWidth: 15,
                padding: 15
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 119, 182, 0.9)',
            titleColor: '#FFFFFF',
            bodyColor: '#CAF0F8',
            callbacks: {
                label: function (context) {
                    let label = context.label || '';
                    if (label) { label += ': '; }
                    if (context.parsed !== null) { label += context.parsed + '%'; }
                    return label;
                }
            }
        }
    }
};


const analyticsCtx = document.getElementById('analyticsDonut').getContext('2d');
new Chart(analyticsCtx, {
    type: 'doughnut',
    data: {
        labels: ['Strategic Insights', 'Data Interpretation', 'Reporting'],
        datasets: [{
            data: [40, 35, 25],
            backgroundColor: ['#0077B6', '#00B4D8', '#90E0EF'],
            borderColor: '#FFFFFF',
            borderWidth: 2
        }]
    },
    options: { ...skillChartOptions, plugins: { ...skillChartOptions.plugins, doughnutLabel: { text: '90%' } } },
    plugins: [doughnutLabel]
});

const managementCtx = document.getElementById('managementDonut').getContext('2d');
new Chart(managementCtx, {
    type: 'doughnut',
    data: {
        labels: ['Program Mgt.', 'Team Leadership', 'Project Execution'],
        datasets: [{
            data: [45, 30, 25],
            backgroundColor: ['#0077B6', '#00B4D8', '#90E0EF'],
            borderColor: '#FFFFFF',
            borderWidth: 2
        }]
    },
    options: { ...skillChartOptions, plugins: { ...skillChartOptions.plugins, doughnutLabel: { text: '85%', color: '#00B4D8' } } },
    plugins: [doughnutLabel]
});

const strategyCtx = document.getElementById('strategyDonut').getContext('2d');
new Chart(strategyCtx, {
    type: 'doughnut',
    data: {
        labels: ['Transformation', 'Innovation', 'Roadmapping'],
        datasets: [{
            data: [40, 35, 25],
            backgroundColor: ['#0077B6', '#00B4D8', '#90E0EF'],
            borderColor: '#FFFFFF',
            borderWidth: 2
        }]
    },
    options: { ...skillChartOptions, plugins: { ...skillChartOptions.plugins, doughnutLabel: { text: '80%', color: '#90E0EF' } } },
    plugins: [doughnutLabel]
});

// Main script for page interactions
document.addEventListener('DOMContentLoaded', () => {
    // Sticky Nav Active State & Back to Top Button
    const navLinks = document.querySelectorAll('#sticky-nav a');
    const sectionsForNav = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('backToTopBtn');

    // Theme toggle logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', function () {
        // toggle icons inside button
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // if set via local storage previously
        if (localStorage.getItem('theme')) {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        } else { // if NOT set via local storage previously
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        }
    });

    window.addEventListener('scroll', () => {
        let current = '';
        sectionsForNav.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 70) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href')?.substring(1) === current) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        // Back to Top button visibility
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Section fade-in animations
    const sectionsToAnimate = document.querySelectorAll('.section-animate');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the section is visible

    sectionsToAnimate.forEach(section => {
        sectionObserver.observe(section);
    });

    // Dynamic Accenture Experience Calculation
    function calculateAccentureExperience() {
        const startDate = new Date('2021-10-01');
        const currentDate = new Date();

        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();

        if (months < 0 || (months === 0 && currentDate.getDate() < startDate.getDate())) {
            years--;
            months += 12;
        }

        let durationString = '';
        if (years > 0) {
            durationString += `${years} year${years > 1 ? 's' : ''}`;
        }
        if (months > 0) {
            durationString += ` ${months} month${months > 1 ? 's' : ''}`;
        }

        document.getElementById('accenture-duration').textContent = `Accenture (${durationString.trim()})`;
    }
    calculateAccentureExperience();
});