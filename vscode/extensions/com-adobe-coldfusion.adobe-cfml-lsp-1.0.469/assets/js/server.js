let validationRules = {
    // general
    "generalTab": {
        "name": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.general.SERVER_NAME_WARNING" )
            },
            {
                "enabled": true,
                "type": "checkServerExists",
                "msg": localize( "adobe-cfml.server.tabs.general.SERVER_NAME_EXIST" )
            }
        ],
        "host": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.general.host" )
            }
        ],
        "port": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.general.port" )
            },
            {
                "enabled": true,
                "type": "number",
                "msg": localize( "adobe-cfml.server.tabs.general.port.number" )
            }
        ],
        "RDSUsername": [
            {
                "enabled": false,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.general.RDS_USERNAME_INFO" )
            }
        ],
        "RDSPassword": [
            {
                "enabled": false,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.general.RDS_PASSWORD_INFO" )
            }
        ]
    },

    // server
    "serverTab": {
        // local server - CF+Tomcat bundle
        "documentRoot": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.server.documentRoot" ),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "local",
                        "operator": "eq"
                    },
                    {
                        "elem": "applicationServer",
                        "value": "CF+Tomcat Bundle",
                        "operator": "eq"
                    }
                ]
            },
            {
                "enabled": true,
                "type": "validatePath",
                "msg": localize("adobe-cfml.server.tabs.server.folderDoesNotExist")
            }
        ],

        "serverHome": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.server.serverHome" ),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "local",
                        "operator": "eq"
                    },
                    {
                        "elem": "applicationServer",
                        "value": "CF+Tomcat Bundle",
                        "operator": "eq"
                    }
                ]
            },
            {
                "enabled": true,
                "type": "validateServerHome",
                "msg": localize( "adobe-cfml.server.tabs.server.invalidServerHome" )
            },
            {
                "enabled": true,
                "type": "validatePath",
                "msg": localize( "adobe-cfml.server.tabs.server.folderDoesNotExist" )
            }
        ],

        // remote server - CF+Tomcat Bundle
        "adminPort": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.server.adminPort" ),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "remote",
                        "operator": "eq"
                    },
                    {
                        "elem": "applicationServer",
                        "value": "CF+Tomcat Bundle",
                        "operator": "eq"
                    }
                ],
            },
            {
                "enabled": true,
                "type": "number",
                "msg": localize("adobe-cfml.server.tabs.server.port.number"),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "remote",
                        "operator": "eq"
                    },
                    {
                        "elem": "applicationServer",
                        "value": "CF+Tomcat Bundle",
                        "operator": "eq"
                    }
                ],
            }
        ],
        "AdminSrvName": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.server.adminServerName" ),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "remote",
                        "operator": "eq"
                    },
                    {
                        "elem": "applicationServer",
                        "value": "CF+Tomcat Bundle",
                        "operator": "eq"
                    }
                ]
            }
        ],
        "userName": [
            {
                "enabled": false,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.server.username_warning" ),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "remote",
                        "operator": "eq"
                    },
                    {
                        "elem": "applicationServer",
                        "value": "CF+Tomcat Bundle",
                        "operator": "eq"
                    }
                ]
            }
        ],
        "password": [
            {
                "enabled": false,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.server.remotePassword" ),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "remote",
                        "operator": "eq"
                    },
                    {
                        "elem": "applicationServer",
                        "value": "CF+Tomcat Bundle",
                        "operator": "eq"
                    }
                ],
            }
        ],
        "ServerDocRoot": [
            {
                "enabled": false,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.server.documentRoot" ),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "remote",
                        "operator": "eq"
                    },
                    {
                        "elem": "applicationServer",
                        "value": "CF+Tomcat Bundle",
                        "operator": "eq"
                    }
                ],
            }
        ],

        // local or remote server - Other ( J2EE )
        "otherServerDocumentRoot": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.server.documentRoot" ),
                "conditions": [
                    {
                        "elem": "applicationServer",
                        "value": "Other",
                        "operator": "eq"
                    }
                ],
            },
            {
                "enabled": true,
                "type": "validatePath",
                "msg": localize("adobe-cfml.server.tabs.server.folderDoesNotExist")
            }
        ]
    },

    // mappings or URL prefix
    "mappingsTab": {
        "localPath": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.mapping.localPath" ),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#mappingModal",
                        "operator": "eq"
                    }
                ]
            },
            {
                "enabled": true,
                "type": "validExistLocalPath",
                "msg": localize( "adobe-cfml.server.tabs.mapping.remotePath.duplicate" ),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#mappingModal",
                        "operator": "eq"
                    }
                ]
            },
            {
                "enabled": true,
                "type": "validatePath",
                "msg": localize("adobe-cfml.server.tabs.server.folderDoesNotExist")
            }
        ],
        "remotePath": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.mapping.remotePathOrUrlPrefix" ),
                "conditions": [
                    {
                        "elem": "type",
                        "value": "remote",
                        "operator": "eq"
                    },
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#mappingModal",
                        "operator": "eq"
                    },
                    {
                        "elem": "urlPrefix",
                        "value": "",
                        "operator": "eq"
                    }
                ]
            }
        ],
        "urlPrefix": [
            {
                "enabled": true,
                "type": "required",
                "msg": $( "input[name='type']:checked" ).val() == "local" ? localize( "adobe-cfml.server.tabs.mapping.urlPrefix" ) : localize( "adobe-cfml.server.tabs.mapping.remotePathOrUrlPrefix" ),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#mappingModal",
                        "operator": "eq"
                    },
                    {
                        "elem": "remotePath",
                        "value": "",
                        "operator": "eq"
                    }
                ]
            }
        ]
    },

    // virtual host
    "virtualHostTab": {
        "virtualName": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize("adobe-cfml.server.tabs.virtualHost.virtualName"),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#virtualHostModal",
                        "operator": "eq"
                    }
                ]
            }
        ],
        "virtualHostName": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize("adobe-cfml.server.tabs.virtualHost.virtualHostName"),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#virtualHostModal",
                        "operator": "eq"
                    }
                ]
            }
        ],
        "virtualPort": [
            {
                "enabled": true,
                // "type": "required",
                // "msg": localize( "adobe-cfml.server.tabs.virtualHost.port" ),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#virtualHostModal",
                        "operator": "eq"
                    }
                ]
            },
            {
                "enabled": true,
                "type": "number",
                "msg": localize("adobe-cfml.server.tabs.virtualHost.port.number"),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#virtualHostModal",
                        "operator": "eq"
                    }
                ]
            }
        ],
        "virtualHostDocumentRoot": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize("adobe-cfml.server.tabs.virtualHost.virtualHostDocumentRoot"),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#virtualHostModal",
                        "operator": "eq"
                    }
                ]
            },
            {
                "enabled": true,
                "type": "validatePath",
                "msg": localize( "adobe-cfml.server.tabs.server.folderDoesNotExist" )
            }
        ],
        "alias": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.virtualHosts.virtualDirectory.alias" ),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#virtualHostModal",
                        "operator": "eq"
                    }
                ]
            }
        ],
        "physicalPathRoot": [
            {
                "enabled": true,
                "type": "required",
                "msg": localize( "adobe-cfml.server.tabs.virtualHosts.virtualDirectory.physicalPathRoot" ),
                "conditions": [
                    {
                        "var": "isModalOpened",
                        "value": true,
                        "operator": "eq"
                    },
                    {
                        "var": "currModalId",
                        "value": "#virtualHostModal",
                        "operator": "eq"
                    }
                ]
            }
        ]
    }
};
let existsFields = {
    serverHome : true,
    documentRoot : true,
    localPath : true,
    virtualHostDocumentRoot : true
};

