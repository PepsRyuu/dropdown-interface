let es_require = require('@std/esm')(module, {esm: 'js', cache: false});

let DropdownInterface = es_require('../src/DropdownInterface').default;
let expect = require('chai').expect;
let fs = require('fs');
let sinon = require('sinon');

let style = document.createElement('style');
style.textContent = fs.readFileSync('./src/DropdownInterface.css', 'utf8');
document.head.appendChild(style);

function getList() {
    return document.querySelector('.DropdownInterface');
}

function getListItems() {
    return document.querySelectorAll('.DropdownInterface .item');
}

function assertFocus(values) {
    let items = getListItems();
    for (let i = 0; i < items.length; i++) {
        expect(items[i].classList.contains('focused')).to.be[values[i]];
    }
}

function assertRoughly(a, b, margin) {
    expect(Math.abs(a - b) < margin).to.be.true;
}

const Keys = {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    ESC: 27,
    TAB: 9
};

describe('Dropdown Interface', function() {
    describe('Options', () => {
        describe('parent', () => {
            it ('should be mandatory to have a parent', () => {
                expect(() => {
                    new DropdownInterface({});
                }).to.throw(Error);

                expect(() => {
                    new DropdownInterface({
                        parent: window
                    })
                }).to.throw(Error);

                expect(() => {
                    new DropdownInterface({
                        parent: document.body
                    })
                }).not.to.throw(Error);
            });

            it ('should load the list relative to the parent position', () => {
                let el = document.createElement('div');
                el.style.position = 'fixed';
                el.style.top = '30px';
                el.style.left = '30px';
                el.style.height = '10px';
                el.style.width = '200px';
                el.style.display = 'inline-block';
                document.body.appendChild(el);

                let inst = new DropdownInterface({
                    parent: el,
                    items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}, {label: 'item 3', value: 3}]
                });

                inst.showList();
                let list = getList();
                expect(list).not.to.be.null;
                expect(list.style.top).to.equal('40px');
                expect(list.style.left).to.equal('30px');
                inst.hideList();
                el.remove();
            });

            it ('should show list upwards relative to parent if not enough space vertically', () => {
                let el = document.createElement('div');
                el.style.position = 'fixed';
                el.style.top = window.innerHeight - 10 + 'px';
                el.style.left = '30px';
                el.style.height = '10px';
                el.style.width = '200px';
                el.style.display = 'inline-block';
                document.body.appendChild(el);

                let inst = new DropdownInterface({
                    parent: el,
                    items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}, {label: 'item 3', value: 3}]
                });

                inst.showList();
                let list = getList();
                expect(list).not.to.be.null;
                expect(list.style.top).to.equal(window.innerHeight - 10 - list.offsetHeight + 'px');
                expect(list.style.left).to.equal('30px');
                inst.hideList();
                el.remove();
            });
        });

        describe('items', () => {
            it ('should show labels specified by the items', () => {
                let inst = new DropdownInterface({
                    parent: document.createElement('div'),
                    items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}]
                });
                inst.showList();

                let itemEls = getListItems();
                expect(itemEls.length).to.equal(2);
                expect(itemEls[0].textContent).to.equal('item 1');
                expect(itemEls[1].textContent).to.equal('item 2');
                inst.hideList();
            });

            it ('should not change items if original array passed in is modified', () => {
                let items = [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}];
                let inst = new DropdownInterface({
                    parent: document.createElement('div'),
                    items: items
                });

                items.push({label: 'item 3', value: 3});
                inst.showList();
                expect(getListItems().length).to.equal(2);
                inst.hideList();
            });
        });

        describe('onItemSelected', () => {
            it ('should call onItemSelected passing the selected item when clicked', () => {
                let spy = sinon.spy();

                let inst = new DropdownInterface({
                    parent: document.createElement('div'),
                    items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}],
                    onItemSelected: spy
                });

                inst.showList();
                getListItems()[0].click();
                expect(spy.callCount).to.equal(1);
                expect(spy.calledWith({label: 'item 1', value: 1})).to.be.true;
                inst.showList();
                getListItems()[1].click();
                expect(spy.callCount).to.equal(2);
                expect(spy.calledWith({label: 'item 2', value: 2})).to.be.true;
            });

            it ('should call onItemSelected passing the selected item when enter key is pressed', () => {
                let spy = sinon.spy();

                let inst = new DropdownInterface({
                    parent: document.createElement('div'),
                    items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}],
                    onItemSelected: spy
                });

                inst.showList();
                inst.setFocusedItem(0);
                inst.handleKeyDown({keyCode: 13, stopPropagation: sinon.spy()});
                expect(spy.callCount).to.equal(1);
                expect(spy.calledWith({label: 'item 1', value: 1})).to.be.true;
                inst.showList();
                inst.setFocusedItem(1);
                inst.handleKeyDown({keyCode: 13, stopPropagation: sinon.spy()});
                expect(spy.callCount).to.equal(2);
                expect(spy.calledWith({label: 'item 2', value: 2})).to.be.true;
            });
        });

        describe('onItemRender', () => {
            it ('should pass element and item being render', () => {
                let spy = sinon.spy();
                let inst = new DropdownInterface({
                    parent: document.createElement('div'),
                    items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}],
                    onItemRender: spy
                });

                inst.showList();
                expect(spy.callCount).to.equal(2);
                expect(spy.args[0][0] instanceof HTMLElement).to.be.true;
                expect(spy.args[0][1]).to.deep.equal({label: 'item 1', value: 1});
                expect(spy.args[1][0] instanceof HTMLElement).to.be.true;
                expect(spy.args[1][1]).to.deep.equal({label: 'item 2', value: 2});
                expect(spy.args[0][0]).not.to.equal(spy.args[1][0]);
                inst.hideList();
            });

            it ('should not use default behaviour if defined', () => {
                let inst = new DropdownInterface({
                    parent: document.createElement('div'),
                    items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}],
                    onItemRender: (el, item) => {
                        el.textContent = 'lol';
                    }
                });

                inst.showList();
                let els = getListItems();
                expect(els[0].textContent).to.equal('lol');
                expect(els[1].textContent).to.equal('lol');
                inst.hideList();
            });
        });
    });

    describe('Methods', () => {
        let inst, onItemSelectedSpy;

        beforeEach(() => {
            onItemSelectedSpy = sinon.spy();

            inst = new DropdownInterface({
                parent: document.createElement('div'),
                items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}],
                onItemSelected: onItemSelectedSpy
            });
        });

        afterEach(() => {
            inst.destroy();
            inst = undefined;
        })

        describe('toggle()', () => {
            it ('should call showList if it is not visible', () => {
                let showSpy = sinon.spy(inst, 'showList');
                inst.toggle();
                expect(showSpy.callCount).to.equal(1);
            });

            it ('should call hideList if it is visible', () => {
                let hideSpy = sinon.spy(inst, 'hideList');
                inst.toggle();
                expect(hideSpy.callCount).to.equal(0);
                inst.toggle();
                expect(hideSpy.callCount).to.equal(1);
            });
        });

        describe('setItems()', () => {
            it ('should update items and not show list', () => {
                inst.setItems([{label: 'item 1', value: 1}, {label: 'item 2', value: 2}, {label: 'item 3', value: 3}]);
                inst.showList();
                expect(getListItems().length).to.equal(3);
            });

            it ('should update the list of items if it is already showing', () => {
                inst.showList();
                expect(getListItems().length).to.equal(2);
                inst.setItems([{label: 'item 1', value: 1}, {label: 'item 2', value: 2}, {label: 'item 3', value: 3}]);
                expect(getListItems().length).to.equal(3);
            });

            it ('should not leak global handlers if called while list is showing', () => {
                inst.showList();
                inst.setItems([{label: 'item 1', value: 1}, {label: 'item 2', value: 2}, {label: 'item 3', value: 3}]);
                let spy = sinon.spy(inst, 'hideList');
                inst.hideList();
                document.body.click();
                expect(spy.callCount).to.equal(1); // if it leaks, it will say it was called twice.
            });
        });

        describe('showList()', () => {
            it ('should show the list', () => {
                inst.showList();
                expect(getList()).not.to.be.null;
            });

            it ('should not leak global handlers if called multiple times', () => {
                inst.showList();
                inst.showList();
                let spy = sinon.spy(inst, 'hideList');
                inst.hideList();
                document.body.click();
                expect(spy.callCount).to.equal(1); // if it leaks, it will say it was called twice.
            });
        });

        describe('hideList()', () => {
            it ('should hide the list', () => {
                inst.showList();
                inst.hideList();
                expect(getList()).to.be.null;
            });

            it ('should not trigger an error if called multiple times', () => {
                inst.showList();
                inst.hideList();
                expect(() => {
                    inst.hideList();
                }).not.to.throw(Error);
            });
        });

        describe('setFocusedItem()', () => {
            it ('should focus on the specified index', () => {
                inst.setFocusedItem(1);
                inst.showList();
                let items = getListItems();
                expect(items[0].classList.contains('focused')).to.be.false;
                expect(items[1].classList.contains('focused')).to.be.true;
            });

            it ('should change focus if list is already showing', () => {
                inst.showList();
                let items = getListItems();
                expect(items[0].classList.contains('focused')).to.be.true;
                expect(items[1].classList.contains('focused')).to.be.false;
                inst.setFocusedItem(1);
                expect(items[0].classList.contains('focused')).to.be.false;
                expect(items[1].classList.contains('focused')).to.be.true;
            });
        });

        describe('destroy()', () => {
            it ('should call hideList', () => {
                let spy = sinon.spy(inst, 'hideList');
                inst.destroy();
                expect(spy.callCount).to.equal(1);
            });
        });

        describe('handleKeyDown()', () => {


            it ('should not call stopPropagation unless it hits a match', () => {
                let spy = sinon.spy();
                inst.handleKeyDown({
                    keyCode: 99,
                    stopPropagation: spy
                });

                expect(spy.callCount).to.equal(0);

                inst.handleKeyDown({
                    keyCode: Keys.DOWN,
                    stopPropagation: spy
                });

                expect(spy.callCount).to.equal(1);
            });

            it ('should not respond to special keys if list is not showing', () => {
                let spy = sinon.spy();
                inst.handleKeyDown({
                    keyCode: Keys.TAB,
                    stopPropagation: spy
                });

                expect(spy.callCount).to.equal(0);
            });

            it ('should list is not showing, and down is pressed, it should show the list', () => {
                inst.handleKeyDown({keyCode: Keys.DOWN, stopPropagation: sinon.spy()});
                expect(getList()).not.to.be.null;
            });

            it ('should select current item if ENTER is pressed', () => {
                let sp = sinon.spy();
                inst.handleKeyDown({keyCode: Keys.DOWN, stopPropagation: sinon.spy()});
                inst.handleKeyDown({keyCode: Keys.ENTER, stopPropagation: sp});
                expect(sp.callCount).to.equal(1);
                expect(onItemSelectedSpy.callCount).to.equal(1);
            });

            it ('should select current item if TAB is pressed', () => {
                let sp = sinon.spy();
                inst.handleKeyDown({keyCode: Keys.DOWN, stopPropagation: sinon.spy()});
                inst.handleKeyDown({keyCode: Keys.TAB, stopPropagation: sp});
                expect(sp.callCount).to.equal(1);
                expect(onItemSelectedSpy.callCount).to.equal(1);
            });

            it ('should hide list if ESC is pressed', () => {
                let sp = sinon.spy();
                inst.handleKeyDown({keyCode: Keys.DOWN, stopPropagation: sinon.spy()});
                inst.handleKeyDown({keyCode: Keys.ESC, stopPropagation: sp});
                expect(sp.callCount).to.equal(1);
                expect(onItemSelectedSpy.callCount).to.equal(0);
                expect(getList()).to.be.null;
            });

            it ('should move focus down if DOWN is pressed', () => {
                let sp = sinon.spy();
                inst.showList();
                inst.setItems([{label: '1'}, {label: '2'}, {label: '3'}])
                inst.handleKeyDown({keyCode: Keys.DOWN, stopPropagation: sp});
                expect(sp.callCount).to.equal(1);
                assertFocus([false, true, false]);
                inst.handleKeyDown({keyCode: Keys.DOWN, stopPropagation: sp});
                assertFocus([false, false, true]);
                inst.handleKeyDown({keyCode: Keys.DOWN, stopPropagation: sp});
                assertFocus([true, false, false]);
            });

            it ('should move focus up if UP is pressed', () => {
                let sp = sinon.spy();
                inst.showList();
                inst.setItems([{label: '1'}, {label: '2'}, {label: '3'}])
                inst.handleKeyDown({keyCode: Keys.UP, stopPropagation: sp});
                expect(sp.callCount).to.equal(1);
                assertFocus([false, false, true]);
                inst.handleKeyDown({keyCode: Keys.UP, stopPropagation: sp});
                assertFocus([false, true, false]);
                inst.handleKeyDown({keyCode: Keys.UP, stopPropagation: sp});
                assertFocus([true, false, false]);
                inst.handleKeyDown({keyCode: Keys.UP, stopPropagation: sp});
                assertFocus([false, false, true]);
            });
        });
    });
    
    describe('Behaviours', () => {
        let inst, el;

        beforeEach(() => {
            el = document.createElement('input');
            el.style.position = 'fixed';
            el.style.top = '10px';
            el.style.left = '10px';
            document.body.appendChild(el);
            inst = new DropdownInterface({
                parent: el,
                items: [{label: '1'}, {label: '2'}, {label: '3'}],
                onItemSelected: sinon.spy()
            });
        });

        afterEach(() => {
            el.remove();
            inst.destroy();
        })

        it ('should hide the list if an item is clicked', () => {
            inst.showList();
            getListItems()[0].click();
            expect(getList()).to.be.null;
        });

        it ('should set the focus index to the clicked item', () => {
            inst.showList();
            getListItems()[1].click();
            inst.showList();
            assertFocus([false, true, false]);
        });

        it ('should focus on the parent if an item is clicked', () => {
            inst.showList();
            getListItems()[1].click();
            expect(document.activeElement).to.equal(el);
        });

        it ('should focus on the hovered item', () => {
            inst.showList();
            assertFocus([true, false, false]);
            let ev = new MouseEvent('mouseenter');
            getListItems()[1].dispatchEvent(ev);
            assertFocus([false, true, false]);
        });

        it ('should hide the list if the body is clicked', () => {
            inst.showList();
            document.body.click();
            expect(getList()).to.be.null;
        });

        it ('should not hide the list if it\'s the parent', () => {
            inst.showList();
            el.click();
            expect(getList()).not.to.be.null;
        });

        it ('should hide the list if the parent element top moves', (done) => {
            inst.showList();
            el.style.top = '20px';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    expect(getList()).to.be.null;
                    done();
                });
            });
        });

        it ('should hide the list if the parent element left moves', (done) => {
            inst.showList();
            el.style.left = '20px';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    expect(getList()).to.be.null;
                    done();
                });
            }); 
        });

        it ('should loop and consistently check element moving', (done) => {
            inst.showList();
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.style.left = '20px';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            expect(getList()).to.be.null;
                            done();
                        });
                    });
                });
            });
        });

        it ('should be able to click body to hide after hiding once', () => {
            inst.showList();
            inst.hideList();
            inst.showList();
            document.body.click();
            expect(getList()).to.be.null;
        });

        describe('Alignment', () => {
            beforeEach(() => {
                let items = Array.from(new Array(20), (v, i) => ({
                    label: 'item ' + i,
                    value: i
                }));

                inst.setItems(items)
            });

            it ('should align a focused item to the bottom if coming in from below', () => {
                inst.showList();
                inst.setFocusedItem(15);
                let list_rect = getList().getBoundingClientRect();
                let focused = getList().querySelector('.focused').getBoundingClientRect();
                assertRoughly(list_rect.bottom, focused.bottom, 5);
            });

            it ('should align a focused item to the top if coming in from above', () => {
                inst.showList();
                inst.setFocusedItem(15);
                inst.setFocusedItem(5);
                let list_rect = getList().getBoundingClientRect();
                let focused = getList().querySelector('.focused').getBoundingClientRect();
                assertRoughly(list_rect.top, focused.top, 5);
            }); 
        })


    });
});