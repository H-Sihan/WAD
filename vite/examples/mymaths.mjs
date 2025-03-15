// Module mymaths.mjs

function _square(n) {
    return n * n;
}

function _cube(n) {
    return n * n * n;
}

const exportedObject = {
    cube: _cube,
    square: _square,
    PI: 3.141592654
};

export default exportedObject;