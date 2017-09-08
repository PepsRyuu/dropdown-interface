window.Select = class extends BaseSelect {
    onKeyDown (e) {
        super.onKeyDown(e);
        e.preventDefault();
    }
}