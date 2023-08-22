class Simulation {
    constructor(pointsX, pointsY, iterations, relaxationParameter, inflowVelocity, maxWindSpeed, radiation, boundary, albedo, tree, density, heatCapacity, conductivity, evapotranspiration, obstacleHeight, initialTemperature, tree_flowtroughrate, deltaTime, deltaX, date, geoLongitude, geoLatitude, useAirflow) {

        this.pointsX = parseInt(pointsX)
        this.pointsY = parseInt(pointsY)
        this.iterations = parseInt(iterations)
        this.deltaTime = parseInt(deltaTime)
        this.initialTemperature = parseFloat(initialTemperature)
        this.deltaX = parseFloat(deltaX)
        this.date = new Date(date)
        this.currentDate = new Date(date)
        this.geoLongitude = parseFloat(geoLongitude)
        this.geoLatitude = parseFloat(geoLatitude)

        this.obstacleHeight = parseFloat(obstacleHeight)
        this.radiation = parseFloat(radiation)
        this.albedo = albedo
        this.boundary = boundary
        this.tree = tree

        this.heatCapacity = heatCapacity
        this.density = density
        this.conductivity = conductivity

        this.evapotranspiration = evapotranspiration

        this.maxWindSpeed = parseFloat(maxWindSpeed)
        this.useAirflow = useAirflow
        this.inflowVelocity = parseFloat(inflowVelocity)
        this.relaxationParameter = parseFloat(relaxationParameter)

        this.velocityVectors = [[1, 1], [1, 0], [1, -1], [0, 1], [0, 0], [0, -1], [-1, 1], [-1, 0], [-1, -1]]
        this.velocityVectorWeights = [1 / 36, 1 / 9, 1 / 36, 1 / 9, 4 / 9, 1 / 9, 1 / 36, 1 / 9, 1 / 36]

        this.result;
    }

    calculateMacroscopicProperties(fin) {
        let rho = Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(0))
        let u = Array.from({ length: 2 }, () => Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(0)))
        for (let x = 0; x < this.pointsX; x++) {
            for (let y = 0; y < this.pointsY; y++) {
                for (let i = 0; i < 9; i++) {
                    rho[x][y] += fin[i][x][y]

                    u[0][x][y] += this.velocityVectors[i][0] * fin[i][x][y]
                    u[1][x][y] += this.velocityVectors[i][1] * fin[i][x][y]
                }
                u[0][x][y] /= rho[x][y]
                u[1][x][y] /= rho[x][y]
            }
        }
        return [rho, u]
    }

    calculateEquilibriumDistribution(rho, u) {
        let feqa = Array.from({ length: 9 }, () => Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(0)))
        for (let x = 0; x < this.pointsX; x++) {
            for (let y = 0; y < this.pointsY; y++) {
                let usqr = 3 / 2 * (u[0][x][y] ** 2 + u[1][x][y] ** 2);
                for (let i = 0; i < 9; i++) {
                    let cu = 3 * (this.velocityVectors[i][0] * u[0][x][y] + this.velocityVectors[i][1] * u[1][x][y]);
                    let value = (rho[x][y] * this.velocityVectorWeights[i] * (1 + cu + 0.5 * cu ** 2 - usqr));
                    feqa[i][x][y] = value;
                }
            }
        }
        return feqa;
    }

    run() {
        let temp = Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(this.initialTemperature));
        let new_temp = Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(this.initialTemperature));

        let u = Array.from({ length: 2 }, () => Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(this.inflowVelocity)))
        let rho = Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(1));
        let fin = this.calculateEquilibriumDistribution(rho, u)
        let arr;
        let windspeed;
        let windspeed_scaled;

        for (let time = 0; time < this.iterations; time++) {

            const T = this.currentDate.getHours() + this.currentDate.getMinutes() / 60 + this.currentDate.getSeconds() / 3600;
            const JD = this.currentDate.getJulian();
            const new_date = new Date(this.currentDate.getTime());
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
            const O = (6.697376 + 2400.05134 * T_0 + 1.002738 * T) * 15 + this.geoLongitude;
            const theta = O - alpha;

            const an = cos(theta) * sin(this.geoLatitude) - tan(delta) * cos(this.geoLatitude)
            const a = an <= 0 ? (atan(sin(theta) / an) + 360) % 360 : (atan(sin(theta) / an) + 540) % 360;
            const h = asin(cos(delta) * cos(theta) * cos(this.geoLatitude) + sin(delta) * sin(this.geoLatitude));

            const R = 1.02 / tan(h + (10.3 / (h + 5.11)));
            const h_R = h + R / 60;

            const w = Math.abs(Math.round(this.obstacleHeight / tan(h_R)));
            const m = tan((a - (a % 90) + 90 - (a % 90)));
            const r = Math.abs(sin(h_R) * this.radiation);
            let solar = Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(true));

            if (h_R > 0) {
                for (let x = 0; x < this.pointsX; x++) {
                    for (let y = 0; y < this.pointsY; y++) {
                        if (this.boundary[x][y]) {
                            let b = y - m * x

                            let startx = (a <= 180) ? 0 : x
                            let endx = (startx == 0) ? x : this.pointsX - 1

                            for (let xs = startx; xs < endx; xs++) {
                                let ys = Math.round(m * xs + b)
                                if (ys <= this.pointsY - 1 && ys >= 0) {
                                    let distance = Math.sqrt((x - xs) ** 2 + (y - ys) ** 2)
                                    if (distance <= w) {
                                        solar[xs][ys] = false
                                    }
                                }
                            }

                            let starty = ((a + 90) % 360 <= 180) ? 0 : y
                            let endy = (starty == 0) ? y : this.pointsY - 1

                            for (let ys = starty; ys < endy; ys++) {
                                let xs = Math.round((ys - b) / m)
                                if (xs <= this.pointsX - 1 && xs >= 0) {
                                    let distance = Math.sqrt((x - xs) ** 2 + (y - ys) ** 2)
                                    if (distance <= w) {
                                        solar[xs][ys] = false
                                    }
                                }
                            }

                        }
                    }
                }


                for (let x = 0; x < this.pointsX; x++) {
                    for (let y = 0; y < this.pointsY; y++) {
                        if (solar[x][y]) {
                            temp[x][y] += this.deltaTime * (this.deltaX ** 2 * r * (1 - this.albedo[x][y]) / (this.heatCapacity[x][y] * this.density[x][y] * this.deltaX ** 3))
                        }
                    }
                }
            }


            if (this.useAirflow == "true") {

                for (let y = 0; y < this.pointsY; y++) {
                    for (let i = 6; i < 9; i++) {
                        fin[i][this.pointsX - 1][y] = fin[i][this.pointsX - 2][y]
                    }
                }

                arr = this.calculateMacroscopicProperties(fin)
                rho = arr[0]
                u = arr[1]

                for (let y = 0; y < this.pointsY; y++) {
                    let col2 = 0
                    let col3 = 0
                    for (let i = 3; i < 6; i++) {
                        col2 += fin[i][0][y]
                    }
                    for (let i = 6; i < 9; i++) {
                        col3 += fin[i][0][y]
                    }
                    rho[0][y] = 1 / (1 - u[0][0][y]) * (col2 + 2 * col3)
                }
                let feq = this.calculateEquilibriumDistribution(rho, u)
                for (let y = 0; y < this.pointsY; y++) {
                    for (let i = 0; i < 3; i++) {
                        fin[i][0][y] = feq[i][0][y] + fin[8 - i][0][y] - feq[8 - i][0][y]
                    }
                }

                let fout = Array.from({ length: 9 }, () => Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(this.inflowVelocity)))
                for (let x = 0; x < this.pointsX; x++) {
                    for (let y = 0; y < this.pointsY; y++) {
                        for (let i = 0; i < 9; i++) {
                            fout[i][x][y] = fin[i][x][y] - this.relaxationParameter * (fin[i][x][y] - feq[i][x][y])
                        }
                    }
                }

                for (let x = 0; x < this.pointsX; x++) {
                    for (let y = 0; y < this.pointsY; y++) {
                        if (this.boundary[x][y] == true) {
                            for (let i = 0; i < 9; i++) {
                                fout[i][x][y] = fin[8 - i][x][y]
                            }
                        } else if (this.tree[x][y] == true && Math.floor(Math.random() * this.tree_flowtroughrate) == 0) {
                            for (let i = 0; i < 9; i++) {
                                fout[i][x][y] = fin[8 - i][x][y]
                            }
                        }
                    }
                }

                for (let x = 0; x < this.pointsX; x++) {
                    for (let y = 0; y < this.pointsY; y++) {
                        for (let i = 0; i < 9; i++) {
                            let next_x = x + this.velocityVectors[i][0]
                            if (next_x < 0) { next_x = this.pointsX - 1 }
                            if (next_x >= this.pointsX) { next_x = 0 }

                            let next_y = y + this.velocityVectors[i][1]
                            if (next_y < 0) { next_y = this.pointsY - 1 }
                            if (next_y >= this.pointsY) { next_y = 0 }

                            fin[i][next_x][next_y] = fout[i][x][y]
                        }
                    }
                }

                windspeed = Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(1));
                for (let x = 0; x < this.pointsX; x++) {
                    for (let y = 0; y < this.pointsY; y++) {
                        windspeed[x][y] = Math.sqrt(u[0][x][y] ** 2 + u[1][x][y] ** 2)
                    }
                }
                let max_value = Math.max(...windspeed.flat());
                windspeed_scaled = windspeed.map(row => row.map(value => (value / max_value) * this.maxWindSpeed));

                let flattenedtemp = arr.flatMap(row => row);
                let averagetemp = flattenedtemp.reduce((total, current) => total + current, 0) / flattenedtemp.length || 0;

                for (let x = 0; x < this.pointsX; x++) {
                    for (let y = 0; y < this.pointsY; y++) {
                        const Re = (1.225 * windspeed_scaled[x][y] * this.deltaX) / 1.7894e-5;
                        const Pr = (1.7894e-5 * 1005) / 0.0257;

                        const Nu = 0.332 * (Re ** (1 / 2)) * (Pr ** (1 / 3))
                        const h = (Nu * 0.0257) / this.deltaX;

                        const q = h * this.deltaX ** 2 * (temp[x][y] - averagetemp) * this.deltaTime;
                        temp[x][y] -= q / (this.heatCapacity[x][y] * this.deltaX ** 3 * this.density[x][y])
                    }
                }
            }

            for (let x = 0; x < this.pointsX; x++) {
                for (let y = 0; y < this.pointsY; y++) {
                    let mass = this.evapotranspiration[x][y] / 86400 * this.deltaTime * (this.deltaX ** 2) * 997
                    let q = mass * ((100 - temp[x][y]) * 4190 + 2258000)
                    temp[x][y] += -q / (this.heatCapacity[x][y] * this.density[x][y] * this.deltaX ** 3);
                }
            }

            new_temp = Array.from({ length: this.pointsX }, () => Array(this.pointsY).fill(1));
            for (let x = 0; x < this.pointsX; x++) {
                for (let y = 0; y < this.pointsY; y++) {
                    const nx = x + 1 === this.pointsX ? x : x + 1;
                    const px = x - 1 === -1 ? x : x - 1;
                    const ny = y + 1 === this.pointsY ? y : y + 1;
                    const py = y - 1 === -1 ? y : y - 1;
                    new_temp[x][y] = temp[x][y] + (this.conductivity[x][y] / (this.density[x][y] * this.heatCapacity[x][y]) * this.deltaTime) / (this.deltaX ** 2) * (temp[nx][y] + temp[px][y] + temp[x][ny] + temp[x][py] - 4 * temp[x][y]);
                }
            }
            temp = new_temp;

            this.currentDate.setSeconds(this.currentDate.getSeconds() + this.deltaTime)
        }
        this.result = temp;
        return this.result;
    }
}