const vscode = acquireVsCodeApi();

let allTabs = [ "#generalTab", "#serverTab", "#mappingsTab", "#virtualHostTab" ];
let activeTab = "#generalTab";
let isActiveTabValid = false;
let tmpTabValid = false;
let isFormValid = false;
let isModalFormValid = false;
let isFormSubmitTried = false;
let isModalOpened = false;
let currModalId = "";
let validateVD = false;
let isValidServerHome = true;

const validateForm = ( showErrorMsg ) => {
    let tmpFormValid = true;
    let tmpModalFormValid = true;
    let tmpActiveTabValid = true;
    let firstInvalidTab = "";
    // set validateVD as true as need to validate VD input
    $( '#alias' ).on( 'input' , function (e) {
        validateVD = true;
    });
    isFormSubmitTried = showErrorMsg ? showErrorMsg : isFormSubmitTried;

    // Loop through all tabs
    allTabs.forEach( ( tmpTab ) => {
        tmpTabValid = validateTab( showErrorMsg, tmpTab );
        if( isFormSubmitTried && !tmpTabValid && firstInvalidTab == "" ) {
            firstInvalidTab = tmpTab;
        }
        // console.log( "console :: tab :: tmpTabValid :: ", tmpTab, tmpTabValid );
        if( tmpTab == "#generalTab" || tmpTab =="#serverTab" ) {
            if( tmpTab == activeTab ) {
                tmpActiveTabValid &&= tmpTabValid;
            }
            tmpFormValid &&= tmpTabValid;
        } else {
            // TODO: always set tmpTabValid as true for mapping / vhost ( This needs to be removed after fixing the issues )
            // tmpTabValid = true;
            tmpModalFormValid &&= tmpTabValid;
        }
    });

    // set isActiveTabValid & isFormValid
    isActiveTabValid = tmpActiveTabValid;
    isFormValid = tmpFormValid;
    isModalFormValid = tmpModalFormValid;

    if( firstInvalidTab != "" ) {
        // Move the user to the corresponding invalid tab
        gotoTab( firstInvalidTab, isFormSubmitTried );
    }

    // console.log( "console :: activeTab, isActiveTabValid, isFormValid :: isFormSubmitTried :: ", activeTab, isActiveTabValid, isFormValid, isFormSubmitTried );
    toggleButtonsState( activeTab, isFormValid, isActiveTabValid, isModalFormValid );

    // set validateVD as false as validation done above
    validateVD = false;
    if( activeTab == "#generalTab" || activeTab == "#serverTab" ) {
        return tmpFormValid;
    } else {
        return isModalFormValid;
    }

}

function isConditionsSatisfied( rule ) {
    var tmpSatisfied = true;
    var operators = {
        "eq": function( a, b ) { return a == b },
        "neq": function( a, b ) { return a != b }
    };

    // create new variables below, if it needs to be added in a condition
    var allVars = {
        type: $( "input[name='type']:checked" ).val(),
        applicationServer: $( "#applicationServer" ).val(),
        remotePath: $( "#remotePath" ).val(),
        urlPrefix: $( "#urlPrefix" ).val(),
        isModalOpened: isModalOpened,
        currModalId: currModalId
    };

    if( rule.hasOwnProperty( "conditions" ) && rule.conditions.length ) {
        var allConditions = rule.conditions;

        allConditions.forEach( ( condition, idx ) => {
            var currVal = condition.elem ? condition.elem : condition.var;
            // check the conditions with operator callback defined above
            if( !operators[ condition.operator ]( allVars[ currVal ], condition.value ) ) {
                tmpSatisfied = false;
                // just for breaking the loop
                return false;
            }
        });
    }
    // console.log( "isConditionsSatisfied", tmpSatisfied, allConditions );
    return tmpSatisfied;
}

function validateTab( showErrorMsg, tmpTab ) {
    let tmpFormValid = true;
    let tmpThisElemValid = true;
    let tmpTabValid = true;
    let vdFields = [ "alias", "physicalPathRoot" ];
    for ( let elem in validationRules[tmpTab.replace("#", "" ) ] ) {
        if ( vdFields.includes( elem ) && !validateVD ) {
            break;
        }
        tmpThisElemValid = validateField( showErrorMsg,tmpTab, elem );

        tmpTabValid = tmpTabValid && tmpThisElemValid;
    }

    tmpFormValid = tmpFormValid && tmpTabValid;
    return tmpFormValid;
}

function validateField(showErrorMsg, tmpTab, elem ){
    let tmpFormValid = true;
    let tmpTabValid = true;
    let thisElemRules = validationRules[tmpTab.replace( "#", "" )][ elem ];
    let thisValue = $( "#" + elem).val().trim();
    let tmpThisElemValid = true;
    let tmpThisElemError = "";

    thisElemRules.forEach( function ( thisRule ) {
        let tmpThisRuleValid = true;
        let tmpThisRuleError = "";

        if ( thisRule.enabled && isConditionsSatisfied( thisRule ) ) {
            // set error msg here for all rules, but show only if the rule is not valid
            switch ( thisRule.type ) {
                case "required":
                    if ( thisValue == "" ) {
                        tmpThisRuleError = thisRule.msg;
                        tmpThisRuleValid = false;
                    }
                    break;

                case "number":
                    if (thisValue != "" && !$.isNumeric( thisValue ) ) {
                        tmpThisRuleError = thisRule.msg;
                        tmpThisRuleValid = false;
                    }
                    break;

                case "validateServerHome":
                    if ( !isValidServerHome && thisValue != "" && existsFields[ elem ]  )  {
                        tmpThisRuleValid = false;
                        tmpThisRuleError = thisRule.msg;
                    }
                    break;
                case "validatePath":
                    if ( thisValue != "" && !existsFields[ elem ] ) {
                        tmpThisRuleValid = false;
                        tmpThisRuleError = thisRule.msg;
                    }
                    break;

                case "checkServerExists":
                    if ( checkServerExists($("#id").val()) ) {
                        tmpThisRuleValid = false;
                        tmpThisRuleError = thisRule.msg;
                    }
                    break;
                case "validExistLocalPath":
                    if ( validExistLocalPath($("#localPath").val(), $("input[name='type']:checked").val()) ) {
                        tmpThisRuleValid = false;
                        tmpThisRuleError = thisRule.msg;
                    }
                    break;
                default:
                    break;
            }
            // if( tmpTab == "#virtualHostTab" )
            // if ( tmpTab == "#mappingsTab" )
                // console.log("console :: 1 :: tmpThisElemValid :: tmpThisRuleValid :: thisRule :: ", tmpThisElemValid, tmpThisRuleValid, thisRule);
        }

        tmpThisElemValid = tmpThisElemValid && tmpThisRuleValid;
        tmpThisElemError = tmpThisElemError + "\n" + tmpThisRuleError;
    });
    // console.log("console :: 2:: tmpTab :: tmpFormValid :: tmpTabValid :: ", tmpTab, tmpFormValid, tmpTabValid);

    if ( !tmpThisElemValid ) {
        // console.log( "tmpThisElemValid", tmpThisElemValid );
        // show error messages if needed
        $( "#error_" + elem ).show();
        $("#error_" + elem).text( tmpThisElemError );
    } else if ( tmpThisElemValid ) {
        // hide if valid or not intended to validate
        $("#error_" + elem).hide();
        $("#error_" + elem).text("");
    }
    tmpTabValid = tmpTabValid && tmpThisElemValid;
    tmpFormValid = tmpFormValid && tmpTabValid;
    return tmpFormValid;
}

