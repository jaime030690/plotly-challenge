

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

// function to update the bar chart

function updateBarChart(val) {

    d3.json("./samples.json").then(function(data) {
        
        var otus = data.samples;

        var otu_data = [];
        
        // loop through data to find matching name value
        for (var i = 0; i < otus.length; i++) {
            if (otus[i].id === val) {
                for (var j = 0; j < otus[i].otu_ids.length; j++) {
                    otu_data.push({
                        otu_id: otus[i].otu_ids[j],
                        sample_value: otus[i].sample_values[j],
                        otu_label: otus[i].otu_labels[j]
                    });
                };
            }
        };

        // sort data
        var sorted_data = otu_data;
        sorted_data.sort(function compareFunction(first, second) {
            return second.sample_value - first.sample_value;
        });

        // slice data, 10 items
        var sliced_data = sorted_data.slice(0, 10).reverse();

        var x_values = sliced_data.map(d => d.sample_value);
        var y_values = sliced_data.map(d => `OTU ${d.otu_id}`);
        var hover = sliced_data.map(d => d.otu_label);

        console.log(hover);

        var trace1 = {
            x: x_values,
            y: y_values,
            hovertext: hover,
            type: "bar",
            orientation: "h"
        };

        var data = [trace1];

        Plotly.newPlot("bar", data);
    });
}