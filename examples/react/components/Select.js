window.Select = class Select extends BaseSelect {
    onKeyDown (e) {
        super.onKeyDown(e);

        if (e.keyCode !== 9) { // allow tab key through
            e.preventDefault();
        }
    }
}