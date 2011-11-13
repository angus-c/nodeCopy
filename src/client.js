(function() {
  $ = document.getElementById.bind(document);
  $$ = document.getElementsByClassName.bind(document);

  [].slice.call($$('path')).forEach(function(el) {
    el.onblur = pathChanged.bind(el);
  })

  function pathChanged() {
    location.href = ['/?', this.id, '=', encodeURIComponent(this.value)].join('');
  }
})();