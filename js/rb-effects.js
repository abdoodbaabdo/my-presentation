/*
 RB-SVD Seminar — smooth Reveal.js transitions
 Does NOT change slide size, position, content, or order.
 Reveal.js remains responsible for slide visibility and layout.
*/
(function () {
  'use strict';

  function init() {
    if (typeof Reveal === 'undefined' || typeof Reveal.on !== 'function') return;

    // Respect reduced-motion preference.
    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // A transition layer outside the Reveal deck: it never touches section geometry.
    var layer = document.createElement('div');
    layer.id = 'rb-page-transition';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = '<div class="rb-transition-glow"></div>';
    document.body.appendChild(layer);

    var busy = false;
    var timer = null;

    function transition() {
      if (busy) return;
      busy = true;

      layer.classList.remove('rb-transition-run');
      void layer.offsetWidth;
      layer.classList.add('rb-transition-run');

      clearTimeout(timer);
      timer = setTimeout(function () {
        layer.classList.remove('rb-transition-run');
        busy = false;
      }, 480);
    }

    // slidechanged fires after Reveal has selected the new slide.
    // We only show a short visual sweep over the change.
    Reveal.on('slidechanged', transition);

    // Also support horizontal/vertical fragment navigation without interfering
    // with fragments themselves.
    Reveal.on('fragmentshown', function () {
      var slide = Reveal.getCurrentSlide && Reveal.getCurrentSlide();
      if (!slide) return;
      var items = slide.querySelectorAll('.fragment.visible');
      var last = items[items.length - 1];
      if (last) {
        last.classList.remove('rb-fragment-polish');
        void last.offsetWidth;
        last.classList.add('rb-fragment-polish');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // Reveal may initialize after DOMContentLoaded.
      setTimeout(init, 0);
    });
  } else {
    setTimeout(init, 0);
  }
})();
