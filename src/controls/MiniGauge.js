jQuery.sap.require("sap/ui/thirdparty/d3");
jQuery.sap.require("sap.jaysdk.utils.Formatter");
jQuery.sap.declare("sap.jaysdk.MiniGauge");

sap.ui.core.Element.extend("sap.jaysdk.MiniGaugeItem", { metadata : {
	properties : {
		"region" : {type : "string", group : "Misc", defaultValue : null},
		"budget" : {type : "string", group : "Misc", defaultValue : null},
		"best" : {type : "string", group : "Misc", defaultValue : null},
		"forecast" : {type : "string", group : "Misc", defaultValue : null},
		"worst" : {type : "string", group : "Misc", defaultValue : null}		
	}
}});	
sap.ui.core.Control.extend("sap.jaysdk.MiniGauge", {
	metadata : {
		properties: {
			"title": {type : "string", group : "Misc", defaultValue : "Minigauge Chart Title"}
		},
		aggregations : {
			"items" : { type: "sap.jaysdk.MiniGaugeItem", multiple : true, singularName : "item"}
		}
		,
		defaultAggregation : "items",
		events: {
			"onPress" : {},
			"onChange":{}		
		}			
	},

	
	init : function() {
		console.log("sap.jaysdk.MiniGauge.init()");
		this.sParentId = "";
	},
	
	
	createGauges : function() {
		console.log("sap.jaysdk.MiniGauge.createGauges()");
		var oMiniGaugeLayout = new sap.m.VBox({alignItems:sap.m.FlexAlignItems.Center,justifyContent:sap.m.FlexJustifyContent.Center});
		var oMiniGaugeFlexBox = new sap.m.FlexBox({height:"auto",alignItems:sap.m.FlexAlignItems.Center});		
		this.sParentId=oMiniGaugeFlexBox.getIdForLabel();
		oMiniGaugeLayout.addItem(oMiniGaugeFlexBox);
		
		
		
		return oMiniGaugeLayout;

	},


	/**
	 * The renderer render calls all the functions which are necessary to create the control,
	 * then it call the renderer of the vertical layout 
	 * @param oRm {RenderManager}
	 * @param oControl {Control}
	 */
	renderer : function(oRm, oControl) {
		var layout = oControl.createGauges();

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
		console.log("sap.jaysdk.MiniGauge.onAfterRendering()");
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
		
		var vis = d3.select("#" + this.sParentId);
		
		var maxval = d3.max(data, function(d){
			return Math.max(d.budget, d.best, d.forecast, d.worst);});
		var cScale = d3.scale.linear()
			.domain([0, maxval])
			.range([0, 1.33 * Math.PI]);
		
		var bgarc = d3.svg.arc()
		.innerRadius(32)
		.outerRadius(52)
		.startAngle(0)
		.endAngle(cScale(maxval));
		
		var budgetarc = d3.svg.arc()
		.innerRadius(35)
		.outerRadius(38)
		.startAngle(0)
		.endAngle(function(d){return cScale(+d.budget);} );
		
		var bestarc = d3.svg.arc()
		.innerRadius(43)
		.outerRadius(45)
		.startAngle(0)
		.endAngle(function(d){return cScale(+d.best);} );
		
		var forecastarc = d3.svg.arc()
		.innerRadius(45)
		.outerRadius(48)
		.startAngle(0)
		.endAngle(function(d){return cScale(+d.forecast);});
		
		var worstarc = d3.svg.arc()
		.innerRadius(48)
		.outerRadius(50)
		.startAngle(0)
		.endAngle(function(d){return cScale(+d.worst);});

		var chart = vis.append("svg").attr("width", 600).attr("height", 110).style("background-color","white").selectAll("path").data(data).enter()
			.append("g").attr("transform", function(d, i){ return "translate(" + ((i*120)+60) + ",60)"});
		chart.append("path")
			.attr("d", bgarc)
			.style("fill", "#EEEEEE")
			.attr("transform", "rotate(-120)");
		chart.append("path")
			.attr("d", budgetarc)
			.style("fill", "darkblue")
			.attr("transform", "rotate(-120)");
		chart.append("path")
			.attr("d", bestarc)
			.style("fill", "green")
			.attr("transform", "rotate(-120)");
		chart.append("path")
			.attr("d", worstarc)
			.style("fill", "red")
			.attr("transform", "rotate(-120)");
		chart.append("path")
			.attr("d", forecastarc)
			.style("fill", "orange")
			.attr("transform", "rotate(-120)");
		chart.append("text")
		    .attr("text-anchor", "middle")
		    .text(function(d) {
		    	return d.region;
		    })
		   	.attr("font-family", "sans-serif")
		   	.attr("font-size", "16px")
		   	.attr("font-weight", "bold")
		   	.attr("fill", "darkgrey");
		
		chart.append("text")
			.attr("transform", "translate(0,24)")
		    .attr("text-anchor", "middle")
		    .text(function(d) {
		    	var formattedFC = sap.jaysdk.utils.Formatter.amount(d.forecast);
		    	return formattedFC;
			})
		   	.attr("font-family", "sans-serif")
		   	.attr("font-size", "14px")
		   	.attr("font-weight", "bold")
		   	.attr("fill", "orange");
		chart.append("text")
			.attr("transform", "translate(0,40)")
		    .attr("text-anchor", "middle")
		    .text(function(d) {
		    	var formattedBG = sap.jaysdk.utils.Formatter.amount(d.budget);
		    	return formattedBG;
			})
		   	.attr("font-family", "sans-serif")
		   	.attr("font-size", "14px")
		   	.attr("font-weight", "bold")
		   	.attr("fill", "darkblue");
		
		
		
	}
	

});