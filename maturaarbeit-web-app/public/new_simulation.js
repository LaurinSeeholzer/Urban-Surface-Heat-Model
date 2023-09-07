/* -----------------------------------------------
/* Author : Laurin Seeholzer
/* MIT license: http://opensource.org/licenses/MIT
/* v2.0.0
/* ----------------------------------------------- */


class Params {
    constructor(pointsX, pointsY, iterations, relaxationParameter, inflowVelocity, maxWindSpeed, radiation, boundary, albedo, airresistence, density, heatCapacity, conductivity, evapotranspiration, obstacleHeight, initialTemperature, tree_flowtroughrate, deltaTime, deltaX, date, geoLongitude, geoLatitude, useAirflow) {

        this.pointsX = parseInt(pointsX) //Integer// gridcells in x-direction
        this.pointsY = parseInt(pointsY) //Integer// gridcells in y-direction
        this.deltaX = parseFloat(deltaX) //Float// length and width of one cell in meters
        this.iterations = parseInt(iterations) //Integer// number of iterations
        this.deltaTime = parseInt(deltaTime) //Integer// duration of one iteration in seconds
        this.initialTemperature = parseFloat(initialTemperature) //Float// initial temperature
        this.date = new Date(date) //DateTime// date and time of the simulation szenario
        this.geoLongitude = parseFloat(geoLongitude) //Float// longitude of simulation location
        this.geoLatitude = parseFloat(geoLatitude) //Float// latittude of simulation location

        this.obstacleHeight = parseFloat(obstacleHeight) //Float// height of obstacles (trees, buildings, ...)
        this.radiation = parseFloat(radiation) //Float// amount of solarradation at an angle of 90 degrees
        this.albedo = albedo //2D-Array// albedo values for each cell
        this.boundary = boundary //2D-Array// stores for each cell if it is an obstacle
        this.airresistence = airresistence //2D-Array// amount of airresistenc of obstacles

        this.heatCapacity = heatCapacity //2D-Array// specific heat capacity of each cell
        this.density = density //2D-Array// material density of each cell
        this.conductivity = conductivity //2D-Array// thermal conductivity of each cell

        this.evapotranspiration = evapotranspiration //2D-Array// evapotranspiration on each cell in m/day

        this.maxWindSpeed = parseFloat(maxWindSpeed) //Float// maximum physical windspeed
        this.useAirflow = useAirflow //Boolean// should airflow be simulated
        this.inflowVelocity = parseFloat(inflowVelocity) //Float// maximum inflow velocity of Fluid Simulation
        this.relaxationParameter = parseFloat(relaxationParameter) //Float// relaxation parameter of Fluid Simulation
        this.velocityVectors = [[1, 1], [1, 0], [1, -1], [0, 1], [0, 0], [0, -1], [-1, 1], [-1, 0], [-1, -1]] //Velocity vectors for Fluid Simulation
        this.velocityVectorWeights = [1 / 36, 1 / 9, 1 / 36, 1 / 9, 4 / 9, 1 / 9, 1 / 36, 1 / 9, 1 / 36] //weights of velocity vectors for Fluid Simulation
    }
}

class Simulation {

    run(params) {

        //set start date and time of simulation
        let currentDate = new Date(params.date)

        //initialize temperature map
        let tempMap = Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(params.initialTemperature))

        //Initialize Airflow if set to true
        //if (params.useAirflow) {

