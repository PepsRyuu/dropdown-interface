window.MultiSelect = class MultiSelect extends React.Component {
    constructor () {
        super();
        this.state = {
            selected: [],
            focused: false
        };

        this.onItemSelected = this.onItemSelected.bind(this);
        this.onSelectedValueRemove = this.onSelectedValueRemove.bind(this);
        this.onInputKeyDown = this.onInputKeyDown.bind(this);
        this.onWrapperClick = this.onWrapperClick.bind(this);
    }

    componentDidMount () {
        this.createInterface(this.props);
    }

    componentWillReceiveProps (props) {
        this.createInterface(props);
    }

    componentWillUnmount () {
        this.interface.destroy();
        this.interface = undefined;
    }

    createInterface (props) {
        if (this.interface) {
            this.interface.destroy();
        }

        this.interface = new DropdownInterface({
            items: props.items,
            onItemSelected: this.onItemSelected,
            parent: ReactDOM.findDOMNode(this),
        });
    }

    onItemSelected (item) {
        let index = this.state.selected.findIndex(obj => {
            return obj.value === item.value;
        });

        if (index === -1) {
            this.setState({
                selected: this.state.selected.concat(item)
            });
        }
    }

    onWrapperClick (e) {
        this.interface.toggle();
    }

    onSelectedValueClick (e) {
        e.stopPropagation();
    }

    onSelectedValueRemove (e) {
        let index = parseInt(e.target.getAttribute('data-index'));

        this.setState({
            selected: this.state.selected.filter((obj, i) => i !== index)
        });
    }

    onInputKeyDown (e) {
        this.interface.handleKeyDown(e);
    }

    render () {
        return (
            <div className="MultiSelect" tabIndex="0" onClick={this.onWrapperClick} onKeyDown={this.onInputKeyDown}>
                {this.state.selected.map((item, index) => {
                    return ( 
                        <div className="MultiSelect-selected" onClick={this.onSelectedValueClick}>
                            <div className="remove" data-index={index} onClick={this.onSelectedValueRemove}>×</div>
                            <div className="title">{item.label}</div>
                        </div>
                    );
                })}
            </div>
        )
    }
}