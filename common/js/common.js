$(function () {
  // open win
  $('a.js-openwin').on('click', function () {
    window.open(
      $(this).attr('href'),
      'new',
      'width=1366,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes,directories=no,titlebar=yes,fullscreen=no'
    );
    return false;
  });

  var config = function () {
    //アンカーリンクをスムージング
    var _ua = Fourdigit.set()._ua,
      _browser = Fourdigit.set()._browser,
      _breakP = Fourdigit.set()._breakP,
      _winSize = Fourdigit.set()._winSize;
    // ブラウザを判別し、bodyにそのブラウザ名のクラスを付与
    for (var key in _browser) {
      if (_browser.hasOwnProperty(key)) {
        if (_browser[key] == true) {
          $('body').addClass(key);
        }
      }
    }
  };

  /**
   * 遅延画像読み込み
   * @description
   */
  document.addEventListener('DOMContentLoaded', yall);
  $(function () {
    /**
     * 共通系処理
     * @description
     * サイト共通で機能させる処理はここに書きます。
     */
    config();
    /**
     * VIEWPORT 切り替え
     * @description
     * TBの場合、viewportの値を切り替えます。
     */
    $(function () {
      function updateMetaViewport(contentWidth) {
        let angle = screen && screen.orientation && screen.orientation.angle;
        if (angle === undefined) angle = window.orientation;
        const isPortrait = angle === 0;
        const deviceW = isPortrait ? screen.width : screen.height;
        const tabLimitW = 768;
        const viewportContent = deviceW > tabLimitW ? `width=${contentWidth}px` : 'width=device-width, user-scalable=no';
        document.querySelector("meta[name='viewport']").setAttribute('content', viewportContent);
      }
      if (_ua.TB) {
        const contentWidth = "1200";
        window.addEventListener('load', updateMetaViewport(contentWidth), false);
        window.addEventListener('orientationchange', updateMetaViewport(contentWidth), false);
      } else if (_ua.SP) {
        const contentWidth = "375";
        window.addEventListener('load', updateMetaViewport(contentWidth), false);
        window.addEventListener('orientationchange', updateMetaViewport(contentWidth), false);
      }
    });
    //android tel設定
    $('a[href^=tel]').click(function () {
      location.href = $(this).attr('href');
      return false;
    });

    /**
     * 各ページ固有の処理
     * 基本的にローカルにJSは置かずにcommon内で完結させる。
     */

    $(function () {
      var w = $(window).width();
      var x = 760;
      if (w <= x) {
        window.onorientationchange = function () {
          switch (window.orientation) {
            case 0:
              break;
            case 90:
              alert('※当サイトを最適な状態でご覧いただくには、スマートフォンを縦にした状態でご覧ください。');
              break;
            case -90:
              alert('※当サイトを最適な状態でご覧いただくには、スマートフォンを縦にした状態でご覧ください。');
              break;
          }
        };
      }
    });

    window.addEventListener('DOMContentLoaded', function () {
      AOS.init({
        offset: 100,
        once: true,
        duration: 1300,
        easing: 'ease'
      });
    });

    // ハンバーガーメニュー
    $('.js-menuTrigger').on('click', function () {
      if ($('.is-open').length) {
        $('.js-menuTrigger').removeClass('is-open');
        $('.js-sp-menu').removeClass('is-sp-menu-open');
      } else {
        $('.js-menuTrigger').addClass('is-open');
        $('.js-sp-menu').addClass('is-sp-menu-open');
      }
      return false;
    });
    $(document).on('click', function (event) {
      if (!$(event.target).closest('.js-sp-menu').length && !$(event.target).is($('.c-menu-btn'))) {
        $('.js-sp-menu').removeClass('is-sp-menu-open');
        $('.js-menuTrigger').removeClass('is-open');
      }
    });

    // ヘッダ位置調整
    function setHeader() {
      var isPC = window.matchMedia('(min-width:768px)').matches;
      if (isPC) {
        if ($('.js-header.is-hide').length > 0) {
          $('.js-header').removeClass('is-hide');
        }
      }
      var header_h = $('.js-header').outerHeight();
      $('body').css('padding-top', header_h + 'px');
    }
    setHeader();

    // 下部固定メニューの位置調整
    function setFixedMenu() {
      var isSP = window.matchMedia('(max-width:768px)').matches;
      if (isSP) {
        var menu_h = $('.js-fixedMenu').outerHeight();
        $('body').css('padding-bottom', menu_h + 'px');
      } else {
        $('body').css('padding-bottom', '0');
      }
    }
    setFixedMenu();

    // リサイズイベント
    $(window).on('resize', function () {
      setHeader();
      setFixedMenu();
    });

    // SP時スクロール表示制御
    var startPos = 0,
      winScrollTop = 0;
    $(window).on('scroll', function () {
      var isSP = window.matchMedia('(max-width:768px)').matches;
      winScrollTop = $(this).scrollTop();
      if (isSP) {
        if (winScrollTop >= startPos) {
          if (winScrollTop >= 200) {
            $('.js-header').addClass('is-hide');
            $('.js-menuTrigger').removeClass('is-open');
            if ($('.js-sp-menu').length > 0) {
              $('.js-sp-menu').removeClass('is-sp-menu-open');
            }
          }
        } else {
          $('.js-header').removeClass('is-hide');
        }
      } else {
        if (winScrollTop >= startPos) {
          if (winScrollTop >= 200) {
            $('.js-pageTop').addClass('is-show');
          }
        } else {
          $('.js-pageTop').removeClass('is-show');
        }
      }
      startPos = winScrollTop;
    });

    // ページ内スクロール
    $(function () {
      $('a[href^="#"]').click(function () {
        const speed = 400;
        let href = $(this).attr('href');
        let target = $(href == '#' || href == '' ? 'html' : href);
        let position = target.offset().top;
        $('body,html').animate({
          scrollTop: position
        }, speed, 'swing');
        return false;
      });
    });

    /**
     * login page(cookie version)
     * md5.jsを使って暗号化はしているものの簡易的なもののため、個人情報等重要な情報を扱うページには利用しないこと
     * @description
     * 現在loginページの処理をlogin page(localStorage version)の方を適用しています。
     * login page(localStorage version)を使用する時は(cookie version)を削除して使用してください
     */
    $(function () {
      let currentPage = $('.main').attr('id');
      let valitadeLimited = currentPage.indexOf('limited') !== -1;
      let valitadeVisit = currentPage.indexOf('visit') !== -1;

      if (valitadeLimited || currentPage == 'login') {
        const accessDataName = 'accessData_leafia_sagamiono';

        /*----------------------------------------------------------------------
        // 資料請求者様限定
        ----------------------------------------------------------------------*/
        let pw = {};
        let inputData;

        pw.init = function () {
          // localStorageのキーの定義
          let limitedKey = window.localStorage.getItem(accessDataName);

          if (currentPage == 'login') {
            if (limitedKey != 'logined') {
              // 限定ログインページ初来訪時の処理
              $('#submit').bind('click touchstart', function () {
                inputData = $('#password').val();
                pw.auth(inputData); // パスワードが間違ってた時にリロードしてしまう処理を無効化

                return false;
              });
            } else {
              // 限定ログインページパスワード認証済みの処理
              window.localStorage.setItem(accessDataName, 'logined');
              location.href = './limited.html';
            }
          } else if (currentPage.includes('limited')) {
            // 限定ページに直接遷移した時にクッキーを認証するための処理
            loginCheck(limitedKey);
          }
        };

        pw.auth = function (value) {
          // md5の暗号を解読するための処理
          let str = CybozuLabs.MD5.calc(value);

          if (str == 'dcf54c3f4bba23c4c1cb5e006c23bfe7') {
            window.localStorage.setItem(accessDataName, 'logined');
            location.href = './limited.html';
          } else {
            alert('パスワードが間違っています');
          }
        };

        function loginCheck(limitedKey) {
          if (limitedKey != 'logined') {
            let urlArray = location.href.split('limited.html'),
              innerPath = urlArray[1],
              pathCount = (innerPath.match(/\//g) || []).length,
              pathLayer = '';
            for (let i = 0; i < pathCount; i++) {
              pathLayer += '../';
            }
            console.log(limitedKey);
            location.href = pathLayer + 'login.html';
          }
        }; // パスワード処理初期化

        pw.init();

      } else if (valitadeVisit || currentPage == 'login-visit') {

        const accessDataName = 'accessData_leafia_visit_sagamiono';

        /*----------------------------------------------------------------------
        // 来場者様限定
        ----------------------------------------------------------------------*/
        let pw = {};
        let inputData;

        pw.init = function () {
          // localStorageのキーの定義
          let limitedKey = window.localStorage.getItem(accessDataName);

          if (currentPage == 'login-visit') {
            if (limitedKey != 'logined') {
              // 限定ログインページ初来訪時の処理
              $('#submit').bind('click touchstart', function () {
                inputData = $('#password').val();
                pw.auth(inputData); // パスワードが間違ってた時にリロードしてしまう処理を無効化

                return false;
              });
            } else {
              // 限定ログインページパスワード認証済みの処理
              window.localStorage.setItem(accessDataName, 'logined');
              location.href = './visit.html';
            }
          } else if (currentPage.includes('visit')) {
            // 限定ページに直接遷移した時にクッキーを認証するための処理
            loginCheck(limitedKey);
          }
        };

        pw.auth = function (value) {
          // md5の暗号を解読するための処理
          let str = CybozuLabs.MD5.calc(value);

          if (str == '50c3ca850e927ef3f3230e8bd2e2e385') {
            window.localStorage.setItem(accessDataName, 'logined');
            location.href = './visit.html';
          } else {
            alert('パスワードが間違っています');
          }
        };

        function loginCheck(limitedKey) {
          if (limitedKey != 'logined') {
            let urlArray = location.href.split('visit.html'),
              innerPath = urlArray[1],
              pathCount = (innerPath.match(/\//g) || []).length,
              pathLayer = '';
            for (let i = 0; i < pathCount; i++) {
              pathLayer += '../';
            }
            console.log(limitedKey);
            location.href = pathLayer + 'login-visit.html';
          }
        }; // パスワード処理初期化

        pw.init();

      }
    });

    function waveBtn() {
      $(window).on('load', function () {
        $('.js-waveBtn').mouseover(function (e) {
          $(this).addClass('is-hover').delay(2000).queue(function (next) {
            $(this).removeClass('is-hover');
            next();
          });
        })

      });

    }
    waveBtn();


    switch ($('.main').attr('id')) {
      case 'top':



        function mvSliderFunc() {
          const $mvSlide = document.querySelector('.js-mvslider');
          const $mvSlideSkipBtn = document.querySelector('.js-mvBtn');
          const slideLength = $mvSlide.querySelectorAll('.swiper-slide').length - 1;
          const slider = new Swiper($mvSlide, {
            loop: false,
            speed: 2000,
            effect: 'fade',
            autoplay: {
              delay: 5500,
              stopOnLastSlide: 'true'
            },
            on: { // イベントを登録する
              slideChange: () => {
                if (slider.activeIndex === slideLength) {
                  $mvSlideSkipBtn.classList.add('is-stop');
                }
              },
            },
          });

          slider.on('slideChange', function () {
            if (this.realIndex > 0) {
              this.params.autoplay.delay = 4500;
            }
          });


          $mvSlideSkipBtn.addEventListener('click', () => {
            if (slider.activeIndex !== slideLength) {
              $mvSlideSkipBtn.classList.add('is-stop');
              $mvSlide.classList.add('is-change');
              setTimeout(function () {
                $mvSlide.classList.remove('is-change');
              }, 2000);
              slider.slideToLoop(slideLength);
              slider.autoplay.stop();
            } else {
              $mvSlideSkipBtn.classList.remove('is-stop');
              $mvSlide.classList.add('is-change');
              setTimeout(function () {
                $mvSlide.classList.remove('is-change');
              }, 2000);
              slider.slideToLoop(0);
              slider.autoplay.start();
            }
          });
        }

        window.addEventListener('DOMContentLoaded', () => {
          setTimeout(function () {
            mvSliderFunc();
          }, 1500);
        });

        break;

      case 'plan':
        $('.cls').on('click',function (){
          $('.fbann').hide();
        });

        function accordionPlan() {
          const $openBtn = document.getElementsByClassName('js-openBtn');
          const $openCont = document.getElementsByClassName('js-openCont');

          for (let i = 0; i < $openBtn.length; i++) {
            $openBtn[i].addEventListener('click', function () {
              this.classList.toggle('is-activeBtn');
              $openCont[i].classList.toggle('is-openCont');
            });
          }
        }
        accordionPlan();

        function switchFig() {
          const $tabs = document.getElementsByClassName('js-tabBtn');
          for (let i = 0; i < $tabs.length; i++) {
            $tabs[i].addEventListener('click', tabSwitch);
          }

          function tabSwitch() {
            const $ancestorEle = this.closest('.js-switchWrap');
            $ancestorEle.getElementsByClassName('is-active')[0].classList.remove('is-active');
            this.classList.add('is-active');
            $ancestorEle.getElementsByClassName('is-show')[0].classList.remove('is-show');
            const $groupTabs = $ancestorEle.getElementsByClassName('js-tabBtn');
            const $arrayTabs = Array.prototype.slice.call($groupTabs);
            const $index = $arrayTabs.indexOf(this);
            $ancestorEle.getElementsByClassName('js-switchCont')[$index].classList.add('is-show');
          }
        }
        switchFig();
        break;

      case 'area':
        function lifeInfoTab() {
          $(window).on('load', function () {
            const tabs = document.getElementsByClassName('js-lifeInfoTab');
            for (let i = 0; i < tabs.length; i++) {
              tabs[i].addEventListener('click', tabSwitch, false);
            }

            function tabSwitch() {
              document.getElementsByClassName('is-selected')[0].classList.remove('is-selected');
              this.classList.add('is-selected');
              document.getElementsByClassName('is-show')[0].classList.remove('is-show');
              const arrayTabs = Array.prototype.slice.call(tabs);
              const index = arrayTabs.indexOf(this);
              document.getElementsByClassName('js-lifeInfoCont')[index].classList.add('is-show');
            };
          });
        }
        lifeInfoTab();
        break;
            
        case 'area':    
        $(function() {
            if($(".swipe-img").length){
                $(window).on("load resize",function(){
                    if($(".sp").is(":visible")){
                        var ww = $(this).width();
                $(".swipe-img.modify-starts").each(function(){
                        var w = $(this).find("img.sp").length ? $(this).find("img.sp").width() : $(this).find("img").width() ;
                        w = w+parseInt($(this).css("padding-left"))+parseInt($(this).css("padding-right"));
                        var pos = w/2-(ww/2);
                        if($(this).hasClass("right-start")){
                            pos = w-ww;
                        }
                        if($(this).hasClass("right-start01")){
                            pos = w/2-w/5*.2;
                        }
                $(this).animate({"scrollLeft":pos},30);
                });
            }
        });
    }
});

      case 'design':
        // function panorama() {
        //   const $panoramaItem = document.querySelectorAll('.js-panoramaItem');
        //   const $panoramaMoveNext = document.querySelectorAll('.js-panoramaMove-next');
        //   const $panoramaMovePrev = document.querySelectorAll('.js-panoramaMove-prev');

        //   if ($panoramaItem.length) {
        //     $panoramaMoveNext.forEach(elm => {
        //       let intervalId;
        //       elm.addEventListener('mousedown', () => {
        //         const scrNext = () => {
        //           elm.closest('.js-panoramaItem').scrollLeft += 3;
        //         };
        //         intervalId = setInterval(scrNext, 1);
        //       });
        //       elm.addEventListener('mouseup', () => {
        //         clearInterval(intervalId);
        //       });
        //       elm.addEventListener('mousemove', () => {
        //         clearInterval(intervalId);
        //       });
        //     });

        //     $panoramaMovePrev.forEach(elm => {
        //       let intervalId;
        //       elm.addEventListener('mousedown', () => {
        //         const scrNext = () => {
        //           elm.closest('.js-panoramaItem').scrollLeft -= 3;
        //         };
        //         intervalId = setInterval(scrNext, 1);
        //       });
        //       elm.addEventListener('mouseup', () => {
        //         clearInterval(intervalId);
        //       });
        //       elm.addEventListener('mousemove', () => {
        //         clearInterval(intervalId);
        //       });
        //     });

        //     window.addEventListener('load', function () {
        //       const halfValue = 2;
        //       const windowWidth = window.innerWidth;
        //       const elmImage = $panoramaItem[0].querySelector('.panorama__image');
        //       const elmInner = $panoramaItem[0];
        //       const elmW = elmImage.clientWidth;
        //       const magicValue = windowWidth > 1200 ? 4 : 2.5;
        //       const elmHW = elmW / halfValue / magicValue;
        //       const breakNum = _breakP.SP ? 170 : 350;
        //       $panoramaItem[0].scrollLeft = elmW / 2 - breakNum - windowWidth / 2;
        //     });
        //   }
        // }
        // panorama();
        break;

      case 'brand':
        function brandSlider() {
          const sliderContainer = document.querySelector('.js-brandSlider');
          const sliderWrapper = sliderContainer.querySelector('.swiper-wrapper');
          const isSP = window.matchMedia('(max-width:768px)').matches;
          const defaltSpeed = 6000;
          const defaltSlideWidth = 440;
          let loopSlider;
          if (isSP) {
            loopSlider = new Swiper('.js-brandSlider', {
              loop: true,
              loopedSlides: 3,
              slidesPerView: 'auto',
              speed: defaltSpeed,
              autoplay: {
                delay: 0,
                disableOnInteraction: false
              },
            });
          } else {
            loopSlider = new Swiper('.js-brandSlider', {
              loop: true,
              freeMode: true,
              loopedSlides: 7,
              slidesPerView: "auto",
              speed: defaltSpeed,
              autoplay: {
                disableOnInteraction: false,
                delay: 0,
              },
            });
          }
          loopSlider.on('slideChange', function () {
            const currentSlideWidth = Number(loopSlider.slides[loopSlider.activeIndex - 1].querySelector('img').naturalWidth);
            currentSlideWidth === defaltSlideWidth ?
              sliderWrapper.style.transitionDuration = `${defaltSpeed}ms` :
              sliderWrapper.style.transitionDuration = `${defaltSpeed * (currentSlideWidth / defaltSlideWidth)}ms`
          });
        }
        window.addEventListener('load', function () {
          brandSlider();
        });

        break;

      case 'detail-limited':
        function switchFigLimited() {
          // タブに対してクリックイベントを適用
          const $tabs = document.getElementsByClassName('js-tabBtn');
          for (let i = 0; i < $tabs.length; i++) {
            $tabs[i].addEventListener('click', tabSwitch);
          }

          // タブをクリックすると実行する関数
          function tabSwitch() {
            // 引数で指定したセレクターと一致する直近の祖先要素を取得
            const $ancestorEle = this.closest('.js-switchWrap');
            // タブのclassの値を変更
            $ancestorEle.getElementsByClassName('is-active')[0].classList.remove('is-active');
            this.classList.add('is-active');
            // コンテンツのclassの値を変更
            $ancestorEle.getElementsByClassName('is-show')[0].classList.remove('is-show');
            const $groupTabs = $ancestorEle.getElementsByClassName('js-tabBtn');
            const $arrayTabs = Array.prototype.slice.call($groupTabs);
            const $index = $arrayTabs.indexOf(this);
            $ancestorEle.getElementsByClassName('js-switchCont')[$index].classList.add('is-show');
          }
        }
        switchFigLimited();
        break;

      case 'select':
        $('.openBtn').on('click',function (){
          var a = $(this).data('s');
          //$('.pbann').removeClass('act');
          $(this).parent().toggleClass('act');
          $(this).parent().next().toggleClass('act');
        });
        break;
      case 'modelroom':
        var slid4 = $(".slider").slick({
          centerMode: false,
          slidesToShow: 5,
          autoplay: true,
          dots: false,
          cssEase: "linear",
          swipe: false,
          pauseOnHover: false,
          // autoplaySpeed: 3000,
          autoplaySpeed: 0,
          speed: 7000,
          variableWidth: true,
          adaptiveHeight:true,
          arrows: false,
          pauseOnFocus: false,
          pauseOnHover: false
        });
        var mainSlider = "#slideb2";
        var thumbnailSlider = "#slide2";
        $(mainSlider).slick({
          autoplay: true,
          slidesToShow: 1,
          speed: 1000,
          fade: true,
          arrows: true
          // ,asNavFor: thumbnailSlider
        });
        $(mainSlider).on('beforeChange',function(event, slick, currentSlide, nextSlide){
          $('#slide2').removeClass(
              's0 s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11'
          );
          $('#slide2').addClass(
              's'+nextSlide
          );
        });
        $(thumbnailSlider+" .slide-item").on('click',function(){
          $(mainSlider).slick('slickPause');
          $('#slide2').removeClass(
              's0 s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11'
          );
          var index = $(this).attr("rel");
          $(mainSlider).slick("slickGoTo",index,false);
          $('#slide2').addClass(
              's'+index
          );
        });
        break;
      default:
        break;
    }
  });
});
