/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
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
 * ============================================================ */
!function(e){"use strict";function t(){e(".dropdown-backdrop").remove(),e(i).each(function(){n(e(this)).removeClass("open")})}function n(t){var n,i=t.attr("data-target");return i||(i=t.attr("href"),i=i&&/#/.test(i)&&i.replace(/.*(?=#[^\s]*$)/,"")),n=i&&e(i),n&&n.length||(n=t.parent()),n}var i="[data-toggle=dropdown]",o=function(t){var n=e(t).on("click.dropdown.data-api",this.toggle);e("html").on("click.dropdown.data-api",function(){n.parent().removeClass("open")})};o.prototype={constructor:o,toggle:function(){var i,o,r=e(this);if(!r.is(".disabled, :disabled"))return i=n(r),o=i.hasClass("open"),t(),o||("ontouchstart"in document.documentElement&&e('<div class="dropdown-backdrop"/>').insertBefore(e(this)).on("click",t),i.toggleClass("open")),r.focus(),!1},keydown:function(t){var o,r,a,s,l;if(/(38|40|27)/.test(t.keyCode)&&(o=e(this),t.preventDefault(),t.stopPropagation(),!o.is(".disabled, :disabled"))){if(a=n(o),s=a.hasClass("open"),!s||s&&27==t.keyCode)return 27==t.which&&a.find(i).focus(),o.click();r=e("[role=menu] li:not(.divider):visible a",a),r.length&&(l=r.index(r.filter(":focus")),38==t.keyCode&&l>0&&l--,40==t.keyCode&&l<r.length-1&&l++,~l||(l=0),r.eq(l).focus())}}};var r=e.fn.dropdown;e.fn.dropdown=function(t){return this.each(function(){var n=e(this),i=n.data("dropdown");i||n.data("dropdown",i=new o(this)),"string"==typeof t&&i[t].call(n)})},e.fn.dropdown.Constructor=o,e.fn.dropdown.noConflict=function(){return e.fn.dropdown=r,this},e(document).on("click.dropdown.data-api",t).on("click.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.dropdown.data-api",i,o.prototype.toggle).on("keydown.dropdown.data-api",i+", [role=menu]",o.prototype.keydown)}(window.jQuery);