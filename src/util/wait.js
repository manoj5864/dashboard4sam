export async function sleep(ms) {
    return new Promise( resolve => setTimeout(resolve, ms))
}

export async function waitFor(expression, sleepTime = 500, maxTries = 1000) {
    let counter = 0;
    while (!expression()) {
        await sleep(sleepTime);
        counter++;
        if (counter == maxTries) {
            return false;
        }
    }
    return true;
}

export class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject
            this.resolve = resolve
        })
    }
}
