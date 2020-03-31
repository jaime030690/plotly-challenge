function init(){
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

    // default selection
    optionChanged("940");
}

// function updates charts when a menu item is chosen
function optionChanged(val) {
    console.log(val);
    updateCharts(val);
}

// function to update the bar chart

function updateCharts(val) {

    d3.json("./samples.json").then(function(data) {
        
        var otus = data.samples;

        var otu_data = [];
        
        // loop through data to find matching name value, push to array
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

        /*
        Creating bar chart, data will need to be sorted with greater OTU sample value,
        then sliced for top 10 OTUs.
        **/

        // sort data
        var sorted_data = otu_data;
        sorted_data.sort(function compareFunction(first, second) {
            return second.sample_value - first.sample_value;
        });

        // slice data, 10 items
        var sliced_data = sorted_data.slice(0, 10).reverse();

        // variables for the trace
        var x_values = sliced_data.map(d => d.sample_value);
        var y_values = sliced_data.map(d => `OTU ${d.otu_id}`);
        var hover = sliced_data.map(d => d.otu_label);

        // crate trace
        var trace1 = {
            x: x_values,
            y: y_values,
            hovertext: hover,
            type: "bar",
            orientation: "h"
        };
        
        var layout = {
            title: "Top 10 OTUs",
        };

        var data = [trace1];

        Plotly.newPlot("bar", data, layout);

        /*
        Creating bubble chart
        */

        // variables for the trace
        var x_values = otu_data.map(d => d.otu_id);
        var y_values = otu_data.map(d => d.sample_value);
        var marker_size = otu_data.map(d => d.sample_value);
        var marker_color = otu_data.map(d => d.otu_id);
        var text_values = otu_data.map(d => d.otu_label);

        // create trace
        var trace1 = {
            x: x_values,
            y: y_values,
            mode: "markers",
            marker: {
                color: marker_color,
                size: marker_size
            },
            hovertext: text_values
        };

        var layout = {
            xaxis: {
                title: "OTU ID"
            }
        };

        var data = [trace1];

        Plotly.newPlot("bubble", data, layout);


    });
}

init();