import co2 from './data_co2.json' assert {type: "json"}



let year = "2017"

let n = 10

let labels = []
let values = []

function comparator(year) {
    return (a, b) => a[year] == b[year] ? 0 : a[year] < b[year] ? 1 : -1
}
function update_data(n, year) {
    labels = []
    values = []
    year = year
    n = n
    //console.log((n,year))
    let d = co2.sort(comparator(year))
    let d_top = d.filter(({ Country }) => !["World", "EU-28", "Asia and Pacific (other)", "Europe (other)", "Americas (other)", "Middle East", "Africa"].includes(Country)).slice(0, n)
    
    for (let j = 0; j < n; j = j + 1) {
        labels.push(d_top[j].Country);
        values.push(d_top[j][year] / 100)
    }
}
update_data(10,"2017")





const ctx = document.getElementById('bar');
const config = {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'tons of Greenhouse Gas Emissions in ' + year,
            data: values,
            borderWidth: 1,
            borderColor: 'rgb(169, 0, 0)',
            backgroundColor: 'rgb(221, 221, 221)'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }


    }
};
let bar = new Chart(ctx, config);
function ChangeData(chart, label, data) {
    chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].label = 'tons of Greenhouse Gas Emissions in ' + year;
    chart.update();
  }
function ChangeYear() {
    let i = document.Choix.Liste.selectedIndex;
    if (i == 0) return;
    year = document.Choix.Liste.options[i].value;
    update_data(n,year)
    ChangeData(bar, labels, values)
    bar.update()
}
const year_choice = document.getElementById("Years");
year_choice.addEventListener("change", ChangeYear);

function ChangeN() {
    let i = document.Top.Liste.selectedIndex;
    if (i == 0) return;
    n = document.Top.Liste.options[i].value;
    update_data(n,year)
    ChangeData(bar, labels, values)
    bar.update()
}
const n_choice = document.getElementById("TOP_N");
n_choice.addEventListener("change", ChangeN);
