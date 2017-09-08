window.FilteringSelect = class extends BaseSelect {
    onInput (e) {
        let value = this.input.value;
        let filtered = this.props.items.filter(obj => {
            return obj.label.indexOf(value) > -1;
        });

        this.interface.setItems(filtered);
        this.interface.showList();
    }
}