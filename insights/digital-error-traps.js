// Habit Override — swipe demo
var hoDone = { a: false, b: false };

function initHOSwipe(cardId, resultId, key) {
    var card = document.getElementById(cardId);
    var startX = null, dx = 0;

    function onStart(x) {
        if (hoDone[key]) return;
        startX = x;
        dx = 0;
        card.style.transition = '';
        card.style.cursor = 'grabbing';
    }
    function onMove(x) {
        if (startX === null || hoDone[key]) return;
        dx = x - startX;
        if (dx < 0) {
            card.style.transform = 'translateX(' + dx + 'px)';
            card.style.opacity = Math.max(0, 1 + dx / 160);
        }
    }
    function onEnd() {
        if (startX === null || hoDone[key]) return;
        startX = null;
        card.style.cursor = 'grab';
        if (dx < -55) {
            hoDone[key] = true;
            card.style.transition = 'transform 0.22s ease, opacity 0.22s ease';
            card.style.transform = 'translateX(-110%)';
            card.style.opacity = '0';
            setTimeout(function () {
                card.parentNode.style.display = 'none';
                document.getElementById(resultId).style.display = 'block';
                if (hoDone.a && hoDone.b) document.getElementById('ho-reset').style.display = 'block';
            }, 220);
        } else {
            card.style.transition = 'transform 0.18s ease, opacity 0.18s ease';
            card.style.transform = 'translateX(0)';
            card.style.opacity = '1';
            dx = 0;
        }
    }

    card.addEventListener('mousedown', function (e) { onStart(e.clientX); e.preventDefault(); });
    document.addEventListener('mousemove', function (e) { onMove(e.clientX); });
    document.addEventListener('mouseup', onEnd);
    card.addEventListener('touchstart', function (e) { onStart(e.touches[0].clientX); }, { passive: true });
    card.addEventListener('touchmove', function (e) {
        if (startX !== null && e.touches[0].clientX - startX < 0) e.preventDefault();
        onMove(e.touches[0].clientX);
    }, { passive: false });
    card.addEventListener('touchend', onEnd);
}

initHOSwipe('ho-card-a', 'ho-result-a', 'a');
initHOSwipe('ho-card-b', 'ho-result-b', 'b');

function resetHO() {
    ['a', 'b'].forEach(function (key) {
        hoDone[key] = false;
        var card = document.getElementById('ho-card-' + key);
        card.style.transition = '';
        card.style.transform = '';
        card.style.opacity = '1';
        card.style.cursor = 'grab';
        card.parentNode.style.display = 'block';
        document.getElementById('ho-result-' + key).style.display = 'none';
    });
    document.getElementById('ho-reset').style.display = 'none';
}

// Feedback Holes — duplicate submit demo
var fhBadClicks = 0, fhBadFrozen = false, fhBadDone = false, fhGoodDone = false;

function handleFHGood() {
    if (fhGoodDone) return;
    fhGoodDone = true;
    document.getElementById('fh-good-btn-wrap').style.display = 'none';
    document.getElementById('fh-good-confirm').style.display = 'block';
    setTimeout(function () {
        document.getElementById('fh-good-result').style.display = 'block';
        checkFHBothDone();
    }, 600);
}

function handleFHBad() {
    if (fhBadDone) return;
    fhBadClicks++;
    var btn = document.getElementById('fh-bad-btn');
    if (!fhBadFrozen) {
        fhBadFrozen = true;
        btn.textContent = 'Submitting…';
        btn.style.opacity = '0.7';
        setTimeout(function () {
            fhBadDone = true;
            btn.style.display = 'none';
            var result = document.getElementById('fh-bad-result');
            result.style.display = 'block';
            result.innerHTML = '<strong>' + fhBadClicks + ' incident' + (fhBadClicks > 1 ? 's' : '') + ' logged.</strong> 1 actual event.' + (fhBadClicks > 1 ? ' Your risk metrics just moved — for a missing confirmation.' : '');
            checkFHBothDone();
        }, 4000);
    }
}

function checkFHBothDone() {
    if (fhGoodDone && fhBadDone) {
        document.getElementById('fh-reset-wrap').style.display = 'block';
    }
}

