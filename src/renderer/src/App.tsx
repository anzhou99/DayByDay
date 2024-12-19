import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

function generateAxisData(min: number, max: number) {
    const data: string[] = []
    const value = max - min
    for (let i = 0; i < value; i++) {
        data.push(`${i + min}`)
    }
    return data
}

function App(): JSX.Element {
    const ref = useRef<HTMLDivElement>(null)
    const chartRef = useRef<echarts.ECharts>()
    // // 根据MouseClickedData中的点位数据，在窗口相应位置使用echarts绘制热力图
    function drawHeatMap(xData, yData, data) {
        if (!ref.current) {
            return
        }
        if (!chartRef.current) {
            chartRef.current = echarts.init(ref.current!)
        }

        const option = {
            coordinateSystem: 'cartesian2d',
            grid: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            xAxis: {
                type: 'category',
                show: false,
                data: xData
            },
            yAxis: {
                type: 'category',
                show: false,
                data: yData
            },
            visualMap: {
                min: 0,
                show: false,
                max: Math.max(...data.map((item) => item.value[2])),
                calculable: true,
                realtime: false,
                inRange: {
                    color: [
                        '#313695',
                        '#4575b4',
                        '#74add1',
                        '#abd9e9',
                        '#e0f3f8',
                        '#ffffbf',
                        '#fee090',
                        '#fdae61',
                        '#f46d43',
                        '#d73027',
                        '#a50026'
                    ]
                }
            },
            series: [
                {
                    type: 'heatmap',
                    coordinateSystem: 'cartesian2d',
                    data: data
                }
            ]
            // tooltip: {
            //     show: true,
            //     trigger: 'axisLine',
            //     formatter: function (params) {
            //         return `${params.value[0]}-${params.value[1]} : ${params.value[2]}`
            //     }
            // }
        }
        chartRef.current.setOption(option)
    }

    const [xData, setXData] = useState<string[]>()
    const [yData, setYData] = useState<string[]>()
    const [heatData, setHeatData] = useState<[{ value: [string, string, number] }]>()

    function getAllData(windowInfo) {
        const { id, rectBounds } = windowInfo
        if (!(id || id === 0)) return
        window.api.getAllMouseClickedData(id).then((mouseData) => {
            if (mouseData?.length && rectBounds.right && rectBounds.bottom) {
                console.log('🚀 ~ file: App.tsx:92 ~ rectBounds:', rectBounds)
                setXData(generateAxisData(rectBounds.left, rectBounds.right))
                setYData(generateAxisData(rectBounds.top, rectBounds.bottom).reverse())
                setHeatData(
                    mouseData.map((item) => ({ value: [`${item.x}`, `${item.y}`, item.count] }))
                )
            }
        })
    }
    const hasRegisted = useRef(false)
    useEffect(() => {
        if (hasRegisted.current) return
        hasRegisted.current = true
        window.api.getScreenInfo((info) => {
            getAllData(info)
        })

        window.api.whenMouseClicked((info) => {
            getAllData(info)
        })
    }, [])

    useEffect(() => {
        if (xData?.length && yData?.length && heatData?.length) {
            drawHeatMap(xData, yData, heatData)
        }
    }, [xData, yData, heatData])

    return <div ref={ref} style={{ width: '100vw', height: '100vh' }}></div>
}

export default App
