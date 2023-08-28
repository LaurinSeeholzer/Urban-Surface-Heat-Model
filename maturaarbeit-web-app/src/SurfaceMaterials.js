import { React, useState , useEffect } from 'react';

import Table from './Table.js'
import InputField from './InputField.js';
import SurfaceMaterialsForm from './SurfaceMaterialsForm.js';
import PageTitle from './PageTitle.js';

const SurfaceMaterials = () => {

    const [surfaceData, setSurfaceData] = useState(
        JSON.parse(localStorage.getItem('surfaceData')) || [
        {id: 1, name: 'Soil Wet', color: 'rgb(63,210,0)', boundary: "false", airresistence: 0, density: 2050, albedo: 0.7, heatcapacity: 1480,  thermalconductivity: 1, evapotranspiration: 0.003},
        {id: 2, name: 'Soil Dry', color: 'rgb(182,210,0)', boundary: "false", airresistence: 0, density: 1050, albedo: 0.5, heatcapacity: 800,  thermalconductivity: 0.5, evapotranspiration: 0.002},
        {id: 3, name: 'Clay Roofing', color: 'rgb(210,112,0)', boundary: "true", airresistence: 10000, density: 2300, albedo: 0.36, heatcapacity: 920,  thermalconductivity: 1.4, evapotranspiration: 0.0001},
        {id: 4, name: 'Asphalt', color: 'rgb(121,121,121)', boundary: "false", airresistence: 0, density: 2360, albedo: 0.14, heatcapacity: 920,  thermalconductivity: 0.75, evapotranspiration: 0.0002},
        {id: 5, name: 'Beton', color: 'rgb(156,156,156)', boundary: "false", airresistence: 0, density: 2200, albedo: 0.35, heatcapacity: 960,  thermalconductivity: 1.4, evapotranspiration: 0.0001},
        {id: 6, name: 'Schotter', color: 'rgb(184,184,184)', boundary: "false", airresistence: 0, density: 2000, albedo: 0.4, heatcapacity: 900,  thermalconductivity: 0.7, evapotranspiration: 0.0015},
        {id: 7, name: 'Wald', color: 'rgb(42,125,80)', boundary: "true", airresistence: 7500, density: 2050, albedo: 0.6, heatcapacity: 1200,  thermalconductivity: 0.75, evapotranspiration: 0.005},
        {id: 8, name: 'Wasser', color: 'rgb(0,112,138)', boundary: "false", airresistence: 0, density: 1000, albedo: 0.7, heatcapacity: 4190,  thermalconductivity: 0.6, evapotranspiration: 0.01},
    ]);

    useEffect(() => {
        console.log(surfaceData)
        localStorage.setItem('surfaceData', JSON.stringify(surfaceData));
    }, [surfaceData]);

    const addSurface = (data) => {
        let name = document.getElementById("name").value
        let color = document.getElementById("color").value
        let boundary = document.getElementById("boundary").value
        let airresistence = document.getElementById("airresistence").value
        let density = document.getElementById("density").value
        let albedo = document.getElementById("albedo").value
        let heatcapacity = document.getElementById("heatcapacity").value
        let thermalconductivity = document.getElementById("thermalconductivity").value
        let evapotranspiration = document.getElementById("evapotranspiration").value
        let newSurface = {id: Date.now(), name: name, color: color, boundary: boundary, airresistence: airresistence, density: density, albedo: albedo, heatcapacity: heatcapacity, thermalconductivity: thermalconductivity, evapotranspiration: evapotranspiration}
        
        let newSurfaceData = [...surfaceData, newSurface]

        setSurfaceData(newSurfaceData);
    };


    const deleteSurface = (id) => {
        const updatedSurfaceData = surfaceData.filter(surface => surface.id !== id);
        setSurfaceData(updatedSurfaceData);
    };

    
    return (
        <div className='grid grid-cols-1 gap-4'>
            <PageTitle title='Surface Material' back='/dashboard' next='/simulationsettings'/>
            <SurfaceMaterialsForm addSurface={addSurface}/>
            <Table surfaceData={surfaceData} deleteSurface={deleteSurface}/>
        </div>
    );
}

export default SurfaceMaterials;