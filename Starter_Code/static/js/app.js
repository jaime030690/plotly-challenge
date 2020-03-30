

// look at json data
d3.json("./samples.json").then(function(data) {
    
    // look at data
    console.log(data);

    // create drop down menu with names in data set
    var dropdownMenu = d3.select("#selDataset")
        .selectAll("option")
        .data(data.names)
        .enter()
        .append("option")
        .text(d => d);
    
});

// function updates bar chart when a menu item is chosen
function optionChanged(val) {
    console.log(val);
    updateBarChart(val);
}



function updateBarChart(val) {

    d3.json("./samples.json").then(function(data) {
        
        var otus = data.samples;

        var otu_data = {
            otu_ids: [],
            sample_values: [],
            otu_labels: []
        };
        
        // loop through data to find matching name value
        for (var i = 0; i < otus.length; i++) {
            if (otus[i].id === val) {
                otu_data.otu_ids = otus[i].otu_ids;
                otu_data.sample_values = +otus[i].sample_values;
                otu_data.otu_labels = otus[i].otu_labels;
            }
        };

        var trace1 = {
            x: otu_data.sample_values,
            y: otu_data.otu_ids,
            type: "bar",
            orientation: "h"
        };

        var data = [trace1];

        Plotly.newPlot("bar", data);

    });
}