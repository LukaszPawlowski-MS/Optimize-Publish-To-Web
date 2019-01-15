require('./test-helper');
require('./script');
var setUrls = false;

global.console = {
    warn: jest.fn()
}

beforeEach(() => {
    global.console.warn.mockClear();
});

test('Load Event is On Page Load and button state is loading', () => {
    let element = createElement('16', '9', '', '', 1000, 700, true, true);
    element.setAttribute('pbi-resize-load-event', 'page-load');
    setImgSrc(element, 'web-img', 'mobile-img');

    let button = getChildByTag(element, 'div');
    setButtonAttributes(button, "loading");

    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(button.textContent).toBe(button.getAttribute('pbi-resize-load-txt'));
});

test('Load Event is After Click and button state is loading your report after click event', () => {
    let element = createElement('16', '9', '', '', 1000, 700, true, true);
    element.setAttribute('pbi-resize-load-event', 'click');
    setImgSrc(element, 'web-img', 'mobile-img');

    let button = getChildByTag(element, 'div');
    setButtonAttributes(button);

    window.document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(button.textContent).toBe(button.getAttribute('pbi-resize-wait-txt'));
    
    button.dispatchEvent(new Event('click'));

    expect(button.textContent).toBe(button.getAttribute('pbi-resize-load-txt'));
});

// test('Load Event is Seconds Timeout and button state is loading your report after specified seconds', () => {
//     let element = createElement('16', '9', '', '', 1000, 700, true, setUrls);
//     element.setAttribute('pbi-resize-load-event', 'seconds-timeout');
//     element.setAttribute('pbi-resize-img', 'web-img');
//     element.setAttribute('pbi-resize-m-img', 'mobile-img');
//     element.setAttribute('pbi-resize-src', 'web-src');
//     element.setAttribute('pbi-resize-m-src', 'mobile-src');
//     window.document.dispatchEvent(new Event("DOMContentLoaded"));

//     let button = getChildByTag(element, 'button');
//     let iframe = getChildByTag(element, 'iframe');

//     expect(button.innerHTML).toBe('Click to interact!');
    
//     setTimeout('', 5000);

//     setCurrentSrc(iframe, 'web-src');

//     expect(button.innerHTML).toBe('Loading your report...');
// });

// test('Load Event is Once in View and', () => {

// });