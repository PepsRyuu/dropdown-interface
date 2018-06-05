# Dropdown Interface

A flexible generic JavaScript dropdown list component that can be attached to any element.

## Motivation

I've tried a few different dropdown libraries in the past, and they all tend to have similar issues:

* They try to do too much, often leading to code bloat and the library not doing exactly what you want it to do.
* They don't often overflow correctly. If you have the dropdown inside a modal, it would be stuck inside the modal and won't overflow outside it. 
* They are usually written for a particular framework, meaning you're locked to a vendor.

This library aims to implement a similar behaviour to the native dropdown provided by the operating system, except that you can style it however you want.

## Getting Started

```npm install dropdown-interface```

Inside your code, you can require the module and instantiate it, attaching it to an element:

```
import DropdownInterface from 'dropdown-interface';

let el = document.createElement('input');

let interface = new DropdownInterface({
    items: [{label: 'item 1', value: 1}, {label: 'item 2', value: 2}],
    parent: el,
    onItemSelected: (item) => {
        console.log(item);
    }
});
```

## Options

* ***Array&lt;Object&gt;* items** - Each item has a label and value. The label is what is displayed to the user.
* ***HTMLElement* parent** - Native HTMLElement to render relatively to.
* ***Function&lt;Object item&gt;* onItemSelected** - Receives the item that was selected in the list. 
* ***Function&lt;HTMLElement el, Object item&gt;* onItemRender** - Custom rendering support. Modify the element to be rendered however you want. By default it renders the label.
* ***Function* onListShow** - Triggers when list is shown, useful for changing visual styles such as arrow directions.
* ***Function* onListHide** - Triggers when list is hidden.


## Methods

* **toggle()** - Show/hides the list.
* **setFocusedItem(*Number* index)** - Highlights the item that matches the index.
* **setItems(*Array&lt;Object&gt;* items)** - Update the items in the list.
* **showList()** - Show the list.
* **hideList()** - Hide the list.
* **handleKeyDown(*KeyEvent* e)** - Must be called by a wrapper component to add keyboard controls.
* **destroy()** - Clean up the component.


## Examples

Find examples on how to integrate the dropdown interface with frameworks in the ```examples``` directory.