// https://bugs.chromium.org/p/chromium/issues/detail?id=564559
let store = new WeakMap();
const _ = (function () {
    return function (inst) {
        let obj = store.get(inst);

        if (!obj) {
            obj = {};
            store.set(inst, obj);
        };

        return obj;
    }; 
})();

const Keys = {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    ESC: 27,
    TAB: 9
};

/**
 * Public methods for DropdownInterface
 * are available through this class. 
 *
 * @class DropdownInterface
 */
class DropdownInterface {
    constructor (options) {
        if (!options.parent || !(options.parent instanceof HTMLElement)) {
            throw new Error('"parent" option must be specified and assigned to a HTMLElement.');
        }

        this.setItems(options.items || []);
        _(this).onItemSelected = options.onItemSelected;
        _(this).onItemRender = options.onItemRender;
        _(this).focusIndex = 0;
        _(this).isShowing = false;
        _(this).element = document.createElement('div');
        _(this).element.setAttribute('class', 'DropdownInterface');
        _(this).parent = options.parent;
    }

    toggle () {
        if (!_(this).isShowing) {
            this.showList();
        } else {
            this.hideList();
        }
    }

    setFocusedItem (index) {
        setFocusedItem.call(this, index);
    }

    setItems (items) {
        _(this).items = items.slice(0);
        _(this).focusIndex = 0;
        
        if (_(this).isShowing) {
            _(this).isShowing = false;
            showList.call(this);
        }
    }

    isShowing () {
        return _(this).isShowing;
    }

    showList () {
        showList.call(this);
    }

    hideList () {
        hideList.call(this);
    }

    handleKeyDown (e) {
        handleKeyDown.call(this, e);
    }

    destroy () {
        this.hideList();
        // Shouldn't need to do this, but better safe than sorry to prevent memory leaks.
        store.delete(this);
    }
}

/**
 * Wrapper around native addEventListener so that
 * events can be easily subscribed to and unsubscribed 
 * despite passing a bound function.
 *
 * @method addEventListener
 * @param {HTMLElement} el
 * @param {String} name
 * @param {Function} callback
 * @return {Object}
 */
function addEventListener(el, name, callback, capture) {
    el.addEventListener(name, callback, capture);

    return {
        stop: function () {
            el.removeEventListener(name, callback, capture);
        }
    };
}

function preventWindowScrollOnArrowKey (e) {
    if (getFocusableElement.call(this) === document.activeElement && (e.keyCode === Keys.UP || e.keyCode === Keys.DOWN)) {
        e.preventDefault();
    }
}

/**
 * Finds the nearest focusable element in the parent.
 *
 * @method getFocusableElement
 * @return {HTMLElement}
 */
function getFocusableElement () {
    let selector = '[tabindex], input, button, textarea';
    if (_(this).parent.matches(selector)) {
        return _(this).parent;
    }
    
    return _(this).parent.querySelector(selector);
}

/**
 * Gets the item and triggers onItemSelected.
 *
 * @method onItemClick
 */
function onItemClick (e) {
    let index = parseInt(e.currentTarget.getAttribute('data-index'));
    setFocusedItem.call(this, index);
    triggerItemSelected.call(this);

    let focusable = getFocusableElement.call(this);
    if (focusable) {
        focusable.focus();
    }
} 

/**
 * Focuses on the item the user hovers over.
 *
 * @method onItemHover
 */
function onItemHover (e) {
    let index = parseInt(e.target.getAttribute('data-index'));
    setFocusedItem.call(this, index);
}

/**
 * Calls the onItemSelected option passed into the constructor
 * passing the selected item.
 *
 * @method triggerItemSelected
 */
function triggerItemSelected () {
    hideList.call(this);
    let item = _(this).items[_(this).focusIndex];
    _(this).onItemSelected.call(undefined, item);
}

/**
 * Key events for when the parent is focused.
 *
 * @method handleKeyDown
 */
function handleKeyDown (e) {
    // We don't want to stop propagation all of the time, only if we
    // actually respond to the event ourselves. This is useful to ensure
    // that components like dialogs will still function correctly.

    if (!_(this).isShowing) {
        if (e.keyCode === Keys.DOWN) {
            e.stopPropagation();
            showList.call(this);
        }

        return;
    }

    switch (e.keyCode) {
        case Keys.ENTER: 
            e.stopPropagation();
            triggerItemSelected.call(this);
            break;

        case Keys.TAB:
            e.stopPropagation();
            triggerItemSelected.call(this);
            break;

        case Keys.ESC:
            e.stopPropagation();
            hideList.call(this);
            break;

        case Keys.DOWN:
            e.stopPropagation();
            focusNextItem.call(this);
            break;

        case Keys.UP:
            e.stopPropagation();
            focusPrevItem.call(this);
            break;
    }
}

/**
 * Renders the list and displays it
 * inline with the parent.
 *
 * @method showList
 */
