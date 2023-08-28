import { React, useState, useEffect, useRef } from 'react';
import { RocketLaunchIcon, ArrowSmallLeftIcon } from '@heroicons/react/24/outline';
import CheckFeed from './CheckFeed';

const RunSimulation = () => {

    const surfaceData = JSON.parse(localStorage.getItem('surfaceData'))
    const simulationSettings = JSON.parse(localStorage.getItem('formData'))
    const mapData = JSON.parse(localStorage.getItem('mapData'))

    var simWorker = new Worker("run.js");

    const numPixelsX = parseInt(simulationSettings.pointsX)
    const numPixelsY = parseInt(simulationSettings.pointsY)

    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [message, setMessage] = useState('Ready to run your Simulation?');
    const [canvasWidth, setCanvasWidth] = useState(0);
    const pixelSize = canvasWidth / numPixelsX;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setContext(ctx);
        setCanvasWidth(canvas.parentElement.clientWidth); // Set canvas width to parent container's width
    }, []);

    const runSimulation = () => {
        let albedo = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let density = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let boundary = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let airresistence = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let heatCapacity = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let conductivity = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        let evapotranspiration = Array.from({ length: simulationSettings.pointsX }, () => Array(simulationSettings.pointsY).fill(0));
        console.log(mapData)
        for (let x = 0; x < simulationSettings.pointsX; x++) {
            for (let y = 0; y < simulationSettings.pointsY; y++) {
                console.log(x, y)
                let surface = surfaceData.find(obj => obj.id === mapData[x][y]);
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
    simWorker.onmessage = event => {
        console.log(event.data)
        if (event.data.type === 'message') {
            setMessage(event.data.data)
        } else {
            const surfaceData = JSON.parse(localStorage.getItem('surfaceData'))
            const simulationSettings = JSON.parse(localStorage.getItem('formData'))
            const surfaceColorData = []
            const pointsX = simulationSettings.pointsX
            const pointsY = simulationSettings.pointsY

            for (const surface of surfaceData) {
                surfaceColorData[surface.color] = surface.id
            }

            const canvas = document.getElementById('myCanvas');
            const ctx = canvas.getContext("2d");

            const array = event.data

            const newArray = [];

            // Find the minimum and maximum values in the array
            let minValue = array[0][0];
            let maxValue = array[0][0];

            for (let row = 0; row < array.length; row++) {
                for (let col = 0; col < array[row].length; col++) {
                    minValue = Math.min(minValue, array[row][col]);
                    maxValue = Math.max(maxValue, array[row][col]);
                }
            }

            // Scale the values to the new range
            const range = 9.999999999 - 0;

            for (let row = 0; row < array.length; row++) {
                const newRow = [];
                for (let col = 0; col < array[row].length; col++) {
                    const scaledValue = ((array[row][col] - minValue) / (maxValue - minValue)) * range + 0;
                    newRow.push(scaledValue);
                }
                newArray.push(newRow);
            }

            canvas.classList.remove('hidden')


            const colors = [
                'rgb(43, 38, 245)', 'rgb(77, 100, 242)', 'rgb(107, 170, 245)', 'rgb(86, 113, 31)', 'rgb(163, 164, 51)',
                'rgb(251, 251, 195)', 'rgb(229, 159, 56)', 'rgb(202, 86, 36)', 'rgb(100, 17, 9)', 'rgb(150, 45, 219)'
            ];

            const pixelWidth = canvas.width / pointsX;
            const pixelHeight = canvas.height / pointsY;

            function mapValueToColor(value) {
                if (value >= 10 && value <= 22) {
                    return 0;
                } else if (value <= 25) {
                    return 1;
                } else if (value > 25 && value <= 28) {
                    return 2;
                } else if (value > 28 && value <= 31) {
                    return 3;
                } else if (value > 31 && value <= 34) {
                    return 4;
                } else if (value > 34 && value <= 37) {
                    return 5;
                } else if (value > 37 && value <= 40) {
                    return 6;
                } else if (value > 40 && value <= 43) {
                    return 7;
                } else if (value > 43 && value <= 48) {
                    return 8;
                } else {
                    return 9;
                }
            }

            for (let x = 0; x < pointsX; x++) {
                for (let y = 0; y < pointsY; y++) {
                    ctx.fillStyle = colors[mapValueToColor(array[x][y])];
                    ctx.fillRect(x * pixelWidth, (pointsY - y - 1) * pixelHeight, pixelWidth, pixelHeight);

                }
            }

            handleDownload();
        }
    }

    const handleDownload = () => {
        const canvas = canvasRef.current

        const dataURL = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "canvas_image.png";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
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
                                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Run
                                <RocketLaunchIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
                    <div className="flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 flex items-center justify-center">
                            <div className="inline-block w-full max-w-xl py-2 align-middle px-4 sm:px-6 lg:px-8">
                                <div className="w-full">
                                    <h1 className='text-xl sm:text-2xl lg:text-4xl font-bold text-indigo-600 text-center'>{message}</h1>
                                    <canvas
                                        id='myCanvas'
                                        ref={canvasRef}
                                        width={canvasWidth}
                                        height={pixelSize * numPixelsY}
                                        style={{ imageRendering: 'pixelated' }}
                                        className='hidden'
                                    />
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