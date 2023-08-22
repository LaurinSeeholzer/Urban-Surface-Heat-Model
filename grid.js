const brushes = [["#000000", "building", 1, 0.88, 0.4*(10**(-6))], ["#006401", "trees", 0.165, 0.8, 5*(10**(-7))], ["#383838", "asphalt", 0.12, 0.92, 7*(10**(-7))], ["#00ff4c", "grass", 0.25, 0.8, 5*(10**(-7))]]
var array = [[false]]
const grid = document.getElementById("grid")

for (let i = 0; i < brushes.length; i++) {
    var opt = document.createElement("option")
    opt.value = i
    opt.innerHTML = brushes[i][1]
    document.getElementById("brush").appendChild(opt)
}

function init_grid() {
    points_x = document.getElementById("points_x").value
    points_y = document.getElementById("points_y").value
    array = []
    for (let x = 0; x < points_x; x++) {
        array[x] = []
        for (let y = 0; y < points_y; y++) {
            array[x][y] = 3
        }
    }
    build_init_grid()
}

function modify_grid(x,y) {
    var brush_size = document.getElementById("brush_size").value;
    var brush = parseInt(document.getElementById("brush").value);
    color = brushes[brush][0];
    for (let i = 0; i < brush_size; i++) {
        for (let e = 0; e <brush_size; e++) {
            if (x+e<points_x && y+i<points_y) {
                document.getElementById("grid").children.item(y + i).children.item(x + e).style.backgroundColor = color;
                array[x+e][y+i] = brush;
            }
        }
    }
}

function build_init_grid() {
    grid.innerHTML = ""
    w = (grid.clientWidth-(2*points_x))/points_x
    h = (grid.clientHeight-(2*points_y))/points_y
    if (w <= h) {
        size = w + "px"
    } else {
        size = h + "px"
    }
    for (let y = 0; y < document.getElementById("points_y").value; y++) {
        let row = document.createElement("div");
        row.classList.add("row")
        row.classList.add("flex")
        row.classList.add("flex-row")
        for (let x = 0; x < document.getElementById("points_x").value; x++) {
            let pixel = document.createElement("div");
            pixel.setAttribute("onclick", "modify_grid("+ x + "," + y + ");")
            pixel.classList.add("border")
            pixel.classList.add("border-black")
            pixel.classList.add("pixel")
            pixel.style.width = size
            pixel.style.height = size
            pixel.style.backgroundColor = brushes[array[x][y]][0]
            row.appendChild(pixel)
        }
        grid.appendChild(row)
    }
}

function build_return_grid(data) {
    let min = data[0][0]
    let max = data[0][0]
    for (let x=0; x<data.length; x++) {
        if (min>Math.min(...data[x])) {min=Math.min(...data[x])};
        if (max<Math.max(...data[x])) {max=Math.max(...data[x])};
    } console.log(min,max)

    grid.innerHTML = ""
    w = (grid.clientWidth-(2*points_x))/points_x
    h = (grid.clientHeight-(2*points_y))/points_y
    if (w <= h) {
        size = w + "px"
    } else {
        size = h + "px"
    }
    for (let y = 0; y < document.getElementById("points_y").value; y++) {
        let row = document.createElement("div");
        row.classList.add("row")
        for (let x = 0; x < document.getElementById("points_x").value; x++) {
            let pixel = document.createElement("div");
            pixel.setAttribute("onclick", "modify("+ x + "," + y + ");")
            pixel.classList.add("pixel")
            pixel.style.width = size
            pixel.style.height = size
            let per = (data[x][y]-min)/(max-min)*255
            pixel.style.backgroundColor = "rgb(" + per + "," + per +"," + per +")";
            row.appendChild(pixel)
        }
        grid.appendChild(row)
    }
}