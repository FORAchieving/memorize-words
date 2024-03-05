import { useCallback, useEffect, useState } from 'react';

// const evtTarget = new EventTarget();

export const useStorage = <K>(storage: Storage) => (key: string, defaultValue: K[]): [K[], (newVal: K[], remove?: boolean) => void, () => void] => {
    const raw = storage.getItem(key);
    const [value, setValue] = useState<K[]>(raw ? JSON.parse(raw) : defaultValue);
    const updater = useCallback((newVal:K[], remove:boolean = false) => {
        storage[remove ? 'removeItem' : 'setItem'](key, JSON.stringify(newVal));
        setValue(newVal);
        // evtTarget.dispatchEvent(new CustomEvent('storage_update', { detail: {key} }));
    }, [key]);

    defaultValue && !raw && updater(defaultValue);
    // useEffect(() => {
    //     const handler = ({detail}: CustomEventInit) => {
    //         if (detail.key === key) {
    //             const lraw = storage.getItem(key);
    //             lraw !== raw && setValue(JSON.parse(lraw as string))
    //         }
    //     }
    //     evtTarget.addEventListener('storage_update', handler);
    //     return () => evtTarget.removeEventListener('storage_update', handler);
    // })

    const remove = () => updater([], true)

    return [value, updater, remove]
}