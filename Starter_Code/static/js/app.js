// function runs when page loads and makes a default selection
function init(){
    // look at json data
    d3.json("./samples.json").then(function(data) {
    
        // look at data
        console.log(data);

        // create drop down menu with names in data set
        d3.select("#selDataset")
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
        
        // get data from samples
        var otus = data.samples;
        
        var otu_data = [];
        
        // loop through data to find matching name value, push to array
        for (var i = 0; i < otus.length; i++) {
            if (otus[i].id == val) {
                for (var j = 0; j < otus[i].otu_ids.length; j++) {
                    otu_data.push({
                        otu_id: otus[i].otu_ids[j],
                        sample_value: otus[i].sample_values[j],
                        otu_label: otus[i].otu_labels[j]
                    });
                };
            };
        };
        
        // get metadata
        var metadata = data.metadata;

        var sample_metadata = {};

        // loop to get metadata for subject
        for (var i = 0; i < metadata.length; i++) {
            if (metadata[i].id == val) {
                sample_metadata = metadata[i];
            };
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
        
        // create layout
        var layout = {
            title: "Top 10 OTUs",
        };

        // add data
        var data = [trace1];

        // build plot
        Plotly.newPlot("bar", data, layout);

        /*
        Create bubble chart
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
        
        // create layout
        var layout = {
            xaxis: {
                title: "OTU ID"
            }
        };
        
        // add data
        var data = [trace1];

        // build plot
        Plotly.newPlot("bubble", data, layout);

        /*
        Update Demographic info.
        */

        d3.select("#sample-metadata")
            .html(`id: ${sample_metadata.id}</br>ethnicity: ${sample_metadata.ethnicity}</br>gender: ${sample_metadata.gender}</br>age: ${sample_metadata.age}</br>location: ${sample_metadata.location}</br>bbtype: ${sample_metadata.bbtype}</br>wfreq: ${sample_metadata.wfreq}`);
        
        /*
        Gauge chart
        */

        // create trace
        var trace1 = {
            domain: {
                x: [0, 1],
                y: [0, 1]
            },
            value: sample_metadata.wfreq,
            title: "Belly Button Washing Frequency",
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {
                    range: [null, 9]
                },
                bar: {
                    color: "#C0392B"
                },
                steps: [
                    { range: [0, 1], color: "#EAF2F8"},
                    { range: [1, 2], color: "#D4E6F1"},
                    { range: [2, 3], color: "#A9CCE3"},
                    { range: [3, 4], color: "#7FB3D5"},
                    { range: [4, 5], color: "#5499C7"},
                    { range: [5, 6], color: "#2980B9"},
                    { range: [6, 7], color: "#2471A3"},
                    { range: [7, 8], color: "#1F618D"},
                    { range: [8, 9], color: "#1A5276"}
                ]
            }
        }
        
        // add data
        var data = [trace1];
        
        // build plot
        Plotly.newPlot("gauge", data);
    });
}

init();