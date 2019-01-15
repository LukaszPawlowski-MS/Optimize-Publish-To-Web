require('./test-helper');
require('./script');
var setUrls = false;

global.console = {
    warn: jest.fn()
}

beforeEach(() => {
    global.console.warn.mockClear();
});

test('Script loads', ()=>{
    expect(window.powerbiresizescript).toBe(1);
});

test('Multiple reports on the page should all work', () => {
    createElement('16', '9', '', '', 1000, 700, true, setUrls);
    createElement('4', '3', '', '', 1200, 700, false, setUrls);

    expect(document.body.children.length).toBe(2);
});

test('Client width greater than 569 with ratio 16x9', () => {
    let element = createElement('16', '9', '', '', 1000, 700, true, setUrls);
    window.document.dispatchEvent(new Event("DOMContentLoaded"));
    
    let img = getChildByTag(element, 'img');

    expect(img.style.width).toBe("100%");
    expect(img.style.height).toBe("618.5px");
});

test('Client width less 569 with ratio 16x9', () => {
    let element = createElement('16', '9', '', '', 560, 700, true, setUrls);
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let img = getChildByTag(element, 'img');

    expect(element.getAttribute('pbi-resize-width')).toBe("16");
    expect(element.getAttribute('pbi-resize-height')).toBe("9");

    setSize(img, '568.88px', (320 + 56 + 'px'));

    expect(global.console.warn).toHaveBeenCalledTimes(2);
});

test('Client width less than 437 with ratio 4x3', () => {
    let element = createElement('4', '3', '', '', 430, 700, true, setUrls);
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let img = getChildByTag(element, 'img');

    expect(img.style.width).toBe("426.66px");
    expect(img.style.height).toBe("376px");
    expect(global.console.warn).toHaveBeenCalledTimes(2);
});

test('Max height less than 320', () => {
    let clientWidth = 400;
    let element = createElement('4', '3', '4', '3', clientWidth, 700, true, setUrls);
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let img = getChildByTag(element, 'img');

    expect(img.style.width).toBe('426.66px');
    expect(img.style.height).toBe('376px');

    expect(global.console.warn).toHaveBeenCalledTimes(2);
});

test('Client width less than 320', () => {
    let clientWidth = 300;
    let element = createElement('4', '6', '4', '6', clientWidth, 700, true, setUrls);
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let img = getChildByTag(element, 'img');

    expect(img.style.width).toBe('320px');
    expect(img.style.height).toBe('536px');

    expect(global.console.warn).toHaveBeenCalledTimes(2);
});

test('Max height or client width greater than 320', () => {
    let clientWidth = 400;
    let element = createElement('5', '6', '5', '6', clientWidth, 700, true, setUrls);
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let sizeRatio = element.getAttribute('pbi-resize-width') / element.getAttribute('pbi-resize-height');
    let maxHeight = Math.max(clientWidth, 320) / sizeRatio;
    let height = maxHeight + 56 + "px";

    let img = getChildByTag(element, 'img');

    expect(img.style.width).toBe(clientWidth + 'px');
    expect(img.style.height).toBe(height);

    expect(global.console.warn).toHaveBeenCalledTimes(2);
});

test('Client width greater than 569 with ratio 4x3', () => {
    let clientWidth = 800;
    let element = createElement('4', '3', '', '', clientWidth, 700, true, setUrls);
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let sizeRatio = element.getAttribute('pbi-resize-width') / element.getAttribute('pbi-resize-height');
    let newHeight = Math.max(clientWidth / sizeRatio, 320) + 56 + "px";
    element.setAttribute('height', newHeight);

    expect(element.getAttribute('width')).toBe("100%");
    expect(element.getAttribute('height')).toBe(newHeight);

    expect(global.console.warn).toHaveBeenCalledTimes(0);
});

test('Resize window less than 569 with aspect ratio 16x9', () => {
    let clientWidth = 800;
    let element = createElement('16', '9', '16', '9', clientWidth, 700, true, setUrls);
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(global.console.warn).toHaveBeenCalledTimes(0);

    let img = getChildByTag(element, 'img');

    Object.defineProperty(element, 'clientWidth', { value: 500, configurable: true });
    window.dispatchEvent(new Event('resize'));

    expect(img.style.width).toBe('568.88px');
    expect(img.style.height).toBe((320 + 56 + 'px'));

    expect(global.console.warn).toHaveBeenCalledTimes(2);
});

test('Still works with mobile', () => {
    let element = createElement('', '', '4', '3', 500, 700, true, null);
    element.setAttribute("pbi-resize-m-img", 'pbi-resize-m-img');
    element.setAttribute("pbi-resize-m-src", 'pbi-resize-m-src');
    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    let img = getChildByTag(element, 'img');

    expect(img.style.width).toBe("100%");
    expect(img.style.height).toBe(Math.max(500 / (4/3), 320) + 56 + "px");
});