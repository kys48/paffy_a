/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
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
 * ======================================================== */
!function(e){"use strict";var t=function(t){this.element=e(t)};t.prototype={constructor:t,show:function(){var t,n,i,o=this.element,r=o.closest("ul:not(.dropdown-menu)"),a=o.attr("data-target");a||(a=o.attr("href"),a=a&&a.replace(/.*(?=#[^\s]*$)/,"")),o.parent("li").hasClass("active")||(t=r.find(".active:last a")[0],i=e.Event("show",{relatedTarget:t}),o.trigger(i),i.isDefaultPrevented()||(n=e(a),this.activate(o.parent("li"),r),this.activate(n,n.parent(),function(){o.trigger({type:"shown",relatedTarget:t})})))},activate:function(t,n,i){function o(){r.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),t.addClass("active"),a?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu")&&t.closest("li.dropdown").addClass("active"),i&&i()}var r=n.find("> .active"),a=i&&e.support.transition&&r.hasClass("fade");a?r.one(e.support.transition.end,o):o(),r.removeClass("in")}};var n=e.fn.tab;e.fn.tab=function(n){return this.each(function(){var i=e(this),o=i.data("tab");o||i.data("tab",o=new t(this)),"string"==typeof n&&o[n]()})},e.fn.tab.Constructor=t,e.fn.tab.noConflict=function(){return e.fn.tab=n,this},e(document).on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(t){t.preventDefault(),e(this).tab("show")})}(window.jQuery);