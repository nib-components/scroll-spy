var event = require('event');
var throttle = require('throttle');
var offset = require('offset');
var scrollTo = require('scroll-to');

function ScrollSpy(el, options) {
  var self = this;

  this._onWindowScroll = throttle(this._onWindowScroll, 50).bind(this);
  this._onClick = this._onClick.bind(this);
  this._onWindowResize = throttle(this._onWindowResize, 500).bind(this);

  this.el = el;
  this.options = options || {};
  this.links = Array.prototype.slice.call(this.el.querySelectorAll('a'));

  // When clicking links in the nav
  this.links.forEach(function(el){
    event.bind(el, 'click', self._onClick);
  });

  this.recalculate();
  this.render();
  this.start();
}

ScrollSpy.prototype.recalculate = function() {
  var self = this;
  this.offsets = [];
  this.targets = [];
  this.links.each(function(el){
    var id = el.getAttribute('href');
    var offset = el.getAttribute('data-offset') * 1 || 0;
    var point = offset(document.body.querySelector(id)).top + offset;
    self.offsets.push(point);
    self.targets.push(el);
  });
};

ScrollSpy.prototype._onWindowResize = function() {
  this.recalculate();
  this.render();
};

ScrollSpy.prototype._onWindowScroll = function() {
  this.render();
};

ScrollSpy.prototype.getElementOffset = function(el) {
  if(this.options.offsetAttribute) {
    return el.getAttribute(this.options.offsetAttribute) * 1;
  }
  return 0;
};

ScrollSpy.prototype.render = function() {
  var currentScroll = document.body.scrollTop || document.querySelector('html').scrollTop;
  this.offsets.forEach(function(offset, i){
    if( currentScroll >= offset && currentScroll < this.offsets[i + 1] ) {
      this.activate(i);
    }
  }, this);
};

ScrollSpy.prototype._onClick = function(event) {
  if(event.preventDefault) {
    event.preventDefault();
  }

  var self = this;
  var el = event.target || event.srcElement;
  var index = this.links.indexOf(el);
  var target = document.querySelector(el.getAttribute('href'));
  var offset = this.getElementOffset(el);

  this.stop();
  this.activate(index);
  this.isAnimating = true;

  scrollTo(target, 2000, 'outExpo', function(){
    self.start();
    self.isAnimating = false;
  });

  return false;
};

ScrollSpy.prototype.activate = function(index) {
  if( this._current === index ) return;
  this.links.forEach(function(el){
    el.classList.remove('is-selected');
  });
  this.links[index).classList.add('is-selected');
  this._current = index;
};

ScrollSpy.prototype.start = function() {
  event.bind(window, 'scroll.scrollSpy', this._onWindowScroll);
};

ScrollSpy.prototype.stop = function() {
  event.unbind(window, 'scroll.scrollSpy', this._onWindowScroll);
};

ScrollSpy.create = function(selector, options) {
  Array.prototype.forEach.call(document.querySelectorAll(selector), function(el){
    return new ScrollSpy(el, options);
  });
};

module.exports = ScrollSpy;