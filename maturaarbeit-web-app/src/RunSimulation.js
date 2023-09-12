import { React, useState, useEffect, useRef } from 'react';
import { RocketLaunchIcon, ArrowSmallLeftIcon } from '@heroicons/react/24/outline';
import Plotly from 'plotly.js-dist-min'

const RunSimulation = () => {

    const surfaceData = JSON.parse(localStorage.getItem('surfaceData'))
    const simulationSettings = JSON.parse(localStorage.getItem('simulationData'))

    const [mapData, setMapData] = useState(JSON.parse(localStorage.getItem('mapData')));
    const [result, setResult] = useState(null);
    const [maxTemp, setMaxTemp] = useState(parseFloat(simulationSettings.initialTemperature).toFixed(1))
    const [minTemp, setMinTemp] = useState(parseFloat(simulationSettings.initialTemperature).toFixed(1))
    const [averageTemp, setAverageTemp] = useState(parseFloat(simulationSettings.initialTemperature).toFixed(1))
    const [iteration, setIteration] = useState('-')
    const [currentDate, setCurrentDate] = useState((new Date(simulationSettings.date)).toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '').replace('-', '.'))

    console.log(mapData)

    var simWorker = new Worker("run.js");

    const numPixelsX = parseInt(simulationSettings.pointsX)
    const numPixelsY = parseInt(simulationSettings.pointsY)

    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [message, setMessage] = useState('Ready to run your simulation?');
    const [canvasWidth, setCanvasWidth] = useState(0);
    const pixelSize = canvasWidth / numPixelsX;

    const runSimulation = () => {
        let albedo = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let density = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let boundary = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let airresistence = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let heatCapacity = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let conductivity = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let evapotranspiration = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        for (let x = 0; x < simulationSettings.pointsX; x++) {
            for (let y = 0; y < simulationSettings.pointsY; y++) {
                let surface = surfaceData.find(obj => obj.id === mapData[x][y]);
                //console.log(x,y,mapData[x][y], surfaceData)
                albedo[x][y] = parseFloat(surface.albedo)
                density[x][y] = parseFloat(surface.density)
                boundary[x][y] = JSON.parse(surface.boundary)
                airresistence[x][y] = parseFloat(surface.airresistence)
                heatCapacity[x][y] = parseFloat(surface.heatcapacity)
                conductivity[x][y] = parseFloat(surface.thermalconductivity)
                evapotranspiration[x][y] = parseFloat(surface.evapotranspiration)
            }
        }

        let data = simulationSettings
        data.albedo = albedo
        data.density = density
        data.boundary = boundary
        data.airresistence = airresistence
        data.heatCapacity = heatCapacity
        data.conductivity = conductivity
        data.evapotranspiration = evapotranspiration
        data.useAirflow = JSON.parse(simulationSettings.useAirflow)
        console.log(data)
        simWorker.postMessage(data);
    }

    let plotArea_3;
    let plotData_3;
    let plotLayout_3;

    useEffect(() => {
        plotData_3 = [
            {
                x: [],
                y: [parseFloat(simulationSettings.initialTemperature)],
                type: 'scatter',
                mode: 'lines',
                name: 'Max. Temp.',
                line: {
                    shape: 'spline',
                  color: 'rgb(114, 21, 40)',
                }
            },
            {
                x: [],
                y: [parseFloat(simulationSettings.initialTemperature)],
                type: 'scatter',
                mode: 'lines',
                name: 'Min. Temp.',
                line: {
                    shape: 'spline',
                    color: 'rgb(254, 253, 205)',
                  }
            },
            {
                x: [],
                y: [parseFloat(simulationSettings.initialTemperature)],
                type: 'scatter',
                mode: 'lines',
                name: 'Ave. Temp.',
                line: {
                    shape: 'spline',
                    color: 'rgb(230, 148, 79)',
                  }
            }
        ]

        plotLayout_3 = {
            autosize: true,
            showlegend: true,
            xaxis: {
                showline: true,
                showgrid: true,
            },
            yaxis: {
                showline: true,
                showgrid: true,
                zeroline: true,
            }
        }

        plotArea_3 = document.getElementById("plotArea_3")
        Plotly.newPlot('plotArea_3', plotData_3, plotLayout_3)
    }, [])

    simWorker.onmessage = event => {
        if (event.data.type === 'status') {
            setAverageTemp(event.data.data.averageTemp.toFixed(1))
            setMinTemp(event.data.data.minTemp.toFixed(1))
            setMaxTemp(event.data.data.maxTemp.toFixed(1))
            setIteration(event.data.data.iteration)
            setCurrentDate(event.data.data.currentDate.toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '').replace(/\//g, '.'))
            plotData_3[0].y.push(parseFloat(event.data.data.maxTemp.toFixed(1)))
            plotData_3[1].y.push(parseFloat(event.data.data.minTemp.toFixed(1)))
            plotData_3[2].y.push(parseFloat(event.data.data.averageTemp.toFixed(1)))
            plotData_3[0].x.push(event.data.data.currentDate.toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '').replace(/\//g, '.'))
            plotData_3[1].x.push(event.data.data.currentDate.toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '').replace(/\//g, '.'))
            plotData_3[2].x.push(event.data.data.currentDate.toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '').replace(/\//g, '.'))
            Plotly.update(plotArea_3, plotData_3, plotLayout_3)
        } else {
            setResult(event.data);
            downloadJSON();
            generateHeatmaps(event.data);
        }
    }

    const generateHeatmaps = (data) => {

        const maxData = Math.max(...data.flat());
        const minData = Math.min(...data.flat());

        let parramattaColorScale = [
            [0.0, 'rgb(43, 38, 245)'],
            [(22 - minData) / (maxData - minData), 'rgb(43, 38, 245)'],

            [(22 - minData) / (maxData - minData), 'rgb(77, 100, 242)'],
            [(25 - minData) / (maxData - minData), 'rgb(77, 100, 242)'],

            [(25 - minData) / (maxData - minData), 'rgb(107, 170, 245)'],
            [(28 - minData) / (maxData - minData), 'rgb(107, 170, 245)'],

            [(28 - minData) / (maxData - minData), 'rgb(86, 113, 31)'],
            [(31 - minData) / (maxData - minData), 'rgb(86, 113, 31)'],

            [(31 - minData) / (maxData - minData), 'rgb(163, 164, 51)'],
            [(34 - minData) / (maxData - minData), 'rgb(163, 164, 51)'],

            [(34 - minData) / (maxData - minData), 'rgb(251, 251, 195)'],
            [(37 - minData) / (maxData - minData), 'rgb(251, 251, 195)'],

            [(37 - minData) / (maxData - minData), 'rgb(229, 159, 56)'],
            [(40 - minData) / (maxData - minData), 'rgb(229, 159, 56)'],

            [(40 - minData) / (maxData - minData), 'rgb(202, 86, 36)'],
            [(43 - minData) / (maxData - minData), 'rgb(202, 86, 36)'],

            [(43 - minData) / (maxData - minData), 'rgb(100, 17, 9)'],
            [(48 - minData) / (maxData - minData), 'rgb(100, 17, 9)'],

            [(48 - minData) / (maxData - minData), 'rgb(150, 45, 219)'],
            [1.0, 'rgb(150, 45, 219)'],
        ]

        let transposedData = data[0].map((_, y) => data.map(row => row[y]));

        const plotData_1 = [{
            z: transposedData,
            colorscale: 'YlOrRd',
            type: 'heatmap',
            showscale: false,
            hoverongaps: false,
            reversescale: true,
        }];

        const plotData_2 = [{
            z: transposedData,
            colorscale: parramattaColorScale,
            type: 'heatmap',
            showscale: false,
            hoverongaps: false,
        }];

        const innerWidth = document.getElementById("plotArea_1").clientWidth

        console.log(innerWidth)

        var layout = {
            autosize: false,
            width: Math.floor(innerWidth),
            height: Math.floor(innerWidth),
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0,
                pad: 0
            },
        }

        Plotly.newPlot('plotArea_1', plotData_1, layout);
        Plotly.newPlot('plotArea_2', plotData_2, layout);
    };

    const downloadJSON = () => {
        const jsonString = JSON.stringify(result);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const dataURL = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "map.json";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(dataURL);
    }


    return (
        <div className='grid grid-cols-1 gap-4'>
            <div className='grid grid-cols-1 gap-4'>
                <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Run Your Simulation
                            </h2>
                        </div>
                        <div className="items-center flex md:ml-4 md:mt-0 gap-4">
                            <a
                                href="/mapeditor"
                                className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <ArrowSmallLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                Back
                            </a>
                            <button
                                onClick={runSimulation}
                                className="inline-flex items-center gap-x-1.5 rounded-md bg-accentcolor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accentcolorbright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor"
                            >
                                Run
                                <RocketLaunchIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='col-span-1 h-full'>
                        <dl className='grid grid-cols-1 gap-4'>
                            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">Minimal Temperature</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{minTemp} °C</dd>
                            </div>
                            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">Average Temperature</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{averageTemp} °C</dd>
                            </div>
                            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">Maximum Temperature</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{maxTemp} °C</dd>
                            </div>
                            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">Time (GMT+0)</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{currentDate}</dd>
                            </div>
                        </dl>
                    </div>
                    <div className='col-span-1 md:col-span-2'>
                        <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white h-full">
                            <div className="flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 flex items-center justify-center">
                                    <div className="grid w-full py-2 align-middle px-4 gap-4 sm:px-6 lg:px-8">
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
                                            <div className="w-full" id='plotArea_1'>
                                            </div>
                                            <div className="w-full" id='plotArea_2'>
                                            </div>
                                        </div>
                                        <div className='w-full' id='plotArea_3'>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RunSimulation;