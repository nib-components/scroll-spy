function ScrollSpy(el, options) {
  _.bindAll(this, '_onWindowScroll', '_onClick');
  this._onWindowScroll = _.throttle(this._onWindowScroll, 50);

  var self = this;

  this.el = $(el);
  this.links = this.el.find('a');
  this.window = $(window);
  this.start();

  var $body = $('body');
  var offsets = this.offsets = [];
  var targets = this.targets = [];

  this.links.each(function(){
    var id = this.getAttribute('href');
    var offset = this.getAttribute('data-offset') * 1 || 0;
    var point = $body.find(id).offset().top + offset;
    offsets.push(point);
    targets.push(this);
    $(this).on('click', self._onClick);
  });

}

ScrollSpy.prototype._onWindowScroll = function() {
  var currentScroll = $(window).scrollTop();
  var offsets = this.offsets;

  for (var i = 0; i < offsets.length; i++) {
    var offset = offsets[i];

    if( currentScroll >= offset && currentScroll < offsets[i + 1] ) {
      this.activate(i);
    }
  }
};

ScrollSpy.prototype._onClick = function(event) {
  event.preventDefault();

  var self = this;
  var el = $(event.currentTarget);
  var index = el.parent().index();
  var target = $(el.attr('href'));
  var offset = el.attr('data-offset') * 1 || 0;

  this.stop();
  this.activate(index);
  this.isAnimating = true;

  $('html, body').stop().animate({ 
    scrollTop: target.offset().top - $('body').offset().top + offset 
  }, { 
    duration: 2000, 
    easing: 'easeOutExpo',
    complete: function(){
      self.start();
      self.isAnimating = false;
    }
  });
};

ScrollSpy.prototype.activate = function(index) {
  if( this._current === index ) return;
  this.links.removeClass('is-selected');
  this.links.eq(index).addClass('is-selected');
  this._current = index;
};

ScrollSpy.prototype.start = function() {
  this.window.on('scroll.scrollSpy', this._onWindowScroll);
};

ScrollSpy.prototype.stop = function() {
  this.window.off('scroll.scrollSpy', this._onWindowScroll);
};

ScrollSpy.create = function(selector, options) {
  $(selector).each(function(){
    return new ScrollSpy(this, options);
  });
};

module.exports = ScrollSpy;