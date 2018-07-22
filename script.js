!function () {
    if ("undefined" == typeof window.powerbiresizescript) {
        window.powerbiresizescript = 1;
        var e = function () {
            for (var iframes = document.querySelectorAll("[pbi-resize=powerbi]"), i = 0; i < iframes.length; i++) {
                iframes[i].style.width = "100%";
                var idealWidth = iframes[i].getAttribute("pbi-resize-width");
                var idealHeight = iframes[i].getAttribute("pbi-resize-height");
                var actualWidth = iframes[i].clientWidth;
                var idealAspectRatio = idealWidth / idealHeight;
                var toosmall = false;
                if (actualWidth < 569 && idealAspectRatio === 16 / 9) {
                    iframes[i].style.width = "568.88px";
                    iframes[i].style.height = "376px";
                    toosmall = true;
                } else if (actualWidth <= 437 && idealAspectRatio === 4 / 3) {
                    iframes[i].style.width = "426.66px";
                    iframes[i].style.height = "376px";
                    toosmall = true;
                } else if (actualWidth < 320 || actualWidth / idealAspectRatio < 320 || idealHeight < 320 && idealAspectRatio !== 16 / 9 && idealAspectRatio !== 4 / 3) {
                    var height = Math.max(actualWidth, 320) / idealAspectRatio;
                    height < 320 ? (iframes[i].style.width = 320 * idealAspectRatio + "px", iframes[i].style.height = "376px")
                        : actualWidth < 320 ? (iframes[i].style.width = "320px", iframes[i].style.height = height + 56 + "px")
                            : (iframes[i].style.width = actualWidth + "px", iframes[i].style.height = height + 56 + "px");
                    toosmall = true;
                } else {
                    iframes[i].style.width = "100%";
                    iframes[i].style.height = Math.max(iframes[i].clientWidth / idealAspectRatio, 320) + 56 + "px";
                }
                if (toosmall) {
                    console.warn("pbi-resize: requested iframe dimension is below the minimum supported dimensions. Minimum supported width is 320px. Minimum supported height is 376px. Change your Power BI report page size to ensure your content looks great when embedded in your web page or blog.")
                }
            }
        };

        window.addEventListener("load", e);
        window.addEventListener("resize", e);
    }
}();