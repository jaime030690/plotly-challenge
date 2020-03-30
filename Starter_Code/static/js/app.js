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
}