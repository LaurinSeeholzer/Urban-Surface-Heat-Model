function generate_domain() {
    let grid = document.getElementById("grid")

    points_x = parseInt(document.getElementById("points_x").value)
    points_y = parseInt(document.getElementById("points_y").value)
    datamap = new Array(points_x).fill(0).map(() => new Array(points_y).fill(0));

    let w = (grid.clientWidth/points_x)
    let h = (grid.clientHeight/points_y)
    let s;
    if (w <= h){s = w + "px"} else {s = h + "px"}

    let container = document.createElement("div")
    container.classList.add("mx-auto")
    container.classList.add("my-auto")

    for (let y=0; y<points_y; y++) {
        let row = document.createElement("div")
        row.classList.add("domain-row")
        for (let x=0; x<points_x; x++) {
            let pixel = document.createElement("div")
            pixel.setAttribute("onclick", 'modify_domain('+ x +','+ (points_y-y-1) +')')
            pixel.classList.add("domain-pixel")
            pixel.style.width = s
            pixel.style.height = s
            row.appendChild(pixel)
        }
        container.appendChild(row)
    }
    grid.innerHTML = ""
    grid.appendChild(container)
}

function modify_domain(x,y) {
    for (let i = 0; i < brush_size; i++) {
        for (let e = 0; e < brush_size; e++) {
            if (x+e<points_x && y+i<points_y) {
                document.getElementById("grid").children.item(0).children.item(points_y-y-1-i).children.item(x + e).style.backgroundColor = brush_color;
                datamap[x+e][y+i] = brush;
            }
        }
    }
}

function show_result(temp) {
    let grid = document.getElementById("grid")

    //let min = temp[0][0]
    //let max = temp[0][0]
    //for (let x=0; x<data.length; x++) {
    //    if (min>Math.min(...temp[x])) {min=Math.min(...temp[x])};
    //    if (max<Math.max(...temp[x])) {max=Math.max(...temp[x])};
    //}
    var min,max;
    temp.forEach(function(itm) {
        itm.forEach(function(itmInner) {
            min = (min == undefined || itmInner<min) ? itmInner : min;
            max = (max == undefined || itmInner>max) ? itmInner : max;
        });
    });
    console.log(max,min); 


    for (let y=0; y<points_y; y++) {
        row = grid.children.item(0).children.item(points_y-y-1)
        for (let x=0; x<points_x; x++) {
            let pixel = row.children.item(x)
            let val = (temp[x][y]-min)/(max-min)*255
            let red = Math.floor(val-128+Math.abs(val-128))
            let green = 255-2*Math.abs(val-127.5)
            let blue = Math.floor(127-val+Math.abs(127-val))
            let color = "rgb(" + red + "," + green +"," + blue +")";
            pixel.style.backgroundColor = color;
        }
    }
}