import { CheckIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react';
import InputField from './InputField'
import PageTitle from './PageTitle';


export default function SimulationSettings() {

    const storedFormData = JSON.parse(localStorage.getItem('formData'))

    const [formData, setFormData] = useState(storedFormData || {
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
        localStorage.removeItem('formData');
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        // Save form data to local storage
        localStorage.setItem('formData', JSON.stringify(formData));
    };


    return (
        <div className='grid grid-cols-1 gap-4'>
            <PageTitle title='Simulation Settings' back='/surfacematerials' next='/mapeditor' />
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">

                <div className="space-y-12">
                    <div>
                        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="pointsX" label="Pixels in X" defaultValue={formData.pointsX} type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="pointsY" label="Pixels in Y" defaultValue={formData.pointsY} type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="deltaX" label="Pixel width" defaultValue={formData.deltaX} type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="date" label="Date & Time of Simulation" defaultValue={formData.date} type="datetime-local" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="iterations" label="Number of iterations" defaultValue={formData.iterations} type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="deltaTime" label="Duration of one iteration" defaultValue={formData.deltaTime} type="number" />
                            </div>
                            <div className="sm:col-span-3">
                                <InputField onChange={handleInputChange} id="geoLatitude" label="Latitude of location" defaultValue={formData.geoLatitude} type="number" />
                            </div>
                            <div className="sm:col-span-3">
                                <InputField onChange={handleInputChange} id="geoLongitude" label="Longitude of location" defaultValue={formData.geoLongitude} type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="initialTemperature" label="Initial temperature" defaultValue={formData.initialTemperature} type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="radiation" label="Radiation" defaultValue={formData.radiation} type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField onChange={handleInputChange} id="obstacleHeight" label="Height of Buildings & Trees" defaultValue={formData.obstacleHeight} type="number" />
                            </div>
                            <div className="sm:col-span-3">
                                <InputField onChange={handleInputChange} id="useAirflow" label="Simulate Airflow" defaultValue={formData.useAirflow} type="text" />
                            </div>
                            <div className="sm:col-span-3">
                                <InputField onChange={handleInputChange} id="maxWindSpeed" label="Max. wind speed" defaultValue={formData.maxWindSpeed} type="number" />
                            </div>
                            <div className="sm:col-span-3">
                                <InputField onChange={handleInputChange} id="relaxationParameter" label="Relaxation Parameter" defaultValue={formData.relaxationParameter} type="number" />
                            </div>
                            <div className="sm:col-span-3">
                                <InputField onChange={handleInputChange} id="inflowVelocity" label="Inflow Velocity" defaultValue={formData.inflowVelocity} type="number" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    onClick={handleSubmit}
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Save
                </button>
            </div>
            </div>
        </div>
    )
}
