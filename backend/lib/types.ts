/**
 * This is a class that is extended by subclasses that must be initialized with an asynchronous function.
 *
 * @export
 * @class InitializableClass
 * @typedef {InitializableClass}
 */
export class InitializableClass {
    protected isInitialized: boolean = false;
    protected initializationHandlers: (() => void)[] = [];
    public awaitInitialization() {
        if (this.isInitialized) return;
        return new Promise<void>((resolve, reject) => {
            this.initializationHandlers.push(resolve);
        });
    }

    protected markAsInitialized() {
        this.isInitialized = true;
        for (let callback of this.initializationHandlers) {
            callback();
        }
    }
}
