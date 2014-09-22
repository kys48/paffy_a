/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
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
!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,i){var o,r,a,s,l;for(this.type=t,this.$element=e(n),this.options=this.getOptions(i),this.enabled=!0,a=this.options.trigger.split(" "),l=a.length;l--;)s=a[l],"click"==s?this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this)):"manual"!=s&&(o="hover"==s?"mouseenter":"focus",r="hover"==s?"mouseleave":"blur",this.$element.on(o+"."+this.type,this.options.selector,e.proxy(this.enter,this)),this.$element.on(r+"."+this.type,this.options.selector,e.proxy(this.leave,this)));this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,this.$element.data(),t),t.delay&&"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n,i=e.fn[this.type].defaults,o={};return this._options&&e.each(this._options,function(e,t){i[e]!=t&&(o[e]=t)},this),n=e(t.currentTarget)[this.type](o).data(this.type),n.options.delay&&n.options.delay.show?(clearTimeout(this.timeout),n.hoverState="in",void(this.timeout=setTimeout(function(){"in"==n.hoverState&&n.show()},n.options.delay.show))):n.show()},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);return this.timeout&&clearTimeout(this.timeout),n.options.delay&&n.options.delay.hide?(n.hoverState="out",void(this.timeout=setTimeout(function(){"out"==n.hoverState&&n.hide()},n.options.delay.hide))):n.hide()},show:function(){var t,n,i,o,r,a,s=e.Event("show");if(this.hasContent()&&this.enabled){if(this.$element.trigger(s),s.isDefaultPrevented())return;switch(t=this.tip(),this.setContent(),this.options.animation&&t.addClass("fade"),r="function"==typeof this.options.placement?this.options.placement.call(this,t[0],this.$element[0]):this.options.placement,t.detach().css({top:0,left:0,display:"block"}),this.options.container?t.appendTo(this.options.container):t.insertAfter(this.$element),n=this.getPosition(),i=t[0].offsetWidth,o=t[0].offsetHeight,r){case"bottom":a={top:n.top+n.height,left:n.left+n.width/2-i/2};break;case"top":a={top:n.top-o,left:n.left+n.width/2-i/2};break;case"left":a={top:n.top+n.height/2-o/2,left:n.left-i};break;case"right":a={top:n.top+n.height/2-o/2,left:n.left+n.width}}this.applyPlacement(a,r),this.$element.trigger("shown")}},applyPlacement:function(e,t){var n,i,o,r,a=this.tip(),s=a[0].offsetWidth,l=a[0].offsetHeight;a.offset(e).addClass(t).addClass("in"),n=a[0].offsetWidth,i=a[0].offsetHeight,"top"==t&&i!=l&&(e.top=e.top+l-i,r=!0),"bottom"==t||"top"==t?(o=0,e.left<0&&(o=-2*e.left,e.left=0,a.offset(e),n=a[0].offsetWidth,i=a[0].offsetHeight),this.replaceArrow(o-s+n,n,"left")):this.replaceArrow(i-l,i,"top"),r&&a.offset(e)},replaceArrow:function(e,t,n){this.arrow().css(n,e?50*(1-e/t)+"%":"")},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function t(){var t=setTimeout(function(){n.off(e.support.transition.end).detach()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.detach()})}var n=this.tip(),i=e.Event("hide");return this.$element.trigger(i),i.isDefaultPrevented()?void 0:(n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?t():n.detach(),this.$element.trigger("hidden"),this)},fixTitle:function(){var e=this.$element;(e.attr("title")||"string"!=typeof e.attr("data-original-title"))&&e.attr("data-original-title",e.attr("title")||"").attr("title","")},hasContent:function(){return this.getTitle()},getPosition:function(){var t=this.$element[0];return e.extend({},"function"==typeof t.getBoundingClientRect?t.getBoundingClientRect():{width:t.offsetWidth,height:t.offsetHeight},this.$element.offset())},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||("function"==typeof n.title?n.title.call(t[0]):n.title)},tip:function(){return this.$tip=this.$tip||e(this.options.template)},arrow:function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(t){var n=t?e(t.currentTarget)[this.type](this._options).data(this.type):this;n.tip().hasClass("in")?n.hide():n.show()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}};var n=e.fn.tooltip;e.fn.tooltip=function(n){return this.each(function(){var i=e(this),o=i.data("tooltip"),r="object"==typeof n&&n;o||i.data("tooltip",o=new t(this,r)),"string"==typeof n&&o[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},e.fn.tooltip.noConflict=function(){return e.fn.tooltip=n,this}}(window.jQuery);