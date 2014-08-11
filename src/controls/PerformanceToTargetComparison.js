jQuery.sap.require("sap/ui/thirdparty/d3");
jQuery.sap.declare("sap.jaysdk.PerformanceToTargetComparison");

sap.ui.core.Element.extend("sap.jaysdk.PerformanceToTargetComparisonItem", { metadata : {
	properties : {
		"region" : {type : "string", group : "Misc", defaultValue : null},
		"budget" : {type : "string", group : "Misc", defaultValue : null},
		"bw" : {type : "string", group : "Misc", defaultValue : null},
		"forecast" : {type : "string", group : "Misc", defaultValue : null}	
	}
}});	
sap.ui.core.Control.extend("sap.jaysdk.PerformanceToTargetComparison", {
	metadata : {
		properties: {
			"title": {type : "string", group : "Misc", defaultValue : "PerformanceToTargetComparison Chart Title"}
		},
		aggregations : {
			"items" : { type: "sap.jaysdk.PerformanceToTargetComparisonItem", multiple : true, singularName : "item"}
		}
		,
		defaultAggregation : "items",
		events: {
			"onPress" : {},
			"onChange":{}		
		}			
	},

	
	init : function() {
		console.log("sap.jaysdk.PerformanceToTargetComparison.init()");
		this.sParentId = "";
	},
	
	
	createComparison : function() {
		/*
		 * Called from renderer
		 */
		console.log("sap.jaysdk.PerformanceToTargetComparison.createComparison()");
		var oComparisonLayout = new sap.m.VBox({alignItems:sap.m.FlexAlignItems.Center,justifyContent:sap.m.FlexJustifyContent.Center});
		var oComparisonFlexBox = new sap.m.FlexBox({height:"auto",alignItems:sap.m.FlexAlignItems.Center});
		/* ATTENTION: Important
		 * This is where the magic happens: we need a handle for our SVG to attach to. We can get this using .getIdForLabel()
		 * Check this in the 'Elements' section of the Chrome Devtools: 
		 * By creating the layout and the Flexbox, we create elements specific for this control, and SAPUI5 takes care of 
		 * ID naming. With this ID, we can append an SVG tag inside the FlexBox
		 */
		this.sParentId=oComparisonFlexBox.getIdForLabel();
		oComparisonLayout.addItem(oComparisonFlexBox);
		
		
		
		return oComparisonLayout;

	},


	/**
	 * The renderer render calls all the functions which are necessary to create the control,
	 * then it call the renderer of the vertical layout 
	 * @param oRm {RenderManager}
	 * @param oControl {Control}
	 */
	renderer : function(oRm, oControl) {
		var layout = oControl.createComparison();

		//layout.addStyleClass('pointer');
		
		// instead of "this" in the renderer function
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
		console.log("sap.jaysdk.PerformanceToTargetComparison.onAfterRendering()");
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
		 * ATTENTION: See .createComparison()
		 * Here we're picking up a handle to the "parent" FlexBox with the ID we got in .createComparison()
		 * Now simply .append SVG elements as desired
		 * EVERYTHING BELOW THIS IS PURE D3.js
		 */
		
		var vis = d3.select("#" + this.sParentId);
		
		var colors = {"pos_bw": "green",
				  "pos_forecast": "darkgreen",
				  "neg_bw": "darkorange",
				  "neg_forecast": "red"};
	
		var numElements = data.length;
		for (var i=0; i<data.length;i++){
			data[i].bw = data[i].bw/data[i].budget;
			data[i].forecast = data[i].forecast/data[i].budget;
			data[i].budget = 1;
		}
		//console.log(data);
		
		var maxval = d3.max(data, function(d){
			return Math.max(d.budget, d.bw, d.forecast);});
		if(maxval<1.6){
			maxval=1.6;
		}
		
		var minval = d3.min(data, function(d){
			return Math.min(d.budget, d.bw, d.forecast);});
		
		var width = 600;
		var offset = 75;
		
		var svg = vis.append("svg").style("background-color","white").attr("width", width).attr("height", numElements*30);
		var xScale = d3.scale.linear().domain([minval, maxval]).range([0, width-(offset+5)]);
		//console.log(minval + " - 0 - " + maxval)
		//console.log(xScale(minval) + " - " + xScale(1) + " - " + xScale(maxval));
		
		var chart;
		
		// 200% line
		if(maxval>2){
			chart= svg.append("g").attr("transform", "translate(" + offset + ",10)");
			chart.append("rect")
				.attr("x", xScale(2))
				.attr("Y", 0)
				.attr("width", 1)
				.attr("height", (numElements-1)*25 + 13)
				.style("fill", "darkgrey");
			chart.append("text").text("200%")
				.attr("text-anchor", "middle")
				.attr("x", xScale(2))
				.attr("y", numElements*25+4)
				.attr("font-family", "sans-serif")
				.attr("font-size", "12px")
				.attr("fill", "darkgrey");
		}
		
		// 300% line
		if(maxval>3.1){
			chart= svg.append("g").attr("transform", "translate(" + offset + ",10)");
			chart.append("rect")
				.attr("x", xScale(3))
				.attr("Y", 0)
				.attr("width", 1)
				.attr("height", (numElements-1)*25 + 13)
				.style("fill", "darkgrey");
			chart.append("text").text("300%")
				.attr("text-anchor", "middle")
				.attr("x", xScale(3))
				.attr("y", numElements*25+4)
				.attr("font-family", "sans-serif")
				.attr("font-size", "12px")
				.attr("fill", "darkgrey");
		}
		
		// 150% line
		if(maxval>1.5 && maxval<3.1){
			chart= svg.append("g").attr("transform", "translate(" + offset + ",10)");
			chart.append("rect")
				.attr("x", xScale(1.5))
				.attr("Y", 0)
				.attr("width", 1)
				.attr("height", (numElements-1)*25 + 13)
				.style("fill", "darkgrey");
			chart.append("text").text("150%")
				.attr("text-anchor", "middle")
				.attr("x", xScale(1.5))
				.attr("y", numElements*25+4)
				.attr("font-family", "sans-serif")
				.attr("font-size", "12px")
				.attr("fill", "darkgrey");
		}
		
		// 150% line
		if(maxval>1.25 && maxval<1.6){
			chart= svg.append("g").attr("transform", "translate(" + offset + ",10)");
			chart.append("rect")
				.attr("x", xScale(1.25))
				.attr("Y", 0)
				.attr("width", 1)
				.attr("height", (numElements-1)*25 + 13)
				.style("fill", "darkgrey");
			chart.append("text").text("125%")
				.attr("text-anchor", "middle")
				.attr("x", xScale(1.25))
				.attr("y", numElements*25+4)
				.attr("font-family", "sans-serif")
				.attr("font-size", "12px")
				.attr("fill", "darkgrey");
		}
		
		// 50% line
		if(minval<0.5){
			chart= svg.append("g").attr("transform", "translate(" + offset + ",10)");
			chart.append("rect")
				.attr("x", xScale(0.5))
				.attr("Y", 0)
				.attr("width", 1)
				.attr("height", (numElements-1)*25 + 13)
				.style("fill", "darkgrey");
			chart.append("text").text("50%")
				.attr("text-anchor", "middle")
				.attr("x", xScale(0.5))
				.attr("y", numElements*25+4)
				.attr("font-family", "sans-serif")
				.attr("font-size", "12px")
				.attr("fill", "darkgrey");
		}
		
		// 75% line
		if(minval<0.75 && minval > 0.4){
			chart= svg.append("g").attr("transform", "translate(" + offset + ",10)");
			chart.append("rect")
				.attr("x", xScale(0.75))
				.attr("Y", 0)
				.attr("width", 1)
				.attr("height", (numElements-1)*25 + 13)
				.style("fill", "darkgrey");
			chart.append("text").text("75%")
				.attr("text-anchor", "middle")
				.attr("x", xScale(0.75))
				.attr("y", numElements*25+4)
				.attr("font-family", "sans-serif")
				.attr("font-size", "12px")
				.attr("fill", "darkgrey");
		}
		
		// Booked/Won Percentage
		chart = svg.append("g").attr("transform", "translate(" + offset + ",10)");
		chart.selectAll(".pttc_bw")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "pttc_bw")
			.attr("x", function(d) {
				if(d.bw<1){
					return xScale(d.bw);
				}else{
					return xScale(1);
				}
			})
			.attr("y", function(d, i){ return 25*i+2;})
			.attr("height", 4)
			.attr("width", function(d){ 
				if(d.bw<1){
					return xScale(1) - xScale(d.bw);
				}else{
					return xScale(d.bw)-xScale(1);
				}
			})
			.style("fill", function(d){ if(d.bw<1){ return colors.neg_bw;} else {return colors.pos_bw;}});
		
		// Forecast Percentage
		chart = svg.append("g").attr("transform", "translate(" + offset + ",10)");
		chart.selectAll(".pttc_forecast")
		.data(data)
		.enter().append("rect")
		.attr("class", "pttc_forecast")
		.attr("x", function(d) {
			if(d.forecast<1){
				return xScale(d.forecast);
			}else{
				return xScale(1);
			}
		})
		.attr("y", function(d, i){ 
			if(d.bw==1){
				return 25*i;
			} else {
				return 25*i+7;}
			})
		.attr("height", function(d){
			if(d.bw==1){
				return 10;
			} else {
				return 4;
			}
		})
		.attr("width", function(d){ 
			if(d.forecast<1){
				return xScale(1) - xScale(d.forecast);
			}else{
				return xScale(d.forecast) - xScale(1);
			}
		})
		.style("fill", function(d){ if(d.forecast<1){ return colors.neg_forecast;} else {return colors.pos_forecast;}});
		
		// Labels
		chart = svg.selectAll(".labels")
		chart.data(data)
			.enter().append("text")
			.attr("class", "labels")
			.attr("text-anchor", "end")
			.attr("x", offset-6)
			.attr("y", function(d, i){ return 25*i + 22})
			.text(function(d){ return d.region;})
			.attr("font-family", "sans-serif")
		   	.attr("font-size", "16px")
		   	.attr("font-weight", "bold")
		   	.attr("fill", "darkgrey");
		
		// 100% line
		chart = svg.append("g").attr("transform", "translate(" + offset + ",10)");
		chart.append("rect")
			.attr("x", xScale(1))
			.attr("Y", 0)
			.attr("width", 1)
			.attr("height", (numElements-1)*25 + 13)
			.style("fill", "grey");
		chart.append("text").text("100%")
			.attr("text-anchor", "middle")
			.attr("x", xScale(1))
			.attr("y", numElements*25+4)
			.attr("font-family", "sans-serif")
			.attr("font-size", "12px")
			.attr("fill", "grey");
			
		
	}
	

});