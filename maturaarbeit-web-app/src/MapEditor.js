import React, { useRef, useEffect, useState } from 'react';
import PageTitle from './PageTitle';

const MapEditor = () => {

    const surfaceData = JSON.parse(localStorage.getItem('surfaceData'));
    const simulationSettings = JSON.parse(localStorage.getItem('simulationData'));

    const [mapData, setMapData] = useState(JSON.parse(localStorage.getItem('mapData')) || new Array(parseInt(simulationSettings.pointsX)).fill(null).map(() => new Array(parseInt(simulationSettings.pointsY)).fill(null)));
    let currentMapData = mapData

    const [brushColor, setBrushColor] = useState(surfaceData[0].color);
    const [brushSize, setBrushSize] = useState(simulationSettings.pointsX / 10);
    const [brush, setBrush] = useState(1)

    const numPixelsX = parseInt(simulationSettings.pointsX);
    const numPixelsY = parseInt(simulationSettings.pointsY);

    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [isPainting, setIsPainting] = useState(false);
    const pixelSize = canvasWidth / numPixelsX;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setContext(ctx);
        setCanvasWidth(canvas.parentElement.clientWidth);
    }, []);

    useEffect(() => {
        console.log("mapData changed")
        localStorage.setItem('mapData', JSON.stringify(mapData));
    }, [mapData]);

    const drawPixels = (event) => {
        if (!isPainting) return;

        const { offsetX, offsetY } = event.nativeEvent;
        const x = Math.floor(offsetX / pixelSize);
        const y = Math.floor(offsetY / pixelSize);

        for (let col = x; col < x + brushSize; col++) {
            for (let row = y; row < y + brushSize; row++) {
                try {
                    currentMapData[col][simulationSettings.pointsY - (row + 1)] = brush;
                } catch {}
            }
        }
        
        context.fillStyle = brushColor;
        context.fillRect(x * pixelSize, y * pixelSize, brushSize * pixelSize, brushSize * pixelSize);

    };

    const handleMouseDown = (event) => {
        setIsPainting(true);
        drawPixels(event);
    };

    const handleMouseUp = () => {
        setMapData(currentMapData);
        localStorage.setItem('mapData', JSON.stringify(mapData));
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
        let id = parseInt(document.getElementById("brush").value);
        let color = surfaceData.find(item => item.id === id).color;
        setBrushColor(color);
        setBrush(id)
    }

    const handleFileChange = (file) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const parsedData = JSON.parse(event.target.result);
                    setMapData(parsedData);
                    currentMapData = parsedData
                    drawMap(parsedData);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            fileInputRef.current.value = null;

            reader.readAsText(file);
        }
    };

    const fileInputRef = useRef(null);

    const drawMap = (data) => {
        let canvas = document.getElementById("myCanvas")

        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var dataWidth = data[0].length;
        var dataHeight = data.length;

        var cellWidth = canvasWidth / dataWidth;
        var cellHeight = canvasHeight / dataHeight;

        for (var i = 0; i < dataWidth; i++) {
            for (var j = 0; j < dataHeight; j++) {
                var id = data[i][j];
                var surface = surfaceData.find(item => item.id === id);
                context.fillStyle = surface.color;
                context.fillRect(i * cellWidth, canvasHeight - ((j + 1) * cellHeight), cellWidth, cellHeight);
            }
        }
    }

    const donwloadImage = () => {
        const canvas = canvasRef.current
        const dataURL = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "map.png";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(dataURL);
    }

    const downloadJSON = () => {
        const jsonString = JSON.stringify(mapData);
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
            <PageTitle title='Map Editor' back='/simulationsettings' next='/runsimulation' />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='col-span-1 h-full'>
                    <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white h-full">
                        <div className="flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                                        <div className="col-span-2">
                                            <div>
                                                <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Select Surface Material
                                                </label>
                                                <select
                                                    onChange={changeBrush}
                                                    id="brush"
                                                    name="brush"
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accentcolor sm:text-sm sm:leading-6"
                                                >
                                                    {surfaceData.map((item, index) => (
                                                        <option key={index} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-span-2'>
                                            <label htmlFor='brushSize' className="block text-sm font-medium leading-6 text-gray-900">
                                                Set Brush Size
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type='number'
                                                    name='brushSize'
                                                    id='brushSize'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accentcolor sm:text-sm sm:leading-6"
                                                    defaultValue={Math.floor(parseInt(simulationSettings.pointsX) / 10)}
                                                    onChange={changeBrushSize}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-span-1 md:col-span-2 2xl:col-span-1'>
                                            <div className="">
                                                <button
                                                    onClick={() => { donwloadImage(); downloadJSON() }}
                                                    type="button"
                                                    className="w-full rounded-md bg-accentcolor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accentcolorbright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor"
                                                >
                                                    Download Map
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-span-1 md:col-span-2 2xl:col-span-1'>
                                            <div className="">
                                                <input id='fileinput' type="file" className='hidden' accept=".json" onChange={(e) => handleFileChange(e.target.files[0])} ref={fileInputRef}></input>
                                                <button
                                                    onClick={() => { document.getElementById('fileinput').click() }}
                                                    type="button"
                                                    className="w-full rounded-md bg-accentcolor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accentcolorbright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor"
                                                >
                                                    Upload Map
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-1 md:col-span-2'>
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
            </div>
        </div>
    );
}

export default MapEditor;