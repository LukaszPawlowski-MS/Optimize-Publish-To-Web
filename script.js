!function () {
    if ("undefined" == typeof window.powerbiresizescript) {
        window.powerbiresizescript = 1;

        // Waiting for Power BI report to finish loading
        window.onmessage = function(event) {
            var isReportPageLoadedEvent = function(event) {
                try {
                    if (event && event.data && event.data.url === '/reports/undefined/events/pageChanged') {
                        return true;
                    }
                } catch(error) {
                    return undefined;                    
                }
            };
            if (isReportPageLoadedEvent(event)) {
                var iframe = getIframeElement(event.source)
                setTimeout(function() {     
                    if(iframe && iframe.parentNode.children.length > 1){
                        switch (iframe.parentNode.getAttribute('pbi-resize-load-event')) {
                            case 'click':
                                showElement(iframe);
                                break;
        
                            case 'page-load':
                            case 'seconds-timeout':
                            case 'in-view':
                                var button = getChildByTag(iframe.parentNode, 'div');
                                setButtonState(button, 'readynow');
                                break;
                        }
                    }                    
                }, (iframe.parentNode.getAttribute('pbi-resize-delay-show') || 1) * 1000);
            }
        };

        function getChildByTag(parent, tagName) {
            if(parent) {
                for (var i = 0; i < parent.children.length; i++) {
                    if (parent.children[i].tagName.toLowerCase() === tagName.toLowerCase()) {
                        return parent.children[i];
                    }
                }
            }
            return null;
        }
          
        function getIframeElement(srcWindow) {
            var frames = document.getElementsByTagName('iframe');

            for (var i = 0; i < frames.length; i++) {
                if (frames[i].contentWindow === srcWindow) {
                    return frames[i];
                }
            }
        }

        function showElement(iframe) {
            // Remove button
            if(!iframe) {
                return;
            }
            var parent = iframe.parentNode;
            var button = getChildByTag(parent, 'div');
            if(button) {
                parent.removeChild(button);
            }
            var spinner = getChildByTag(parent, 'span');
            if(spinner) {
                parent.removeChild(spinner);
            }

            // Show report
            iframe.style.position = 'static';
            iframe.style.visibility = 'visible';

            // Remove image
            var img = getChildByTag(parent, 'img');
            if(img) {
                parent.removeChild(img);
            }
        }

        function setButtonState(button, state) {
            button.setAttribute('data-state', state);
            // This should be somewhere we can update it properly
            var states = [
                { state: 'waiting', text: button.getAttribute('pbi-resize-wait-txt') },
                { state: 'loading', text: button.getAttribute('pbi-resize-load-txt')},
                { state: 'loadingnow', text: button.getAttribute('pbi-resize-load-txt')},
                { state: 'ready', text: button.getAttribute('pbi-resize-rdy-txt') },
                { state: 'readynow', text: button.getAttribute('pbi-resize-load-txt') }
            ]

            var text = '';

            for (var i = 0; i < states.length; i++) {
                if (states[i].state === state) {
                    text = states[i].text;
                }
            }

            var spinner = getChildByTag(button, 'span');
            button.innerHTML = text + spinner.outerHTML;

            switch (state) {
                case 'loading':
                    button.onclick = function() {
                        setButtonState(button, 'loadingnow');
                    }
                    button.parentNode.onclick = function() {
                        setButtonState(button, 'loadingnow');
                    }
                    break;

                case 'readynow':
                    resize();

                    var iframe = getChildByTag(button.parentNode, 'iframe');
                    showElement(iframe)
                    break;
                    
                case 'ready':
                    resize();
                    var spinner = getChildByTag(button, 'span');
                    spinner.style.display = 'none';
                    button.style.width = 'auto';
                    
                    button.onclick = function(e) {
                        var iframe = getChildByTag(e.target.parentNode, 'iframe');
                        showElement(iframe);
                    }

                    button.parentNode.onclick = function(e) {
                        var iframe = getChildByTag(e.target.parentNode, 'iframe');
                        showElement(iframe);
                    }

                    break;
            }
        }

        var e = function () {
            for (var e = document.querySelectorAll('[pbi-resize="powerbi"]'), i = 0; i < e.length; i++) {
                e[i].style.width = '100%';
                var actualWidth = e[i].clientWidth;

                var contentMinWidth = e[i].getAttribute("pbi-resize-min-width");
                var height = e[i].getAttribute('height');
                var webImg = e[i].getAttribute('pbi-resize-img');
                var mobileImg = e[i].getAttribute('pbi-resize-m-img') || webImg;
                var webWidth = e[i].getAttribute("pbi-resize-width");
                var webHeight = e[i].getAttribute("pbi-resize-height");
                var webSrc = e[i].getAttribute("pbi-resize-src");
                var mobileWidth = e[i].getAttribute("pbi-resize-m-width");
                var mobileHeight = e[i].getAttribute("pbi-resize-m-height");
                var mobileSrc = e[i].getAttribute("pbi-resize-m-src");
                var loadEvent = e[i].getAttribute('pbi-resize-load-event');
                var header = e[i].getAttribute('pbi-resize-header');

                var img = getChildByTag(e[i], 'img');
                var iframe = getChildByTag(e[i], 'iframe');
                var currentSrc = iframe ? iframe.getAttribute('src') : null;

                var mobileRatio = mobileWidth / mobileHeight;
                var webRatio = webWidth / webHeight;
                var isWebSize = actualWidth > contentMinWidth;

                var newSrc = !(webSrc && mobileSrc) ? webSrc : (isWebSize ? webSrc : mobileSrc);

                var resizedToWeb = ((iframe && iframe.src == mobileSrc) || (img && img.src == mobileImg)) && isWebSize && mobileSrc != webSrc;
                var resizedToMobile = ((iframe && iframe.src == webSrc) || (img && img.src == webImg)) && !isWebSize && mobileSrc != webSrc;
                var currentSrcIsImage = e[i].children.length > 1 ? true : false;

                if (!currentSrc) {
                    if(iframe) {
                        iframe.style.position = 'absolute';
                        iframe.style.top = 0;
                        iframe.style.left = 0;
                        iframe.style.visibility = 'hidden';
                    }

                    // If mobile screen width use the mobile image source, otherwise use desktop images
                    if(img) {
                        img.setAttribute('src', (!isWebSize && mobileImg) ? mobileImg : webImg);
                    }

                    if ((!webImg && webSrc && isWebSize) || (!mobileImg && mobileSrc && !isWebSize)) {
                        // If no web or mobile image provided remove the image tag and show the iframe
                        iframe.setAttribute('src', (!isWebSize && mobileSrc) ? mobileSrc : webSrc);
                        showElement(iframe);
                        resize();
                        break;
                    } else if ((webImg && webSrc) || (mobileImg && mobileSrc)) {
                        var button = getChildByTag(e[i], 'div');
                        
                        setButtonState(button, 'waiting');
    
                        switch (loadEvent) {
                            case 'page-load':
                            loadIframe(iframe.parentNode, newSrc);
                                break;
                        
                            case 'seconds-timeout':
                                var timeout = parseInt(e[i].getAttribute('pbi-resize-seconds')) * 1000;
                                
                                t = setTimeout(function () {
                                    loadIframe(iframe.parentNode, newSrc);
                                }, timeout);
                                break;
    
                            case 'in-view':
                                if(currentSrcIsImage && !iframe.src && isInViewport(img)) {
                                    loadIframe(iframe.parentNode, newSrc);
                                }
                                window.addEventListener('scroll', function () {
                                    if (currentSrcIsImage && !iframe.src && isInViewport(img)) {
                                        loadIframe(iframe.parentNode, newSrc);
                                    }
                                }, false);
                                break;
                            case 'click':
                                button.onclick = function() {
                                    loadIframe(iframe.parentNode, newSrc);
                                }
                                e[i].firstChild.onclick = function() {
                                    loadIframe(iframe.parentNode, newSrc);
                                }
                                break;
                        }
                    }
                }

                if((currentSrc == webImg && !webImg && webSrc && isWebSize) || (currentSrc == mobileImg && !mobileImg && mobileSrc && !isWebSize)) {
                    showElement(iframe);
                }
                else if(resizedToMobile || resizedToWeb) {
                    changeCurrentSrc(e[i].children[0], isWebSize, currentSrcIsImage ? webImg : webSrc, currentSrcIsImage ? mobileImg : mobileSrc, newSrc);
                }

                if (currentSrcIsImage && ((resizedToMobile && !mobileImg && mobileSrc) || (resizedToWeb && !webImg && webSrc))) {
                    showElement(iframe);
                }
                else if(!currentSrcIsImage && ((resizedToMobile && mobileImg && !mobileSrc) || (resizedToWeb && webImg && !webSrc))) {
                    showElement(iframe);
                }

                if (img && img.parentNode) {
                    resizeElement(img, header, actualWidth, isWebSize, webRatio, mobileRatio, webHeight, mobileHeight);
                }

                if (iframe) {
                    resizeElement(iframe, header, actualWidth, isWebSize, webRatio, mobileRatio, webHeight, mobileHeight);
                }
            }
        };

        function resizeElement(element, header, actualWidth, isWebSize, webRatio, mobileRatio, webHeight, mobileHeight) {
            var warn = false;

            if (mobileRatio && mobileHeight) {
                var pageSize = isWebSize ? webRatio : mobileRatio;
                var pageHeight = isWebSize ? webHeight : mobileHeight;
            }
            else {
                var pageSize = webRatio;
                var pageHeight = webHeight;
            }

            var p169 = 16.0 / 9.0;
            var p43 = 4.0 / 3.0;
            var heightOffset = header.toLowerCase()=="true" ? 36 : 56;

            if (actualWidth < 569 && pageSize === p169) {
                element.parentNode.style.width = "568.88px";
                element.style.width = "568.88px";
                element.style.height = 320 + heightOffset + "px";
                warn = true;
            }
            else if (actualWidth <= 437 && pageSize === p43) {
                element.parentNode.style.width = "426.66px";
                element.style.width = "426.66px";
                element.style.height = 320 + heightOffset + "px";
                warn = true;
            }
            else if (actualWidth < 320 || actualWidth / pageSize < 320 || (pageHeight < 320 && pageSize !== p169 && pageSize !== p43)) {
                var height = Math.max(actualWidth, 320) / pageSize;

                if (height < 320) {
                    element.parentNode.style.width = 320 * pageSize + "px";
                    element.style.width = 320 * pageSize + "px";
                    element.style.height = 320 + heightOffset + "px";
                }
                else if (actualWidth < 320) {
                    element.parentNode.style.width = 320 + "px";
                    element.style.width = 320 + "px";
                    element.style.height = height + heightOffset + "px";
                }
                else {
                    element.parentNode.style.width = actualWidth + "px";
                    element.style.width = actualWidth + "px";
                    element.style.height = height + heightOffset + "px";
                }
                warn = true;
            }
            else {
                element.parentNode.style.width = "100%";
                element.style.width = "100%";
                element.style.height = Math.max(element.clientWidth / pageSize, 320) + heightOffset + "px";
            }

            if (warn) {
                console.warn("pbi-resize: requested iframe dimension is below the minimum supported dimensions. Minimum supported width is 320px. Minimum supported height is 376px. Change your Power BI report page size to ensure your content looks great when embedded in your web page or blog.");
            }
        }

        document.addEventListener("DOMContentLoaded", e);
        window.addEventListener("resize", e);
        window.addEventListener("orientationchange", e);

        function isInViewport(e) {
            var bounding = e.getBoundingClientRect();
            return (
                bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };

        function changeCurrentSrc(e, isWebSize, web, mobile, newSrc) {
            if(web && mobile) {
                var iframe = e.nextElementSibling;
                if (e instanceof HTMLImageElement && iframe.src && (newSrc != iframe.src)) {
                    iframe.setAttribute('src', newSrc);
                    setButtonState(iframe.nextElementSibling, 'loading');
                }
                var currentSrc = isWebSize ? web : mobile;
                e.setAttribute('src', currentSrc);
            }
        }

        function resize() {
            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                var evt = document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            } else {
                window.dispatchEvent(new Event('resize'));
            }
        }

        function loadIframe(parent, src) {
            var iframe = getChildByTag(parent, 'iframe');
            var button = getChildByTag(parent, 'div');
            var spinner = getChildByTag(button, 'span');
            spinner.style.display = 'block';

            var style = document.createElement('style');
            style.type = 'text/css';
            var keyFrames = '@keyframes pbi-resize-spinner {\
                0% {\
                    transform: rotate(0deg);\
                }\
                100% {\
                    transform: rotate(360deg);\
                }\
            }';
            style.innerHTML = keyFrames;
            document.getElementsByTagName('head')[0].appendChild(style);


            iframe.setAttribute('src', src);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowFullScreen', 'true');
            setButtonState(button, 'loading');
        }
    }
}();