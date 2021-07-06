var size = 200;
var margin = 20;
var count = 6;
var visible = 3; // Visible carousel slides (excluding the barely)
var last = count - visible; // 3
var offset = 0;
var carousel = (size * visible) + (margin * visible) + (size / 3);
var container = (size * count) + (margin * count);
var barely = size / visible;

var $container = $('.carousel__inner');
var $slides = $('.carousel__box');
var $left = $('.carousel__control--left');
var $right = $('.carousel__control--right');
var $previous = null;
var $next = null;

var enter = null;
var close = null;

$left.on('click', function() {
  if ( offset === 0 ) return;
  move(--offset);
});

$right.on('click', function() {
  if ( offset === count - visible ) return;
  move(++offset);
});

$slides.each(function(index, slide) {
  $(slide).data('index', index);
});

$slides.on('mouseenter', _.debounce(function() {
  var $slide = $(this);
  var index = $slide.data('index');
  $previous = previous(index);
  $next = next(index);

  $previous.addClass('carousel__box--previous');
  $next.addClass('carousel__box--next');
  $slide.addClass('carousel__box--enter')
}, 350));

$slides.on('mouseout', _.debounce(function() {
  var $slide = $(this);

  $slide
    .addClass('carousel__box--leave')
    .removeClass('carousel__box--enter')
    .delay(400)
    .queue(function() {
      $(this).removeClass('carousel__box--leave')
        .dequeue();
    });

  $previous.addClass('carousel__box--previous-leave')
    .removeClass('carousel__box--previous')
    .delay(300)
    .queue(function() {
      $(this).removeClass('carousel__box--previous-leave')
        .dequeue();
    });

  $next.addClass('carousel__box--next-leave')
    .removeClass('carousel__box--next')
    .delay(300)
    .queue(function() {
      $(this).removeClass('carousel__box--next-leave')
        .dequeue();
    });
}, 300));

function previous(hovered) {
  // Index of the hovered slide in the current offset
  var index = hovered - offset;

  // We could have this as start = offset, but we have
  // a weird slider presented here haha.
  var start = offset + visible === count
    ? offset - 1
    : offset;

  return $slides.slice(start, offset + index);
}

function next(hovered) {
  // Index of the hovered slide in the current offset
  var index = hovered - offset;

  if ( index === visible ) {
    return $slides.slice();
  } else {
    return $slides.slice(offset + index + 1, offset + visible + 1);
  }
}

function move(offset) {
  var translateX = offset === last
    ? -(container - carousel - margin)
    : -((size * offset) + (margin * offset));
  $container.css('transform', 'translateX(' + translateX + 'px)');
}
