jQuery.sap.declare("sap.jaysdk.Component");

sap.ui.core.UIComponent.extend("sap.jaysdk.Component", {

	createContent : function() {

		// create root view
		var oView = sap.ui.view({
			id : "app",
			viewName : "sap.jaysdk.view.App",
			type : "JS",
			viewData : { component : this }
		});
		
		// set i18n model 
		var i18nModel = new sap.ui.model.resource.ResourceModel({ 
			bundleUrl : "i18n/messageBundle.properties" 
		}); 
		oView.setModel(i18nModel, "i18n");

//		// Using OData model to connect against a real service
//		var url = "/proxy/http/<server>:<port>/sap/opu/odata/sap/ZGWSAMPLE_SRV/";
//		var oModel = new sap.ui.model.odata.ODataModel(url, true, "<user>", "<password>");
//		oView.setModel(oModel);

		// Using a local model for offline development
		var oModel = new sap.ui.model.json.JSONModel("model/hana-rpt-nav.json");
		oView.setModel(oModel, "reports");
		
		var gModel = new sap.ui.model.json.JSONModel("model/minigauges.json");
		sap.ui.getCore().setModel(gModel, "gauges");
		var gModel = new sap.ui.model.json.JSONModel("model/performance-comparison.json");
		sap.ui.getCore().setModel(gModel, "comparison");
		
		
		gModel = new sap.ui.model.json.JSONModel("model/growth-regions-scatter.json");
		sap.ui.getCore().setModel(gModel, "growth-regions-scatter");
		
		gModel = new sap.ui.model.json.JSONModel("model/growth-segment-scatter.json");
		sap.ui.getCore().setModel(gModel, "growth-segment-scatter");
		
		gModel = new sap.ui.model.json.JSONModel("model/growth-regions-details.json");
		sap.ui.getCore().setModel(gModel, "growth-regions-details");
		
		gModel = new sap.ui.model.json.JSONModel("model/inprocess.json");
		sap.ui.getCore().setModel(gModel, "inprocess");
		
		gModel = new sap.ui.model.json.JSONModel("model/top20deals.json");
		sap.ui.getCore().setModel(gModel, "top20deals");
		
		gModel = new sap.ui.model.json.JSONModel("model/top10-regions-details.json");
		sap.ui.getCore().setModel(gModel, "top10-regions-details");
		
		
		// set device model 
		var deviceModel = new sap.ui.model.json.JSONModel({ 
			isPhone : jQuery.device.is.phone, 
			isNoPhone : ! jQuery.device.is.phone, 
			listMode : (jQuery.device.is.phone) ? "None" : "SingleSelectMaster", 
			listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive" 
		}); 
		deviceModel.setDefaultBindingMode("OneWay");
		oView.setModel(deviceModel, "device");
		
		// done
		return oView;
	}
});