$(document).ready(function(){
var $slider = $('.slider'),
    contentLength = $slider.children().length - 1; // .slider直下の要素の数を取得。0から始まるインデックス番号と合致させる為に1引く。この数は最後のスライド番号と同じになります。
    
$slider.slick({
  slidesToShow: 1,
  autoplay: true,
  pauseOnHover: false,
  autoplaySpeed: 2000,
  arrows: false,
  fade: true,
  speed: 3000,
  dots: true
  }).on('afterChange', function() {
    var currentSlide = $slider.slick('slickCurrentSlide');
    if(currentSlide === contentLength){
      $slider.slick('slickPause');
    }
  });
});

