import { React, useState , useEffect } from 'react';

import Table from './Table.js'
import InputField from './InputField.js';
import SurfaceMaterialsForm from './SurfaceMaterialsForm.js';
import PageTitle from './PageTitle.js';

const SurfaceMaterials = () => {

    const [surfaceData, setSurfaceData] = useState(
        JSON.parse(localStorage.getItem('surfaceData')) || [
        {id: 0, name: 'name', hexcolor: '#000', boundary: "true", density: 0.4, albedo: 0.4, heatcapacity: 0.4,  thermalconductivity: 0.4, evapotranspiration: 0.3},
        {id: 1, name: 'name', hexcolor: '#000', boundary: "true", density: 0.4, albedo: 0.4, heatcapacity: 0.4,  thermalconductivity: 0.4, evapotranspiration: 0.3},
    ]);

    useEffect(() => {
        console.log(surfaceData)
        localStorage.setItem('surfaceData', JSON.stringify(surfaceData));
    }, [surfaceData]);

    const addSurface = (data) => {
        let name = document.getElementById("name").value
        let hexcolor = document.getElementById("hexcolor").value
        let boundary = document.getElementById("boundary").value
        let density = document.getElementById("density").value
        let albedo = document.getElementById("albedo").value
        let heatcapacity = document.getElementById("heatcapacity").value
        let thermalconductivity = document.getElementById("thermalconductivity").value
        let evapotranspiration = document.getElementById("evapotranspiration").value
        let newSurface = {id: Date.now(), name: name, hexcolor: hexcolor, boundary: boundary, density: density, albedo: albedo, heatcapacity: heatcapacity, thermalconductivity: thermalconductivity, evapotranspiration: evapotranspiration}
        
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