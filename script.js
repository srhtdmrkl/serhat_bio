document.addEventListener('DOMContentLoaded', function () {
    const shareBtn = document.getElementById('share-btn');
    const shareDd = document.getElementById('share-dd');
    const shareCopy = document.getElementById('share-copy');

    if (shareBtn && shareDd) {
        shareBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            shareDd.classList.toggle('open');
        });

        document.addEventListener('click', function () {
            shareDd.classList.remove('open');
        });

        shareDd.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    if (shareCopy) {
        shareCopy.addEventListener('click', function () {
            navigator.clipboard.writeText(window.location.href).then(function () {
                shareCopy.textContent = 'Copied!';
                setTimeout(function () {
                    shareCopy.innerHTML = '<span class="share-icon">⎘</span> Copy link';
                    shareDd.classList.remove('open');
                }, 1500);
            });
        });
    }

    const form = document.getElementById('contact-form');
    const result = document.getElementById('form-result');
    const submitButton = document.getElementById('submit-button');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const json = JSON.stringify(Object.fromEntries(new FormData(form)));
            submitButton.innerHTML = 'Sending…';
            submitButton.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
            .then(async function (response) {
                const data = await response.json();
                if (response.status === 200) {
                    result.innerHTML = 'Message sent. I\'ll be in touch.';
                    result.className = 'form-result success';
                    result.style.display = 'block';
                    form.reset();
                    submitButton.style.display = 'none';
                } else {
                    result.innerHTML = data.message || 'Something went wrong.';
                    result.className = 'form-result error';
                    result.style.display = 'block';
                    submitButton.innerHTML = 'Send message →';
                    submitButton.disabled = false;
                }
            })
            .catch(function () {
                result.innerHTML = 'Something went wrong.';
                result.className = 'form-result error';
                result.style.display = 'block';
                submitButton.innerHTML = 'Send message →';
                submitButton.disabled = false;
            });
        });
    }
});
