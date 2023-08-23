import React, { useRef, useEffect, useState } from 'react';

import PageTitle from './PageTitle';

const MapEditor = () => {

    const surfaceData = JSON.parse(localStorage.getItem('surfaceData'))
    const simulationSettings = JSON.parse(localStorage.getItem('formData'))

    const [data, setData] = useState( new Array(parseInt(simulationSettings.pointsX)).fill(0).map(() => new Array(parseInt(simulationSettings.pointsY)).fill(0)))

    const [brush, setBrush] = useState(1)
    const [brushColor, setBrushColor] = useState(surfaceData[0].hexcolor)
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

    const drawPixels = (event) => {
        if (!isPainting) return;

        const { offsetX, offsetY } = event.nativeEvent;
        const x = Math.floor(offsetX / pixelSize);
        const y = Math.floor(offsetY / pixelSize);

        for (let i = 0; i < brushSize; i++) {
            for (let j = 0; j < brushSize; j++) {
                const posX = x + i;
                const posY = y + j;

                let newData = [...data.map(row => [...row])]
                newData[posX][posY] = brush
                setData(newData)
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
        let color = surfaceData[input].hexcolor
        console.log(data)
        setBrush(input)
        setBrushColor(color)
    }

    return (
        <div className='grid grid-cols-1 gap-4'>
            <PageTitle title='Map Editor' back='/simulationsettings' />
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
                <div className="flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
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