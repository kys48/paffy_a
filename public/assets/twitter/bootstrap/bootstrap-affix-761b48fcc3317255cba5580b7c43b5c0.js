/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n),this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)).on("click.affix.data-api",e.proxy(function(){setTimeout(e.proxy(this.checkPosition,this),1)},this)),this.$element=e(t),this.checkPosition()};t.prototype.checkPosition=function(){if(this.$element.is(":visible")){var t,n=e(document).height(),i=this.$window.scrollTop(),r=this.$element.offset(),o=this.options.offset,a=o.bottom,s=o.top,l="affix affix-top affix-bottom";"object"!=typeof o&&(a=s=o),"function"==typeof s&&(s=o.top()),"function"==typeof a&&(a=o.bottom()),t=null!=this.unpin&&i+this.unpin<=r.top?!1:null!=a&&r.top+this.$element.height()>=n-a?"bottom":null!=s&&s>=i?"top":!1,this.affixed!==t&&(this.affixed=t,this.unpin="bottom"==t?r.top-i:null,this.$element.removeClass(l).addClass("affix"+(t?"-"+t:"")))}};var n=e.fn.affix;e.fn.affix=function(n){return this.each(function(){var i=e(this),r=i.data("affix"),o="object"==typeof n&&n;r||i.data("affix",r=new t(this,o)),"string"==typeof n&&r[n]()})},e.fn.affix.Constructor=t,e.fn.affix.defaults={offset:0},e.fn.affix.noConflict=function(){return e.fn.affix=n,this},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),t.affix(n)})})}(window.jQuery);