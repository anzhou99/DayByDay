
import { getFromStore } from "../store/mouseClicked";

interface MouseClickedItem {
    time: number,
    x: number,
    y: number
}


type Bounds = {
    left: number
    right: number
    top: number
    bottom: number
}



class CookedMouseClickedData {

    constructor() {
    }


    // 根据点位生成 count字段
    private goupByPoint(data: MouseClickedItem[], bounds?: Bounds) {
        const cookedData: { x: number; y: number; time: number; count: number }[] = []

        for (let i = 0; i < data.length; i++) {
            const item = data[i]

            const condition = !bounds ? true : item.x >= bounds.left && item.x <= bounds.right && item.y >= bounds.top && item.y <= bounds.bottom
            if (condition) {
                const index = cookedData.findIndex((v) => v.x === item.x && v.y === item.y)
                if (index > -1) {
                    cookedData[index].count++
                } else {
                    cookedData.push({ ...item, count: 1 })
                }
            }
        }


        return cookedData
    }



    getLeftDataByPoint(bounds?: Bounds) {
        return this.goupByPoint(getFromStore('left'), bounds)
    }

    getRightDataByPoint(bounds?: Bounds) {
        return this.goupByPoint(getFromStore('right'), bounds)
    }

    getAllDataByPoint(bounds?: Bounds) {
        return this.goupByPoint([...getFromStore('left'), ...getFromStore('right')], bounds)
    }


}

export default CookedMouseClickedData