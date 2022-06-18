function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(Sample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(Sample);
  buildCharts(Sample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("data.zip").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("./static/js/samples.json").then((data) => {
    console.log(data)
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultcArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  Create a variable that holds the first sample in the array.
    var resultc = resultcArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var  ids = resultc.otu_ids;
    var labels = resultc.otu_labels;
    var values = resultc.sample_values;
    console.log(ids)

    var bubbleLabels = resultc.otu_labels;
    var bubbleValues = resultc.sample_values;

    // Create the yticks for the bar chart.
    // Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
    console.log(yticks);
    // Create the trace for the bar chart. 
    var trace1 = [{
      x: values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels.slice(0,10).reverse(), 
    }];

    // Create the layout for the bar chart. 
    var layout1 = {
    title: "<b>Top 10 Bacteria Cultures Found</b>",
    xaxis: {title: "Sample vaule"},
    yaxis: {title: "Sample ID"}
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace1,layout1);


// Bar and Bubble charts
    // Create the trace for the bubble chart.
    var trace2 = [{
      x: ids,
      y: bubbleValues,
      text: bubbleLabels,
      mode: "markers",
       marker: {
         size: bubbleValues,
         color: ids,
         colorscale: "Earth" }
       }];

    // Create the layout for the bubble chart.
    var layout2 = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "Sample ID"},
      yaxis: {title: "Sample vaule"},
      automargin: true,
      hovermode: "closest"
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", trace2, layout2); 

// Gauge Chart
// Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Create a variable that holds the first sample in the array.
    var gaugeArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0];

    // Create a variable that holds the washing frequency. 
    var wfreqs = gaugeResult.wfreq;
    
    // Create the trace for the gauge chart.
    var trace3 = [{
      type: "indicator",
      value: wfreqs,
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},

        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var layout3 = { 
      width: 400, height: 300, margin: { t: 80, b: 10 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", trace3, layout3 );
  });
}
