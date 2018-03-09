window.BaseSelect = class extends React.Component {
    constructor () {
        super();

        this.onItemSelected = this.onItemSelected.bind(this); 
    }

    componentDidMount () {
        this.interface = new DropdownInterface({
            onItemSelected: this.onItemSelected,
            parent: ReactDOM.findDOMNode(this),
            onItemRender: this.onItemRender
        });

        this.applyPropsToInterface(this.props);
    }

    componentWillUnmount () {
        this.interface.destroy();
        this.interface = undefined;
    }

    componentWillReceiveProps (props) {
        this.applyPropsToInterface(props);
    }

    onItemSelected (selected) {
        this.props.onChange(selected);
    }

    onClick (e) {
        this.interface.toggle();
    }

    onKeyDown (e) {
        this.interface.handleKeyDown(e);
    }

    onInput (e) {}

    applyPropsToInterface (props) {
        if (this.interface) {
            this.interface.hideList();
        }

        this.interface.setItems(props.items || []);

        if (props.selected) {
            this.input.value = props.selected.label;
        }
    }

    render () {
        return (
            <input 
                className="Select"
                onClick={e => this.onClick(e)}
                onInput={e => this.onInput(e)}
                onKeyDown={e => this.onKeyDown(e)}
                ref={e => this.input = e}
            />
        );
    }
}