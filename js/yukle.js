document.getElementById('upload').addEventListener('change', handleFileSelect, false);
document.getElementById('parse').addEventListener('click', init)

var root = new root_1();

function separation(a, b) {
  return (a.parent == b.parent ? 1 : 1.5) ;
}

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

function resim(d){
  // document.getElementById('resim').style.backgroundImage = "url(./" + (d.resim ? "resimler/" + d.resim : "js/erkek.png") + ")";
  document.getElementById('iresim').src = d.resim ? "resimler/" + d.resim : "js/erkek.png";
  document.getElementById('isim').innerText = d.name
  document.getElementById('dogum').innerText = d.dogumyeri ? d.dogum + " - " + d.dogumyeri : d.dogum
  document.getElementById('vefat').innerText = d.olum ? d.olum : "Hayatta"
  document.getElementById('es').innerText = d.esi ? d.esi : "Bekar"
  document.getElementById('kpeder').innerText = d.kpeder ? d.kpeder : ""
  try {
    document.getElementById('baba').innerText = d.parent.name;
    document.getElementById('anne').innerText = d.parent.esi;
  } catch (error) {
    console.log("parent not found\n"+error)
  }
 
  document.getElementById('tel').innerText = d.tel ? String(d.tel).replace(/(\d{0,2})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4') : "Kayitli Degil"
  document.getElementById('email').innerText = d.email ? d.email : "Kayitli Degil"
}

function getDepth(obj) {
    var depth = 0;
    if (obj.children) {
        obj.children.forEach(function (d) {
            var tmpDepth = getDepth(d)
            if (tmpDepth > depth) {
                depth = tmpDepth
            }
        })
    }
    return 1 + depth
}

function init () {
  root.children.forEach(toggleAll);
  toggle(root.children[0]);
  toggle(root.children[0].children[0]);
  toggle(root.children[0].children[0].children[1]);
  toggle(root.children[0].children[0].children[1].children[0]);
  toggle(root.children[0].children[0].children[1].children[0].children[0]);
 
  update(root);
}

function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();
  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 90; });
  // Update the nodes…
  var node = vis.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });
  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
    .on("click", function(d) { toggle(d); update(d) })
    .on("mouseover", function(d){resim(d)})

  nodeEnter.append("svg:circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("svg:text")
    .attr("dy", "1.8em")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-30)")
    .text(function(d) { 
      return d.name;
    })
  .style("fill-opacity", 1e-6);
  
  nodeEnter.append("svg:text")
    .attr("dy", "3.8em")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-30)")
    .text(function(d){
      if(d.esi)
      return "(" + d.esi + ")";
      else
      return "(Bekar)";

    })
    .style("fill-opacity", 1e-6);

  nodeEnter.append("svg:text")
    .attr("dy", "2.8em")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-30)")
    .text(function(d){
      if(d.olum)
      return d.dogum + " - " + d.olum;
      else
      return d.dogum + " - ?";
    })
  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
    .attr("r", 4.5)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.selectAll("text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
    .remove();

  nodeExit.selectAll("text")
    .style("fill-opacity", 1e-6);

  nodeExit.select("circle")
    .attr("r", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link")
    .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
    })
  .transition()
    .duration(duration)
    .attr("d", diagonal);
  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);
  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
    })
  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}


var m = [20,  0, 10,  -20],
    w = parseInt(d3.select('#body').style('width')) - m[1] - m[3],
    h = getDepth(root) * 90 - m[0] - m[2],
    info = d3.select("#info"),
    i = 0;

var tree = d3.layout.tree().size([w, 30]);

tree.separation(separation);

var diagonal = d3.svg.diagonal().projection(function(d) { return [d.x, d.y]; });

var vis = d3.select("#body").attr("height", h*2).append("svg:svg")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])
  .append("svg:g")
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

root.x0 =  w / 2 ;
root.y0 = 0;

//below lines commented due to initialization will be started by button press after loading excel file
// init();
// update(json_object);

// excell reader related functions added 
var obj = [];
var ExcelToJSON = function () {

  this.parseExcel = function (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var xls_obj = JSON.stringify(XL_row_object);
        
        
        var obj = JSON.parse(xls_obj);

        //root object is the one we are sending UI. So I added below line to excel reader code
        root = orderPeople(obj);

        console.log(obj);
       
      })
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function handleFileSelect(evt) {

  var files = evt.target.files; // FileList object
  var xl2json = new ExcelToJSON();
  xl2json.parseExcel(files[0]);
}