function showList () {
    if (_(this).isShowing) {
        return;
    }

    _(this).isShowing = true;

    // Render the list items
    render.call(this);
    document.body.appendChild(_(this).element);

    _(this).wheelEvent = addEventListener(_(this).element, 'mousewheel', (e) => {
        let scrollTop = _(this).element.scrollTop;
        let scrollHeight = _(this).element.scrollHeight - _(this).element.offsetHeight;
        let dir = e.wheelDelta > 0? 1 : -1;

        if (
            (scrollTop === 0 && dir === 1) ||
            (scrollTop >= scrollHeight && dir === -1)
        ) {
            e.preventDefault();
        }
    });

    _(this).preventScrollEvent = addEventListener(document, 'keydown', preventWindowScrollOnArrowKey.bind(this), true);

    // Add Event Listeners to list items.
    let itemEls = _(this).element.querySelectorAll('.item');
    [].forEach.call(itemEls, el => {
        el.addEventListener('click', onItemClick.bind(this));
        el.addEventListener('mouseenter', onItemHover.bind(this));
    });

    // Position the element
    let rect = _(this).parent.getBoundingClientRect();
    _(this).element.style.top = rect.bottom + 'px';
    _(this).element.style.left = rect.left + 'px';
    _(this).element.style.width = rect.width + 'px';

    // Flip the list if it's getting cropped below the window.
    let listHeight = _(this).element.offsetHeight;
    if (rect.bottom + listHeight >= window.innerHeight) {
        _(this).element.style.top = rect.top - listHeight + 'px';
    }

    if (!_(this).bodyListener) {
        _(this).bodyListener = addEventListener(document.body, 'click', (e) => {
            // If we don't check if we're clicking on the input itself,
            // we could end up with a scenario where both the input and the body respond
            // calling the hideList and showList functions at the same time causing
            // nothing to happen.
            if (!_(this).parent !== e.target && !_(this).parent.contains(e.target)) {
                this.hideList();
            }
        });
    }
    
    if (!_(this).scrollListener) {
        let scrollListener = () => {
            // If the parent moves, close the list.
            let newPos = _(this).parent.getBoundingClientRect();
            if (newPos.top !== rect.top || newPos.left !== rect.left) {
                this.hideList();
            } else {
                _(this).scrollListener = requestAnimationFrame(scrollListener);
            }
        };

        _(this).scrollListener = requestAnimationFrame(scrollListener);
    }
    
    setFocusedItem.call(this, _(this).focusIndex);
}

/**
 * Removes the list and cleans up events.
 *
 * @method hideList
 */
function hideList () {
    if (_(this).isShowing) {
        _(this).isShowing = false;
        _(this).bodyListener.stop();
        _(this).bodyListener = undefined;
        cancelAnimationFrame(_(this).scrollListener);
        _(this).scrollListener = undefined;
        _(this).wheelEvent.stop();
        _(this).preventScrollEvent.stop();
        document.body.removeChild(_(this).element);
    }
}

/**
 * Focuses on the next item below the current focused item.
 *
 * @method focusNextItem
 */
function focusNextItem () {
    let focusIndex = _(this).focusIndex + 1;
    if (focusIndex === _(this).items.length) {
        focusIndex = 0;
    }

    setFocusedItem.call(this, focusIndex);
}

/**
 * Focuses on the previous item above the current focused item.
 *
 * @method focusPrevItem
 */
function focusPrevItem () {
    let focusIndex = _(this).focusIndex - 1;
    if (focusIndex < 0) {
        focusIndex = _(this).items.length - 1;
    }

    setFocusedItem.call(this, focusIndex);
}

/**
 * Sets the focus index and updates the visuals.
 *
 * @method setFocusedItem
 * @param {Number} newIndex
 */
function setFocusedItem (newIndex) {
    _(this).focusIndex = newIndex;

    let els = _(this).element.querySelectorAll('.item');
    [].forEach.call(els, (el, index) => {
        if (index === _(this).focusIndex) {
            el.classList.add('focused');
        } else {
            el.classList.remove('focused');
        }
    });

    // Need to scroll the element into view.
    let el = _(this).element.querySelector('.item.focused');

    if (el) {
        let parent = el.offsetParent.getBoundingClientRect();
        let rect = el.getBoundingClientRect();

        if (rect.bottom < parent.top || rect.top < parent.top) {
            el.offsetParent.scrollTop = el.offsetTop;
        } else if (rect.bottom > parent.bottom || rect.top > parent.bottom) {
            el.offsetParent.scrollTop = el.offsetTop - (parent.height - el.offsetHeight);
        }
    }
}

/**
 * Wipes out and renders the latest items.
 *
 * @method render
 */
function render () {
    _(this).element.innerHTML = '';

    _(this).items.forEach((item, index) => {
        let el = document.createElement('div');
        el.setAttribute('class', 'item');
        el.setAttribute('data-index', index);

        if (_(this).onItemRender) {
            _(this).onItemRender.call(undefined, el, item);
        } else {
            el.textContent = item.label;
        }

        _(this).element.appendChild(el);
    });
}

export default DropdownInterface;

