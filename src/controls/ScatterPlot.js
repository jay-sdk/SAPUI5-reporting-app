jQuery.sap.require("sap/ui/thirdparty/d3");
jQuery.sap.declare("sap.jaysdk.ScatterPlot");

sap.ui.core.Element.extend("sap.jaysdk.ScatterPlotItem", { metadata : {
	properties : {
		"quarter" : {type : "string", group : "Misc", defaultValue : null},
		"values" : {type : "object", group : "Misc", defaultValue : null}	
	}
}});	
sap.ui.core.Control.extend("sap.jaysdk.ScatterPlot", {
	metadata : {
		properties: {
			"title": {type : "string", group : "Misc", defaultValue : "ScatterPlot Title"}
		},
		aggregations : {
			"items" : { type: "sap.jaysdk.ScatterPlotItem", multiple : true, singularName : "item"}
		}
		,
		defaultAggregation : "items",
		events: {
			"onPress" : {},
			"onChange":{}		
		}			
	},

	
	init : function() {
		console.log("sap.jaysdk.ScatterPlot.init()");
		this.sParentId = "";
	},
	
	
	createScatterPlot : function() {
		/*
		 * Called from renderer
		 */
		console.log("sap.jaysdk.ScatterPlot.createScatterPlot()");
		var oScatterPlotLayout = new sap.m.VBox({alignItems:sap.m.FlexAlignItems.Center,justifyContent:sap.m.FlexJustifyContent.Center});
		var oScatterPlotFlexBox = new sap.m.FlexBox({height:"auto",alignItems:sap.m.FlexAlignItems.Center});
		/* ATTENTION: Important
		 * This is where the magic happens: we need a handle for our SVG to attach to. We can get this using .getIdForLabel()
		 * Check this in the 'Elements' section of the Chrome Devtools: 
		 * By creating the layout and the Flexbox, we create elements specific for this control, and SAPUI5 takes care of 
		 * ID naming. With this ID, we can append an SVG tag inside the FlexBox
		 */
		this.sParentId=oScatterPlotFlexBox.getIdForLabel();
		oScatterPlotLayout.addItem(oScatterPlotFlexBox);
		
		return oScatterPlotLayout;

	},


	/**
	 * The renderer render calls all the functions which are necessary to create the control,
	 * then it call the renderer of the vertical layout 
	 * @param oRm {RenderManager}
	 * @param oControl {Control}
	 */
	renderer : function(oRm, oControl) {
		var layout = oControl.createScatterPlot();

		oRm.write("<div");
		oRm.writeControlData(layout); // writes the Control ID and enables event handling - important!
		oRm.writeClasses(); // there is no class to write, but this enables 
		// support for ColorBoxContainer.addStyleClass(...)
		
		oRm.write(">");
		oRm.renderControl(layout);
		oRm.addClass('verticalAlignment');

		oRm.write("</div>");
	
	},
	
	onAfterRendering: function(){
		console.log("sap.jaysdk.ScatterPlot.onAfterRendering()");
		//console.log(this.sParentId);
		var cItems = this.getItems();
		var data = [];
		for (var i=0;i<cItems.length;i++){
			var oEntry = {};
			for (var j in cItems[i].mProperties) {
				oEntry[j]=cItems[i].mProperties[j];
			}	
			data.push(oEntry);
		}
		//console.log("Data:");
		//console.log(data);
		
		/*
		 * ATTENTION: See .createScatterPlot()
		 * Here we're picking up a handle to the "parent" FlexBox with the ID we got in .createScatterPlot()
		 * Now simply .append SVG elements as desired
		 * EVERYTHING BELOW THIS IS PURE D3.js
		 */
		
		var margin = {
			    top: 15,
			    right: 15,
			    bottom: 30,
			    left: 40
			},
			width = 600 - margin.left - margin.right,
			    height = 300 - margin.top - margin.bottom;

			// Our X scale
			var x = d3.scale.linear()
			    .range([0, width-80]);

			// Our Y scale
			var y = d3.scale.linear()
			    .range([height, 0]);

			// Our color bands
			var color = d3.scale.ordinal()
			    .range(["#004460", "#0070A0", "#008BC6", "#009DE0", "#45B5E5", "8CCDE9", "#DAEBF2"]);    //"#00A6ED",   

			// Use our X scale to set a bottom axis
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			// Smae for our left axis
			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickFormat(d3.format(".2s"));
			    
			var tip = d3.select("body").append("div")
				.attr("class", "sctooltip")
				.style("position", "absolute")
				.style("text-align", "center")
				.style("width", "80px")
				.style("height", "42px")
				.style("padding", "2px")
				.style("font", "11px sans-serif")
				.style("background", "#F0F0FF")
				.style("border", "0px")
				.style("border-radius", "8px")
				.style("pointer-events", "none")
				.style("opacity", 0);
		
		var vis = d3.select("#" + this.sParentId);
		var svg = vis.append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .style("background-color","white")
	    .style("font", "12px sans-serif")
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		x.domain([0, d3.max(data, function (d) {

	    	var max = d3.max(d.values, function (dd){
	    		return(+dd.value);
	    	})
	    	 return max;
	    })]);

	    // Our Y domain is from zero to our highest total
	    y.domain([0, d3.max(data, function (d) {

	    	var max = d3.max(d.values, function (dd){
	    		return(+dd.value2);
	    	})
	    	return max;
	    })]);
	    
	    var totalval = 0;
	    var totalval2 = 0;
	    data.forEach(function (d) {
	        var quarter = d.quarter;
	        d.values.forEach(function (dd){
	        	dd.quarter = quarter;
	        	totalval += +dd.value;
	        	totalval2 += +dd.value2;
	        });
	        
	    });
	    
	    var average = totalval/totalval2;
	    var line_data = [{"x": 0, "y": 0},{"x": (y.domain()[1]*average), "y": y.domain()[1]}];
	    
	    var avgline = d3.svg.line()
	    	.x(function(d){ return x(d.x); })
	    	.y(function(d){ return y(d.y); })
	    	.interpolate("linear");
	   		    

	    svg.append("g")
	        .attr("class", "x axis")
	        .style("fill", "none")
	        .style("stroke", "grey")
	        .style("shape-rendering", "crispEdges")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    svg.append("g")
	        .attr("class", "y-axis")
	        .style("fill", "none")
	        .style("stroke", "grey")
	        .style("shape-rendering", "crispEdges")
	        .call(yAxis);
	    
	    //average line
	    svg.append("path")
	    	.attr("class", "avgline")
	    	.style("stroke", "#000")
	    	.style("stroke-width", "1px")
	    	.style("stroke-dasharray", ("4, 4"))
	    	.attr("d", avgline(line_data));
	    
	    /*
	        .append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 6)
	        .attr("dy", ".71em")
	        .style("text-anchor", "end")
	        .text("XXXXX");
	    */
	    var plot = svg.selectAll(".quarter")
	        .data(data)
	        .enter().append("g");

	    plot.selectAll("dot")
	        .data(function (d) {
	        return d.values;
	    })
	        .enter().append("circle")
	        .attr("class", "dot")
	        .attr("r", 5)
	        .attr("cx", function (d){
	        	return x(d.value);
	        })
	        .attr("cy", function (d) {
	        return y(d.value2);
	    })
	    	.style("stroke", "#004460")
	        .style("fill", function (d) {
	        return color(d.name);
	    })
	    	.style("opacity", .9)
	    	.style("visibility", function(d){
	    		if(+d.value != 0){
	    			return "visible";
	    		}else{
	    			return "hidden";
	    		}
	    	})
	    	.style("pointer-events", "visible")
	    	.on("mouseover", function(d){
		    		tip.transition()
		    			.duration(200)
		    			.style("opacity", .8);
		    		tip.html(d.name + "<br/>" + d.quarter + "<br />" + "Avg. " +(+d.value/+d.value2).toFixed(2))
		    			.style("left", (d3.event.pageX-40) + "px")
		    			.style("top", (d3.event.pageY-50) + "px");
		    			
		    	})
		    	.on("mouseout", function(d){
		    		tip.transition()
		    			.duration(500)
		    			.style("opacity", 0);
		    	});;

	    var legend = svg.selectAll(".legend")
	    .data(color.domain())
	    .enter().append("g")
	    .attr("class", "legend")
	    .attr("transform", function (d, i) {
	    return "translate(0," + i * 16 + ")";
		});

		legend.append("rect")
	    .attr("x", width - 12)
	    .attr("width", 12)
	    .attr("height", 12)
	    .style("fill", color);

		legend.append("text")
	    .attr("x", width - 24)
	    .attr("y", 6)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .style("font", "11px sans-serif")
	    .text(function (d) {
	    return d;
	    });	
		
		var avglabel = svg.append("g")
			.attr("transform", "translate(" + (width-40) + ",140)");
		avglabel.append("text")
			.style("text-anchor", "middle")
			.text("Average: " + average.toFixed(2));
		
	}
	

});