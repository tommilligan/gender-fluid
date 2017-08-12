// @flow

function requireMapKey<K, V> (map: Map<K, V>, key: K, errorMsg?: string): V {
    const value = map.get(key);
    if (!value) {
        throw new Error(errorMsg || 'Missing required key in map.');
    }
    return value;
}

export {requireMapKey};