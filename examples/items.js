function createArray (size) {
    return Array.from(new Array(size), (v, i) => ({
        label: 'item ' + i,
        value: i
    }));
}

const small_items = createArray(5);
const large_items = createArray(200);
const extra_large_items = createArray(1000);
const disabled_small_items = createArray(5);
disabled_small_items[0].disabled = true;