            //initialize fluid velocities
            let velocity_u = Array.from({ length: 2 }, () => Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(params.inflowVelocity)))

            //initialize fluid densities
            let density_rho = Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(1));

            //calculate initial probabilitydistributions from fluid velocities and densities
            let fIn = this.calculateEquilibriumDistribution(params, density_rho, velocity_u)
        //}

        //Main Loop
        for (let time = 0; time < params.iterations; time++) {

            //calculate the sun position
            let sunPosition = this.calculateSunPosition(params, currentDate);
            let azimut = sunPosition.azimut
            let elevation = sunPosition.elevation

            //If Sun is over the horizon
            if (elevation > 0) {

                //calculate Map of shadows
                let solarMap = this.calculateSolarMap(params, azimut, elevation);

                //calculate the solar radiation
                const solarRadiation = Math.abs(sin(elevation) * params.radiation);

                //calculate temperatruechange based on the solarRadiation and solarMap
                this.applySolarRadiation(params, solarMap, tempMap, solarRadiation);
            }

            //Fluid Simulation & Heat Convection
            if (params.useAirflow && time%100 === 0) {

                //Fluid Simulation

                //apply outflow conditions
                this.applyOutflowConditions(params, fIn);

                //calculate macroscopic fluid properties from changed probabilitydistributions
                let macroscopicProperties = this.calculateMacroscopicProperties(params, fIn);
                velocity_u = macroscopicProperties.velocity_u;
                density_rho = macroscopicProperties.density_rho;

                //calculate new probabilitydistributions at Inflow and apply Inflow coniditions
                this.calculateDensityAtInflow(params, fIn, velocity_u, density_rho)
                let feq = this.calculateEquilibriumDistribution(params, density_rho, velocity_u)
                this.applyInflowConditions(params, fIn, feq);

                //apply collision step
                let fout = this.applyCollisionStep(params, fIn, feq); 

                //apply Bounce-Back-Boundary condition
                this.applyBounceBackCondition(params, fIn, fout);

                //apply streaming Step
                this.applyStreamingStep(params, fIn, fout);

                //calculate actual physical windspeed from fluid simulation velocities
                let windSpeed = this.calculateWindSpeed(params, velocity_u);

                //Apply Convection Heat Transfer based on calculated Windspeed
                this.applyConvectionHeatTransfer(params, tempMap, windSpeed);
            }

            //calculate and apply temperaturechange from evapotranspiration
            this.applyEvapotranspirationCooling(params, tempMap);

            //apply heat diffusion
            this.applyHeatDiffusion(params, tempMap);

            //update current Date and Time (+ deltaTime)
            this.updateCurrentDate(params, currentDate);

            //send information about the simulation status to the FrontEnd¨
            if ((time+1)%10 === 0) {
                let data = {
                    averageTemp: this.calculateAverageTemperature(tempMap),
                    minTemp: this.calculateMinimalTemperture(tempMap),
                    maxTemp: this.calculateMaximumTemperture(tempMap),
                    iterations: params.iterations,
                    iteraton: time + 1,
                    date: params.date,
                    currentDate: currentDate
                }
                this.informFrontend(params, 'status', data);
            }
        } 

        return tempMap;
    }
    
    //caluclates the solarposiiton (azimut & elevation) from date, time and geographical coordinates
    calculateSunPosition(params, currentDate) {
        
        const T = currentDate.getHours() + currentDate.getMinutes() / 60 + currentDate.getSeconds() / 3600;
        const JD = currentDate.getJulian();
        const new_date = new Date(currentDate.getTime());
        new_date.setHours(0, 0, 0, 0);
        const JD_0 = new_date.getJulian();

        const n = JD - 2451545.0;
        const L = 280.460 + 0.9856474 * n;
        const g = 357.528 + 0.9856003 * n;
        const A = L + 1.915 * sin(g) + 0.01997 * sin(2 * g);
        const epsilon = 23.439 - 0.0000004 * n;
        let alpha = cos(A) <= 0 ? atan(cos(epsilon) * tan(A)) + 4 * atan(1) : atan(cos(epsilon) * tan(A));
        const delta = asin(sin(epsilon) * sin(A));
        const T_0 = (JD_0 - 2451545.0) / 36525;
        const O = (6.697376 + 2400.05134 * T_0 + 1.002738 * T) * 15 + params.geoLongitude;
        const theta = O - alpha;

        const an = cos(theta) * sin(params.geoLatitude) - tan(delta) * cos(params.geoLatitude)
        const a = an <= 0 ? (atan(sin(theta) / an) + 360) % 360 : (atan(sin(theta) / an) + 540) % 360;
        const h = asin(cos(delta) * cos(theta) * cos(params.geoLatitude) + sin(delta) * sin(params.geoLatitude));

        const R = 1.02 / tan(h + (10.3 / (h + 5.11)));
        const h_R = h + R / 60;

        let sunPosition = {
            azimut: a,
            elevation: h_R,
        }

        return sunPosition;
    }

    //caluclates a 2d map of shadow: flase and solarradiaiton: true
    calculateSolarMap(params, azimut, elevation) {

        const shadowLength_w = Math.abs(Math.round(params.obstacleHeight / tan(elevation)));
        const gradiant_m = tan((azimut - (azimut % 90) + 90 - (azimut % 90)));
        
        let solarMap = Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(true))

        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                if (params.boundary[x][y]) {
                    let b = y - gradiant_m * x

                    //calculate intersections of the straight line with all lines parallel to the Y-axis

                    let startx = (azimut <= 180) ? 0 : x
                    let endx = (startx == 0) ? x : params.pointsX - 1
                    
                    for (let xs = startx; xs < endx; xs++) {
                        let ys = Math.round(gradiant_m * xs + b)
                        if (ys <= params.pointsY - 1 && ys >= 0) {
                            let distance = Math.sqrt((x - xs) ** 2 + (y - ys) ** 2)
                            if (distance * params.deltaX <= shadowLength_w) {
                                solarMap[xs][ys] = false
                            }
                        }
                    }

                    //calculate intersections of the straight line with all lines parallel to the X-axis

                    let starty = ((azimut + 90) % 360 <= 180) ? 0 : y
                    let endy = (starty == 0) ? y : params.pointsY - 1

                    for (let ys = starty; ys < endy; ys++) {
                        let xs = Math.round((ys - b) / gradiant_m)
                        if (xs <= params.pointsX - 1 && xs >= 0) {
                            let distance = Math.sqrt((x - xs) ** 2 + (y - ys) ** 2)
                            if (distance * params.deltaX <= shadowLength_w) {
                                solarMap[xs][ys] = false
                            }
                        }
                    }

                }
            }
        }

        return solarMap
    }

    //applies temperaturechanges from solar radiaiton to tempMap
    applySolarRadiation(params, solarMap, tempMap, solarRadiation) {
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                if (solarMap[x][y] || params.boundary[x][y]) {
                    tempMap[x][y] += params.deltaTime * (params.deltaX ** 2 * solarRadiation * (1 - params.albedo[x][y]) / (params.heatCapacity[x][y] * params.density[x][y] * params.deltaX ** 2 * 1))
                }
            }
        }
    }

    //calculates the macroscopic fluid propperties from probabiltydistribution
    calculateMacroscopicProperties(params, fIn) {
        let rho = Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(0))
        let u = Array.from({ length: 2 }, () => Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(0)))
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                for (let i = 0; i < 9; i++) {
                    rho[x][y] += fIn[i][x][y]

                    u[0][x][y] += params.velocityVectors[i][0] * fIn[i][x][y]
                    u[1][x][y] += params.velocityVectors[i][1] * fIn[i][x][y]
                }
                u[0][x][y] /= rho[x][y]
                u[1][x][y] /= rho[x][y]
            }
        }
        
        let macroscopicProperties = {
            velocity_u: u,
            density_rho: rho
        }

        return macroscopicProperties
    }

    //calculates an equilibriumdistribution based on macroscopic fluid properties
    calculateEquilibriumDistribution(params, rho, u) {
        let feqa = Array.from({ length: 9 }, () => Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(0)))
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                let usqr = 3 / 2 * (u[0][x][y] ** 2 + u[1][x][y] ** 2);
                for (let i = 0; i < 9; i++) {
                    let cu = 3 * (params.velocityVectors[i][0] * u[0][x][y] + params.velocityVectors[i][1] * u[1][x][y]);
                    let value = (rho[x][y] * params.velocityVectorWeights[i] * (1 + cu + 0.5 * cu ** 2 - usqr));
                    feqa[i][x][y] = value;
                }
            }
        }
        return feqa;
    }

    //applies outflow conditions
    applyOutflowConditions(params, fIn) {
        for (let y = 0; y < params.pointsY; y++) {
            for (let i = 6; i < 9; i++) {
                fIn[i][params.pointsX - 1][y] = fIn[i][params.pointsX - 2][y]
            }
        }
    }

    //calculates unknown densities at inflow to apply inflow conditions
    calculateDensityAtInflow(params, fIn, velocity_u, density_rho) {
        for (let y = 0; y < params.pointsY; y++) {
            let col2 = 0
            let col3 = 0
            for (let i = 3; i < 6; i++) {
                col2 += fIn[i][0][y]
            }
            for (let i = 6; i < 9; i++) {
                col3 += fIn[i][0][y]
            }
            density_rho[0][y] = 1 / (1 - velocity_u[0][0][y]) * (col2 + 2 * col3)
        }
    }

    //applies inflow conditions
    applyInflowConditions(params, fIn, feq) {
        for (let y = 0; y < params.pointsY; y++) {
            for (let i = 0; i < 3; i++) {
                fIn[i][0][y] = feq[i][0][y] + fIn[8 - i][0][y] - feq[8 - i][0][y]
            }
        }
    }

    //applies collision step (fIn -> fout)
    applyCollisionStep(params, fIn, feq) {
        let fout = Array.from({ length: 9 }, () => Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(0)))
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                for (let i = 0; i < 9; i++) {
                    fout[i][x][y] = fIn[i][x][y] - params.relaxationParameter * (fIn[i][x][y] - feq[i][x][y])
                }
            }
        }
        return fout
    }

    //applies the bounce Back Boundary condition to obstacles in the flow field
    applyBounceBackCondition(params, fIn, fout) {
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                if (params.boundary[x][y]) {
                    if (Math.random() <= params.airresistence[x][y]) {
                        for (let i = 0; i < 9; i++) {
                            fout[i][x][y] = fIn[8 - i][x][y]
                        }
                    }
                }
            }
        }
    }

    //applies streaming step (fout -> fIn)
    applyStreamingStep(params, fIn, fout) {
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                for (let i = 0; i < 9; i++) {
                    let next_x = x + params.velocityVectors[i][0]
                    if (next_x < 0) { next_x = params.pointsX - 1 }
                    if (next_x >= params.pointsX) { next_x = 0 }

                    let next_y = y + params.velocityVectors[i][1]
                    if (next_y < 0) { next_y = params.pointsY - 1 }
                    if (next_y >= params.pointsY) { next_y = 0 }

                    fIn[i][next_x][next_y] = fout[i][x][y]
                }
            }
        }
    }

    //calculates physical windspeed from fluidsimulation velocities
    calculateWindSpeed(params, velocity_u) {
        let windspeed = Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(1));
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                windspeed[x][y] = Math.sqrt(velocity_u[0][x][y] ** 2 + velocity_u[1][x][y] ** 2)
            }
        }
        let max_value = Math.max(...windspeed.flat());
        let windspeedScaled = windspeed.map(row => row.map(value => (value / max_value) * params.maxWindSpeed));
        return windspeedScaled;
    }

    //calculates average Value of given tempMap
    calculateAverageTemperature(tempMap) {
        let flattenedTemp = tempMap.flatMap(row => row);
        let averageTemp = flattenedTemp.reduce((total, current) => total + current, 0) / flattenedTemp.length || 0;
        return averageTemp
    }

    applyConvectionHeatTransfer(params, tempMap, windSpeed) {

        let averageTemp = this.calculateAverageTemperature(tempMap);
    
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                if (!params.boundary[x][y]) {
                    const Re = (1.225 * windSpeed[x][y] * params.deltaX) / 1.7894e-5;
                    const Pr = (1.7894e-5 * 1005) / 0.0257;
    
                    const Nu = 0.332 * (Re ** (1 / 2)) * (Pr ** (1 / 3))
                    const h = (Nu * 0.0257) / params.deltaX;
    
                    const q = h * params.deltaX ** 2 * (tempMap[x][y] - averageTemp) * params.deltaTime;
                    tempMap[x][y] -= q / (params.heatCapacity[x][y] * params.deltaX ** 3 * params.density[x][y])
                }
            }
        }
    }

    //calculates and applies temperaturechanges from evapotranspiration
    applyEvapotranspirationCooling(params, tempMap) {
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                let mass = params.evapotranspiration[x][y] / 86400 * params.deltaTime * (params.deltaX ** 2) * 997
                let q = mass * ((100 - tempMap[x][y]) * 4190 + 2258000)
                tempMap[x][y] += -q / (params.heatCapacity[x][y] * params.density[x][y] * params.deltaX ** 2 * 1);
            }
        }
    }

    //applys Heat Diffusion to the tempMap
    applyHeatDiffusion(params, tempMap) {
        let new_temp = Array.from({ length: params.pointsX }, () => Array(params.pointsY).fill(1));
        for (let x = 0; x < params.pointsX; x++) {
            for (let y = 0; y < params.pointsY; y++) {
                const nx = x + 1 === params.pointsX ? x : x + 1;
                const px = x - 1 === -1 ? x : x - 1;
                const ny = y + 1 === params.pointsY ? y : y + 1;
                const py = y - 1 === -1 ? y : y - 1;
                const thermalDiffusivity = params.conductivity[x][y] / (params.density[x][y] * params.heatCapacity[x][y])
                new_temp[x][y] = tempMap[x][y] + (thermalDiffusivity * params.deltaTime * (tempMap[nx][y] + tempMap[px][y] + tempMap[x][ny] + tempMap[x][py] - 4 * tempMap[x][y]) / (params.deltaX ** 2));
            }
        }
        tempMap = new_temp
    }

    calculateMinimalTemperture(tempMap) {
        let minTemp = Math.min(...tempMap.map(row => Math.min(...row)));
        return minTemp;
    }

    calculateMaximumTemperture(tempMap) {
        let maxTemp = Math.max(...tempMap.map(row => Math.max(...row)));
        return maxTemp;
    }

    //updates currentDate (+ deltaTime)
    updateCurrentDate(params, currentDate) {
        currentDate.setSeconds(currentDate.getSeconds() + params.deltaTime)
    }

    //sends status information of the simulation to the FrontEnd
    informFrontend(params, type, data) {
        postMessage({type: type, data: data});
    }
}