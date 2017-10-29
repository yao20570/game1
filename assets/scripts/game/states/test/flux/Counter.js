/**
 * Created by on 2017/9/25.
 */
let _counter = 1;

/**
 * This is a simple counter for providing unique ids.
 */
const Counter = {
    increment() {
        return 'id-' + String(_counter++);
    },
};

export default Counter;