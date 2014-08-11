jQuery.sap.require("sap/ui/thirdparty/d3");
jQuery.sap.declare("sap.jaysdk.HorizontalBarChart");

sap.ui.core.Element.extend("sap.jaysdk.HorizontalBarChartItem", { metadata : {
	properties : {
		"dim1" : {type : "string", group : "Misc", defaultValue : null},
		"dim2" : {type : "string", group : "Misc", defaultValue : null},
		"dim3" : {type : "string", group : "Misc", defaultValue : null},
		"value" : {type : "string", group : "Misc", defaultValue : null}	
	}
}});	
sap.ui.core.Control.extend("sap.jaysdk.HorizontalBarChart", {
	metadata : {
		properties: {
			"title": {type : "string", group : "Misc", defaultValue : "HorizontalBarChart Title"}
		},
		aggregations : {
			"items" : { type: "sap.jaysdk.HorizontalBarChartItem", multiple : true, singularName : "item"}
		}
		,
		defaultAggregation : "items",
		events: {
			"onPress" : {},
			"onChange":{}		
		}			
	},

	
	init : function() {
		console.log("sap.jaysdk.HorizontalBarChart.init()");
		this.sParentId = "";
	},
	
	
	createHorizontalBarChart : function() {
		/*
		 * Called from renderer
		 */
		console.log("sap.jaysdk.HorizontalBarChart.createHorizontalBarChart()");
		var oHorizontalBarChartLayout = new sap.m.VBox({alignItems:sap.m.FlexAlignItems.Center,justifyContent:sap.m.FlexJustifyContent.Center});
		var oHorizontalBarChartFlexBox = new sap.m.FlexBox({height:"auto",alignItems:sap.m.FlexAlignItems.Center});
		/* ATTENTION: Important
		 * This is where the magic happens: we need a handle for our SVG to attach to. We can get this using .getIdForLabel()
		 * Check this in the 'Elements' section of the Chrome Devtools: 
		 * By creating the layout and the Flexbox, we create elements specific for this control, and SAPUI5 takes care of 
		 * ID naming. With this ID, we can append an SVG tag inside the FlexBox
		 */
		this.sParentId=oHorizontalBarChartFlexBox.getIdForLabel();
		oHorizontalBarChartLayout.addItem(oHorizontalBarChartFlexBox);
		
		return oHorizontalBarChartLayout;

	},


	/**
	 * The renderer render calls all the functions which are necessary to create the control,
	 * then it call the renderer of the vertical layout 
	 * @param oRm {RenderManager}
	 * @param oControl {Control}
	 */
	renderer : function(oRm, oControl) {
		var layout = oControl.createHorizontalBarChart();

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
		console.log("sap.jaysdk.HorizontalBarChart.onAfterRendering()");
		console.log(this.sParentId);
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
		 * ATTENTION: See .createHorizontalBarChart()
		 * Here we're picking up a handle to the "parent" FlexBox with the ID we got in .createHorizontalBarChart()
		 * Now simply .append SVG elements as desired
		 * EVERYTHING BELOW THIS IS PURE D3.js
		 */
		
		// Sort by value
	    data.sort(function (a, b) {
	        return b.value - a.value;
	    });
		
		var vis = d3.select("#" + this.sParentId);
		
		var margin = {
			    top: 15,
			    right: 10,
			    bottom: 10,
			    left: 10
			},
			width = 600 - margin.left - margin.right,
			barOffset = 290;
			
		var barHeight = 38;

		// Our X scale
		var x = d3.scale.linear()
			.range([0, width-barOffset]);
			
		x.domain([0, d3.max(data, function (d) {
			return +d.value;
		})]);

		var height = data.length*barHeight;
			
			
		var svg = vis.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("background-color","white")
			.append("g")
			.attr("width", width)
			.attr("height", height)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var bar = svg.selectAll("bars")
			.data(data)
			.enter().append("g")
			.attr("class", "bars")
			.attr("transform", function(d,i){
					return "translate(" + barOffset + "," + i*barHeight + ")";	
			});

		bar.append("rect")
			.attr("width", function(d){ return x(d.value); })
			.attr("height", barHeight-2)
			.style("fill", "#009DE0");
			
		bar.append("text")
			.attr("x", function(d) { 
				if(x(d.value) > 42){
					return x(d.value) - 4; 
				} else {
					return x(d.value) + 4;
				}
			})
		    .attr("y", barHeight / 2)
		    .attr("dy", ".35em")
		    .style("text-anchor", function(d) {
		    	if(x(d.value) > 42){
					return "end"; 
				} else {
					return "start";
				}
		    })
		    .style("fill", function(d) {
		    	if(x(d.value) > 42){
					return "white"; 
				} else {
					return "#009DE0";
				}
		    })
		  	.style("font", "14px sans-serif")
		  	.style("font-weight", "bold")
		    .text(function(d) { return d.value; });

		var label = svg.selectAll("labels")
			.data(data)
			.enter().append("g")
			.attr("class", "labels")
			.attr("transform", function(d,i){
					return "translate(0," + i*barHeight + ")";	
			});
			
		label.append("text")
			.attr("x", barOffset-4)
			.attr("y", barHeight/3)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.style("font", "14px sans-serif")
			.style("font-weight", "bold")
			.text(function(d){
				return d.dim1;
			});
			
		label.append("text")
			.attr("x", barOffset-4)
			.attr("y", (barHeight/3)*2)
			.attr("dy", ".5em")
			.style("fill", "grey")
			.style("text-anchor", "end")
			.style("font", "10px sans-serif")
			.text(function(d){
				return d.dim2 + " (" + d.dim3 + ") ";
			});
			
		
	}
	

});