window.Select = class Select extends BaseSelect {
    onKeyDown (e) {
        super.onKeyDown(e);
        e.preventDefault();
    }
}