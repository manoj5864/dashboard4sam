/**
 * Combine traits to one new class to inherit from
 * @param Parent must be a class or null
 * @param mixins must be objects
 */
export function mixin(Parent, ...mixins) {
    let newParent = Parent || Object
    class Mixed extends newParent {}

    for (let mixin of mixins) {
        for (let prop of Object.keys(mixin)) {
            Mixed.prototype[prop] = mixin[prop];
        }
    }
    return Mixed;
};