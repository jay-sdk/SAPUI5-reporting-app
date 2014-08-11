jQuery.sap.require("sap/ui/thirdparty/d3");
jQuery.sap.declare("sap.jaysdk.Chart");

sap.ui.core.Element.extend("sap.jaysdk.ChartItem", { metadata : {
	properties : {
		"region" : {type : "string", group : "Misc", defaultValue : null},
		"budget" : {type : "string", group : "Misc", defaultValue : null},
		"bw" : {type : "string", group : "Misc", defaultValue : null},
		"forecast" : {type : "string", group : "Misc", defaultValue : null}	
	}
}});	
sap.ui.core.Control.extend("sap.jaysdk.Chart", {
	metadata : {
		properties: {
			"title": {type : "string", group : "Misc", defaultValue : "Chart Title"}
		},
		aggregations : {
			"items" : { type: "sap.jaysdk.ChartItem", multiple : true, singularName : "item"}
		}
		,
		defaultAggregation : "items",
		events: {
			"onPress" : {},
			"onChange":{}		
		}			
	},

	
	init : function() {
		console.log("sap.jaysdk.Chart.init()");
		this.sParentId = "";
	},
	
	
	createChart : function() {
		/*
		 * Called from renderer
		 */
		console.log("sap.jaysdk.Chart.createChart()");
		var oChartLayout = new sap.m.VBox({alignItems:sap.m.FlexAlignItems.Center,justifyContent:sap.m.FlexJustifyContent.Center});
		var oChartFlexBox = new sap.m.FlexBox({height:"auto",alignItems:sap.m.FlexAlignItems.Center});
		/* ATTENTION: Important
		 * This is where the magic happens: we need a handle for our SVG to attach to. We can get this using .getIdForLabel()
		 * Check this in the 'Elements' section of the Chrome Devtools: 
		 * By creating the layout and the Flexbox, we create elements specific for this control, and SAPUI5 takes care of 
		 * ID naming. With this ID, we can append an SVG tag inside the FlexBox
		 */
		this.sParentId=oChartFlexBox.getIdForLabel();
		oChartLayout.addItem(oChartFlexBox);
		
		return oChartLayout;

	},


	/**
	 * The renderer render calls all the functions which are necessary to create the control,
	 * then it call the renderer of the vertical layout 
	 * @param oRm {RenderManager}
	 * @param oControl {Control}
	 */
	renderer : function(oRm, oControl) {
		var layout = oControl.createChart();

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
		console.log("sap.jaysdk.Chart.onAfterRendering()");
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
		 * ATTENTION: See .createChart()
		 * Here we're picking up a handle to the "parent" FlexBox with the ID we got in .createChart()
		 * Now simply .append SVG elements as desired
		 * EVERYTHING BELOW THIS IS PURE D3.js
		 */
		
		var vis = d3.select("#" + this.sParentId);
		
		//Your D3.js code HERE
			
		
	}
	

});