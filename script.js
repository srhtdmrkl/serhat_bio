// Google Analytics event tracking helper
function trackEvent(eventName, eventParams) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  } else {
    console.log(`GA Event (gtag not found): ${eventName}`, eventParams);
  }
}

document.addEventListener('DOMContentLoaded', function() {
    async function loadHTML(url, elementId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        } catch (error) {
            console.error(`Could not load ${url}:`, error);
        }
    }

    loadHTML('/header.html?v=2', 'header-placeholder');
    loadHTML('/footer.html?v=2', 'footer-placeholder');

    const toggleButtons = document.querySelectorAll('.toggle-buttons .btn');
    const contentPanels = document.querySelectorAll('.content-panel');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-primary');
                btn.classList.add('btn-secondary');
            });
            contentPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            button.classList.add('active', 'btn-primary');
            button.classList.remove('btn-secondary');

            const tab = button.getAttribute('data-tab');
            const activePanel = document.getElementById(tab + '-content');
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });

    // Set copyright year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Highlight active nav link
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        console.log('currentPath:', currentPath);
        console.log('linkPath:', linkPath);
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Web3Forms AJAX handler
    const form = document.getElementById('contact-form');
    const result = document.getElementById('form-result');
    const submitButton = document.getElementById('submit-button');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Track attempt
            trackEvent('form_submit_attempt', { form_id: 'contact-form' });

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            submitButton.innerHTML = "Sending...";
            submitButton.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = "Message sent successfully. I will get back to you soon.";
                    result.classList.add("success");
                    result.classList.remove("error");
                    result.style.display = "block";
                    form.reset();
                    submitButton.style.display = "none";
                    
                    // Track success
                    trackEvent('form_submit_success', { form_id: 'contact-form' });
                } else {
                    console.log(response);
                    result.innerHTML = json.message || "Something went wrong!";
                    result.classList.add("error");
                    result.classList.remove("success");
                    result.style.display = "block";
                    submitButton.innerHTML = "Send Message";
                    submitButton.disabled = false;
                }
            })
            .catch(error => {
                console.log(error);
                result.innerHTML = "Something went wrong!";
                result.classList.add("error");
                result.classList.remove("success");
                result.style.display = "block";
                submitButton.innerHTML = "Send Message";
                submitButton.disabled = false;
            });
        });
    }
});


function generateSocialShareButtons(articleTitle, articleUrl, articleSummary) {
    const encodedTitle = encodeURIComponent(articleTitle);
    const encodedUrl = encodeURIComponent(articleUrl);
    const encodedSummary = encodeURIComponent(articleSummary); 
    const escapedTitle = articleTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;');

    return `
        <div class="social-share-buttons" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
            <a href="mailto:?subject=Check out this article&body=I thought you'd be interested in this article: ${encodedTitle} - ${encodedUrl}" target="_blank" aria-label="Share by Email" style="color: #333; font-size: 1.5rem;" onclick="trackEvent('share_article', {share_method: 'email', article_title: '${escapedTitle}'})"><i class="fas fa-envelope"></i></a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}&source=${encodeURIComponent(window.location.origin)}" target="_blank" aria-label="Share on LinkedIn" style="color: #0077B5; font-size: 1.5rem;" onclick="trackEvent('share_article', {share_method: 'linkedin', article_title: '${escapedTitle}'})"><i class="fab fa-linkedin"></i></a>
            <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" aria-label="Share on X" style="color: #000000; font-size: 1.5rem;" onclick="trackEvent('share_article', {share_method: 'twitter', article_title: '${escapedTitle}'})"><i class="fab fa-x-twitter"></i></a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" aria-label="Share on Facebook" style="color: #1877F2; font-size: 1.5rem;" onclick="trackEvent('share_article', {share_method: 'facebook', article_title: '${escapedTitle}'})"><i class="fab fa-facebook"></i></a>
        </div>
    `;
}