function resetFH() {
    fhBadClicks = 0; fhBadFrozen = false; fhBadDone = false; fhGoodDone = false;
    document.getElementById('fh-good-btn-wrap').style.display = 'block';
    document.getElementById('fh-good-confirm').style.display = 'none';
    document.getElementById('fh-good-result').style.display = 'none';
    var badBtn = document.getElementById('fh-bad-btn');
    badBtn.style.display = 'block';
    document.getElementById('fh-bad-result').style.display = 'none';
    document.getElementById('fh-reset-wrap').style.display = 'none';
}

// Smart Guess Error — multi-step form demo
function sgeAccept() {
    document.getElementById('sge-form').style.display = 'none';
    document.getElementById('sge-result-accept').style.display = 'block';
    document.getElementById('sge-reset').style.display = 'block';
}

function sgeCorrect() {
    document.getElementById('sge-submit-wrap').style.display = 'none';
    document.getElementById('sge-loading').style.display = 'block';
    setTimeout(function () {
        document.getElementById('sge-loading').style.display = 'none';
        document.getElementById('sge-dropdown-wrap').style.display = 'block';
    }, 1200);
}

function sgeSelect(el) {
    var items = el.parentNode.querySelectorAll('div');
    items.forEach(function (i) { i.style.background = ''; });
    el.style.background = '#eff6ff';
    document.getElementById('sge-dropdown-wrap').style.display = 'none';
    document.getElementById('sge-confirm-wrap').style.display = 'block';
}

function sgeKeep() {
    document.getElementById('sge-form').style.display = 'none';
    document.getElementById('sge-result-keep').style.display = 'block';
    document.getElementById('sge-reset').style.display = 'block';
}

function sgeOverride() {
    document.getElementById('sge-confirm-wrap').style.display = 'none';
    document.getElementById('sge-reason-wrap').style.display = 'block';
}

function sgeCheckReason() {
    var val = document.getElementById('sge-reason-input').value.trim();
    var btn = document.getElementById('sge-submit-final');
    if (val.length > 3) {
        btn.disabled = false;
        btn.style.background = '#2563eb';
        btn.style.color = 'white';
        btn.style.cursor = 'pointer';
    } else {
        btn.disabled = true;
        btn.style.background = '#e2e8f0';
        btn.style.color = '#94a3b8';
        btn.style.cursor = 'not-allowed';
    }
}

function sgeSubmitCorrected() {
    document.getElementById('sge-form').style.display = 'none';
    document.getElementById('sge-result-correct').style.display = 'block';
    document.getElementById('sge-reset').style.display = 'block';
}

function resetSGE() {
    document.getElementById('sge-form').style.display = 'block';
    document.getElementById('sge-loading').style.display = 'none';
    document.getElementById('sge-dropdown-wrap').style.display = 'none';
    document.getElementById('sge-confirm-wrap').style.display = 'none';
    document.getElementById('sge-reason-wrap').style.display = 'none';
    document.getElementById('sge-submit-wrap').style.display = 'flex';
    document.getElementById('sge-result-accept').style.display = 'none';
    document.getElementById('sge-result-keep').style.display = 'none';
    document.getElementById('sge-result-correct').style.display = 'none';
    document.getElementById('sge-reset').style.display = 'none';
    document.getElementById('sge-reason-input').value = '';
    var btn = document.getElementById('sge-submit-final');
    btn.disabled = true;
    btn.style.background = '#e2e8f0';
    btn.style.color = '#94a3b8';
    btn.style.cursor = 'not-allowed';
    document.querySelectorAll('#sge-dropdown-wrap div').forEach(function (i) { i.style.background = ''; });
}

// Alert Saturation — notification stream demo
var asNotifications = [
    { text: 'Shift handover reminder', time: '09:02', critical: false },
    { text: 'Training module overdue', time: '09:14', critical: false },
    { text: 'Permit #2847 pending approval', time: '09:31', critical: false },
    { text: 'Inspection overdue — Bay 4', time: '09:45', critical: false },
    { text: 'Critical isolation conflict — Unit 3', time: '09:47', critical: true },
    { text: 'Permit #2848 pending approval', time: '09:53', critical: false },
    { text: 'Shift handover reminder', time: '10:02', critical: false },
];
var asIndex = 0, asRunning = false, asTimer = null, asDismissed = [];

