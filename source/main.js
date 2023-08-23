//data
var datamap;
var data = [
  //[density, heatcapacity, conductivity, albedo, evapotranspiration]
    [2050,1480,1.075,0.215,0.003],//grass and organic soil
    [997,4182,0.6,0.08,0.012],//water
    [2360,920,0.75,0.15,0],//asphalt
    [1600,900,0.15,0.17,0],//brick
    [2050,1480,1.1,0.165,0.008]//forest soil
]

//basic
points_x;
points_y;

//brush
var brush = 0;
var brush_size = 5;
var brush_color = '#000'

//
var airflow = "false"

//submit
function submit() {
    document.getElementById("grid").style.display = "none"
    document.getElementById("loading").classList.remove("hidden")

    //Map Data
    let density = new Array(points_x).fill(0).map(() => new Array(points_y).fill(0));
    let heatcapacity = new Array(points_x).fill(0).map(() => new Array(points_y).fill(0));
    let conductivity = new Array(points_x).fill(0).map(() => new Array(points_y).fill(0));
    let albedo = new Array(points_x).fill(0).map(() => new Array(points_y).fill(0));
    let building = new Array(points_x).fill(0).map(() => new Array(points_y).fill(0));
    let evapotranspiration = new Array(points_x).fill(0).map(() => new Array(points_y).fill(0));
    let tree = new Array(points_x).fill(0).map(() => new Array(points_y).fill(0));

    //Basic Settings
    let iterations = document.getElementById("iterations").value
    let initial_temperature = document.getElementById("initial_temperature").value
    let delta_t = document.getElementById("delta_t").value
    let delta_x = document.getElementById("delta_x").value
    let date = document.getElementById("date").value.toString()
    let geo_l = document.getElementById("longitude").value
    let geo_b = document.getElementById("latitude").value

    //Air Flow
    let inflow_velocity = document.getElementById("inflow_velocity").value
    let relaxation_parameter = document.getElementById("relaxation_parameter").value
    let max_windspeed = document.getElementById("max_windspeed").value

    //Radiation
    let radiation = document.getElementById("radiation").value
    let obstacle_height = document.getElementById("obstacle_height").value

    //Trees
    let tree_flowtroughrate = document.getElementById("tree_flowtroughrate").value

    //set Map Data
    for (x=0; x<points_x; x++) {
        for (y=0; y<points_y; y++) {
            let current_brush = datamap[x][y]

            density[x][y] = data[current_brush][0]
            heatcapacity[x][y] = data[current_brush][1]
            conductivity[x][y] = data[current_brush][2]
            albedo[x][y] = data[current_brush][3]
            evapotranspiration[x][y] = data[current_brush][4]

            building[x][y] = (current_brush === 3)
            tree[x][y] = (current_brush === 4)
        }
    }

    console.log(geo_b)

    simWorker.postMessage({
        points_x: points_x,
        points_y: points_y,
        iterations: iterations,
        relaxation_parameter: relaxation_parameter,
        inflow_velocity: inflow_velocity,
        max_windspeed: max_windspeed,
        radiation: radiation,
        building: building,
        albedo: albedo,
        tree: tree,
        density: density,
        heatcapacity: heatcapacity,
        conductivity: conductivity,
        evapotranspiration: evapotranspiration,
        obstacle_height: obstacle_height,
        initial_temperature: initial_temperature,
        tree_flowtroughrate: tree_flowtroughrate,
        delta_t: delta_t, 
        delta_x: delta_x,
        date: date,
        geo_l: geo_l,
        geo_b: geo_b,
        airflow: airflow
    });
}

var simWorker = new Worker("run.js");

simWorker.addEventListener('message', function (e) {
    document.getElementById("loading").classList.add("hidden")
    document.getElementById("grid").style.display = "flex"
    console.log(e.data)
    show_result(e.data)
});
