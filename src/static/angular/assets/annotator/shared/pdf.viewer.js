"undefined"==typeof PDFJS&&(("undefined"!=typeof window?window:this).PDFJS={}),function(){"use strict";var t=1;function e(t,e,i){var n=t.offsetParent;if(n){for(var r=i||!1,s=t.offsetTop+t.clientTop,a=t.offsetLeft+t.clientLeft;n.clientHeight===n.scrollHeight||r&&"hidden"===getComputedStyle(n).overflow;)if(n.dataset._scaleY&&(s/=n.dataset._scaleY,a/=n.dataset._scaleX),s+=n.offsetTop,a+=n.offsetLeft,!(n=n.offsetParent))return;e&&(void 0!==e.top&&(s+=e.top),void 0!==e.left&&(a+=e.left,n.scrollLeft=a)),n.scrollTop=s}else console.error("offsetParent is not set -- cannot scroll")}function i(t){if(Math.floor(t)===t)return[t,1];var e=1/t;if(e>8)return[1,8];if(Math.floor(e)===e)return[1,e];for(var i=t>1?e:t,n=0,r=1,s=1,a=1;;){var o=n+s,h=r+a;if(h>8)break;i<=o/h?(s=o,a=h):(n=o,r=h)}return i-n/r<s/a-i?i===t?[n,r]:[r,n]:i===t?[s,a]:[a,s]}function n(t,e){var i=t%e;return 0===i?t:Math.round(t-i+e)}var r=function(){function t(t,e){this.visible=!0,this.div=document.querySelector(t+" .progress"),this.bar=this.div.parentNode,this.height=e.height||100,this.width=e.width||100,this.units=e.units||"%",this.div.style.height=this.height+this.units,this.percent=0}return t.prototype={updateBar:function(){if(this._indeterminate)return this.div.classList.add("indeterminate"),void(this.div.style.width=this.width+this.units);this.div.classList.remove("indeterminate");var t=this.width*this._percent/100;this.div.style.width=t+this.units},get percent(){return this._percent},set percent(t){var e,i,n;this._indeterminate=isNaN(t),this._percent=(e=t,i=0,n=100,Math.min(Math.max(e,i),n)),this.updateBar()},setWidth:function(t){if(t){var e=t.parentNode.offsetWidth-t.offsetWidth;e>0&&this.bar.setAttribute("style","width: calc(100% - "+e+"px);")}},hide:function(){this.visible&&(this.visible=!1,this.bar.classList.add("hidden"),document.body.classList.remove("loadingInProgress"))},show:function(){this.visible||(this.visible=!0,document.body.classList.add("loadingInProgress"),this.bar.classList.remove("hidden"))}},t}(),s=function(){function t(){this.baseUrl=null,this.pdfDocument=null,this.pdfViewer=null,this.pdfHistory=null,this._pagesRefCache=null}return t.prototype={setDocument:function(t,e){this.baseUrl=e,this.pdfDocument=t,this._pagesRefCache=Object.create(null)},setViewer:function(t){this.pdfViewer=t},setHistory:function(t){this.pdfHistory=t},get pagesCount(){return this.pdfDocument.numPages},get page(){return this.pdfViewer.currentPageNumber},set page(t){this.pdfViewer.currentPageNumber=t},navigateTo:function(t){var e,i="",n=this,r=function(e){var s=e instanceof Object?n._pagesRefCache[e.num+" "+e.gen+" R"]:e+1;s?(s>n.pagesCount&&(s=n.pagesCount),n.pdfViewer.scrollPageIntoView(s,t),n.pdfHistory&&n.pdfHistory.push({dest:t,hash:i,page:s})):n.pdfDocument.getPageIndex(e).then(function(t){var i=t+1,s=e.num+" "+e.gen+" R";n._pagesRefCache[s]=i,r(e)})};"string"==typeof t?(i=t,e=this.pdfDocument.getDestination(t)):e=Promise.resolve(t),e.then(function(e){t=e,e instanceof Array&&r(e[0])})},getDestinationHash:function(t){if("string"==typeof t)return this.getAnchorUrl("#"+escape(t));if(t instanceof Array){var e=t[0],i=e instanceof Object?this._pagesRefCache[e.num+" "+e.gen+" R"]:e+1;if(i){var n=this.getAnchorUrl("#page="+i),r=t[1];if("object"==typeof r&&"name"in r&&"XYZ"===r.name){var s=t[4]||this.pdfViewer.currentScaleValue,a=parseFloat(s);a&&(s=100*a),n+="&zoom="+s,(t[2]||t[3])&&(n+=","+(t[2]||0)+","+(t[3]||0))}return n}}return this.getAnchorUrl("")},getAnchorUrl:function(t){return(this.baseUrl||"")+t},setHash:function(t){if(t.indexOf("=")>=0){var e,i,n=function(t){for(var e=t.split("&"),i={},n=0,r=e.length;n<r;++n){var s=e[n].split("="),a=s[0].toLowerCase(),o=s.length>1?s[1]:null;i[decodeURIComponent(a)]=decodeURIComponent(o)}return i}(t);if("nameddest"in n)return this.pdfHistory&&this.pdfHistory.updateNextHashParam(n.nameddest),void this.navigateTo(n.nameddest);if("page"in n&&(e=0|n.page||1),"zoom"in n){var r=n.zoom.split(","),s=r[0],a=parseFloat(s);-1===s.indexOf("Fit")?i=[null,{name:"XYZ"},r.length>1?0|r[1]:null,r.length>2?0|r[2]:null,a?a/100:s]:"Fit"===s||"FitB"===s?i=[null,{name:s}]:"FitH"===s||"FitBH"===s||"FitV"===s||"FitBV"===s?i=[null,{name:s},r.length>1?0|r[1]:null]:"FitR"===s?5!==r.length?console.error("PDFLinkService_setHash: Not enough parameters for 'FitR'."):i=[null,{name:s},0|r[1],0|r[2],0|r[3],0|r[4]]:console.error("PDFLinkService_setHash: '"+s+"' is not a valid zoom value.")}if(i?this.pdfViewer.scrollPageIntoView(e||this.page,i):e&&(this.page=e),"pagemode"in n){var o=document.createEvent("CustomEvent");o.initCustomEvent("pagemode",!0,!0,{mode:n.pagemode}),this.pdfViewer.container.dispatchEvent(o)}}else/^\d+$/.test(t)?this.page=t:(this.pdfHistory&&this.pdfHistory.updateNextHashParam(unescape(t)),this.navigateTo(unescape(t)))},executeNamedAction:function(t){switch(t){case"GoBack":this.pdfHistory&&this.pdfHistory.back();break;case"GoForward":this.pdfHistory&&this.pdfHistory.forward();break;case"NextPage":this.page++;break;case"PrevPage":this.page--;break;case"LastPage":this.page=this.pagesCount;break;case"FirstPage":this.page=1}var e=document.createEvent("CustomEvent");e.initCustomEvent("namedaction",!0,!0,{action:t}),this.pdfViewer.container.dispatchEvent(e)},cachePageRef:function(t,e){var i=e.num+" "+e.gen+" R";this._pagesRefCache[i]=t}},t}(),a={UNKNOWN:0,NORMAL:1,CHANGING:2,FULLSCREEN:3},o={INITIAL:0,RUNNING:1,PAUSED:2,FINISHED:3},h=function(){function t(){this.pdfViewer=null,this.pdfThumbnailViewer=null,this.onIdle=null,this.highestPriorityPage=null,this.idleTimeout=null,this.printing=!1,this.isThumbnailViewEnabled=!1}return t.prototype={setViewer:function(t){this.pdfViewer=t},setThumbnailViewer:function(t){this.pdfThumbnailViewer=t},isHighestPriority:function(t){return this.highestPriorityPage===t.renderingId},renderHighestPriority:function(t){this.idleTimeout&&(clearTimeout(this.idleTimeout),this.idleTimeout=null),this.pdfViewer.forceRendering(t)||this.pdfThumbnailViewer&&this.isThumbnailViewEnabled&&this.pdfThumbnailViewer.forceRendering()||this.printing||this.onIdle&&(this.idleTimeout=setTimeout(this.onIdle.bind(this),3e4))},getHighestPriority:function(t,e,i){var n=t.views,r=n.length;if(0===r)return!1;for(var s=0;s<r;++s){var a=n[s].view;if(!this.isViewFinished(a))return a}if(i){var o=t.last.id;if(e[o]&&!this.isViewFinished(e[o]))return e[o]}else{var h=t.first.id-2;if(e[h]&&!this.isViewFinished(e[h]))return e[h]}return null},isViewFinished:function(t){return t.renderingState===o.FINISHED},renderView:function(t){switch(t.renderingState){case o.FINISHED:return!1;case o.PAUSED:this.highestPriorityPage=t.renderingId,t.resume();break;case o.RUNNING:this.highestPriorityPage=t.renderingId;break;case o.INITIAL:this.highestPriorityPage=t.renderingId;var e=function(){this.renderHighestPriority()}.bind(this);t.draw().then(e,e)}return!0}},t}(),d=function(){function e(e){var i=e.container,n=e.id,r=e.scale,s=e.defaultViewport,a=e.renderingQueue,h=e.textLayerFactory,d=e.annotationLayerFactory;this.id=n,this.renderingId="page"+n,this.rotation=0,this.scale=r||t,this.viewport=s,this.pdfPageRotate=s.rotation,this.hasRestrictedScaling=!1,this.renderingQueue=a,this.textLayerFactory=h,this.annotationLayerFactory=d,this.renderingState=o.INITIAL,this.resume=null,this.onBeforeDraw=null,this.onAfterDraw=null,this.textLayer=null,this.zoomLayer=null,this.annotationLayer=null;var u=document.createElement("div");u.id="pageContainer"+this.id,u.className="page",u.style.width=Math.floor(this.viewport.width)+"px",u.style.height=Math.floor(this.viewport.height)+"px",u.setAttribute("data-page-number",this.id),this.div=u,i.appendChild(u)}return e.prototype={setPdfPage:function(t){this.pdfPage=t,this.pdfPageRotate=t.rotate;var e=(this.rotation+this.pdfPageRotate)%360;this.viewport=t.getViewport(this.scale*(96/72),e),this.stats=t.stats,this.reset()},destroy:function(){this.zoomLayer=null,this.reset(),this.pdfPage&&this.pdfPage.cleanup()},reset:function(t,e){this.renderTask&&this.renderTask.cancel(),this.resume=null,this.renderingState=o.INITIAL;var i=this.div;i.style.width=Math.floor(this.viewport.width)+"px",i.style.height=Math.floor(this.viewport.height)+"px";for(var n=i.childNodes,r=t&&this.zoomLayer||null,s=e&&this.annotationLayer&&this.annotationLayer.div||null,a=n.length-1;a>=0;a--){var h=n[a];r!==h&&s!==h&&i.removeChild(h)}i.removeAttribute("data-loaded"),s?this.annotationLayer.hide():this.annotationLayer=null,this.canvas&&!r&&(this.canvas.width=0,this.canvas.height=0,delete this.canvas),this.loadingIconDiv=document.createElement("div"),this.loadingIconDiv.className="loadingIcon",i.appendChild(this.loadingIconDiv)},update:function(t,e){this.scale=t||this.scale,void 0!==e&&(this.rotation=e);var i=(this.rotation+this.pdfPageRotate)%360;this.viewport=this.viewport.clone({scale:this.scale*(96/72),rotation:i});var n=!1;if(this.canvas&&PDFJS.maxCanvasPixels>0){var r=this.outputScale,s=this.viewport.width*this.viewport.height;Math.sqrt(PDFJS.maxCanvasPixels/s);(Math.floor(this.viewport.width)*r.sx|0)*(Math.floor(this.viewport.height)*r.sy|0)>PDFJS.maxCanvasPixels&&(n=!0)}if(this.canvas){if(PDFJS.useOnlyCssZoom||this.hasRestrictedScaling&&n){this.cssTransform(this.canvas,!0);var a=document.createEvent("CustomEvent");return a.initCustomEvent("pagerendered",!0,!0,{pageNumber:this.id,cssTransform:!0}),void this.div.dispatchEvent(a)}this.zoomLayer||(this.zoomLayer=this.canvas.parentNode,this.zoomLayer.style.position="absolute")}this.zoomLayer&&this.cssTransform(this.zoomLayer.firstChild),this.reset(!0,!0)},updatePosition:function(){this.textLayer&&this.textLayer.render(200)},cssTransform:function(t,e){var i=PDFJS.CustomStyle,n=this.viewport.width,r=this.viewport.height,s=this.div;t.style.width=t.parentNode.style.width=s.style.width=Math.floor(n)+"px",t.style.height=t.parentNode.style.height=s.style.height=Math.floor(r)+"px";var a=this.viewport.rotation-t._viewport.rotation,o=Math.abs(a),h=1,d=1;90!==o&&270!==o||(h=r/n,d=n/r);var u="rotate("+a+"deg) scale("+h+","+d+")";if(i.setProp("transform",t,u),this.textLayer){var l=this.textLayer.viewport,c=this.viewport.rotation-l.rotation,f=Math.abs(c),g=n/l.width;90!==f&&270!==f||(g=n/l.height);var p,v,m=this.textLayer.textLayerDiv;switch(f){case 0:p=v=0;break;case 90:p=0,v="-"+m.style.height;break;case 180:p="-"+m.style.width,v="-"+m.style.height;break;case 270:p="-"+m.style.width,v=0;break;default:console.error("Bad rotation value.")}i.setProp("transform",m,"rotate("+f+"deg) scale("+g+", "+g+") translate("+p+", "+v+")"),i.setProp("transformOrigin",m,"0% 0%")}e&&this.annotationLayer&&this.annotationLayer.render(this.viewport,"display")},get width(){return this.viewport.width},get height(){return this.viewport.height},getPagePoint:function(t,e){return this.viewport.convertToPdfPoint(t,e)},draw:function(){this.renderingState!==o.INITIAL&&console.error("Must be in new state before drawing"),this.renderingState=o.RUNNING;var t=this.pdfPage,e=this.viewport,r=this.div,s=document.createElement("div");s.style.width=r.style.width,s.style.height=r.style.height,s.classList.add("canvasWrapper");var a=document.createElement("canvas");a.id="page"+this.id,a.setAttribute("hidden","hidden");var h=!0;s.appendChild(a),this.annotationLayer&&this.annotationLayer.div?r.insertBefore(s,this.annotationLayer.div):r.appendChild(s),this.canvas=a;var d=a.getContext("2d",{alpha:!1}),u=function(t){var e=(window.devicePixelRatio||1)/(t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1);return{sx:e,sy:e,scaled:1!==e}}(d);if(this.outputScale=u,PDFJS.useOnlyCssZoom){var l=e.clone({scale:96/72});u.sx*=l.width/e.width,u.sy*=l.height/e.height,u.scaled=!0}if(PDFJS.maxCanvasPixels>0){var c=e.width*e.height,f=Math.sqrt(PDFJS.maxCanvasPixels/c);u.sx>f||u.sy>f?(u.sx=f,u.sy=f,u.scaled=!0,this.hasRestrictedScaling=!0):this.hasRestrictedScaling=!1}var g=i(u.sx),p=i(u.sy);a.width=n(e.width*u.sx,g[0]),a.height=n(e.height*u.sy,p[0]),a.style.width=n(e.width,g[1])+"px",a.style.height=n(e.height,p[1])+"px",a._viewport=e;var v,m,w=null,P=null;this.textLayerFactory&&((w=document.createElement("div")).className="textLayer",w.style.width=s.style.width,w.style.height=s.style.height,this.annotationLayer&&this.annotationLayer.div?r.insertBefore(w,this.annotationLayer.div):r.appendChild(w),P=this.textLayerFactory.createTextLayerBuilder(w,this.id-1,this.viewport)),this.textLayer=P;var y=new Promise(function(t,e){v=t,m=e}),b=this;function x(e){if(S===b.renderTask&&(b.renderTask=null),"cancelled"!==e){if(b.renderingState=o.FINISHED,h&&(b.canvas.removeAttribute("hidden"),h=!1),b.loadingIconDiv&&(r.removeChild(b.loadingIconDiv),delete b.loadingIconDiv),b.zoomLayer){var i=b.zoomLayer.firstChild;i.width=0,i.height=0,r.removeChild(b.zoomLayer),b.zoomLayer=null}b.error=e,b.stats=t.stats,b.onAfterDraw&&b.onAfterDraw();var n=document.createEvent("CustomEvent");n.initCustomEvent("pagerendered",!0,!0,{pageNumber:b.id,cssTransform:!1}),r.dispatchEvent(n),e?m(e):v(void 0)}else m(e)}var _=null;this.renderingQueue&&(_=function(t){if(!b.renderingQueue.isHighestPriority(b))return b.renderingState=o.PAUSED,void(b.resume=function(){b.renderingState=o.RUNNING,t()});h&&(b.canvas.removeAttribute("hidden"),h=!1),t()});var k={canvasContext:d,transform:u.scaled?[u.sx,0,0,u.sy,0,0]:null,viewport:this.viewport},S=this.renderTask=this.pdfPage.render(k);return S.onContinue=_,this.renderTask.promise.then(function(){x(null),P&&b.pdfPage.getTextContent({normalizeWhitespace:!0}).then(function(t){P.setTextContent(t),P.render(200)})},function(t){x(t)}),this.annotationLayerFactory&&(this.annotationLayer||(this.annotationLayer=this.annotationLayerFactory.createAnnotationLayerBuilder(r,this.pdfPage)),this.annotationLayer.render(this.viewport,"display")),r.setAttribute("data-loaded",!0),b.onBeforeDraw&&b.onBeforeDraw(),y},beforePrint:function(){var t=PDFJS.CustomStyle,e=this.pdfPage,i=e.getViewport(1),n=document.createElement("canvas");n.width=2*Math.floor(i.width),n.height=2*Math.floor(i.height),n.style.width="200%";t.setProp("transform",n,"scale(0.5, 0.5)"),t.setProp("transformOrigin",n,"0% 0%");var r=document.getElementById("printContainer"),s=document.createElement("div");s.appendChild(n),r.appendChild(s),n.mozPrintCallback=function(t){var r=t.context;r.save(),r.fillStyle="rgb(255, 255, 255)",r.fillRect(0,0,n.width,n.height),r.restore(),r._transformMatrix=[2,0,0,2,0,0],r.scale(2,2);var s={canvasContext:r,viewport:i,intent:"print"};e.render(s).promise.then(function(){t.done()},function(e){console.error(e),"abort"in t?t.abort():t.done()})}}},e}(),u=function(){function t(t){this.textLayerDiv=t.textLayerDiv,this.renderingDone=!1,this.divContentDone=!1,this.pageIdx=t.pageIndex,this.pageNumber=this.pageIdx+1,this.matches=[],this.viewport=t.viewport,this.textDivs=[],this.findController=t.findController||null,this.textLayerRenderTask=null,this._bindMouse()}return t.prototype={_finishRendering:function(){this.renderingDone=!0;var t=document.createElement("div");t.className="endOfContent",this.textLayerDiv.appendChild(t);var e=document.createEvent("CustomEvent");e.initCustomEvent("textlayerrendered",!0,!0,{pageNumber:this.pageNumber}),this.textLayerDiv.dispatchEvent(e)},render:function(t){if(this.divContentDone&&!this.renderingDone){this.textLayerRenderTask&&(this.textLayerRenderTask.cancel(),this.textLayerRenderTask=null),this.textDivs=[];var e=document.createDocumentFragment();this.textLayerRenderTask=PDFJS.renderTextLayer({textContent:this.textContent,container:e,viewport:this.viewport,textDivs:this.textDivs,timeout:t}),this.textLayerRenderTask.promise.then(function(){this.textLayerDiv.appendChild(e),this._finishRendering(),this.updateMatches()}.bind(this),function(t){})}},setTextContent:function(t){this.textLayerRenderTask&&(this.textLayerRenderTask.cancel(),this.textLayerRenderTask=null),this.textContent=t,this.divContentDone=!0},convertMatches:function(t){for(var e=0,i=0,n=this.textContent.items,r=n.length-1,s=null===this.findController?0:this.findController.state.query.length,a=[],o=0,h=t.length;o<h;o++){for(var d=t[o];e!==r&&d>=i+n[e].str.length;)i+=n[e].str.length,e++;e===n.length&&console.error("Could not find a matching mapping");var u={begin:{divIdx:e,offset:d-i}};for(d+=s;e!==r&&d>i+n[e].str.length;)i+=n[e].str.length,e++;u.end={divIdx:e,offset:d-i},a.push(u)}return a},renderMatches:function(t){if(0!==t.length){var e=this.textContent.items,i=this.textDivs,n=null,r=this.pageIdx,s=null!==this.findController&&r===this.findController.selected.pageIdx,a=null===this.findController?-1:this.findController.selected.matchIdx,o={divIdx:-1,offset:void 0},h=a,d=h+1;if(null!==this.findController&&this.findController.state.highlightAll)h=0,d=t.length;else if(!s)return;for(var u=h;u<d;u++){var l=t[u],c=l.begin,f=l.end,g=s&&u===a?" selected":"";if(this.findController&&this.findController.updateMatchPosition(r,u,i,c.divIdx,f.divIdx),n&&c.divIdx===n.divIdx?w(n.divIdx,n.offset,c.offset):(null!==n&&w(n.divIdx,n.offset,o.offset),m(c)),c.divIdx===f.divIdx)w(c.divIdx,c.offset,f.offset,"highlight"+g);else{w(c.divIdx,c.offset,o.offset,"highlight begin"+g);for(var p=c.divIdx+1,v=f.divIdx;p<v;p++)i[p].className="highlight middle"+g;m(f,"highlight end"+g)}n=f}n&&w(n.divIdx,n.offset,o.offset)}function m(t,e){var n=t.divIdx;i[n].textContent="",w(n,0,t.offset,e)}function w(t,n,r,s){var a=i[t],o=e[t].str.substring(n,r),h=document.createTextNode(o);if(s){var d=document.createElement("span");return d.className=s,d.appendChild(h),void a.appendChild(d)}a.appendChild(h)}},updateMatches:function(){if(this.renderingDone){for(var t=this.matches,e=this.textDivs,i=this.textContent.items,n=-1,r=0,s=t.length;r<s;r++){for(var a=t[r],o=Math.max(n,a.begin.divIdx),h=a.end.divIdx;o<=h;o++){var d=e[o];d.textContent=i[o].str,d.className=""}n=a.end.divIdx+1}null!==this.findController&&this.findController.active&&(this.matches=this.convertMatches(null===this.findController?[]:this.findController.pageMatches[this.pageIdx]||[]),this.renderMatches(this.matches))}},_bindMouse:function(){var t=this.textLayerDiv;t.addEventListener("mousedown",function(e){var i=t.querySelector(".endOfContent");if(i){if(e.target!==t){var n=t.getBoundingClientRect(),r=Math.max(0,(e.pageY-n.top)/n.height);i.style.top=(100*r).toFixed(2)+"%"}i.classList.add("active")}}),t.addEventListener("mouseup",function(e){var i=t.querySelector(".endOfContent");i&&(i.style.top="",i.classList.remove("active"))})}},t}();function l(){}l.prototype={createTextLayerBuilder:function(t,e,i){return new u({textLayerDiv:t,pageIndex:e,viewport:i})}};var c=function(){function t(t){this.pageDiv=t.pageDiv,this.pdfPage=t.pdfPage,this.linkService=t.linkService,this.downloadManager=t.downloadManager,this.div=null}return t.prototype={render:function(t,e){var i=this,n={intent:void 0===e?"display":e};this.pdfPage.getAnnotations(n).then(function(e){if(t=t.clone({dontFlip:!0}),n={viewport:t,div:i.div,annotations:e,page:i.pdfPage,linkService:i.linkService,downloadManager:i.downloadManager},i.div)PDFJS.AnnotationLayer.update(n);else{if(0===e.length)return;i.div=document.createElement("div"),i.div.className="annotationLayer",i.pageDiv.appendChild(i.div),n.div=i.div,PDFJS.AnnotationLayer.render(n),"undefined"!=typeof mozL10n&&mozL10n.translate(i.div)}})},hide:function(){this.div&&this.div.setAttribute("hidden","true")}},t}();function f(){}f.prototype={createAnnotationLayerBuilder:function(t,e){return new c({pageDiv:t,pdfPage:e,linkService:new p})}};var g=function(){function i(t){var e=[];this.push=function(i){var n=e.indexOf(i);n>=0&&e.splice(n,1),e.push(i),e.length>t&&e.shift().destroy()},this.resize=function(i){for(t=i;e.length>t;)e.shift().destroy()}}function n(t){var e,i,n,r,s;this.container=t.container,this.viewer=t.viewer||t.container.firstElementChild,this.linkService=t.linkService||new p,this.downloadManager=t.downloadManager||null,this.removePageBorders=t.removePageBorders||!1,this.defaultRenderingQueue=!t.renderingQueue,this.defaultRenderingQueue?(this.renderingQueue=new h,this.renderingQueue.setViewer(this)):this.renderingQueue=t.renderingQueue,this.scroll=(e=this.container,i=this._scrollUpdate.bind(this),n=function(t){s||(s=window.requestAnimationFrame(function(){s=null;var t=e.scrollTop,n=r.lastY;t!==n&&(r.down=t>n),r.lastY=t,i(r)}))},r={down:!0,lastY:e.scrollTop,_eventHandler:n},s=null,e.addEventListener("scroll",n,!0),r),this.updateInProgress=!1,this.presentationModeState=a.UNKNOWN,this._resetView(),this.removePageBorders&&this.viewer.classList.add("removePageBorders")}return n.prototype={get pagesCount(){return this._pages.length},getPageView:function(t){return this._pages[t]},get currentPageNumber(){return this._currentPageNumber},set currentPageNumber(t){if(this.pdfDocument){var e=document.createEvent("UIEvents");if(e.initUIEvent("pagechange",!0,!0,window,0),e.updateInProgress=this.updateInProgress,!(0<t&&t<=this.pagesCount))return e.pageNumber=this._currentPageNumber,e.previousPageNumber=t,void this.container.dispatchEvent(e);e.previousPageNumber=this._currentPageNumber,this._currentPageNumber=t,e.pageNumber=t,this.container.dispatchEvent(e),this.updateInProgress||this.scrollPageIntoView(t)}else this._currentPageNumber=t},get currentScale(){return 0!==this._currentScale?this._currentScale:t},set currentScale(t){if(isNaN(t))throw new Error("Invalid numeric scale");if(!this.pdfDocument)return this._currentScale=t,void(this._currentScaleValue=0!==t?t.toString():null);this._setScale(t,!1)},get currentScaleValue(){return this._currentScaleValue},set currentScaleValue(t){if(!this.pdfDocument)return this._currentScale=isNaN(t)?0:t,void(this._currentScaleValue=t);this._setScale(t,!1)},get pagesRotation(){return this._pagesRotation},set pagesRotation(t){this._pagesRotation=t;for(var e=0,i=this._pages.length;e<i;e++){var n=this._pages[e];n.update(n.scale,t)}this._setScale(this._currentScaleValue,!0),this.defaultRenderingQueue&&this.update()},setDocument:function(t){if(this.pdfDocument&&this._resetView(),this.pdfDocument=t,t){var e,i=t.numPages,n=this,r=new Promise(function(t){e=t});this.pagesPromise=r,r.then(function(){var t=document.createEvent("CustomEvent");t.initCustomEvent("pagesloaded",!0,!0,{pagesCount:i}),n.container.dispatchEvent(t)});var s=!1,a=null,o=new Promise(function(t){a=t});this.onePageRendered=o;var h=function(t){t.onBeforeDraw=function(){n._buffer.push(this)},t.onAfterDraw=function(){s||(s=!0,a())}},u=t.getPage(1);return this.firstPagePromise=u,u.then(function(r){for(var s=this.currentScale,a=r.getViewport(s*(96/72)),u=1;u<=i;++u){var l=null;PDFJS.disableTextLayer||(l=this);var c=new d({container:this.viewer,id:u,scale:s,defaultViewport:a.clone(),renderingQueue:this.renderingQueue,textLayerFactory:l,annotationLayerFactory:this});h(c),this._pages.push(c)}var f=this.linkService;o.then(function(){if(PDFJS.disableAutoFetch)e();else for(var r=i,s=1;s<=i;++s)t.getPage(s).then(function(t,i){var s=n._pages[t-1];s.pdfPage||s.setPdfPage(i),f.cachePageRef(t,i.ref),--r||e()}.bind(null,s))});var g=document.createEvent("CustomEvent");g.initCustomEvent("pagesinit",!0,!0,null),n.container.dispatchEvent(g),this.defaultRenderingQueue&&this.update(),this.findController&&this.findController.resolveFirstPage()}.bind(this))}},_resetView:function(){this._pages=[],this._currentPageNumber=1,this._currentScale=0,this._currentScaleValue=null,this._buffer=new i(10),this._location=null,this._pagesRotation=0,this._pagesRequests=[];for(var t=this.viewer;t.hasChildNodes();)t.removeChild(t.lastChild)},_scrollUpdate:function(){if(0!==this.pagesCount){this.update();for(var t=0,e=this._pages.length;t<e;t++)this._pages[t].updatePosition()}},_setScaleDispatchEvent:function(t,e,i){var n=document.createEvent("UIEvents");n.initUIEvent("scalechange",!0,!0,window,0),n.scale=t,i&&(n.presetValue=e),this.container.dispatchEvent(n)},_setScaleUpdatePages:function(t,e,i,n){if(this._currentScaleValue=e,function(t,e){return e===t||Math.abs(e-t)<1e-15}(this._currentScale,t))n&&this._setScaleDispatchEvent(t,e,!0);else{for(var r=0,s=this._pages.length;r<s;r++)this._pages[r].update(t);if(this._currentScale=t,!i){var a,o=this._currentPageNumber;!this._location||this.isInPresentationMode||this.isChangingPresentationMode||(o=this._location.pageNumber,a=[null,{name:"XYZ"},this._location.left,this._location.top,null]),this.scrollPageIntoView(o,a)}this._setScaleDispatchEvent(t,e,n),this.defaultRenderingQueue&&this.update()}},_setScale:function(t,e){var i=parseFloat(t);if(i>0)this._setScaleUpdatePages(i,t,e,!1);else{var n=this._pages[this._currentPageNumber-1];if(!n)return;var r=this.isInPresentationMode||this.removePageBorders?0:40,s=this.isInPresentationMode||this.removePageBorders?0:5,a=(this.container.clientWidth-r)/n.width*n.scale,o=(this.container.clientHeight-s)/n.height*n.scale;switch(t){case"page-actual":i=1;break;case"page-width":i=a;break;case"page-height":i=o;break;case"page-fit":i=Math.min(a,o);break;case"auto":var h=n.width>n.height?Math.min(o,a):a;i=Math.min(1.25,h);break;default:return void console.error("pdfViewSetScale: '"+t+"' is an unknown zoom value.")}this._setScaleUpdatePages(i,t,e,!0)}},scrollPageIntoView:function(t,i){if(this.pdfDocument){var n=this._pages[t-1];if(this.isInPresentationMode){if(this._currentPageNumber!==n.id)return void(this.currentPageNumber=n.id);i=null,this._setScale(this._currentScaleValue,!0)}if(i){var r,s,a=0,o=0,h=0,d=0,u=n.rotation%180!=0,l=(u?n.height:n.width)/n.scale/(96/72),c=(u?n.width:n.height)/n.scale/(96/72),f=0;switch(i[1].name){case"XYZ":a=i[2],o=i[3],f=i[4],a=null!==a?a:0,o=null!==o?o:c;break;case"Fit":case"FitB":f="page-fit";break;case"FitH":case"FitBH":f="page-width",null===(o=i[2])&&this._location&&(a=this._location.left,o=this._location.top);break;case"FitV":case"FitBV":a=i[2],h=l,d=c,f="page-height";break;case"FitR":a=i[2],o=i[3],h=i[4]-a,d=i[5]-o;var g=this.removePageBorders?0:40,p=this.removePageBorders?0:5;r=(this.container.clientWidth-g)/h/(96/72),s=(this.container.clientHeight-p)/d/(96/72),f=Math.min(Math.abs(r),Math.abs(s));break;default:return}if(f&&f!==this._currentScale?this.currentScaleValue=f:0===this._currentScale&&(this.currentScaleValue="auto"),"page-fit"!==f||i[4]){var v=[n.viewport.convertToViewportPoint(a,o),n.viewport.convertToViewportPoint(a+h,o+d)],m=Math.min(v[0][0],v[1][0]),w=Math.min(v[0][1],v[1][1]);e(n.div,{left:m,top:w})}else e(n.div)}else e(n.div)}},_updateLocation:function(t){var e=this._currentScale,i=this._currentScaleValue,n=parseFloat(i)===e?Math.round(1e4*e)/100:i,r=t.id,s="#page="+r;s+="&zoom="+n;var a=this._pages[r-1],o=this.container,h=a.getPagePoint(o.scrollLeft-t.x,o.scrollTop-t.y),d=Math.round(h[0]),u=Math.round(h[1]);s+=","+d+","+u,this._location={pageNumber:r,scale:n,top:u,left:d,pdfOpenParams:s}},update:function(){var t=this._getVisiblePages(),e=t.views;if(0!==e.length){this.updateInProgress=!0;var i=Math.max(10,2*e.length+1);this._buffer.resize(i),this.renderingQueue.renderHighestPriority(t);for(var n=this._currentPageNumber,r=t.first,s=0,a=e.length,o=!1;s<a;++s){var h=e[s];if(h.percent<100)break;if(h.id===n){o=!0;break}}o||(n=e[0].id),this.isInPresentationMode||(this.currentPageNumber=n),this._updateLocation(r),this.updateInProgress=!1;var d=document.createEvent("UIEvents");d.initUIEvent("updateviewarea",!0,!0,window,0),d.location=this._location,this.container.dispatchEvent(d)}},containsElement:function(t){return this.container.contains(t)},focus:function(){this.container.focus()},get isInPresentationMode(){return this.presentationModeState===a.FULLSCREEN},get isChangingPresentationMode(){return this.presentationModeState===a.CHANGING},get isHorizontalScrollbarEnabled(){return!this.isInPresentationMode&&this.container.scrollWidth>this.container.clientWidth},_getVisiblePages:function(){if(this.isInPresentationMode){var t=[],e=this._pages[this._currentPageNumber-1];return t.push({id:e.id,view:e}),{first:e,last:e,views:t}}return function(t,e,i){for(var n,r,s,a,o,h,d=t.scrollTop,u=d+t.clientHeight,l=t.scrollLeft,c=l+t.clientWidth,f=[],g=0===e.length?0:function(t,e){var i=0,n=t.length-1;if(0===t.length||!e(t[n]))return t.length;if(e(t[i]))return i;for(;i<n;){var r=i+n>>1;e(t[r])?n=r:i=r+1}return i}(e,function(t){var e=t.div;return e.offsetTop+e.clientTop+e.clientHeight>d}),p=e.length;g<p&&(s=(r=(n=e[g]).div).offsetTop+r.clientTop,a=r.clientHeight,!(s>u));g++)(h=r.offsetLeft+r.clientLeft)+r.clientWidth<l||h>c||(o=100*(a-(Math.max(0,d-s)+Math.max(0,s+a-u)))/a|0,f.push({id:n.id,x:h,y:s,view:n,percent:o}));var v=f[0],m=f[f.length-1];return i&&f.sort(function(t,e){var i=t.percent-e.percent;return Math.abs(i)>.001?-i:t.id-e.id}),{first:v,last:m,views:f}}(this.container,this._pages,!0)},cleanup:function(){for(var t=0,e=this._pages.length;t<e;t++)this._pages[t]&&this._pages[t].renderingState!==o.FINISHED&&this._pages[t].reset()},_ensurePdfPageLoaded:function(t){if(t.pdfPage)return Promise.resolve(t.pdfPage);var e=t.id;if(this._pagesRequests[e])return this._pagesRequests[e];var i=this.pdfDocument.getPage(e).then(function(i){return t.setPdfPage(i),this._pagesRequests[e]=null,i}.bind(this));return this._pagesRequests[e]=i,i},forceRendering:function(t){var e=t||this._getVisiblePages(),i=this.renderingQueue.getHighestPriority(e,this._pages,this.scroll.down);return!!i&&(this._ensurePdfPageLoaded(i).then(function(){this.renderingQueue.renderView(i)}.bind(this)),!0)},getPageTextContent:function(t){return this.pdfDocument.getPage(t+1).then(function(t){return t.getTextContent({normalizeWhitespace:!0})})},createTextLayerBuilder:function(t,e,i){return new u({textLayerDiv:t,pageIndex:e,viewport:i,findController:this.isInPresentationMode?null:this.findController})},createAnnotationLayerBuilder:function(t,e){return new c({pageDiv:t,pdfPage:e,linkService:this.linkService,downloadManager:this.downloadManager})},setFindController:function(t){this.findController=t}},n}(),p=function(){function t(){}return t.prototype={get page(){return 0},set page(t){},navigateTo:function(t){},getDestinationHash:function(t){return"#"},getAnchorUrl:function(t){return"#"},setHash:function(t){},executeNamedAction:function(t){},cachePageRef:function(t,e){}},t}(),v=function(){function t(t){this.linkService=t.linkService,this.initialized=!1,this.initialDestination=null,this.initialBookmark=null}return t.prototype={initialize:function(t){this.initialized=!0,this.reInitialized=!1,this.allowHashChange=!0,this.historyUnlocked=!0,this.isViewerInPresentationMode=!1,this.previousHash=window.location.hash.substring(1),this.currentBookmark="",this.currentPage=0,this.updatePreviousBookmark=!1,this.previousBookmark="",this.previousPage=0,this.nextHashParam="",this.fingerprint=t,this.currentUid=this.uid=0,this.current={};var e=window.history.state;this._isStateObjectDefined(e)?(e.target.dest?this.initialDestination=e.target.dest:this.initialBookmark=e.target.hash,this.currentUid=e.uid,this.uid=e.uid+1,this.current=e.target):(e&&e.fingerprint&&this.fingerprint!==e.fingerprint&&(this.reInitialized=!0),this._pushOrReplaceState({fingerprint:this.fingerprint},!0));var i=this;function n(){i.previousHash=window.location.hash.slice(1),i._pushToHistory({hash:i.previousHash},!1,!0),i._updatePreviousBookmark()}function r(){var t=i._getPreviousParams(null,!0);if(t){var e=!i.current.dest&&i.current.hash!==i.previousHash;i._pushToHistory(t,!1,e),i._updatePreviousBookmark()}window.removeEventListener("beforeunload",r,!1)}window.addEventListener("popstate",function(t){i.historyUnlocked&&(t.state?i._goTo(t.state):0===i.uid?function(t,e){function n(){window.removeEventListener("popstate",n),i.allowHashChange=!0,i.historyUnlocked=!0,e()}i.historyUnlocked=!1,i.allowHashChange=!1,window.addEventListener("popstate",function e(){window.removeEventListener("popstate",e);window.addEventListener("popstate",n);i._pushToHistory(t,!1,!0);history.forward()}),history.back()}(i.previousHash&&i.currentBookmark&&i.previousHash!==i.currentBookmark?{hash:i.currentBookmark,page:i.currentPage}:{page:1},function(){n()}):n())},!1),window.addEventListener("beforeunload",r,!1),window.addEventListener("pageshow",function(t){window.addEventListener("beforeunload",r,!1)},!1),window.addEventListener("presentationmodechanged",function(t){i.isViewerInPresentationMode=!!t.detail.active})},clearHistoryState:function(){this._pushOrReplaceState(null,!0)},_isStateObjectDefined:function(t){return!!(t&&t.uid>=0&&t.fingerprint&&this.fingerprint===t.fingerprint&&t.target&&t.target.hash)},_pushOrReplaceState:function(t,e){e?window.history.replaceState(t,""):window.history.pushState(t,"")},get isHashChangeUnlocked(){return!this.initialized||this.allowHashChange},_updatePreviousBookmark:function(){this.updatePreviousBookmark&&this.currentBookmark&&this.currentPage&&(this.previousBookmark=this.currentBookmark,this.previousPage=this.currentPage,this.updatePreviousBookmark=!1)},updateCurrentBookmark:function(t,e){this.initialized&&(this.currentBookmark=t.substring(1),this.currentPage=0|e,this._updatePreviousBookmark())},updateNextHashParam:function(t){this.initialized&&(this.nextHashParam=t)},push:function(t,e){if(this.initialized&&this.historyUnlocked){if(t.dest&&!t.hash&&(t.hash=this.current.hash&&this.current.dest&&this.current.dest===t.dest?this.current.hash:this.linkService.getDestinationHash(t.dest).split("#")[1]),t.page&&(t.page|=0),e){var i=window.history.state.target;return i||(this._pushToHistory(t,!1),this.previousHash=window.location.hash.substring(1)),this.updatePreviousBookmark=!this.nextHashParam,void(i&&this._updatePreviousBookmark())}if(this.nextHashParam){if(this.nextHashParam===t.hash)return this.nextHashParam=null,void(this.updatePreviousBookmark=!0);this.nextHashParam=null}t.hash?this.current.hash?this.current.hash!==t.hash?this._pushToHistory(t,!0):(!this.current.page&&t.page&&this._pushToHistory(t,!1,!0),this.updatePreviousBookmark=!0):this._pushToHistory(t,!0):this.current.page&&t.page&&this.current.page!==t.page&&this._pushToHistory(t,!0)}},_getPreviousParams:function(t,e){if(!this.currentBookmark||!this.currentPage)return null;if(this.updatePreviousBookmark&&(this.updatePreviousBookmark=!1),this.uid>0&&(!this.previousBookmark||!this.previousPage))return null;if(!this.current.dest&&!t||e){if(this.previousBookmark===this.currentBookmark)return null}else{if(!this.current.page&&!t)return null;if(this.previousPage===this.currentPage)return null}var i={hash:this.currentBookmark,page:this.currentPage};return this.isViewerInPresentationMode&&(i.hash=null),i},_stateObj:function(t){return{fingerprint:this.fingerprint,uid:this.uid,target:t}},_pushToHistory:function(t,e,i){if(this.initialized){if(!t.hash&&t.page&&(t.hash="page="+t.page),e&&!i){var n=this._getPreviousParams();if(n){var r=!this.current.dest&&this.current.hash!==this.previousHash;this._pushToHistory(n,!1,r)}}this._pushOrReplaceState(this._stateObj(t),i||0===this.uid),this.currentUid=this.uid++,this.current=t,this.updatePreviousBookmark=!0}},_goTo:function(t){if(this.initialized&&this.historyUnlocked&&this._isStateObjectDefined(t)){if(!this.reInitialized&&t.uid<this.currentUid){var e=this._getPreviousParams(!0);if(e)return this._pushToHistory(this.current,!1),this._pushToHistory(e,!1),this.currentUid=t.uid,void window.history.back()}this.historyUnlocked=!1,t.target.dest?this.linkService.navigateTo(t.target.dest):this.linkService.setHash(t.target.hash),this.currentUid=t.uid,t.uid>this.uid&&(this.uid=t.uid),this.current=t.target,this.updatePreviousBookmark=!0;var i=window.location.hash.substring(1);this.previousHash!==i&&(this.allowHashChange=!1),this.previousHash=i,this.historyUnlocked=!0}},back:function(){this.go(-1)},forward:function(){this.go(1)},go:function(t){if(this.initialized&&this.historyUnlocked){var e=window.history.state;-1===t&&e&&e.uid>0?window.history.back():1===t&&e&&e.uid<this.uid-1&&window.history.forward()}}},t}(),m=function(){function t(t,e){var i=document.createElement("a");if(i.click)i.href=t,i.target="_parent","download"in i&&(i.download=e),(document.body||document.documentElement).appendChild(i),i.click(),i.parentNode.removeChild(i);else{if(window.top===window&&t.split("#")[0]===window.location.href.split("#")[0]){var n=-1===t.indexOf("?")?"?":"&";t=t.replace(/#|$/,n+"$&")}window.open(t,"_parent")}}function e(){}return e.prototype={downloadUrl:function(e,i){PDFJS.isValidUrl(e,!0)&&t(e+"#pdfjs.action=download",i)},downloadData:function(e,i,n){if(navigator.msSaveBlob)return navigator.msSaveBlob(new Blob([e],{type:n}),i);t(PDFJS.createObjectURL(e,n),i)},download:function(e,i,n){URL?navigator.msSaveBlob?navigator.msSaveBlob(e,n)||this.downloadUrl(i,n):t(URL.createObjectURL(e),n):this.downloadUrl(i,n)}},e}();PDFJS.PDFViewer=g,PDFJS.PDFPageView=d,PDFJS.PDFLinkService=s,PDFJS.TextLayerBuilder=u,PDFJS.DefaultTextLayerFactory=l,PDFJS.AnnotationLayerBuilder=c,PDFJS.DefaultAnnotationLayerFactory=f,PDFJS.PDFHistory=v,PDFJS.DownloadManager=m,PDFJS.ProgressBar=r}.call("undefined"==typeof window?this:window);