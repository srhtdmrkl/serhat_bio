(function() {
  var bar = document.getElementById('readbar');
  if (!bar) return;
  function upd() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? Math.min(100, h.scrollTop / max * 100) : 0) + '%';
  }
  window.addEventListener('scroll', upd, { passive: true });
  upd();
})();

(function() {
  var btn = document.getElementById('share-btn');
  var dd = document.getElementById('share-dd');
  if (!btn || !dd) return;
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', function() { dd.style.display = 'none'; });
  document.getElementById('share-copy').addEventListener('click', function() {
    navigator.clipboard.writeText(window.location.href).catch(function(){});
    dd.style.display = 'none';
  });
})();
