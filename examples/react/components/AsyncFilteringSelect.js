function AsyncGetData (label) {
    return new Promise(resolve => {
        setTimeout(() => {
            let output = extra_large_items.filter(obj => {
                return obj.label.indexOf(label) > -1;
            }).slice(0, 10);
            resolve(output);
        }, 500);
    })
}

window.AsyncFilteringSelect = class extends BaseSelect {

    onInput (e) {
        // Simple mechanism to prevent race condition
        let fetchTime = Date.now();
        this.fetchTime = fetchTime;

        let value = this.input.value;
        if (!value) {
            return this.interface.setItems([]);
        }

        // TODO: Design loader...
        AsyncGetData(value).then(items => {
            if (fetchTime === this.fetchTime) {
                this.interface.setItems(items);
                this.interface.showList();
            }
        });
    }
}