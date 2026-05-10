(function () {
  var KEY = 'pqc-demo-theme';

  // Apply saved preference before first paint — prevents dark→light flash
  if (localStorage.getItem(KEY) === 'light') {
    document.documentElement.classList.add('light');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var isLight = document.documentElement.classList.contains('light');

    var btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.setAttribute('aria-label', 'Toggle light/dark mode');
    btn.textContent = isLight ? '\u25d1' : '\u2600'; // ◑ : ☀
    btn.style.cssText =
      'background:transparent;' +
      'border:1px solid rgba(255,255,255,0.15);' +
      'color:var(--text-dim,#50596a);' +
      'font-size:13px;' +
      'width:26px;height:26px;' +
      'border-radius:4px;' +
      'cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;' +
      'flex-shrink:0;' +
      'line-height:1;';

    btn.addEventListener('click', function () {
      var nowLight = document.documentElement.classList.toggle('light');
      localStorage.setItem(KEY, nowLight ? 'light' : 'dark');
      btn.textContent = nowLight ? '\u25d1' : '\u2600';
    });

    btn.addEventListener('mouseenter', function () {
      btn.style.borderColor = 'rgba(255,255,255,0.4)';
      btn.style.color = 'var(--text,#c8d4e0)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.borderColor = 'rgba(255,255,255,0.15)';
      btn.style.color = 'var(--text-dim,#50596a)';
    });

    var target = document.querySelector('.header-right');
    if (target) target.appendChild(btn);
  });
})();