// function validateServerHome() {
// 	let path = /(\\\\?([^\\/]*[\\/])*)([^\\/]+)$/g;
//     let isValid = true;
//     var os = getOS();
//     if( os == "Linux" ){
//         if ( !linuxPathValidation( document.getElementById( "serverHome" ).value ) ) {
//             isValid = false;
//         }
//     } else {
//         if ( !path.test( document.getElementById( "serverHome" ).value ) ) {
//             isValid = false;
//         }
//     }
// 	return isValid;
// }

function linuxPathValidation( contPathLinux ) {
	for ( var k = 0; k < contPathLinux.length; k++ ) {
		if ( contPathLinux.charAt(k).match(/^[\\]$/) ) {
			return false;
		}
	}
	if ( contPathLinux.charAt(0) != "/" ) {
		return false;
	}
	if ( contPathLinux.charAt(0) == "/" && contPathLinux.charAt(1) == "/" ) {
		return false;
	}
	return true;
}

function getOS() {
	var userAgent = window.navigator.userAgent,
		platform = window.navigator.platform,
		macosPlatforms = [ "Macintosh", "MacIntel", "MacPPC", "Mac68K" ],
		windowsPlatforms = [ "Win32", "Win64", "Windows", "WinCE" ],
		iosPlatforms = [ "iPhone", "iPad", "iPod" ],
		os = null;

	if ( macosPlatforms.indexOf( platform ) !== -1 ) {
		os = 'Mac OS';
	} else if ( iosPlatforms.indexOf( platform ) !== -1 ) {
		os = 'iOS';
	} else if ( windowsPlatforms.indexOf( platform ) !== -1 ) {
		os = 'Windows';
	} else if ( /Android/.test( userAgent ) ) {
		os = 'Android';
	} else if ( !os && /Linux/.test( platform ) ) {
		os = 'Linux';
	}
	return os;
}

function openFolderPicker( key ) {
	vscode.postMessage({
		command: "openFolderPicker",
		text: getFormValues( key ),
        activeTab: activeTab
	});
}

function fileExists( key ) {
    vscode.postMessage({
        command: "fileExists",
        text: getFormValues( key ),
        activeTab: activeTab,
        path: $( "#"+ key).val().trim(),
        serverHome: $( "#serverHome" ).val().trim(),
    });
}

const gotoTab = ( tab, isFormSubmitted ) => {
    if( typeof tab == "undefined" ) {
        tab = "#generalTab";
    }
    if( typeof isFormSubmitted == "undefined" ) {
        isFormSubmitted = false;
    }

    // switch to correct tab
    $( ".nav-link" ).removeClass( "active" );
    $( ".nav-link[href='" + tab + "']" ).addClass( "active" );
    // switch to correct tab-pane
    $( ".tab-pane" ).removeClass( "show active" );
    $( tab ).addClass( "show active" );

    activeTab = tab;
    isFormSubmitTried = isFormSubmitted;
    $( "#backBtn" ).prop( "disabled", activeTab == "#generalTab" );
    $( "#nextBtn" ).prop( "disabled", activeTab == "#virtualHostTab" );
    // validateForm( isFormSubmitTried );
}

const prevTab = () => {
    let currTabIndex = allTabs.findIndex( function( elem ) {
        return elem == activeTab;
    });

    if( currTabIndex == -1 && currTabIndex != 0  ) {
        // TODO: Need to add some mesaage
        // May be this is not possible, if everything is developed properly
    }
    gotoTab( allTabs[ currTabIndex - 1 ], isFormSubmitTried );
}

const nextTab = () => {
    let isValid = validateTab( true, activeTab );
    if( isValid ){
        let currTabIndex = allTabs.findIndex( function( elem ) {
            return elem == activeTab;
        });
        // console.log("currTabIndex ::", currTabIndex);

        if( currTabIndex == -1 && currTabIndex != allTabs.length-1  ) {
            // TODO: Need to add some mesaage
            // May be this is not possible, if everything is developed properly

        }
        gotoTab( allTabs[ currTabIndex + 1 ], isFormSubmitTried );
    }
}

const toggleButtonsState = ( activeTab, isFormValid, isActiveTabValid, isModalFormValid ) => {
    // disable if form is not valid
    // $( "#submitBtn" ).prop( "disabled", !isFormValid );

    // TODO: need to change somehow which button needs to be disabled / enabled
    // disable button on modal if modal form is not valid
    // $( "#mappingAddButton" ).prop( "disabled", !isModalFormValid );
    if( !validateVD )
        $( "#virtualHostAddButton" ).prop( "disabled", !isModalFormValid );
    $( "#vitrualDirectoryAddButton" ).prop( "disabled", !isModalFormValid );

    // disable if active tab is virtual host or form is not valid
    // $( "#nextBtn" ).prop( "disabled", ( activeTab == "#virtualHostTab" || !isActiveTabValid ) );
    $( "#nextBtn" ).prop( "disabled", ( activeTab == "#virtualHostTab" ) );

    // disable if active tab is general
    $( "#backBtn" ).prop( "disabled", activeTab == "#generalTab" );
}

