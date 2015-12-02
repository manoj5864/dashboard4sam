/**
 * Combine traits to one new class to inherit from
 * @param Parent must be a class or null
 * @param mixins must be objects
 */
export function mixin(Parent, ...mixins) {

    class MixedSimple {}

    class Mixed extends Parent {
        constructor() { super() }
    }

    if (Parent) {
        for (let mixin of mixins) {
            for (let prop of Object.keys(mixin)) {
                Mixed.prototype[prop] = mixin[prop];
            }
        }
        return Mixed;
    } else {
        for (let mixin of mixins) {
            for (let prop of Object.keys(mixin)) {
                MixedSimple.prototype[prop] = mixin[prop];
            }
        }
        return MixedSimple;
    }
};