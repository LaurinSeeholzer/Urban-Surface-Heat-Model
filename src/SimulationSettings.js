import React, { useEffect, useState, useRef } from 'react';
import InputField from './InputField'
import SideBar from './SideBar';

export default function SimulationSettings() {

    const storedSimulationData = JSON.parse(localStorage.getItem('simulationData'))

    const [simulationData, setSimulationData] = useState(storedSimulationData || {
        pointsX: 200,
        pointsY: 200,
        deltaX: 1,
        date: "2012-01-01T02:00",
        iterations: 2880,
        deltaTime: 60,
        geoLatitude: -33.79955532256849,
        geoLongitude: 150.9778614130294,
        initialTemperature: 37.4,
        radiation: 650,
        obstacleHeight: 6,
        useAirflow: "true",
        maxWindSpeed: 4.5,
        relaxationParameter: 1.978417266,
        inflowVelocity: 0.04,
    });

    const clearLocalStorage = () => {
        localStorage.removeItem('simulationData');
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSimulationData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        localStorage.setItem('simulationData', JSON.stringify(simulationData));
    }, [simulationData])


    const downloadSimulationSettings = () => {
        const jsonString = JSON.stringify(simulationData);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const dataURL = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "simulationSettings.json";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(dataURL);
    }

    const uploadSimulationSettings = (data) => {
        setSimulationData(data);
    }

    const handleFileChange = (file) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const parsedData = JSON.parse(event.target.result);
                    uploadSimulationSettings(parsedData);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            fileInputRef.current.value = null;

            reader.readAsText(file);
        }
    };

    const fileInputRef = useRef(null);

    return (
        <>
            <div className='grid grid-cols-1 gap-4'>
                <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">

                    <div className="space-y-12">
                        <div>
                            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="pointsX" label="Pixels in X" defaultValue={simulationData.pointsX} type="number" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="pointsY" label="Pixels in Y" defaultValue={simulationData.pointsY} type="number" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="deltaX" label="Pixel width" defaultValue={simulationData.deltaX} type="number" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="date" label="Date & Time of Simulation" defaultValue={simulationData.date} type="datetime-local" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="iterations" label="Number of iterations" defaultValue={simulationData.iterations} type="number" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="deltaTime" label="Duration of one iteration" defaultValue={simulationData.deltaTime} type="number" />
                                </div>
                                <div className="sm:col-span-3">
                                    <InputField onChange={handleInputChange} id="geoLatitude" label="Latitude of location" defaultValue={simulationData.geoLatitude} type="number" />
                                </div>
                                <div className="sm:col-span-3">
                                    <InputField onChange={handleInputChange} id="geoLongitude" label="Longitude of location" defaultValue={simulationData.geoLongitude} type="number" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="initialTemperature" label="Initial temperature" defaultValue={simulationData.initialTemperature} type="number" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="radiation" label="Radiation" defaultValue={simulationData.radiation} type="number" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField onChange={handleInputChange} id="obstacleHeight" label="Height of Buildings & Trees" defaultValue={simulationData.obstacleHeight} type="number" />
                                </div>
                                <div className="sm:col-span-3">
                                    <InputField onChange={handleInputChange} id="useAirflow" label="Simulate Airflow" defaultValue={simulationData.useAirflow} type="text" />
                                </div>
                                <div className="sm:col-span-3">
                                    <InputField onChange={handleInputChange} id="maxWindSpeed" label="Max. wind speed" defaultValue={simulationData.maxWindSpeed} type="number" />
                                </div>
                                <div className="sm:col-span-3">
                                    <InputField onChange={handleInputChange} id="relaxationParameter" label="Relaxation Parameter" defaultValue={simulationData.relaxationParameter} type="number" />
                                </div>
                                <div className="sm:col-span-3">
                                    <InputField onChange={handleInputChange} id="inflowVelocity" label="Inflow Velocity" defaultValue={simulationData.inflowVelocity} type="number" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <input id='fileinput' type="file" className='hidden' accept=".json" onChange={(e) => handleFileChange(e.target.files[0])} ref={fileInputRef}></input>
                        <button
                            onClick={() => { document.getElementById('fileinput').click() }}
                            type="button"
                            className="inline-flex items-center rounded-md bg-accentcolor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accentcolorbright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor"
                        >
                            Upload Simulation Settings
                        </button>
                        <button
                            onClick={downloadSimulationSettings}
                            type="button"
                            className="inline-flex items-center rounded-md bg-accentcolor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accentcolorbright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor"
                        >
                            Download Simulation Settings
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
