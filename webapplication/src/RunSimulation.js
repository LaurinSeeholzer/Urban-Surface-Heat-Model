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

    var simWorker = new Worker("run.js");

    const numPixelsX = parseInt(simulationSettings.pointsX)
    const numPixelsY = parseInt(simulationSettings.pointsY)

    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [message, setMessage] = useState('Ready to run your simulation?');
    const [canvasWidth, setCanvasWidth] = useState(0);
    const pixelSize = canvasWidth / numPixelsX;

    let plotArea_3;
    let plotData_3;
    let plotLayout_3;

    let plotArea_2;
    let plotData_2;
    let plotLayout_2;

    let plotArea_1;
    let plotData_1;
    let plotLayout_1;

    const formatedDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

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

    const initializePlotly = () => {
        plotData_3 = [
            {
                x: [],
                y: [parseFloat(simulationSettings.initialTemperature)],
                type: 'scatter',
                mode: 'lines',
                name: 'Max. Temp.',
                line: {
                    dash: "solid",
                    color: 'rgb(0,0,0)',
                }
            },
            {
                x: [],
                y: [parseFloat(simulationSettings.initialTemperature)],
                type: 'scatter',
                mode: 'lines',
                name: 'Ave. Temp.',
                line: {
                    dash: "dash",
                    color: 'rgb(0,0,0)',
                }
            },
            {
                x: [],
                y: [parseFloat(simulationSettings.initialTemperature)],
                type: 'scatter',
                mode: 'lines',
                name: 'Min. Temp.',
                line: {
                    dash: "dot",
                    color: 'rgb(0,0,0)',
                }
            },
        ]
        plotData_2 = [{
            z: null,
            colorscale: 'Hot',
            type: 'heatmap',
            showscale: true,
            hoverongaps: false,
        }];

        plotData_1 = [{
            z: null,
            colorscale: 'Hot',
            type: 'heatmap',
            showscale: true,
            hoverongaps: false,
        }];

        plotLayout_3 = {
            title: "Temperature Development",
            autosize: true,
            showlegend: true,
        };
        plotLayout_2 = {
            autosize: true,
            showlegend: true,
        };
        plotLayout_1 = {
            autosize: true,
            showlegend: true,
        };


        plotArea_3 = document.getElementById("plotArea_3");
        plotArea_2 = document.getElementById("plotArea_2");
        plotArea_1 = document.getElementById("plotArea_1");

        Plotly.newPlot('plotArea_3', plotData_3, plotLayout_3);
        Plotly.newPlot('plotArea_2', plotData_2, plotLayout_2)
        Plotly.newPlot('plotArea_1', plotData_1, plotLayout_1)
    };

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

        plotData_1[0].colorscale = parramattaColorScale;
        plotData_2[0].colorscale = 'Hot';

        plotData_2[0].reversescale = true;

        plotData_1[0].z = transposedData;
        plotData_2[0].z = transposedData;

        Plotly.update(plotArea_2, plotData_2, plotLayout_2);
        Plotly.update(plotArea_1, plotData_1, plotLayout_1);
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

    useEffect(() => {
        initializePlotly();
    }, []);

    simWorker.onmessage = event => {
        if (event.data.type === 'statusUpdate') {
            setAverageTemp(event.data.data.averageTemp.toFixed(1))
            setMinTemp(event.data.data.minTemp.toFixed(1))
            setMaxTemp(event.data.data.maxTemp.toFixed(1))
            setIteration(event.data.data.iteration)
            setCurrentDate(event.data.data.currentDate.toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '').replace(/\//g, '.'))
            plotData_3[0].y.push(parseFloat(event.data.data.maxTemp.toFixed(1)))
            plotData_3[1].y.push(parseFloat(event.data.data.averageTemp.toFixed(1)))
            plotData_3[2].y.push(parseFloat(event.data.data.minTemp.toFixed(1)))
            plotData_3[0].x.push(formatedDate(event.data.data.currentDate));
            plotData_3[1].x.push(formatedDate(event.data.data.currentDate));
            plotData_3[2].x.push(formatedDate(event.data.data.currentDate));
            Plotly.update(plotArea_3, plotData_3, plotLayout_3);
            generateHeatmaps(event.data.data.data)
        } else {
            setResult(event.data);
            downloadJSON();
            generateHeatmaps(event.data);
        }
    }


    return (
        <>
            <div className="grid grid-cols-6 grid-rows-5 gap-4 pb-4">
                <div className="col-span-2">
                <div className="overflow-hidden flex rounded-lg bg-white px-4 py-5 shadow sm:p-6 h-full items-center text-center align-center my-auto">
                    <button
                        onClick={runSimulation}
                        type="button"
                        className="grid m-auto grid-cols-6 w-full rounded-md bg-accentcolor px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accentcolorbright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor"
                    >
                        <span className='col-span-5 text-left'>Run Simulation</span>
                        <RocketLaunchIcon className="h-full w-6 mx-auto" aria-hidden="true" />
                    </button>
                    </div>
                </div>
                <div className="col-span-2 col-start-1 row-start-2">
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">Maximum Temperature</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{maxTemp} °C</dd>
                    </div>
                </div>
                <div className="col-span-2 col-start-1 row-start-3">
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">Average Temperature</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{averageTemp} °C</dd>
                    </div>
                </div>
                <div className="col-span-2 col-start-1 row-start-4">                            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Minimal Temperature</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{minTemp} °C</dd>
                </div></div>
                <div className="col-span-2 col-start-1 row-start-5">
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">Time (GMT+0)</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{currentDate}</dd>
                    </div>
                </div>
                <div className="col-span-4 row-span-5 col-start-3 row-start-1">
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 w-full h-full">
                        <div className='w-full h-full' id='plotArea_3'>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white h-full">
                    <div className="flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 flex items-center justify-center">
                            <div className="grid w-full py-2 align-middle px-4 gap-4 sm:px-6 lg:px-8">
                                <div className='w-full'>
                                    <div className="w-full" id='plotArea_2'>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white h-full">
                    <div className="flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 flex items-center justify-center">
                            <div className="grid w-full py-2 align-middle px-4 gap-4 sm:px-6 lg:px-8">
                                <div className='w-full'>
                                    <div className="w-full" id='plotArea_1'>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default RunSimulation;