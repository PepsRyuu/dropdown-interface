let colors = ['#ff0000', '#00ff00', '#0000ff'];

window.CustomSelect = class extends BaseSelect {
    onItemRender (parent, item) {
        let el = document.createElement('div');
        el.textContent = item.label;
        el.style.color = colors[item.value % colors.length];
        parent.appendChild(el);
    }
}