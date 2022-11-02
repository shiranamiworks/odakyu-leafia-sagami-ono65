/**
 * @name util.js
 * @fileOverview
 * @version 1.0
 * @description
 * <p>JavaScript Utility Library</p>
 * <p>(c) FOURDIGIT Inc. Licensed <a href="http://ja.wikipedia.org/wiki/GNU_General_Public_License">GNU General Public License</a>.</p>
 */
var Fourdigit = Fourdigit || {};
(function ($) {
  /**
   * @class Utility Core Class
   * @description
   * <p>FOURDIGIT Inc jQuery Plugins Core Class</p>
   * <p>ここは内部的に利用する関数が主です。</p>
   */
  Fourdigit.core = $.extend(
    /** @lends Fourdigit.core */
    {
      /**
       * 対象のリンクをポップアップする
       * @function
       * @param {String}	src ポップアップ先のURL
       * @param {String}	windowName ウィンドウ名
       * @param {Boolean}	status メニューバーの有無
       */
      popWindow: function (src, windowName, status) {
        var _href = (src ? src : "");
        var _isPop = (status != null);
        var _windowName = (windowName ? windowName : "");
        if (_isPop) {
          var _features = "";
          status.width ? _features += ",width=" + Math.min(status.width, screen.availWidth) : "";
          status.height ? _features += ",height=" + Math.min(status.height, screen.availHeight - 50) : "";
          status.left ? _features += ",left=" + status.left : "";
          status.top ? _features += ",top=" + status.top : "";
          status.menubar ? _features += ",menubar=" + status.menubar :
            _features += ",menubar=no";
          status.toolbar ? _features += ",toolbar=" + status.toolbar :
            _features += ",toolbar=no";
          status.location ? _features += ",location=" + status.location :
            _features += ",location=no";
          status.status ? _features += ",status=" + status.status :
            _features += ",location=no";
          status.resizable ? _features += ",resizable=" + status.resizable :
            _features += ",resizable=yes";
          status.scrollbars ? _features += ",scrollbars=" + status.scrollbars :
            _features += ",scrollbars=yes";
          _features = _features.replace(/^,/, "");
          void(window.open(_href, _windowName, _features));
        } else {
          void(window.open(_href, _windowName, null));
        }
      }
    });
  /**
   * @class Utility function Class
   * @description
   * <p>FOURDIGIT Inc jQuery Plugins function Class</p>
   * <p>ここはjQueryオブジェクトに対して機能追加されるプラグイン関数部分です。</p>
   */
  Fourdigit.fx = $.fn.extend(
    /** @lends Fourdigit.fx */
    {
      /**
       * 対象要素のリンクをポップアップにする
       * @function
       * @return {jQuery}	jQueryオブジェクトを返すのでそのままチェーンします。
       * @example
       * jQuery("a.commonPop").easyPop();
       * <strong>HTML</strong>
       * きちんとした定義
       * &lt;a href="someLink" class="commonPop" target="_blank" rel="width:500,height:300"%gt;SOME LINK%lt;a%gt;
       * 略 - widthとheightしか指定できません
       * &lt;a href="someLink" class="commonPop" target="_blank" rel="500,300"%gt;SOME LINK%lt;a%gt;
       */
      easyPop: function () {
        this.each(function () {
          this.target = "";
          var rel = {};
          if (!/:/.test(this.rel)) {
            var relArr = this.rel.split(",");
            if (relArr[1]) {
              rel["width"] = relArr[0];
              rel["height"] = relArr[1];
            } else {
              rel["width"] = relArr[0];
              rel["height"] = relArr[0];
            }
          } else {
            if (!this.rel) {
              rel = {
                width: "750",
                height: "800"
              }
            } else {
              var relArr = this.rel.split(",");
              if (this.rel.split(":")) {
                for (var i = 0; i < relArr.length; i++) {
                  var _key = relArr[i].split(":")[0];
                  var _val = relArr[i].split(":")[1];
                  rel[_key] = _val;
                }
              }
            }
          }
          $(this).click(function () {
            var wname = (rel["wname"] ? rel["wname"] : "");
            $.popWindow(this.href, wname, rel);
            return false;
          });
        })
        return this;
      },
      /**
       * 対象の要素を含んでいるかどうかを判別
       * @function
       * @param {String}	expr CSS形式での対象要素
       * @return {Boolean}
       * @example
       * if(jQuery.hasElem("#index")){
       *	alert("#indexがあります。");
       * }else{
       *	alert("#indexがありません。");
       * }
       */
      hasElem: function (expr) {
        return $(expr)[0];
      },
      /**
       * 対象要素がページ内リンクだった場合、イージングでスクロールするようにする
       * @function
       * @return {jQuery}	jQueryオブジェクトを返すのでそのままチェーンします。
       * @example
       * jQuery("a[href*=#]").smoothScroll();
       */
      smoothScroll: function (speed) {
        var pagePath = /\?/.test(location.href) ? location.href.split('?')[0] :
          /#/.test(location.href) ? location.href.split('#')[0] :
          location.href;
        var scrollInt;
        this.each(function () {
          var actX, actY, tarY = 0,
            tarX = 0;
          var headerHeight = $('.header-property').outerHeight(),
            /* 固定ヘッダーの高さ */
            headerMargin = 10; /* ヘッダーとスクロール指定位置までのマージン */
          speed = (!speed ? 6 : speed == "fast" ? 3 : speed == "normal" ? 6 : speed == "slow" ? 12 : speed);
          var setScroll = function (tarX, tarY) {
            actX += (tarX - actX) / parseInt(speed);
            actY += (tarY - actY) / parseInt(speed);
            if (Math.abs(tarX - actX) < 1 && Math.abs(tarY - actY) < 1) {
              clearInterval(scrollInt);
              scrollTo(Math.round(tarX), Math.round(tarY));
            } else {
              scrollTo(Math.round(actX), Math.round(actY));
            }
          }
          var anc = this.href.split('#')[1];
          if (!anc) return;
          if (/#/.test(this.href) && this.href.match(pagePath) && $('#' + anc)[0]) {
            $(this).click(function () {
              var tarObj = $('#' + anc);
              tarX = ($(document).width() > tarObj.position().left + $(window).width()) ?
                tarObj.position().left :
                $(document).width() - $(window).width();
              tarY = ($(document).height() > tarObj.position().top + $(window).height()) ?
                tarObj.position().top :
                $(document).height() - $(window).height();
              actX = $(document).scrollLeft();
              actY = $(document).scrollTop();
              tarY = tarY - headerHeight - headerMargin;
              clearInterval(scrollInt);
              scrollInt = setInterval(function () {
                setScroll(tarX, tarY)
              }, 20);
              return false;
            });
          }
        });
        var wheel = function () {
          clearInterval(scrollInt);
        }
        if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
        window.onmousewheel = document.onmousewheel = wheel;
        return this;
      }
    });
  /**
   * @class Utility Setting Class
   * @description
   * <p>FOURDIGIT Inc jQuery Plugins Setting Class</p>
   * <p>ここは判別用の値を返す関数です。</p>
   */
  Fourdigit.set = function () {
    /**
     * ユーザーエージェント判別
     * @function
     * @example
     * if(_ua.SP) {
     * 	// Mobile
     * }
     */
    _ua = (function (u) {
        return {
          TB: (u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) ||
            u.indexOf("ipad") != -1 ||
            u.indexOf("macintosh") != -1 && "ontouchend" in document ||
            (u.indexOf("android") != -1 && u.indexOf("mobile") == -1) ||
            (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1) ||
            u.indexOf("kindle") != -1 ||
            u.indexOf("silk") != -1 ||
            u.indexOf("playbook") != -1,
          SP: (u.indexOf("windows") != -1 && u.indexOf("phone") != -1) ||
            u.indexOf("iphone") != -1 ||
            u.indexOf("ipod") != -1 ||
            (u.indexOf("android") != -1 && u.indexOf("mobile") != -1) ||
            (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1) ||
            u.indexOf("blackberry") != -1
        }
      })(window.navigator.userAgent.toLowerCase()),
      /**
       * ブラウザ判別
       * @function
       * @example
       * if(_browser.ie11) {
       * 	// ie11
       * }
       */
      _browser = (function (u) {
        return {
          ie11: (u.indexOf('trident/7') > -1),
          edge: (u.indexOf('edge') > -1),
          ie: ((u.indexOf('msie') > -1) && (u.indexOf('opera') == -1)) || (u.indexOf('trident/7') > -1),
          chrome: (u.indexOf('chrome') > -1) && (u.indexOf('edge') == -1),
          ff: (u.indexOf('firefox') > -1),
          safari: (u.indexOf('safari') > -1) && (u.indexOf('chrome') == -1),
          opera: (u.indexOf('opera') > -1)
        }
      })(window.navigator.userAgent.toLowerCase()),
      /**
       * ブレイクポイント判別
       * @function
       * @example
       * if(_breakP.SP) {
       * 	// sp
       * }
       */
      _breakP = (function (w) {
        return {
          PC: w > 1000,
          TB: w < 1000 && w > 768,
          SP: w <= 768
        }
      })(window.innerWidth),
      /**
       * ウィンドウ幅の取得
       * @function
       * @example
       * if(_winSize.w < 736) {
       * }
       */
      _winSize = (function (w) {
        return {
          w: w
        }
      })(window.innerWidth)

    return {
      _ua: _ua,
      _browser: _browser,
      _breakP: _breakP,
      _winSize: _winSize
    }
  };
})(jQuery);
