if ( typeof( window.gcCounter ) == "undefined" ) {


	var getTimeZoneData = function() {
		var today = new Date();
		var jan = new Date(today.getFullYear(), 0, 1);
		var jul = new Date(today.getFullYear(), 6, 1);
		var dst = today.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

        return encodeURI(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes());

		return {
			timezone_offset: -(today.getTimezoneOffset()/60),
			timezone_dst: +dst
		};
	};
	try {
	var tz = getTimeZoneData();

	var urlAdd = "";
	if (window.gcsObjectType) {
		urlAdd = "&objectType=" + window.gcsObjectType;
	}
	if (window.gcsObjectId) {
		urlAdd = "&objectId=" + window.gcsObjectId;
	}
	if (window.gcUniqId) {
		urlAdd += '&uniqId='+encodeURIComponent(window.gcUniqId);
	}
	if (window.gcsObjectTypeId) {
		urlAdd += '&objectTypeId='+window.gcsObjectTypeId;
	}
	if (
		undefined !== window.csrfToken &&
		window.csrfToken &&
		undefined !== window.gcSessionId &&
		! window.gcSessionId
	) {
		urlAdd += '&token='+window.csrfToken;
	}

	document.write( "<img style='position: absolute; left:0;top:0' width=1 height=1 id='gccounterImg' src='/stat/counter?ref=" + encodeURIComponent( document.referrer ) + "&loc=" + encodeURIComponent( document.location.href ) + urlAdd + "&tzof=" + tz + "'/>" );
	window.gcCounter = 1;
	}
	catch (e) {
		document.write("<img style='position: absolute; left:0;top:0' width=1 height=1 id='gccounterErrImg' src='/stat/counter-error?err=" + encodeURIComponent(e.message) + "'/>");
	}
}

function gcFixIncident( type, subtype ) {
	var data = {};
	data.type = type;
	data.subtype = subtype;
	data.userId = window.accountUserId;
	data.sessionId = window.gcSessionId;

	ajaxCall( "/pl/stat/counter/fix-incident", data, {}, function( response ) {

	} );
}
