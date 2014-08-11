jQuery.sap.declare("sap.jaysdk.utils.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ui.core.format.NumberFormat");

sap.jaysdk.utils.Formatter = { 

	date : function (value) { 
		if (value) { 
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm"}); 
			return oDateFormat.format(new Date(value)); 
		} else { 
			return value; 
		} 
	}, 
	
	amount : function (value) { 
		if (value) { 
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				  maxFractionDigits: 0,
				  groupingEnabled: true,
				  groupingSeparator: ","
				});
			return oNumberFormat.format(value); 
		} else { 
			return value; 
		} 
	}, 
	
	quantity : function (value) { 
		try { 
			return (value) ? parseFloat(value).toFixed(0) : value; 
		} catch (err) { 
			return "Not-A-Number"; 
		} 
	}
};