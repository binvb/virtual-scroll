import { cloneDeep } from 'lodash'

export function addTombStoneProperty(items: any[], offsetHeight: any) {
    let _result = cloneDeep(items)

    _result.map(element => {
        return Object.assign(element, {isTombstone: true, offsetHeight})
    })
    
    return _result
}

export async function sleep(period:number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, period)
    })
}

export function addIndexProperty(data) {
    let _data = cloneDeep(data)

    _data.map((element, index) => {
        element.index = index
    })

    return _data
}