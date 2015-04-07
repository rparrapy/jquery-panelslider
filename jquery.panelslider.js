/*
 * jQuery Panel Slider plugin v0.1.1
 * https://github.com/eduardomb/jquery-panelslider
*/
(function($) {
  'use strict';

  var $body,
      _sliding = false;

  function _slideIn(panel, options) {
    var panelWidth = panel.outerWidth(true),
        bodyAnimation = {},
        panelAnimation = {};

    if(panel.is(':visible') || _sliding) {
      return;
    }

    _sliding = true;
    panel.addClass('ps-active-panel').css({
      position: 'fixed',
      top: 0,
      height: '100%',
      'z-index': 999999
    });
    panel.data(options);

    switch (options.side) {
      case 'left':
        panel.css({
          left: '-' + panelWidth + 'px',
          right: 'auto'
        });
        bodyAnimation['margin-left'] = '+=' + panelWidth;
        panelAnimation.left = '+=' + panelWidth;
        break;

      case 'right':
        panel.css({
          left: 'auto',
          right: '-' + panelWidth + 'px'
        });
        bodyAnimation['margin-left'] = '-=' + panelWidth;
        panelAnimation.right = '+=' + panelWidth;
        break;
    }

    if(typeof options.onOpen == 'function' && !options.animateCallbacks) {
        options.onOpen();
      }

    $body.animate(bodyAnimation, options.duration);
    panel.show().animate(panelAnimation, options.duration, function() {
      _sliding = false;

      if(typeof options.onOpen == 'function' && options.animateCallbacks) {
        options.onOpen();
      }
    });
  }

  $.panelslider = function(element, options) {
    var active = $('.ps-active-panel');
    var defaults = {
      side: 'left',     // panel side: left or right
      duration: 200,    // Transition duration in miliseconds
      clickClose: true, // If true closes panel when clicking outside it
      onOpen: null,      // When supplied, function is called after the panel opens
      container: $('body')
    };

    options = $.extend({}, defaults, options);
    $body = options.container;

    // If another panel is opened, close it before opening the new one
    if(active.is(':visible') && active[0] != element[0]) {
      _slideIn(element, options);
/*      $.panelslider.close(function() {
        _slideIn(element, options);
      });*/
    } else if(!active.length || active.is(':hidden')) {
      _slideIn(element, options);
    }
  };

  $.panelslider.close = function(panel, options) {
    var active = panel || $('.ps-active-panel'),
        duration = active.data('duration'),
        panelWidth = active.outerWidth(true),
        bodyAnimation = {},
        panelAnimation = {},
        callback = options.onClose;

    if(!active.length || active.is(':hidden') || _sliding) {
      return;
    }

    _sliding = true;

    switch(active.data('side')) {
      case 'left':
        bodyAnimation['margin-left'] = '-=' + panelWidth;
        panelAnimation.left = '-=' + panelWidth;
        break;

      case 'right':
        bodyAnimation['margin-left'] = '+=' + panelWidth;
        panelAnimation.right = '-=' + panelWidth;
        break;
    }

    if(callback && !options.animateCallbacks) {
        callback();
      }

    active.animate(panelAnimation, duration);
    $body.animate(bodyAnimation, duration, function() {
      active.hide();
      active.removeClass('ps-active-panel');
      _sliding = false;

      if(callback && options.animateCallbacks) {
        callback();
      }
    });
  };

  // Bind click outside panel and ESC key to close panel if clickClose is true
  $(document).bind('click keyup', function(e) {
    var active = $('.ps-active-panel');

    if(e.type == 'keyup' && e.keyCode != 27) {
      return;
    }

    if(active.is(':visible') && active.data('clickClose')) {
      $.panelslider.close();
    }
  });

  // Prevent click on panel to close it
  $(document).on('click', '.ps-active-panel', function(e) {
    e.stopPropagation();
  });

  $.fn.panelslider = function(options) {
    this.click(function(e) {
      var active = $('.ps-active-panel'),
          panel = $(this.getAttribute('href'));

      // Close panel if it is already opened otherwise open it
      if (active.is(':visible') && active.index(panel[0]) >= 0) {
        $.panelslider.close(panel, options);
      } else {
        $.panelslider(panel, options);
      }

      e.preventDefault();
      e.stopPropagation();
    });

    return this;
  };
})(jQuery);
