import React, { useRef, useEffect, useState } from 'react';

import PageTitle from './PageTitle';

const MapEditor = () => {

    const surfaceData = JSON.parse(localStorage.getItem('surfaceData'))
    const simulationSettings = JSON.parse(localStorage.getItem('formData'))

    const [mapData, setMapData] = useState(new Array(parseInt(simulationSettings.pointsX)).fill(0).map(() => new Array(parseInt(simulationSettings.pointsY)).fill(0)))

    const [brushColor, setBrushColor] = useState(surfaceData[0].color)
    const [brushSize, setBrushSize] = useState(simulationSettings.pointsX / 10)

    const numPixelsX = parseInt(simulationSettings.pointsX)
    const numPixelsY = parseInt(simulationSettings.pointsY)

    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [isPainting, setIsPainting] = useState(false);
    const pixelSize = canvasWidth / numPixelsX;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setContext(ctx);
        setCanvasWidth(canvas.parentElement.clientWidth); // Set canvas width to parent container's width
    }, []);

    useEffect(() => {
        localStorage.setItem('mapData', JSON.stringify(mapData));
    }, [mapData]);

    const drawPixels = (event) => {
        if (!isPainting) return;

        const { offsetX, offsetY } = event.nativeEvent;
        const x = Math.floor(offsetX / pixelSize);
        const y = Math.floor(offsetY / pixelSize);

        context.fillStyle = brushColor;
        context.fillRect(x * pixelSize, y * pixelSize, brushSize * pixelSize, brushSize * pixelSize);
    };

    const handleMouseDown = (event) => {
        setIsPainting(true);
        drawPixels(event);
    };

    const handleMouseUp = () => {
        setIsPainting(false);
    };

    const handleMouseMove = (event) => {
        drawPixels(event);
    };

    const handleMouseClick = (event) => {
        drawPixels(event);
    };

    const changeBrushSize = () => {
        let input = parseInt(document.getElementById("brushSize").value)
        setBrushSize(input)
    }

    const changeBrush = () => {
        let input = parseInt(document.getElementById("brush").value)
        let color = surfaceData[input].color
        setBrushColor(color)
    }

    const generateData = () => {
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

        const pixelArray = [];

        const pixelWidth = canvas.width / pointsX;
        const pixelHeight = canvas.height / pointsY;
    
        for (let x = 0; x < pointsX; x++) {
            const column = [];
            for (let y = pointsY - 1; y >= 0; y--) {
                const sampleX = Math.floor(x * pixelWidth + pixelWidth / 2);
                const sampleY = Math.floor(y * pixelHeight + pixelHeight / 2);
    
                const pixelData = ctx.getImageData(sampleX, sampleY, 1, 1).data;
                const red = pixelData[0];
                const green = pixelData[1];
                const blue = pixelData[2];
                const colorString = `rgb(${red},${green},${blue})`;
                column.push(surfaceColorData[colorString]);
                console.log(x, y, colorString, surfaceColorData[colorString])
            }
            pixelArray.push(column);
        }
        setMapData(pixelArray)
        handleDownload();
    };

    const handleDownload = () => {
        const canvas = canvasRef.current

        const dataURL = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "map_raw.png";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    return (
        <div className='grid grid-cols-1 gap-4'>
            <PageTitle title='Map Editor' back='/simulationsettings' next='/runsimulation'/>
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
                <div className="flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                            Select Surface Material
                                        </label>
                                        <select
                                            onChange={changeBrush}
                                            id="brush"
                                            name="brush"
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                            {surfaceData.map((item, index) => (
                                                <option key={index} value={index}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='brushSize' className="block text-sm font-medium leading-6 text-gray-900">
                                        Set Brush Size
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type='number'
                                            name='brushSize'
                                            id='brushSize'
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            defaultValue={Math.floor(parseInt(simulationSettings.pointsX) / 10)}
                                            onChange={changeBrushSize}
                                        />
                                    </div>
                                </div>
                                <div className='sm:col-span-1'>
                                    <div className="mt-8">
                                    <button
                                        onClick={generateData}
                                        type="button"
                                        className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Save Map
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
                <div className="flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                            <div>
                                <canvas
                                    id='myCanvas'
                                    ref={canvasRef}
                                    width={canvasWidth}
                                    height={pixelSize * numPixelsY}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                    onClick={handleMouseClick}
                                    style={{ border: '1px solid black', imageRendering: 'pixelated' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapEditor;