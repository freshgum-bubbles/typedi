export class ImmutableMap<K, V> extends Map<K, V> implements Map<K, V> {
    constructor (private innerMap: Map<K, V>) {
        /** Note that instead of copying the inner-map, we shadow it for additional performance. */
        super();
    }

    /**
     * A set of keys which have been deleted by consumers of this map.
     * 
     * If a key is in this list, the map pretends as if it does not know about it.
     * This is to ensure it remains spec-compliant with the original {@link Map} implementation.
     */
    private deletedKeys = new Set<K>();

    get(key: K): V | undefined {
        if (this.deletedKeys.has(key)) {
            return;
        }

        if (this.has(key)) {
            return super.get(key);
        }

        return this.innerMap.get(key);
    }

    has(key: K): boolean {
        return !this.deletedKeys.has(key) && (this.has(key) || this.innerMap.has(key));
    }

    delete(key: K): boolean {
        /**
         * Note that instead of deleting the key from the inner-map, we just add
         * it to a set of keys that we've marked as deleted, so we know never to
         * return them to the caller unless they set a new value for them.
         * 
         * This mirrors the implementation of a native Map while ensuring we 
         * keep a performant implementation.
         */
        if (this.deletedKeys.has(key)) {
            return false;
        }

        this.deletedKeys.add(key);
        return true;
    }

    set(key: K, value: V): this {
        if (this.deletedKeys.has(key)) {
            this.deletedKeys.delete(key);
        }

        return super.set(key, value);
    }

    clear() {
        this.forEach((_, key) => this.deletedKeys.add(key));
    }

    *entries(): IterableIterator<[K, V]> {
        const shown = new Set<K>();
        
        for (const entry of this.entries()) {
            const [key] = entry;
            shown.add(key);
            
            if (!this.deletedKeys.has(key)) {
                yield entry;
            }
        }

        for (const entry of this.innerMap.entries()) {
            /** As this map shadows the inner-map, we ensure we don't yield a key more than once. */
            const [key] = entry;

            if (shown.has(key)) {
                continue;
            }

            if (!this.deletedKeys.has(key)) {
                yield entry;
            }
        }
    }

    *keys(): IterableIterator<K> {
        /** Re-use the entries implementation, as we've done the shadowing work there. */
        for (const [key] of this.entries()) {
            yield key;
        }
    }

    *values(): IterableIterator<V> {
        /** Re-use the entries implementation, as we've done the shadowing work there. */
        for (const [, value] of this.entries()) {
            yield value;
        }
    }

    *[Symbol.iterator]() {
        return this.entries();
    }

    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        for (const [key, value] of this.entries()) {
            callbackfn.call(thisArg, value, key, this);
        }
    }

    get size () {
        /** TODO: This could use some optimization. */
        let totalSize = 0;
        const iterator = this.keys();
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        while (iterator.next().done === false) {
            totalSize++;
        }

        return totalSize;
    }
}
