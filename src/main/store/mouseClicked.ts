import Store from 'electron-store'


const store = new Store({
    name: 'mouseClicked',
    defaults: {
        left: [],
        right: []
    },
    watch: true
});


export function pushToStore(type: 'left' | 'right', data: { x: number, y: number, time: number }) {
    store.set(type, [...store.get(type), data])
}

export function getFromStore(type: 'left' | 'right') {
    return store.get(type)
}


export default store