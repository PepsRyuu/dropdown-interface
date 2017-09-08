window.BaseSelect = class extends React.Component {
    constructor () {
        super();

        this.onItemSelected = this.onItemSelected.bind(this);
    }

    componentDidMount () {
        this.createInterface(this.props);
    }

    componentWillReceiveProps (props) {
        this.createInterface(props);
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

    createInterface (props) {
        if (this.interface) {
            this.interface.destroy();
        }

        this.interface = new DropdownInterface({
            items: props.items || [],
            onItemSelected: this.onItemSelected,
            parent: ReactDOM.findDOMNode(this),
            onItemRender: this.onItemRender
        });

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