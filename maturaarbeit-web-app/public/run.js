importScripts('./simulation.js');
importScripts('./utils.js');

self.onmessage = e => {
    let d = e.data
    let sim = new Simulation(
        d.pointsX, 
        d.pointsY,
        d.iterations, 
        d.relaxationParameter, 
        d.inflowVelocity, 
        d.maxWindSpeed, 
        d.radiation, 
        d.boundary, 
        d.albedo, 
        d.airresistence, 
        d.density, 
        d.heatCapacity, 
        d.conductivity, 
        d.evapotranspiration, 
        d.obstacleHeight, 
        d.initialTemperature, 
        d.tree_flowtroughrate, 
        d.deltaTime, 
        d.deltaX,
        d.date, 
        d.geoLongitude, 
        d.geoLatitude, 
        d.useAirflow
    )
    let result = sim.run()
    self.postMessage(result);
  };