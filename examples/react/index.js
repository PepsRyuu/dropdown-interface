class App extends React.Component {
    constructor () {
        super();
        this.state = {};
    }

    onChange (name, value) {
        this.setState({[name]: value});
    }

    render () {
        return (
            <div>
                <h1>Simple</h1>
                <p>Simple dropdown list. Use mouse or arrow keys and enter to select.</p>
                <Select items={small_items} onChange={e => this.onChange('simple', e)} selected={this.state.simple} />
                <h1>Filtering</h1>
                <p>Type to filter items (5 items in list)</p>
                <FilteringSelect items={small_items} onChange={e => this.onChange('filtering', e)} selected={this.state.filtering}/>
                <h1>Async Filtering</h1>
                <p>Type to asynchronously filter through list of 1000 items.</p>
                <AsyncFilteringSelect onChange={e => this.onChange('asyncfilter', e)} selected={this.state.asyncfilter}/>
                <h1>Multi Select</h1>
                <p>Your parent can keep track of multiple items if it needs to.</p>
                <MultiSelect items={small_items} onChange={e => this.onChange('multi', e)} selected={this.state.multi} />
                <h1>Overflow Correction</h1>
                <div style={{height: '100px', overflow: 'auto', width: '400px', border: '1px solid black', padding: '20px'}}>
                    <p>This dropdown will correctly overflow outside any scrollable elements.</p>
                    <p>It will also show the list upwards if there's not enough space below vertically.</p>
                    <Select items={large_items} onChange={e => this.onChange('overflow', e)} selected={this.state.overflow} />
                </div>
                <h1>Custom Rendering</h1>
                <p>Not happy with the default rendering? Add your own rendering logic.</p>
                <CustomSelect items={small_items} onChange={e => this.onChange('custom', e)} selected={this.state.custom}/>
                <h1>Disabled Items</h1>
                <p>Disabled items in a dropdown list.</p>
                <Select items={disabled_small_items} onChange={e => this.onChange('simple', e)} selected={this.state.simple} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#root'));