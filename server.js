let express = require('express');
let app = express();

app.use('/', express.static(__dirname));
app.use('/examples/:framework/node_modules/dropdown-interface', express.static(__dirname));

app.listen(8585, () => {
    console.log('Listening on 8585...');
});