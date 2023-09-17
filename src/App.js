import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './Dashboard.js'
import SurfaceMaterials from './SurfaceMaterials.js'
import SimulationSettings from './SimulationSettings.js'
import SideBar from './SideBar.js'
import MapEditor from './MapEditor.js'
import RunSimulation from './RunSimulation.js'


function App() {
  return (
    <Router>
        <div>
            <SideBar />
            <main className="py-10 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/surfacematerials" element={<SurfaceMaterials />} />
                        <Route path="/simulationsettings" element={<SimulationSettings />} />
                        <Route path="/mapeditor" element={<MapEditor />} />
                        <Route path="/runsimulation" element={<RunSimulation />} />
                    </Routes>
                </div>
            </main>
        </div>
    </Router>
  );
}

export default App;