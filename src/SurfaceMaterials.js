import { React, useState, useEffect } from 'react';
import Table from './Table.js'
import SurfaceMaterialsForm from './SurfaceMaterialsForm.js';
import SideBar from './SideBar.js';

const SurfaceMaterials = () => {

    const [surfaceData, setSurfaceData] = useState(
        JSON.parse(localStorage.getItem('surfaceData')) || [
            { id: 1, name: 'Soil Wet', color: 'rgb(63,210,0)', boundary: "false", airresistence: 0, density: 2050, albedo: 0.7, heatcapacity: 1480, thermalconductivity: 1, evapotranspiration: 0.006 },
            { id: 2, name: 'Soil Dry', color: 'rgb(182,210,0)', boundary: "false", airresistence: 0, density: 1050, albedo: 0.5, heatcapacity: 800, thermalconductivity: 0.5, evapotranspiration: 0.005 },
            { id: 3, name: 'Clay Roofing', color: 'rgb(210,112,0)', boundary: "true", airresistence: 10000, density: 2300, albedo: 0.36, heatcapacity: 920, thermalconductivity: 1.4, evapotranspiration: 0.001 },
            { id: 4, name: 'Asphalt', color: 'rgb(121,121,121)', boundary: "false", airresistence: 0, density: 2360, albedo: 0.14, heatcapacity: 920, thermalconductivity: 0.75, evapotranspiration: 0.002 },
            { id: 5, name: 'Beton', color: 'rgb(156,156,156)', boundary: "false", airresistence: 0, density: 2200, albedo: 0.35, heatcapacity: 960, thermalconductivity: 1.4, evapotranspiration: 0.001 },
            { id: 6, name: 'Schotter', color: 'rgb(184,184,184)', boundary: "false", airresistence: 0, density: 2000, albedo: 0.4, heatcapacity: 900, thermalconductivity: 0.7, evapotranspiration: 0.001 },
            { id: 7, name: 'Wald', color: 'rgb(42,125,80)', boundary: "true", airresistence: 7500, density: 2050, albedo: 0.6, heatcapacity: 1200, thermalconductivity: 0.75, evapotranspiration: 0.007 },
            { id: 8, name: 'Wasser', color: 'rgb(0,112,138)', boundary: "false", airresistence: 0, density: 1000, albedo: 0.7, heatcapacity: 4190, thermalconductivity: 0.6, evapotranspiration: 0.015 },
        ]);

    useEffect(() => {
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
        let newSurface = { id: Date.now(), name: name, color: color, boundary: boundary, airresistence: airresistence, density: density, albedo: albedo, heatcapacity: heatcapacity, thermalconductivity: thermalconductivity, evapotranspiration: evapotranspiration }

        let newSurfaceData = [...surfaceData, newSurface]

        setSurfaceData(newSurfaceData);
    };


    const deleteSurface = (id) => {
        const updatedSurfaceData = surfaceData.filter(surface => surface.id !== id);
        setSurfaceData(updatedSurfaceData);
    };

    const downloadSurfaceData = () => {
        const jsonString = JSON.stringify(surfaceData);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const dataURL = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "surfaceMaterials.json";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(dataURL);
    }

    const uploadSurfaceData = (data) => {
        const newSurfaceData = surfaceData.concat(data)
        setSurfaceData(newSurfaceData)
    }

    return (
        <>
        <SideBar />
        <main className="py-10 lg:pl-72">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className='grid grid-cols-1 gap-4'>
                    <SurfaceMaterialsForm addSurface={addSurface} />
                    <Table surfaceData={surfaceData} deleteSurface={deleteSurface} downloadSurfaceData={downloadSurfaceData} uploadSurfaceData={uploadSurfaceData} />
                </div>
            </div>
        </main>
        </>
    );
}

export default SurfaceMaterials;