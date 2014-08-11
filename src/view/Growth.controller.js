jQuery.sap.registerModulePath("sap.jaysdk.StackedBarChart", "controls/StackedBarChart");
jQuery.sap.require("sap.jaysdk.StackedBarChart");
jQuery.sap.registerModulePath("sap.jaysdk.StackedBarChartItem", "controls/StackedBarChart");
jQuery.sap.require("sap.jaysdk.StackedBarChartItem");
jQuery.sap.registerModulePath("sap.jaysdk.ScatterPlot", "controls/ScatterPlot");
jQuery.sap.require("sap.jaysdk.ScatterPlot");
jQuery.sap.registerModulePath("sap.jaysdk.ScatterPlotItem", "controls/StackedBarChart");
jQuery.sap.require("sap.jaysdk.ScatterPlotItem");

sap.ui.controller("sap.jaysdk.view.Growth", {
	
	handleNavButtonPress : function (evt) {
		this.nav.back("Master");
	},
	
	handleNavBack : function (evt) { 
		this.nav.back("Master"); 
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Growth
*/
	onInit: function() {
		this._rebindAll();
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Growth
*/
	onBeforeRendering: function() {
		console.log("sap.jaysdk.view.Growth.onBeforeRendering()");
	},
	
	
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Growth
*/
	onAfterRendering: function() {
		//this._rebindAll();
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Growth
*/
//	onExit: function() {
//
//	}
	
	
	_rebindAll : function() {
		console.log("sap.jaysdk.view.Growth._rebindAll");
		var oStackedBarHolder = this.byId("RegionStackedBarChartHolder");
		var oStackedBarItem = new sap.jaysdk.StackedBarChartItem({quarter:"{quarter}", values:"{values}"});
		/* new  chart */
		var oStackedBar = new sap.jaysdk.StackedBarChart({
			items: {path : "/buckets", template : oStackedBarItem}
		});
		
		//console.log("sap.jaysdk.views.launchPad._rebindAll: setting model");
		var oModel = sap.ui.getCore().getModel("growth-regions-scatter");
		
		oStackedBar.setModel(oModel);
		oStackedBarHolder.addItem(oStackedBar);
		
		var oScatterPlotHolder = this.byId("RegionScatterPlotHolder");
		var oScatterPlotItem = new sap.jaysdk.ScatterPlotItem({quarter:"{quarter}", values:"{values}"});
		/* new  chart */
		var oScatterPlot = new sap.jaysdk.ScatterPlot({
			items: {path : "/buckets", template : oScatterPlotItem}
		});
		
		//var oModel = sap.ui.getCore().getModel("growth-regions-scatter");
		
		oScatterPlot.setModel(oModel);
		oScatterPlotHolder.addItem(oScatterPlot);
		
		
		oStackedBarHolder = this.byId("SegmentStackedBarChartHolder");
		oStackedBarItem = new sap.jaysdk.StackedBarChartItem({quarter:"{quarter}", values:"{values}"});
		/* new  chart */
		oStackedBar = new sap.jaysdk.StackedBarChart({
			items: {path : "/buckets", template : oStackedBarItem}
		});
		
		var oModel = sap.ui.getCore().getModel("growth-segment-scatter");
		
		oStackedBar.setModel(oModel);
		oStackedBarHolder.addItem(oStackedBar);
		
		oScatterPlotHolder = this.byId("SegmentScatterPlotHolder");
		oScatterPlotItem = new sap.jaysdk.ScatterPlotItem({quarter:"{quarter}", values:"{values}"});
		/* new  chart */
		oScatterPlot = new sap.jaysdk.ScatterPlot({
			items: {path : "/buckets", template : oScatterPlotItem}
		});
		
		//oModel = sap.ui.getCore().getModel("growth-segment-scatter");
		
		oScatterPlot.setModel(oModel);
		oScatterPlotHolder.addItem(oScatterPlot);

		

	},

});