require('./test-helper');
require('./script');

global.console = {
    warn: jest.fn()
}

beforeEach(() => {
    global.console.warn.mockClear();
});

test('Replaces img element with new web iframe', () => {
    let clientWidth = 1000;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true);
    setReportUrls(element, 'pbi-resize-src', 'pbi-resize-m-src');
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    var currentChild = document.body.children[0].children[0];

    expect(currentChild).toBeInstanceOf(HTMLIFrameElement);
});

test('Replaces img element with new mobile iframe', () => {
    let clientWidth = 500;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true);
    setReportUrls(element, 'pbi-resize-src', 'pbi-resize-m-src');
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    var currentChild = document.body.children[0].children[0];

    expect(currentChild).toBeInstanceOf(HTMLIFrameElement);
});

test('Sets current src to web img', () => {
    let clientWidth = 1000;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true);
    setImgSrc(element, 'web-img', 'mobile-img');
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let img = getChildByTag(element, 'img');

    expect(img.getAttribute('src')).toBe('web-img');
});

test('Sets current src to mobile img', () => {
    let clientWidth = 500;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true);
    setImgSrc(element, 'web-img', 'mobile-img');
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let img = getChildByTag(element, 'img');

    expect(img.getAttribute('src')).toBe('mobile-img');
});

test('If resize smaller than content min width change to mobile img', () => {
    let clientWidth = 1000;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true);
    setImgSrc(element, 'web-img', 'mobile-img');
    var img = getChildByTag(element, 'img');

    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(img.getAttribute('src')).toBe('web-img');

    Object.defineProperty(element, 'clientWidth', { value: 500 });
    window.dispatchEvent(new Event('resize'));

    expect(img.getAttribute('src')).toBe('mobile-img');
});

test('If resize larger than content min width change to web img', () => {
    let clientWidth = 500;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true);
    setImgSrc(element, 'web-img', 'mobile-img');
    var img = getChildByTag(element, 'img');

    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    Object.defineProperty(element, 'clientWidth', { value: 1000 });
    window.dispatchEvent(new Event('resize'));

    expect(img.getAttribute('src')).toBe('web-img');
});

test('If current src is web pbi report and resize smaller than content min width change to mobile pbi report', () => {
    let clientWidth = 1000;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true, true);
    var iframe = getChildByTag(element, 'iframe');

    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    // Setting iframe src attibute prefixes with 'http://localhost/' so need to remove :(
    Object.defineProperty(iframe, 'src', { value: iframe.src.substring(17), configurable: true });

    Object.defineProperty(element, 'clientWidth', { value: 500, configurable: true });
    window.dispatchEvent(new Event('resize'));

    expect(iframe.getAttribute('src')).toBe('mobile-src');
});

test('If current src is mobile pbi report and resize larger than content min width change to web pbi report', () => {
    let clientWidth = 500;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true, true);
    var iframe = getChildByTag(element, 'iframe');

    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    // Setting iframe src attibute prefixes with 'http://localhost/' so need to remove :(
    Object.defineProperty(iframe, 'src', { value: iframe.src.substring(17), configurable: true });

    Object.defineProperty(element, 'clientWidth', { value: 1000, configurable: true });
    window.dispatchEvent(new Event('resize'));

    expect(iframe.getAttribute('src')).toBe('web-src');
});

// by the time we get to the click event we have not yet defined what to do so nothing is happening here.
test('If current element is img and we click on the img, replace with iframe', () => {
    let clientWidth = 1000;
    let contentMinWidth = 700;
    let element = createElement('16', '9', '4', '3', clientWidth, contentMinWidth, true, true);
    setImgSrc(element, 'pbi-resize-img', 'pbi-resize-m-img');

    element.setAttribute('pbi-resize-load-event', 'page-load');

    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    var button = getChildByTag(element, 'div');
    button.dispatchEvent(new Event('click'));

    var currentChild = document.body.children[0].children[0];
    expect(currentChild).toBeInstanceOf(HTMLIFrameElement);
});