function storeData() {
    if( validateForm( true ) ) {
        var type = null;
        var ssl = null;

        if( document.getElementById( "typeLocal" ).checked ) {
            type = document.getElementById( "typeLocal" ).value;
        } else if( document.getElementById( "typeRemote" ).checked) {
            type = document.getElementById( "typeRemote" ).value;
        }

        let servers = document.getElementById( "servers" ).value.trim();
        let serverID = document.getElementById( "id" ).value.trim();

        servers = servers.replace(/'/g, '\"');
        let getServerDetails = JSON.parse( servers.replace(/'/g, '\"')).filter( server => server.id == serverID );

        ssl = document.getElementById( "enableSSL" ).checked;

		var formDatas = document.forms[0];
        let config = {
            "id": formDatas.id.value,
            "name": formDatas.name.value,
            "description": formDatas.description.value,
            "appServer": document.getElementById( "applicationServer" ).value.trim(),
            "host": formDatas.host.value,
            "port": formDatas.port.value,
            "contextRoot": document.getElementById( "contextRoot" ).value,
            "appServerName": formDatas.appServerName.value,
            "version": formDatas.version.value,
            "RDSUsername": formDatas.RDSUsername.value,
            "RDSPassword": formDatas.RDSPassword.value,
            "enableSSL": ssl,
            "useServiceMethod": $( "#useServiceMethod" ).prop( "checked" ),
            "serviceMethodVersion": document.getElementById( "serviceMethodVersion" ).value,
            "autoStart": formDatas.autoStart.value,
            "autoStop": formDatas.autoStop.value,
            "type": type,
            "serverHome": document.getElementById( "serverHome" ).value,
            "documentRoot": document.getElementById( "documentRoot" ).value,
            "otherServerDocumentRoot": document.getElementById( "otherServerDocumentRoot" ).value,
            "RDSOnly":false,
            "RDSShow":true,
            "mappings": readMappingData( type ),
            "debugMappings": getServerDetails.length && getServerDetails[0].debugMappings ? getServerDetails[0].debugMappings : [],
            "virtualDatas": readvirtualHostData(),
        }

        if( type === "remote" ) {
            var remote_config = {
                "adminPort": formDatas.adminPort.value,
                "userName": formDatas.userName.value,
                "password": formDatas.password.value,
                "AdminSrvName": formDatas.AdminSrvName.value,
                "AdminSrvCtxRoot": formDatas.AdminSrvCtxRoot.value,
                "ServerDocRoot": document.getElementById( "ServerDocRoot" ).value
            }
        } else {
            var remote_config = {
                "adminPort": 8995,
                "userName": "",
                "password": "",
                "AdminSrvName": "",
                "AdminSrvCtxRoot": "AdminServlet",
                "ServerDocRoot": ""
            }
        }

        config = {
            ...config,
            ...remote_config
        };

        let value = [];
        value = [ ...value, config ];
        var configJSON = JSON.stringify( value );

        vscode.postMessage( { command: "save", text: configJSON } );
        // document.getElementById( "addServer" ).reset();
        // document.getElementById( "id" ).value = Math.random().toString( 36 ).substr( 2, 9 );
    }
}

function toggleServerTypeSelection() {
    toggleServerTabFields();
    // if we changed from remote to local, we need to get the old path from #ServerDocRoot ( only standalone server )
    // if we changed from local to remote, we need to get the old path from #documentRoot ( only standalone server )
    let documentRoot = $( "input[name='type']:checked" ).val() === "local" ? $( "#ServerDocRoot" ).val() : $( "#documentRoot" ).val();
    if( $( "#applicationServer" ).val() == "Other" ) {
        // we need to get the old path from #otherServerDocumentRoot for bothe local/remote JEE server
        documentRoot = $( "#otherServerDocumentRoot" ).val();
    }

    vscode.postMessage({
        command: "showTypeChangeWarning",
        serverId: $( "#id" ).val(),
        documentRoot: documentRoot,
        mappingTableLength: $( "#mappings_data_table tr" ).length - 1,
        mappingDatas: getMappings()
    });
}

function toggleapplicationServerSelection() {
    toggleServerTabFields();
    let type = $( "input[name='type']:checked" ).val();
    let documentRoot = "";

    /*
        standalone-local -> documentRoot
        standalone-remote -> ServerDocRoot
        other-local -> otherServerDocumentRoot
        other-remote -> otherServerDocumentRoot
    */

    if( $( "#applicationServer" ).val() != "Other" ) {
        // if it is either local or remote server, we need to get the old path from #otherServerDocumentRoot
        documentRoot = $( "#otherServerDocumentRoot" ).val();
    } else {
        // if it is a local server, we need to get the old path from #documentRoot
        // if it is a remote server, we need to get the old path from #ServerDocRoot
        documentRoot = type === "local" ? $( "#documentRoot" ).val() : $( "#ServerDocRoot" ).val();
    }

    vscode.postMessage({
        command: "alertForChangeApplicationServer",
        value: $( "#applicationServer" ).val(),
        msg: localize( "adobe-cfml.server.tabs.general.appServer.alert" ),
        documentRoot: documentRoot
    })
}

function toggleServerTabFields() {
    let type = $( "input[name='type']:checked" ).val();
    let applicationServer = $( "#applicationServer" ).val();
    let showserverTabHeading = type == "remote" ? localize( "adobe-cfml.server.tabs.remoteServer.title" ) : localize("adobe-cfml.server.tabs.localServer.title");
    let showMappingsTabHeading = type == "remote" ? localize("adobe-cfml.server.tabs.localMapping.title") : localize("adobe-cfml.server.tabs.remoteMapping.title");

    // Change the Title based on server type
    $( "#serverHeadingTab" ).text( showserverTabHeading );
    $( "#mappingsHeadingTab" ).text( showMappingsTabHeading );

    // Show and hide the Fields based on server type
    if ( type === "remote" && applicationServer != localize( "other" ) ) {
        $( ".remoteServerFields" ).removeClass( "d-none" );
        $( ".mappingsFields" ).removeClass( "d-none" );
        $( ".otherServers" ).addClass( "d-none" );
        $( ".localServerFields" ).addClass( "d-none" );
        $( "#appServerName" ).removeAttr( "disabled" );
    } else if ( type === "local" && applicationServer != localize( "other" ) ) {
        $( ".localServerFields" ).removeClass( "d-none" );
        $( ".remoteServerFields" ).addClass( "d-none" );
        $( ".mappingsFields" ).addClass( "d-none" );
        $( ".otherServers" ).addClass( "d-none" );
        $( "#appServerName" ).removeAttr( "disabled" );
    } else {
        $( ".otherServers" ).removeClass( "d-none" );
        if( type == "local" ){
            $( ".showBrowseBtn" ).removeClass( "d-none" );
            $( ".mappingsFields" ).addClass( "d-none" );
        } else {
            $( ".showBrowseBtn" ).addClass( "d-none" )
            $( ".mappingsFields" ).removeClass( "d-none" );
        }
        $( ".remoteServerFields" ).addClass( "d-none" );
        $( ".localServerFields" ).addClass("d-none");
        $( "#appServerName" ).attr( "disabled", true );
    }

    type == "local" ? $( ".OtherRemoteServerFields" ).addClass( "d-none" ) : $( ".OtherRemoteServerFields" ).removeClass( "d-none" );
}

function disposeWebview() {
	vscode.postMessage({
		command: "close"
	})
}

function readMappingData( type ){
	var list = document.getElementsByClassName( "mappingDatas" );
	var mappings = [];
	for ( var item of list ) {
		var struct = {};
        struct[ "mappingId" ] = item.children[0].getAttribute( "data-id" );
		struct[ "local" ]     = item.children[0].innerHTML;
        if( type === "remote" ){
            struct[ "remote" ] = item.children[1].innerHTML;
            struct[ "prefix" ] = item.children[2].innerHTML;
        } else {
            struct[ "prefix" ] = item.children[1].innerHTML;
        }
		mappings.push( struct );
	}
	return mappings;
}

function readvirtualHostData(){
    var list = document.getElementsByClassName( "virtualHostDatas" );
	var virtualDatas = [];
    var i = 0;

    let servers = document.getElementById( "servers" ).value.trim();
    let serverID = document.getElementById( "id" ).value.trim();

    servers = servers.replace(/'/g, '\"');
    let getServerDetails = JSON.parse( servers.replace(/'/g, '\"') ).filter( server => server.id == serverID );

	for ( var item of list ) {
        var struct = {};
        struct[ "virtualHostId" ] = item.children[0].getAttribute( "data-id" );
		struct[ "virtualName" ] = item.children[0].innerHTML;
        struct[ "virtualHostName" ] = item.children[1].innerHTML;
        struct[ "virtualPort" ] = item.children[2].innerHTML;
        struct[ "virtualHostDocumentRoot" ] = item.children[3].innerHTML;
        struct[ "virtualType" ] = item.children[4].innerHTML;
        struct[ "virtualDirectoryDatas" ] = readvirtualDirectoryDatas( item.children[0].getAttribute( "data-id" ) );
        struct[ "virtualDebugMappings" ] = [];
        if ( getServerDetails.length && getServerDetails[0][ "virtualDatas" ] ) {
            let vhIndex =  getServerDetails[0][ "virtualDatas" ].findIndex( data => data.virtualHostId === item.children[0].getAttribute( "data-id" ) );
            if(vhIndex != -1 &&  getServerDetails[0][ "virtualDatas" ][vhIndex ]){
                struct[ "virtualDebugMappings" ] = getServerDetails[0][ "virtualDatas" ][vhIndex ][ "virtualDebugMappings" ];
            }
        }
		virtualDatas.push( struct );
        i++;
	}
    document.getElementById( "virtualDatas" ).value = JSON.stringify( virtualDatas );

	return virtualDatas;
}

function getFormValues( fileKey ) {
	var type = null;
	var path = null;
	var ssl = null;

	if( document.getElementById( "typeLocal" ).checked ) {
		type = document.getElementById( "typeLocal" ).value;
	} else if (document.getElementById( "typeRemote" ).checked) {
		type = document.getElementById( "typeRemote" ).value;
	}

	if( fileKey != ""  ) {
		path = fileKey;
	}

	if( document.getElementById( "enableSSL" ).checked ) {
		ssl = true ;
	} else {
		ssl = false ;
	}

	var formDatas = document.forms[0];

    var config = {
        "id": formDatas.id.value,
        "name": formDatas.name.value,
        "description": formDatas.description.value,
        "appServer": document.getElementById( "applicationServer" ).value,
        "host": formDatas.host.value,
        "port": formDatas.port.value,
        "contextRoot": document.getElementById( "contextRoot" ).value,
        "appServerName": formDatas.appServerName.value,
        "version": "9.0.X",
        "serverHome": document.getElementById( "serverHome" ).value,
        "documentRoot": document.getElementById( "documentRoot" ).value,
        "RDSUsername": formDatas.RDSUsername.value,
        "RDSPassword": formDatas.RDSPassword.value,
        "enableSSL": ssl,
        "useServiceMethod": $( "#useServiceMethod" ).prop( "checked" ),
        "serviceMethodVersion": document.getElementById( "serviceMethodVersion" ).value,
        "autoStart": false,
        "autoStop": false,
        "type": type,
        "path": path,
        "adminPort": formDatas.adminPort.value != undefined ? formDatas.adminPort.value : "8995",
        "userName": formDatas.userName.value != undefined ? formDatas.userName.value : "",
        "password": formDatas.password.value != undefined ? formDatas.password.value : "",
        "AdminSrvName" : document.getElementById("AdminSrvName") != undefined ? document.getElementById( "AdminSrvName" ).value : "",
        "AdminSrvCtxRoot" : document.getElementById( "AdminSrvCtxRoot" ) != undefined ? document.getElementById( "AdminSrvCtxRoot" ).value : "",
        "ServerDocRoot" : document.getElementById( "ServerDocRoot" ) != undefined ? document.getElementById( "ServerDocRoot" ).value : "",
        "mappings": formDatas.mappings.value != undefined ? readMappingData( type ) : [],
        "localPath": document.getElementById( "localPath" ).value,
        "virtualName": document.getElementById( "virtualName" ).value,
        "virtualHostName": document.getElementById( "virtualHostName" ).value,
        "virtualPort": document.getElementById( "virtualPort" ).value,
        "virtualType": document.getElementById( "virtualType" ).value,
        "virtualHostDocumentRoot": document.getElementById( "virtualHostDocumentRoot" ).value,
        "virtualDatas": formDatas.virtualDatas.value != undefined ? readvirtualHostData() : [],
        "vDirectoryData": document.getElementById( "vDirectory" ).value,
        "vHostId": document.getElementById( "vhostId" ).value.trim(),
        "otherServerDocumentRoot": document.getElementById( "otherServerDocumentRoot" ).value,
        "RDSOnly":false,
        "RDSShow":true
    };

	return config;
}

function editMappings( no, type, mapId ) {
    var localPath = $( "#localPath_row" + no );
	var urlPrefix = $( "#urlPrefix_row" + no );
    var localPath_data = localPath.html();
    var urlPrefix_data = urlPrefix.html();

    isModalOpened = true;
    currModalId = "#mappingModal";

    $( "#mapId" ).val( mapId );
    $( "#localPathBrowseBtn" ).prop( "disabled", true );

    if( type === "remote"){
        var remotePath = $("#remotePath_row" + no );
        var remotePath_data = remotePath.html();
        $( "#remotePath" ).val( remotePath_data );
    }
    $( "#localPath" ).val( localPath_data );
    $( "#urlPrefix" ).val( urlPrefix_data );

    $("#mappingAddButton").html(localize("adobe-cfml.server.common.button.update"));
}

function validExistLocalPath( currentLocalPath, type ) {
    var previousMappingData = readMappingData( type );
    var isExist = false;
    if( $( "#mapId" ).val() == "" ){
        document.getElementById( "mappingAddButton" ).disabled = false;
        previousMappingData.forEach( mappingData => {
            if( mappingData.local == currentLocalPath ) {
                isExist = true;
            }
        });
    } else{
        $( "#localPathBrowseBtn" ).prop( "disabled", true );
    }
    return isExist;
}

function delete_row(no) {
	document.getElementById( "row" + no + "" ).outerHTML = "";
}

function addMappings() {
    let type = $( "input[name='type']:checked" ).val();
    if( validateTab( false, activeTab ) ){
		var localPath = $( "#localPath" ).val().trim();
        var urlPrefix = $( "#urlPrefix" ).val().trim();

        var table = $("#mappings_data_table tr");
		var table_len = ( table.length ) - 1;
        var mapId = $( "#mapId" ).val();

        if( type == "remote" ){
            var remotePath = $( "#remotePath" ).val().trim();
            var remoteTRData = "<td class='word-break-break-all' id='remotePath_row" + table_len + "'>" + remotePath + "</td>"
        }

        if( mapId.length && mapId != "" && mapId != undefined ){
            var list = $( ".mappingDatas" );
            var i = 0;
            for ( var item of list ) {
                if( item.children[0].getAttribute( "data-id" ) === mapId ) {
                    $( "#localPath_row" + i ).html( localPath );
                    $( "#urlPrefix_row" + i ).html( urlPrefix );
                    if( type == "remote" ) {
                        $( "#remotePath_row" + i ).html( remotePath );
                    }
                }
                i++;
            }
        } else {
            var uuid = this.createUUID();
            var tbodyContent = "";
            tbodyContent = "<tr class='mappingDatas' id='row" + table_len + "'><td class='word-break-break-all' data-id= '" + uuid + "' id='localPath_row" + table_len + "'>" + localPath + "</td>" + remoteTRData + "<td class='word-break-break-all' id='urlPrefix_row" + table_len + "'>" + urlPrefix + "</td><td class='word-break-break-all'> <button type='button' id='edit_button" + table_len + "' class='edit btn mr-md-2' data-toggle='modal' data-target='#mappingModal' onclick='editMappings(" + table_len + ",`" + type + "` ,`" + uuid + "`)'><i class='fa fa-pencil' aria-hidden='true'></i></button><button type='button' onclick = 'delete_row(" + table_len + ")' class='delete btn' > <i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>";

            $( "#mappings_data_table" ).append( tbodyContent );
        }
        closeModal( "#mappingModal" );
        return true;
	}
    return false;
}

function addVirtualHost( fromDirectory ) {
    if( validateTab( false, activeTab ) ) {
        var virtualName = $( "#virtualName" ).val().trim();
        var virtualHostName = $( "#virtualHostName" ).val().trim();
        var virtualPort = $( "#virtualPort" ).val().trim();
        var virtualType = $( "#virtualType" ).val().trim();
        var virtualHostDocumentRoot = $( "#virtualHostDocumentRoot" ).val().trim();
        var table = $( "#virtualHost_data_table tr" );
        var table_len = ( table.length ) - 1;
        var tempVhost = false;

        var vhostId = $( "#vhostId" ).val();
        var tempvhostId = $( "#tempVHostId" ).val();
        if( vhostId == "" && tempvhostId == "" ){
            $( "#tempVHostId" ).val( this.createUUID() );
            tempvhostId = $( "#tempVHostId" ).val()
        }

        if( vhostId.length && vhostId != "" && vhostId != undefined ) {
            var list = $( ".virtualHostDatas" );
            var i = 0;
            for ( var item of list ) {
                if( item.children[0].getAttribute("data-id") === vhostId ){
                    $( "#virtual_name" + i).html( virtualName );
                    $( "#virtual_host_name" + i).html( virtualHostName );
                    $( "#virtual_port" + i).html( virtualPort );
                    $( "#virtual_host_documentRoot" + i).html( virtualHostDocumentRoot );
                    $( "#virtual_type" + i).html( virtualType );
                }
                i++;
            }
        } else {
            vhostId = tempvhostId;
            tempVhost = true;
            var tbodyContent = "";
            tbodyContent = "<tr class='virtualHostDatas' id='virtual_row" + table_len + "'><td data-id ='" + vhostId + "' id='virtual_name" + table_len + "'>" + virtualName + "</td><td id='virtual_host_name" + table_len + "'>" + virtualHostName + "</td><td id='virtual_port" + table_len + "'>" + virtualPort + "</td><td id='virtual_host_documentRoot" + table_len + "'>" + virtualHostDocumentRoot + "</td><td id='virtual_type" + table_len + "'>" + virtualType + "</td><td> <button type='button' id='virtualHost_edit_button" + table_len + "' class='edit btn mr-md-2' data-toggle='modal' data-target='#virtualHostModal' onclick='virtualHost_edit_row(" + table_len + ",`" + vhostId + "`)'><i class='fa fa-pencil' aria-hidden='true'></i></button><button type='button' onclick = 'virtualHost_delete_row(" + table_len + ")' class='delete btn' > <i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>";

            $("#virtualHost_data_table tbody").append( tbodyContent );
        }

        // Virtual Directory Data update
        var tempVirtualDirectory    = $( "#vDirectory" ).val().trim().replace(/'/g, '"');
        var totalobject             = JSON.parse( $( "#virtualDatas" ).val().trim().replace( /'/g, '"' ) );

        if( tempVhost ){
            var struct = {};
            struct[ "virtualHostId" ]           = vhostId;
            struct[ "virtualName" ]             = virtualName;
            struct[ "virtualHostName" ]         = virtualHostName;
            struct[ "virtualPort" ]             = virtualPort;
            struct[ "virtualHostDocumentRoot" ] = virtualHostDocumentRoot;
            struct[ "virtualType" ]             = virtualType;
            struct[ "virtualDirectoryDatas" ]   = tempVirtualDirectory.length ? JSON.parse( tempVirtualDirectory ) : [];

            totalobject.push( struct );
        }

        $( "#virtualDatas" ).val( JSON.stringify( totalobject ).replace( /"/g, "'" ) ) ;
        $( "#vDirectory" ).val("");
        $( "#tempvhostId" ).val("");
        if( !fromDirectory ){
            closeModal( "#virtualHostModal" );
        }

        return true
	}
    return false;
}

function virtualHost_delete_row( no ) {
    var deleteRowDataId = document.getElementById( "virtual_row" + no ).children[0].getAttribute( "data-id" );
    var virtualData     = JSON.parse( document.getElementById( "virtualDatas" ).value.trim().replace( /'/g, '"' ) );
    virtualData.map( ( data, index ) => {
        if( data.virtualHostId === deleteRowDataId ){
            virtualData.splice( index, 1 );
        }
    })
    document.getElementById( "virtualDatas" ).value = JSON.stringify( virtualData ).replace( /"/g, "'" );
    document.getElementById( "virtual_row" + no ).outerHTML = "";
}

function virtualHost_edit_row( no, vhostId  ) {
    var virtualName             = $( "#virtual_name" + no );
    var virtualHostName         = $( "#virtual_host_name" + no );
    var virtualPort             = $( "#virtual_port" + no );
    var virtualHostDocumentRoot = $( "#virtual_host_documentRoot" + no );
    var virtualType             = $( "#virtual_type" + no );
    var virtualTypeDropDown     = $( "#virtualType" );
    $( "#vhostId" ).val( vhostId );

    $("#virtualHostAddButton").html( localize( "adobe-cfml.server.common.button.update" ) );

    isModalOpened = true;
    currModalId = "#virtualHostModal";

    var totalVitualhost = JSON.parse( $( "#virtualDatas" ).val().trim().replace( /'/g, '"' ) );

    var tempVitualhostDirectory = $( "#vDirectory" ).val().trim().replace( /'/g, '"' ) ;

    if( tempVitualhostDirectory.length  ){
        virtualDirectoyData = JSON.parse( tempVitualhostDirectory );
    } else {
        var virtualDirectoyData = [];
        totalVitualhost.map( ( data ) => {
            if( data.virtualHostId == vhostId ){
                virtualDirectoyData = data.virtualDirectoryDatas;
            }
        });
    }

    virtualDirectoryTableRow( virtualDirectoyData, vhostId );
    $( "#alias" ).val( "" );
    $( "#physicalPathRoot" ).val( "" );

    var fields = [ "#virtualName", "#virtualHostName", "#virtualPort", "#virtualHostDocumentRoot", "#virtualType" ];
    var fieldsData = [ virtualName.html(), virtualHostName.html(), virtualPort.html(), virtualHostDocumentRoot.html(), virtualType.html() ];

    for( var i=0; i<fields.length; i++ ){ $( fields[i] ).val( fieldsData[i] ); }
}

function virtualDirectoryTableRow( virtualDirectory, vhostId ) {
    var directoryTable = document.querySelector( "#virtualDirectoryBody" );
    directoryTable.innerHTML = ""
    if( Array.isArray( virtualDirectory ) && virtualDirectory.length ){
        for ( i = 0; i < virtualDirectory.length; i++  ) {
            var objKeys = Object.keys( virtualDirectory[i] );
            var tableRow = document.createElement('tr');

            tableRow.setAttribute( "class", "virtualDirectoryDatas_" + vhostId );
            tableRow.setAttribute( "id", "virtualDirectory_row" + i );
            objKeys.push( "button" );
            for ( j = 0; j < objKeys.length; j++ ){
                let tableCol = document.createElement( 'td' );
                tableCol.setAttribute( "id", objKeys[j] + i );
                if( objKeys[j] != 'button' ){
                    tableCol.innerHTML = virtualDirectory[i][ objKeys[j] ];
                    tableRow.appendChild( tableCol );
                } else {
                    var deleteBtn = document.createElement( "button" );
                    var deleteicon = document.createElement( "i" );
                    deleteicon.setAttribute( "class", "fa fa-trash" );
                    deleteicon.setAttribute( "aria-hidden", "true" );
                    deleteBtn.setAttribute( "class", "delete btn" );
                    deleteBtn.setAttribute( "type", "button" );
                    deleteBtn.setAttribute( "onclick", "virtualDirectory_delete_row(" + i + ")" );
                    deleteBtn.appendChild( deleteicon );
                    tableCol.setAttribute("class", "text-center");
                    tableCol.appendChild( deleteBtn );
                    tableRow.appendChild( tableCol );
                }
            }
            directoryTable.appendChild( tableRow );
        }
    }
    else{
        document.querySelector( "#virtualDirectoryBody" ).innerHTML = "";
    }
}

function checkRDSConnection() {

    var checkField = ["host", "port", "RDSUsername", "RDSPassword","contextRoot" ];
    let ssl = null;
    if( document.getElementById( "enableSSL" ).checked ) {
        ssl = true;
    } else {
        ssl = false;
    }
    let contextRoot = document.getElementById(checkField[4]).value.trim();
    vscode.postMessage({
        command: "verifyRDSConnection",
        host: document.getElementById( checkField[0] ).value.trim(),
        port: document.getElementById( checkField[1] ).value.trim(),
        RDSUsername: document.getElementById( checkField[2] ).value.trim(),
        RDSPassword: document.getElementById( checkField[3] ).value.trim(),
        contextRoot: contextRoot != "" ? contextRoot : "",
        enableSSL: ssl
    });

}

function checkServerExists( id ) {
    let newName = document.getElementById( "name" ).value.trim().toUpperCase();
    let servers = document.getElementById( "servers" ).value.trim();
    let isEdit = $( "#isEdit" ).val();

    servers = servers.replace( /'/g, '\"' );
    servers = JSON.parse( servers );

    let otherServerWithThisName = servers.filter( function( data ) {
        if( isEdit == "0" && data.name.toUpperCase() == newName ) {
            return data;
        }
    });

    return otherServerWithThisName.length > 0;
}

function createUUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return ( c == "x" ? r : (r & 0x3 | 0x8) ).toString(16);
    });

    return uuid;
}

function clearFields( module ) {
    var fields = [];
    if( module === "#virtualHostModal" ) {
        $("#virtualHostAddButton").html( localize( "adobe-cfml.server.common.button.add" ) );
        fields = [ "virtualName", "virtualHostName", "virtualPort", "virtualHostDocumentRoot", "vhostId", "tempVHostId" ];
    } else if( module === "#mappingModal" ) {
        $("#mappingAddButton").html( localize( "adobe-cfml.server.common.button.add" ) );
        fields = [ "localPath", "remotePath", "urlPrefix" ];
    }

    if( fields.length ) {
        fields.map( ( data ) => { document.getElementById( data ).value = "" });
    }
    document.getElementById("virtualDirectoryBody").innerHTML = ""
}

function addVirtualDirectory() {
    vscode.postMessage({
        command: "addVirtualDirectory",
        type: $("input[name='type']:checked").val()
    })
}

function addDummyVirtualDirectory( data ) {
    vhostId = $( "#vhostId" ).val().trim();

    if( vhostId == "" ) {
        $( "#tempVHostId" ).val( this.createUUID() );
        vhostId = $( "#tempVHostId" ).val()
    }

    var alias = data.alias;
    var physicalPathRoot = data.loacation;

    var table = $( "#virtualDirectory_data_table tr" );
    var table_len = table.length == -1 || table.length == 0 ? 0 : ( table.length ) - 1;
    directoryStruct = {};

    var existhiddenData =  $( "#vDirectory").val().trim();
    var existDirectoryData = readvirtualDirectoryDatas( vhostId );
    if( existhiddenData.length ){
        existDirectoryData = JSON.parse( existhiddenData.replace(/'/g, '"') );
    }

    let directoryContent = "<tr class='virtualDirectoryDatas_" + vhostId + "' id='virtualDirectory_row" + table_len + "'><td id='alias" + table_len + "'>" + alias + "</td><td id='physical_Path_Root" + table_len + "'>" + physicalPathRoot + "</td><td class='text-center'><button type='button' onclick = 'virtualDirectory_delete_row(" + table_len + ")' class='delete btn' > <i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>";

    $( "#virtualDirectory_data_table tbody" ).append( directoryContent );

    directoryStruct[ "aliasName" ] = alias;
    directoryStruct[ "physicalRootPath" ] = physicalPathRoot;
    existDirectoryData.push( directoryStruct );

    $( "#vDirectory").val( JSON.stringify( existDirectoryData ) );

    var totalobject = JSON.parse( $( "#virtualDatas" ).val().trim().replace( /'/g, '"' ) );
    totalobject.map( ( data ) => {
        if( data.virtualHostId == vhostId ){
            data.virtualDirectoryDatas = existDirectoryData;
        }
    })

    $( "#virtualDatas" ).val( JSON.stringify( totalobject ).replace( /"/g, "'" ) ) ;
    $( "#alias").val("");
    $( "#physicalPathRoot").val("");

    return true;
}

function virtualDirectory_delete_row( no ) {
    var vhostId     = $( '#virtualDirectory_row' + no ).attr( 'class' ).replace( "virtualDirectoryDatas_", "" );
    var virtualData = JSON.parse( $( "#virtualDatas" ).val().trim().replace( /'/g, '"' ) );

    virtualData.map( ( data ) => {
        if( data.virtualHostId === vhostId ) {
            data.virtualDirectoryDatas.splice( no, 1 );
        }
    })

    document.getElementById( "virtualDatas" ).value = JSON.stringify( virtualData ).replace( /"/g, "'" );
    document.getElementById( "virtualDirectory_row" + no ).outerHTML = "";
}

function readvirtualDirectoryDatas( vhostId ) {
    var totalVitualhost = JSON.parse( $( "#virtualDatas" ).val().trim().replace( /'/g, '"' ) );
    var list = document.getElementsByClassName( "virtualDirectoryDatas_" + vhostId );
    var virtualDirectoryDatas = [];

    if( list.length ){
        for ( var item of list ) {
            var struct = {};
            struct[ "aliasName" ] = item.children[0].innerHTML;
            struct[ "physicalRootPath" ] = item.children[1].innerHTML;
            virtualDirectoryDatas.push( struct );
        }
    } else{
        totalVitualhost.map( ( data ) => {
            if( data.virtualHostId == vhostId ){
                virtualDirectoryDatas = data.virtualDirectoryDatas;
            }
        })
    }
    return virtualDirectoryDatas;
}

function showModal( id ) {
    isModalOpened = true;
    currModalId = id;
    clearFields( id );
    $( id ).modal( "show" );
    $( "#mapId" ).val( "" );
    if( id = "#mappingModal" ){
        $( "#localPathBrowseBtn" ).prop( "disabled", false );
    }
}

function closeModal( id ) {
    isModalOpened = false;
    currModalId = "";
    clearValidations( validationRules );
    $( id ).modal( "hide" );
}

// Copy the mappings Data Based on server.
function existMappings( serverId, action, mappingData, documentRoot ) {
    $( "#mappings_data_table tr.mappingDatas " ).remove();
    if( action == "Confirm" ){
        addExistingMappingData( serverId, mappingData );
    } else{
        documentRoot = "";
    }

    $( "input[name='type']:checked" ).val() === "local" ? $( "#documentRoot" ).val( documentRoot ) : $( "#ServerDocRoot" ).val( documentRoot );
    if( $( "#applicationServer" ).val() == "Other" ){
        $( "#otherServerDocumentRoot" ).val( documentRoot );
    }
}

function addExistingMappingData( serverId, mappingsData ) {
    let type = $( "input[name='type']:checked" ).val();

    // copy of mapping data
    if( Array.isArray( mappingsData ) && mappingsData.length ) {
        var mappingsHTML = "";
        if( type === "local" ) {
            for (var [ index, item ] of mappingsData.entries()) {
                mappingsHTML = mappingsHTML + "<tr class='mappingDatas' id='row" + index + "'><td class='word-break-break-all' data-id =" + item.mappingId + " id='localPath_row" + index + "'>" + item.local + "</td><td class='word-break-break-all' id='urlPrefix_row" + index + "'>" + item.prefix + "</td><td class='word-break-break-all'><button type='button' id='edit_button" + index + "' class='edit btn mr-md-2' data-toggle='modal' data-target='#mappingModal' onclick='editMappings(" + index + ",`" + type + "`, `" + item.mappingId + "`)'><i class='fa fa-pencil' aria-hidden='true'></i></button><button type='button' onclick = 'delete_row(" + index + ")' class='delete btn' > <i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>";
            }
        } else if( type === "remote" ) {
            for (var [index, item] of mappingsData.entries()) {
                item.remote = !item.hasOwnProperty( "remote" ) ? "" : item.remote;

                mappingsHTML = mappingsHTML + "<tr class='mappingDatas' id='row" + index + "'><td class='word-break-break-all' data-id =" + item.mappingId + " id='localPath_row" + index + "'>" + item.local + "</td><td class='word-break-break-all' id='remotePath_row" + index + "'>" + item.remote + "</td><td class='word-break-break-all' id='urlPrefix_row" + index + "'>" + item.prefix + "</td><td class='word-break-break-all'><button type='button' id='edit_button" + index + "' data-toggle='modal' data-target='#mappingModal'  class='edit btn mr-md-2' onclick='editMappings(" + index + ",`" + type + "`, `" + item.mappingId + "`)'><i class='fa fa-pencil' aria-hidden='true'></i></button><button type='button' onclick = 'delete_row(" + index + ")' class='delete btn' > <i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>";
            }
        }

        $( "#mappings_data_table" ).append( mappingsHTML );
    }
}

function getMappings() {
    let type = $( "input[name='type']:checked" ).val();
    var list = document.getElementsByClassName( "mappingDatas" );
    var mappings = [];
    for ( var item of list ) {
        var struct = {};
        struct[ "mappingId" ] = item.children[0].getAttribute( "data-id" );
        struct[ "local" ] = item.children[0].innerHTML;
        struct[ "prefix" ] = item.children[1].innerHTML;
        if( type === "remote" ) {
            struct[ "remote" ] = "";
        } else {
            struct[ "prefix" ] = item.children[2].innerHTML;
        }
        mappings.push( struct );
    }
    return mappings;
}

function clearValidations( validationRules ) {
    allTabs.forEach( ( tmpTab ) => {
        for( let elem in validationRules[ tmpTab.replace( "#", "" ) ] ) {
            $( "#error_" + elem ).hide();
            $( "#error_" + elem ).text( "" );
        }
    });
}

function toggleServerType( elem, ipV6, ipV4, hostname ) {
    let thisValue = $( "#" + elem ).val().trim().toLowerCase();
    let localhosts = [ "localhost", "127.0.0.1", ipV6.trim(), ipV4.trim(), hostname.toLowerCase().trim() ];
    localhosts.includes( thisValue ) ? $( "#typeLocal" ).prop( "checked", true ) : $( "#typeRemote" ).prop( "checked", true );
    toggleServerTypeSelection();
}