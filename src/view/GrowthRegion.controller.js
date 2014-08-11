jQuery.sap.registerModulePath("sap.jaysdk.StackedBarChart", "controls/StackedBarChart");
jQuery.sap.require("sap.jaysdk.StackedBarChart");
jQuery.sap.registerModulePath("sap.jaysdk.StackedBarChartItem", "controls/StackedBarChart");
jQuery.sap.require("sap.jaysdk.StackedBarChartItem");
jQuery.sap.registerModulePath("sap.jaysdk.ScatterPlot", "controls/ScatterPlot");
jQuery.sap.require("sap.jaysdk.ScatterPlot");
jQuery.sap.registerModulePath("sap.jaysdk.ScatterPlotItem", "controls/StackedBarChart");
jQuery.sap.require("sap.jaysdk.ScatterPlotItem");
jQuery.sap.registerModulePath("sap.jaysdk.HorizontalBarChart", "controls/HorizontalBarChart");
jQuery.sap.require("sap.jaysdk.HorizontalBarChart");
jQuery.sap.registerModulePath("sap.jaysdk.HorizontalBarChartItem", "controls/HorizontalBarChart");
jQuery.sap.require("sap.jaysdk.HorizontalBarChartItem");

sap.ui.controller("sap.jaysdk.view.GrowthRegion", {
	
	handleNavButtonPress : function (evt) {
		this.nav.back("Master");
	},
	
	handleNavBack : function (evt) { 
		this.nav.back("Master"); 
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.GrowthRegion
*/
	onInit: function(evt) {
		console.log("sap.jaysdk.view.GrowthRegion.onInit()");
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.GrowthRegion
*/
	onBeforeRendering: function() {
		console.log(this.getView().getBindingContext("reports").sPath);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.GrowthRegion
*/
	onAfterRendering: function() {
		this._rebindAll();
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.GrowthRegion
*/
//	onExit: function() {
//
//	}
	
	_rebindAll : function() {
		console.log("sap.jaysdk.view.GrowthRegion._rebindAll");
		
		//console.log(this.getView());
		var conpath = this.getView().getBindingContext("reports").sPath;
		var index = conpath.substring(conpath.lastIndexOf("/") +1);
		index = +index -2; //offset for first 2 reports in list
		//console.log(index);
		var filterpath = "/" + index + "/buckets"
		console.log(filterpath);
		
		
		var oStackedBarHolder = this.byId("SegmentStackedBarChartHolder");
		oStackedBarHolder.removeAllItems();
		var oStackedBarItem = new sap.jaysdk.StackedBarChartItem({quarter:"{quarter}", values:"{values}"});
		/* new  chart */
		oStackedBar = new sap.jaysdk.StackedBarChart({
			items: {path : filterpath, template : oStackedBarItem}
		});
		
		var oModel = sap.ui.getCore().getModel("growth-regions-details");
		//console.log(oModel);
		oStackedBar.setModel(oModel);
		oStackedBarHolder.addItem(oStackedBar);
		
		oScatterPlotHolder = this.byId("SegmentScatterPlotHolder");
		//console.log(oScatterPlotHolder);
		oScatterPlotHolder.removeAllItems();
		oScatterPlotItem = new sap.jaysdk.ScatterPlotItem({quarter:"{quarter}", values:"{values}"});
		/* new  chart */
		oScatterPlot = new sap.jaysdk.ScatterPlot({
			items: {path : filterpath, template : oScatterPlotItem}
		});
		
		oScatterPlot.setModel(oModel);
		oScatterPlotHolder.addItem(oScatterPlot);
		//console.log(oScatterPlotHolder);

		var oHorizontalBarHolder = this.byId("HorizontalBarChartHolder");
		oHorizontalBarHolder.removeAllItems();
		var oHorizontalBarItem = new sap.jaysdk.HorizontalBarChartItem({dim1:"{customer}", dim2:"{qualification}", dim3:"{date}", value: "{value}"});
		filterpath = "/" + index + "/deals";
		/* new  chart */
		
		var oHorizontalBar = new sap.jaysdk.HorizontalBarChart({
			items: {path : filterpath, template : oHorizontalBarItem}
		});
		
		//console.log("sap.jaysdk.views.launchPad._rebindAll: setting model");
		var oModel = sap.ui.getCore().getModel("top10-regions-details");
		
		oHorizontalBar.setModel(oModel);
		oHorizontalBarHolder.addItem(oHorizontalBar);
		

	},

});