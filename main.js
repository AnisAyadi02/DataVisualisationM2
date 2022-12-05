import data_visu from './data.json' assert { type: "json" };
import countries from './countries.json' assert { type: "json" };
import co2 from './data_co2.json' assert {type: "json"}

let year = "Y2019"
let country = 'World'
let labels = []
let values = []
let values_co2 = []
let d = {}
let dict_co2 = {}
labels.push("1961")
for (let j = 1965; j <= 2019; j = j + 5) {
  labels.push(j);
}
labels.push("2017")
labels.push("2019")
function update_data(country) {
  d = data_visu.filter((el) => el.Area == country && el.Element == "Temperature change" && el.Months == "Meteorological year")
  values = []


  values.push(d[0]["Y1961"])
  for (let i = 1965; i <= 2019; i = i + 5) {
    let col = "Y" + i
    values.push(d[0][col])
  }



  values.push(d[0]["Y2017"])
  values.push(d[0]["Y2019"])

  console.log(values)

  values_co2 = []
  dict_co2 = co2.filter((el) => el.Country == country)
  labels.forEach(element => {


    values_co2.push(dict_co2[0][element] / 100)

  })

  console.log(values_co2)
}
update_data(country);



const data = {
  labels: labels,
  datasets: [
    {
      label: 'Temperature Change (Celsius)',
      data: values,
      borderColor: 'rgb(169, 0, 0)',
      backgroundColor: 'rgb(221, 221, 221)',
      yAxisID: 'y',
    },
    {
      label: 'Greenhouse Gases (tons)',
      data: values_co2,
      borderColor: 'rgb(0, 169, 0)',
      backgroundColor: 'rgb(221, 221, 221)',
      yAxisID: 'y1',
    }
  ]
};
const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Evolution of the Temperature and Emissions of Greenhouse Gases In ' + country
      }
    },
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return value + 'C°';
          }
        },
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {

        type: 'linear',
        display: true,
        position: 'right',

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    }
  },
};
let chart_two_line = new Chart(document.getElementById('two_line'), config)
function ChangeData(chart, label, data1, data2) {
  chart.data.labels = label;
  chart.data.datasets[0].data = data1;
  chart.data.datasets[1].data = data2;
  chart.options.plugins.title.text = 'Evolution of the Temperature and Emissions of Greenhouse Gases In ' + country;
  chart.update();
}





const map = L.map('map').setView([0, 0], 2);
let geojson;

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


function getColor(n) {
  let t = Number.parseFloat(n)
  if (Number.isNaN(t) || t == null) {
    return '#FFFFFF';
  }
  return t >= 2 ? '#BD0026' :
    t >= 1.5 ? '#DC143C' : // B22222 
      t >= 1 ? '#FFA500' :
        t >= 0.5 ? '#FFD700' :
          t >= 0 ? '#FFFF00' : //  ADFF2F
            t >= -0.5 ? '#ADFF2F' : //ADFF2F
              t >= -1 ? '#00FF00' :  // 7FFFD4
                t >= -1.5 ? '#0000CD' : //# A8E462
                  t <= -2 ? '#191970' : //# 0DC052

                    'FFFBEB';

}

function style(feature) {
  return {

    fillColor: getColor(feature.properties[year]),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  layer.bringToFront();
  info.update(layer.feature.properties);
}
function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
  country = e.target.feature.properties.ADMIN

  update_data(country)
  ChangeData(chart_two_line, labels, values, values_co2)


}
map.on('click', function (e) {
  country = 'World'
  update_data(country)
  ChangeData(chart_two_line, labels, values, values_co2)
  map.setView([0, 0], 2);



});
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    dblclick: zoomToFeature

  });
}

geojson = L.geoJson(countries, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h4>Temperature Change (Celsius)</h4>' + (props ?
    '<b>' + props.ADMIN + '</b><br />' + props[year] + 'C°'
    : 'Hover over a state');
};

info.addTo(map);

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = ["-2", "-1.5", "-1", "-0.5", "0", "0.5", "1", "1.5","2"],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    console.log(grades[i])
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i]) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);

function ChangeYear() {
  let i = document.Choix.Liste.selectedIndex;
  if(i==0) return;
  year = "Y" + document.Choix.Liste.options[i].value;
  geojson = L.geoJson(countries, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);


}
const year_choice = document.getElementById("Years");
year_choice.addEventListener("change", ChangeYear);




