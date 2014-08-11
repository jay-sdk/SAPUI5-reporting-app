sap.ui.controller("sap.jaysdk.view.App", {
	
	/**
	 * Navigates to another page
	 * @param {string} pageId The id of the next page
	 * @param {sap.ui.model.Context} context The data context to be applied to the next page (optional)
	 */
	to : function (pageId, context) {
		//console.log(context);
		var app = this.getView().app;
		// load page on demand
		var master = ("Master" === pageId);
		if (app.getPage(pageId, master) === null) {
			var page = sap.ui.view({
				id : pageId,
				viewName : "sap.jaysdk.view." + pageId,
				type : "XML"
			});
			page.getController().nav = this;
			app.addPage(page, master);
			//console.log("app controller > loaded page: " + pageId);
		}
		
		/*
		if (app.getPage("Chart", false) === null) {
			var page = sap.ui.view({
				id : "Chart",
				viewName : "sap.jaysdk.view." + "Chart",
				type : "HTML"
			});
			page.getController().nav = this;
			app.addPage(page, master);
			//console.log("app controller > loaded page: " + "Chart");
		}
		*/
		
		// set data context on the page
		if (context) {
			var page = app.getPage(pageId);
			page.setBindingContext(context, "reports");
			if(pageId=="GrowthRegion"){
				page.rerender();
			}
		}
		
		// show the page
		app.to(pageId);
		
		
		
		
		
	},
	
	/**
	 * Navigates back to a previous page
	 * @param {string} pageId The id of the next page
	 */
	back : function (pageId) {
		this.getView().app.backToPage(pageId);
	}
});