function asStart() {
    document.getElementById('as-start-wrap').style.display = 'none';
    asRunning = true;
    asNext();
}

function asNext() {
    if (asIndex >= asNotifications.length) return;
    var n = asNotifications[asIndex];
    var stream = document.getElementById('as-stream');

    var el = document.createElement('div');
    el.id = 'as-notif-' + asIndex;
    el.style.cssText = 'background:white;border:1px solid #e2e8f0;border-radius:4px;padding:0.4rem 0.75rem;display:flex;justify-content:space-between;align-items:center;opacity:0;transition:opacity 0.3s ease;';
    el.innerHTML =
        '<span style="color:#64748b;font-size:0.78rem;">' + n.text + '</span>' +
        '<span style="display:flex;align-items:center;gap:0.6rem;">' +
        '<span style="font-size:0.7rem;color:#94a3b8;">' + n.time + '</span>' +
        '<button onclick="asDismiss(' + asIndex + ')" style="background:none;border:1px solid #e2e8f0;border-radius:3px;padding:0.1rem 0.45rem;font-size:0.7rem;color:#94a3b8;cursor:pointer;line-height:1.4;">Dismiss ×</button>' +
        '</span>';

    stream.appendChild(el);
    setTimeout(function () { el.style.opacity = '1'; }, 30);
    var idx = asIndex;
    asIndex++;
}

function asDismiss(idx) {
    var el = document.getElementById('as-notif-' + idx);
    if (!el) return;
    asDismissed.push(idx);
    el.style.transition = 'opacity 0.2s ease, max-height 0.25s ease, padding 0.25s ease, margin 0.25s ease';
    el.style.opacity = '0';
    el.style.maxHeight = '0';
    el.style.padding = '0';
    el.style.overflow = 'hidden';

    if (asDismissed.length < asNotifications.length) {
        asTimer = setTimeout(asNext, 1400);
    } else {
        setTimeout(asShowResult, 400);
    }
}

function asShowResult() {
    document.getElementById('as-stream').style.display = 'none';
    var resultList = document.getElementById('as-result-list');
    resultList.innerHTML = '';
    var criticalDismissed = false;
    asNotifications.forEach(function (n, i) {
        var el = document.createElement('div');
        if (n.critical) {
            criticalDismissed = true;
            el.style.cssText = 'background:#fef2f2;border:1px solid #fca5a5;border-radius:4px;padding:0.4rem 0.75rem;display:flex;justify-content:space-between;align-items:center;';
            el.innerHTML = '<span style="color:#991b1b;font-size:0.78rem;font-weight:600;">' + n.text + '</span>' +
                '<span style="display:flex;align-items:center;gap:0.6rem;"><span style="font-size:0.7rem;color:#fca5a5;">' + n.time + '</span>' +
                '<span style="font-size:0.68rem;color:#991b1b;background:#fef2f2;border:1px solid #fca5a5;border-radius:3px;padding:0.1rem 0.45rem;">Dismissed</span></span>';
        } else {
            el.style.cssText = 'background:white;border:1px solid #e2e8f0;border-radius:4px;padding:0.4rem 0.75rem;display:flex;justify-content:space-between;align-items:center;opacity:0.5;';
            el.innerHTML = '<span style="color:#94a3b8;font-size:0.78rem;">' + n.text + '</span>' +
                '<span style="font-size:0.7rem;color:#cbd5e1;">' + n.time + '</span>';
        }
        resultList.appendChild(el);
    });
    document.getElementById('as-result-note').textContent = criticalDismissed
        ? 'The critical isolation conflict was dismissed at 09:47. No action was taken. The interface gave no way to tell it apart.'
        : '';
    document.getElementById('as-result').style.display = 'block';
}

function asReset() {
    asIndex = 0; asRunning = false; asDismissed = [];
    clearTimeout(asTimer);
    document.getElementById('as-stream').innerHTML = '';
    document.getElementById('as-stream').style.display = 'flex';
    document.getElementById('as-result').style.display = 'none';
    document.getElementById('as-start-wrap').style.display = 'block';
}
