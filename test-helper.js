setSize = (e, width, height) => {
    e.setAttribute('width', width);
    e.setAttribute('height', height);
}

setReportUrls = (e, webUrl, mobileUrl) => {
    e.setAttribute('pbi-resize-src', webUrl);
    e.setAttribute('pbi-resize-m-src', mobileUrl);
}

setImgSrc = (e, webSrc, mobileSrc) => {
    e.setAttribute('pbi-resize-img', webSrc);
    e.setAttribute('pbi-resize-m-img', mobileSrc);
};

setCurrentSrc = (e, src) => {
    e.setAttribute('src', src);
};

setButtonAttributes = (button, state) => {
    button.setAttribute('pbi-resize-wait-txt', 'Click to Interact!');
    button.setAttribute('pbi-resize-load-txt', 'Loading interactive report...');
    button.setAttribute('pbi-resize-rdy-txt', 'Click to Interact!');
    button.setAttribute('data-state', state);
}

getChildByTag = (parent, tagName)  => {
    for (var i = 0; i < parent.children.length; i++) {
        if (parent.children[i].tagName.toLowerCase() === tagName.toLowerCase()) {
            return parent.children[i];
        }
    }

    return null;
};

setButtonState = (button, state) => {
    button.setAttribute('data-state', state);
}

createElement = (webWidth, webHeight, mobileWidth, mobileHeight, clientWidth, minWidth, removeElement, setUrls) => {
    // delete everything from the DOM
    if(removeElement) {
        while (document.body.children.length>0) {
            document.body.removeChild(document.body.children[0]);
        }
    }

    // create and add iframe
    let e = document.createElement('div');
    e.setAttribute("pbi-resize", "powerbi");
    e.setAttribute("pbi-resize-width", webWidth);
    e.setAttribute("pbi-resize-height", webHeight);
    e.setAttribute("pbi-resize-m-width", mobileWidth);
    e.setAttribute("pbi-resize-m-height", mobileHeight);
    e.setAttribute("pbi-resize-min-width", minWidth);
    e.setAttribute("width", "100%");
    Object.defineProperty(e, 'clientWidth', { value: clientWidth, configurable: true });

    let img = document.createElement('img');
    Object.defineProperty(img, 'clientWidth', { value: clientWidth, configurable: true });

    e.appendChild(img);

    let iframe = document.createElement('iframe');
    Object.defineProperty(iframe, 'clientWidth', { value: clientWidth, configurable: true });

    e.appendChild(iframe);

    let button = document.createElement('div');
    e.appendChild(button);

    let spinner = document.createElement('span');
    button.appendChild(spinner);

    document.body.appendChild(e);

    if(setUrls){
        setReportUrls(e, 'web-src', 'mobile-src');
    }

    return e;
}