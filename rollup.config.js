let pkg = require('./package.json');
let buble = require('rollup-plugin-buble');

module.exports = {
    input: 'src/DropdownInterface.js',
    plugins: [
        buble()
    ],
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.browser, format: 'umd', name: 'DropdownInterface'},
        { file: pkg.module, format: 'es' }
    ]
}