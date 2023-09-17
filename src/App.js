import { BrowserRouter as Router, Route, Routes, HashRouter, BrowserRouter } from 'react-router-dom';

import Dashboard from './Dashboard.js'
import SurfaceMaterials from './SurfaceMaterials.js'
import SimulationSettings from './SimulationSettings.js'
import SideBar from './SideBar.js'
import MapEditor from './MapEditor.js'
import RunSimulation from './RunSimulation.js'
import LandingPage from './LandingPage.js'


function App() {

    const sideBar = () => {
        console.log(window.location.href) 
        if (window.location.href === "https://laurinseeholzer.github.io/Urban-Surface-Heat-Model/") {   
        return <LandingPage />;
        }
        return <SideBar />
    }


  return (
        <div>
            <BrowserRouter>
            {sideBar()}
            <main className="py-10 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/Urban-Surface-Heat-Model/" element={<></>} />
                        <Route path="/Urban-Surface-Heat-Model/dashboard" element={<Dashboard />} />
                        <Route path="/Urban-Surface-Heat-Model/surfacematerials" element={<SurfaceMaterials />} />
                        <Route path="/Urban-Surface-Heat-Model/simulationsettings" element={<SimulationSettings />} />
                        <Route path="/Urban-Surface-Heat-Model/mapeditor" element={<MapEditor />} />
                        <Route path="/Urban-Surface-Heat-Model/runsimulation" element={<RunSimulation />} />
                    </Routes>
                </div>
            </main>
            </BrowserRouter>
        </div>
  );
}

export default App;
