// Load CSV file
d3.text("results.csv").then(function(datasetText) {
    var rows = d3.csvParseRows(datasetText),
        table = d3.select('#table-container').append('table')
                    .style("border-collapse", "collapse")
                    .style("border", "1px black solid");

    // headers
    var headers = table.append("thead").append("tr")
        .selectAll("th")
        .data(rows[0])
        .enter().append("th")
        .text(function(d) { return d; })
        .style("border", "1px black solid")
        .style("padding", "5px")
        .style("background-color", "hsl(270, 70%, 80%)")
        .style("font-weight", "bold")
        .style("text-transform", "uppercase");

    // Add filter dropdowns for each column
    headers.append("br"); // Add line break
    headers.append("select")
        .attr("class", "filter-dropdown")
        .on("change", function () {
            var columnIdx = headers.nodes().indexOf(this.parentNode);
            var selectedValue = this.value;
            table.selectAll("tbody tr")
                .style("display", function (d) {
                    var cellValue = d3.select(this).selectAll("td").data()[columnIdx];
                    return selectedValue === "All" || cellValue === selectedValue ? "" : "none";
                });
        })
        .selectAll("option")
        .data(function (header, i) {
            var values = Array.from(new Set(rows.slice(1).map(function (d) { return d[i]; }))); // Unique values for the column
            // Sort numeric values numerically, string values alphabetically
            values.sort((a, b) => isNaN(a) || isNaN(b) ? d3.ascending(a, b) : a - b);
            return ["All"].concat(values);
        })
        .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });

    // data
    table.append("tbody")
        .selectAll("tr").data(rows.slice(1))
        .enter().append("tr")
        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "5px")
        .on("mouseover", function(){
            d3.select(this).style("background-color", "hsl(270, 70%, 80%)");
        })
        .on("mouseout", function(){
            d3.select(this).style("background-color", null);
        })
        .text(function(d){return d;})
        .style("font-size", "12px");
}).catch(function(error) {
    // Handle any errors
    console.error("Error loading the data: " + error);
});
