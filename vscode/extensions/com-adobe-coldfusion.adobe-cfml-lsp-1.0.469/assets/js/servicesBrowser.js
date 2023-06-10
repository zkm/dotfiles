const vscode = acquireVsCodeApi();

var showSystemCFCs = false;
var showRemote = true;
var showPublic = true;
var showPackage = true;
var showPrivate = true;

var activeEditor;

function disposeWebview() {
	vscode.postMessage( { command: "close" } );
}

function sendMessage( action, data ) {
    vscode.postMessage({
        action: action,
        data: data
    });
}

function createTree() {
    sendMessage( "getAllServers", {} );
}

var servers, currServerContext, currPackageContext, currCFCContext, currFuncContext, currExtendCFCContext;

function listAllServers( allServers ) {
    let serversUL = document.getElementById( "serversUL" );

    servers = allServers;
    currServerContext = undefined;
    currPackageContext = undefined;
    currCFCContext = undefined;
    currFuncContext = undefined;
    currExtendCFCContext = undefined;

    allServers.forEach( ( thisServer, idx ) => {
        let serverLI = document.createElement( "li" );
        let packagesUL = document.createElement( "ul" );
        let allRootComponentsUL = document.createElement( "ul" );
        let innerSpan = document.createElement( "span" );
        let labelElem = document.createElement( "span" );
        let innerSpanIcon = document.createElement( "i" );
        let nameLabel = document.createElement( "span" );
        let serverImg = document.createElement( "span" );
        serverImg.setAttribute( "class", "icon server" );

        serverLI.setAttribute( "id", "serverLI_" + thisServer.id );
        serverLI.setAttribute( "class", "serverLI cursor-pointer" );
        serverLI.setAttribute( "class", "serverLI cursor-pointer" );

        innerSpanIcon.setAttribute( "class", "fa fa-chevron-right" );
        innerSpanIcon.setAttribute( "onclick", "javascript: expandOrCollapse( this, 'server', '" + thisServer.id + "' );" );

        nameLabel.setAttribute( "class", "sbInnerText_" + thisServer.name );

        innerSpan.appendChild( innerSpanIcon );
        labelElem.appendChild( serverImg );
        nameLabel.appendChild( document.createTextNode( thisServer.name ) );
        labelElem.setAttribute( "class", "label" );
        // To highlight this element while it is being clicked
        labelElem.setAttribute( "onclick", "javascript: setCurrentElem( this );" );
        labelElem.appendChild( nameLabel );
        innerSpan.appendChild( labelElem );
        innerSpan.setAttribute( "oncontextmenu", "javascript: showContextMenu( 'server', event );" );

        packagesUL.setAttribute( "id", "packagesUL_" + thisServer.id );
        packagesUL.setAttribute( "class", "packages nested" );

        allRootComponentsUL.setAttribute( "id", "allRootComponentsUL_" + thisServer.id );
        allRootComponentsUL.setAttribute( "class", "componentLI nested" );

        serverLI.appendChild( innerSpan );
        serverLI.appendChild( packagesUL );
        serverLI.appendChild( allRootComponentsUL );
        serversUL.appendChild( serverLI );
    });
}

function packageLoading( data ) {
    let thisNode = document.getElementById( "serverLI_" + data.serverId );
    let packagesUL = document.getElementById( "packagesUL_" + data.serverId );

    let spinner = document.getElementById( "spinner" );
    if( spinner != null ) {
        if( data.isShow ) {
            spinner.setAttribute( "style", "display:block;" );
        } else {
            spinner.setAttribute( "style", "display:none;" );
        }
        let packageLI = document.createElement( "li" );
        let innerSpan = document.createElement( "span" );
        innerSpan.appendChild( spinner );
        packageLI.appendChild( innerSpan );
        packagesUL.appendChild( packageLI );
        thisNode.appendChild( packagesUL );
    }
}

function addLoaderToComponent( data ) {
    if( !$( "#spinner" ) ) {
        $( "#spinner" ).toggleClass( "visible", data.isShow );
        $( "componentLI_" + data.componentId ).parent().appendChild( $( "#spinner" ) );
    }
}

// Will list / show packages & root level components that are available under a server
function listServerDetails( data ) {
    let thisNode = document.getElementById( "serverLI_" + data.serverId );
    let packagesUL = document.getElementById( "packagesUL_" + data.serverId );
    let allComponentsUL = document.getElementById( "allRootComponentsUL_" + data.serverId );

    servers.map( server => {
        if( data.serverId == server.id ) {
            server.allPackages = data.allPackages;
            server.allRootComponents = data.allRootComponents;
        }
    });
    // Avoid to append the same data.
    var requireAPICall = true;
    var serverIds = JSON.parse( document.getElementById( "eventServerIds" ).value.trim().replace( /'/g, '"' ) );
    if( serverIds.length && serverIds.includes( data.serverId ) )
        requireAPICall = false;

    if( !data.refreshCache ){
        serverIds.includes( data.serverId ) ? serverIds : serverIds.push( data.serverId );
    }
    document.getElementById( "eventServerIds" ).value = JSON.stringify( serverIds ).replace( /"/g, "'" );

    if( requireAPICall ) {
        packagesUL.innerHTML = "";
        allComponentsUL.innerHTML = "";
        if( !data.loadingError ) {
            let allPackages = data.allPackages;
            let allServerComponents = data.allRootComponents;
            if( allPackages.length ) {
                for( let i=0; i<allPackages.length; i++ ) {
                    if( allPackages[i].hasOwnProperty( "name" ) ) {
                        let packageLI = document.createElement( "li" );
                        let innerSpan = document.createElement( "span" );
                        let labelElem = document.createElement( "span" );
                        let innerSpanIcon = document.createElement( "i" );
                        let nameLabel = document.createElement( "span" );
                        let packageIcon = document.createElement( "span" );
                        packageIcon.setAttribute( "class", "icon package" );

                        packageLI.setAttribute( "id", "packageLI_" + allPackages[i].id );
                        packageLI.setAttribute( "class", "packageLI" );

                        if(
                            allPackages[i].name.toUpperCase().startsWith( "CFIDE." )
                            || allPackages[i].name.toUpperCase().startsWith( "CFDOCS." )
                            || allPackages[i].name.toUpperCase().startsWith( "WEB-INF.CFTAGS" )
                        ) {
                            $( packageLI ).addClass( "showSystemCFCs" ).toggle( showSystemCFCs );
                        }

                        innerSpanIcon.setAttribute( "class", "fa fa-chevron-right" );
                        innerSpanIcon.setAttribute( "onclick", "javascript: expandOrCollapse( this, 'package', '" + data.serverId + "', '" + allPackages[i].id + "' );" );
                        nameLabel.setAttribute( "class", "sbPackageInnerText" );
                        nameLabel.appendChild( document.createTextNode( allPackages[i].name ) );

                        innerSpan.appendChild( innerSpanIcon );
                        labelElem.setAttribute( "class", "label" );
                        // To highlight this element while it is being clicked
                        labelElem.setAttribute( "onclick", "javascript: setCurrentElem( this );" );
                        labelElem.appendChild( packageIcon );
                        labelElem.appendChild( nameLabel );
                        innerSpan.appendChild( labelElem );

                        packageLI.appendChild( innerSpan );
                        packagesUL.appendChild( packageLI );
                        thisNode.appendChild( packagesUL );

                        let allRootComponents = allPackages[i].components;
                        packageLI.appendChild( createComponentsHTML( allRootComponents, data.serverId, allPackages[i].id, false ) );
                    }
                }
            }

            if( allServerComponents && allServerComponents.length ) {
                if( allComponentsUL != null )
                    $( allComponentsUL ).remove();
                let tmpUL = createComponentsHTML( allServerComponents, data.serverId, "", false );

                $( tmpUL.childNodes ).each( function() {
                    allComponentsUL.appendChild( this );
                });
                thisNode.appendChild( allComponentsUL );
            }

            // TODO: Need to confirm this with CFB
            if( !allPackages.length && !allServerComponents.length ) {
                let serverError = createErrorMsgElem( localize( "adobe-cfml.services-browser.serverNotStart" ), packagesUL, "icon serverError" )
                thisNode.appendChild( serverError );
            }
        } else {
            let serverLoadingError = createErrorMsgElem( localize( "adobe-cfml.services-browser.connectionTimeOut" ), packagesUL, "icon server" );
            thisNode.appendChild( serverLoadingError );
        }
    }
}

function createErrorMsgElem( message, target, iconClass ) {
    let packageLI = document.createElement( "li" );
    let innerSpan = document.createElement( "span" );
    let imageSpan = document.createElement( "span" );
    let innerSpanSub = document.createElement( "span" );
    imageSpan.setAttribute( "class", iconClass );
    innerSpanSub.appendChild( document.createTextNode( message ) );
    innerSpan.appendChild( imageSpan );
    innerSpan.appendChild( innerSpanSub );
    packageLI.appendChild( innerSpan );
    target.appendChild( packageLI );

    return target
}

function listComponentDetails( data ) {
    // Need to work the tree View.
    componentLIId = "componentSubLI_" + data.componentId;
    if ( document.getElementById( componentLIId ) != null ){
        var target = document.getElementById( componentLIId ).parentElement;
    }

    // Avoid to append the same data.
    var requireAPICall = true;
    var componentEventIds = JSON.parse( document.getElementById( "eventListenerId" ).value.trim().replace( /'/g, '"' ) );
    if ( componentEventIds.length && componentEventIds.includes( componentLIId ) )
        requireAPICall = false;

    componentEventIds.includes(componentLIId) ? componentEventIds : componentEventIds.push(componentLIId);
    // TODO: why componentEventIds???
    document.getElementById("eventListenerId").value = JSON.stringify(componentEventIds).replace(/"/g, "'");

    if ( Object.keys( data.allFunctions ).length ){
        var functionDetails = data.allFunctions.functions;
        var extendsDetails =  data.allFunctions.extends ;
        var propertiesDetails = data.allFunctions.properties.sort( ( tempValue, sortValue ) => tempValue.name.toLowerCase().localeCompare( sortValue.name ) );

        // Update the functions details for appropriate component in global variable
        var tmpServerIdx = servers.findIndex( ( server => server.id == data.serverId ) );
        var tmpServer = servers[ tmpServerIdx ];
        if( data.packageId && data.packageId != "undefined" ) {
            var tmpPackageIdx = tmpServer.allPackages.findIndex( ( package => package.id == data.packageId ) );
            var tmpPackage = tmpServer.allPackages[ tmpPackageIdx ];
            var tmpComponentIdx = tmpPackage.components.findIndex( ( component => component.id == data.componentId ) );

            // update functions
            servers[ tmpServerIdx ].allPackages[ tmpPackageIdx ].components[ tmpComponentIdx ].functions = functionDetails;
            servers[ tmpServerIdx ].allPackages[ tmpPackageIdx ].components[ tmpComponentIdx ][ "extends" ] = extendsDetails;
        } else {
            var tmpComponentIdx = tmpServer.allRootComponents.findIndex( ( component => component.id == data.componentId ) );
            // update functions
            servers[ tmpServerIdx ].allRootComponents[ tmpComponentIdx ].functions = functionDetails;
            servers[ tmpServerIdx ].allRootComponents[ tmpComponentIdx ][ "extends" ] = extendsDetails;
        }

        if( requireAPICall ) {
            if( extendsDetails.name != "WEB-INF.cftags.component" ) {
                //Make the HTML content for extends component
                let extendsComponents = createComponentsHTML( extendsDetails, data.serverId, data.packageId, true );

                //Make the HTML content for extends properties
                createPropertiesHTML( extendsDetails.properties, $( extendsComponents.childNodes[0]).children( "ul" )[0] );

                //Make the HTML content for extends function
                createFunctionsHTML( extendsDetails.functions.sort( ( tempValue, sortValue ) => tempValue.name.toLowerCase().localeCompare( sortValue.name ) ), data.serverId, data.packageId, extendsDetails.id, $( extendsComponents.childNodes[0]).children( "ul" )[0], true );
                target.appendChild( extendsComponents.childNodes[0] );
            }

            // Properties Append
            createPropertiesHTML( propertiesDetails, target );

            // Functions Append
            var functionsUL = document.createElement( "ul" );
            functionsUL.setAttribute( "class", "nested" );
            createFunctionsHTML( functionDetails, data.serverId, data.packageId, data.componentId, target, false );
        }
    } else{
        if ( requireAPICall ) {
            target.innerHTML = "";
            createErrorMsgElem( localize("adobe-cfml.services-browser.serverNotStart"), target, "icon serverError" );
        }
    }
}

function createPropertiesHTML( propertiesDetails, target ) {
    for ( var p = 0; p < propertiesDetails.length; p++ ) {
        var propertyLI = document.createElement( "li" );
        var propertyLabelElem = document.createElement( "span" );
        var labelPropertySpan = document.createElement( "span" );
        var propertyIcon = document.createElement( "span" );
        propertyIcon.setAttribute( "class", "icon property" );
        propertyLabelElem.setAttribute( "class", "label" );
        // To highlight this element while it is being clicked
        propertyLabelElem.setAttribute( "onclick", "javascript: setCurrentElem( this );" );

        propertyLabelElem.appendChild( propertyIcon );
        propertyLabelElem.appendChild( document.createTextNode( propertiesDetails[p].name.trim() ) );
        labelPropertySpan.appendChild( propertyLabelElem );
        propertyLI.appendChild( labelPropertySpan );
        target.appendChild( propertyLI );
    };
}

function createFunctionsHTML( functionDetails, serverId, packageId, componentId, target, isExtends ) {
    for ( var i = 0; i < functionDetails.length; i++ ) {
        var functionsLI = document.createElement("li");
        var innerFuncSpan = document.createElement("span");
        let labelElem = document.createElement("span");
        let cfcFunctionIcon = document.createElement("span");

        // TODO: clean this classes
        // Public Or Private icon set.
        if( functionDetails[i].hasOwnProperty( "access" ) && functionDetails[i].access == "private" ) {
            cfcFunctionIcon.setAttribute("class", "icon private privateFunction");
            if( !$("#showPrivate").hasClass("active" ) ) { functionsLI.style.display = "none"; }
        } else if(functionDetails[i].hasOwnProperty("access") && functionDetails[i].access == "package") {
            cfcFunctionIcon.setAttribute("class", "icon package packageFunction");
            if(!$("#showPackage").hasClass("active")) { functionsLI.style.display = "none"; }
        } else if(functionDetails[i].hasOwnProperty("access") && functionDetails[i].access == "remote") {
            cfcFunctionIcon.setAttribute("class", "icon remote remoteFunction");
            if(!$("#showRemote").hasClass("active")) { functionsLI.style.display = "none"; }
        } else {
            cfcFunctionIcon.setAttribute("class", "icon public publicFunction");
            if(!$("#showPublic").hasClass("active")) { functionsLI.style.display = "none"; }
        }

        if( functionDetails[i].parameters.length ) {
            var innerFuncSpanIcon = document.createElement( "i" );
            innerFuncSpanIcon.setAttribute( "class", "fa fa-chevron-right" );
            innerFuncSpanIcon.setAttribute( "onclick", "javascript: expandOrCollapse( this, 'func', '" + serverId + "', '" + packageId + "', '" + componentId + "', '" + functionDetails[i].id + "' );" );
            innerFuncSpan.appendChild( innerFuncSpanIcon );
        }
        var functionTitle = functionDetails[i].name;
        var parametersList = "";
        if( Array.isArray( functionDetails[i].parameters ) ) {
            for ( j = 0; j < functionDetails[i].parameters.length; j++ ) {
                if( !parametersList.length ) {
                    parametersList = parametersList + functionDetails[i].parameters[j].name;
                } else {
                    parametersList = parametersList + ", " + functionDetails[i].parameters[j].name;
                }
            }
        }

        let returntype = functionDetails[i].returntype != undefined ? functionDetails[i].returntype.toUpperCase() : "ANY";
        functionTitle = functionTitle + "( " + parametersList + " ) : " + returntype;

        labelElem.setAttribute("class", "label");
        // To highlight this element while it is being clicked
        labelElem.setAttribute("onclick", "javascript: setCurrentElem( this );");
        labelElem.appendChild(cfcFunctionIcon);
        labelElem.appendChild( document.createTextNode( functionTitle ) );
        innerFuncSpan.appendChild(labelElem);
        innerFuncSpan.setAttribute( "oncontextmenu", "javascript: showContextMenu( 'func', event," + isExtends + " );" );
        functionsLI.setAttribute( "class", "functionsLI " + functionDetails[i].access );
        functionsLI.setAttribute( "id", "functionsLI_" + functionDetails[i].id );
        functionsLI.appendChild( innerFuncSpan );

        if( functionDetails[i].parameters.length ) {
            var parametersUL = document.createElement( "ul" );
            parametersUL.setAttribute( "class", "nested" );
            for ( var k = 0; k < functionDetails[i].parameters.length; k++ ) {
                var parametersLI = document.createElement( "li" );
                var parameterSpan = document.createElement( "span" );
                var parameterlabelElem = document.createElement( "span" );
                var parameterText = functionDetails[i].parameters[k].name;

                var parameterIcon = document.createElement( "span" );
                parameterIcon.setAttribute( "class", "icon arguments" );

                if( functionDetails[i].parameters[k].hasOwnProperty( "type" ) ) {
                    parameterText = parameterText + " : " + functionDetails[i].parameters[k].type.toUpperCase();
                } else {
                    parameterText = parameterText + " : ANY";
                }

                if ( functionDetails[i].parameters[k].hasOwnProperty( "required" )
                    && ( functionDetails[i].parameters[k]["required"] == "false" || ( functionDetails[i].parameters[k][ "required" ] == "No" ) )
                ){
                    parameterText = parameterText + " [optional]";
                }

                parameterlabelElem.setAttribute( "class", "label" );
                // To highlight this element while it is being clicked
                parameterlabelElem.setAttribute( "onclick", "javascript: setCurrentElem( this );" );
                parameterlabelElem.appendChild( parameterIcon );
                parameterlabelElem.appendChild( document.createTextNode( parameterText ) );
                parameterSpan.appendChild( parameterlabelElem );
                parametersLI.appendChild( parameterSpan );
                parametersUL.appendChild( parametersLI );
            }
            functionsLI.appendChild( parametersUL );
        }
        target.appendChild( functionsLI );
    }
}
function expandOrCollapse( elem, type, serverId, packageId, componentId, isExtends ) {
    var isOpen = false;
    var isHaveData = elem.parentElement.nextSibling.getElementsByTagName( "li" ).length;
    if( !elem.classList.contains( "caret-down" ) ) {
        isOpen = true;
    }
    if( !isExtends ) {
        if( type == "server" ) {
            // TODO:: Need to avoid passing isOpen & isHaveData..
            sendMessage( "getDetailsForServer", { serverId: serverId, isOpen: isOpen, isHaveData: isHaveData } );
        } else if( type =="component" ) {
            sendMessage( "getDetailsForComponents", { serverId: serverId, packageId: packageId, componentId: componentId } );
        }
    }
    if( elem.parentElement.nextSibling != null ) {
        if( elem.parentElement.nextSibling.nextSibling != null )
            elem.parentElement.nextSibling.nextSibling.classList.toggle( "active" );
        elem.parentElement.nextSibling.classList.toggle( "active" );
        elem.classList.toggle( "caret-down" );
    }
}

function refreshServer() {
    console.log( "refreshServer", currServerContext );
    if( typeof currServerContext != "undefined" ) {
        // Refresh to remove the serverIds data.
		let serverData = {};
        // TODO: what is this eventServerIds? And what are we doing here?
        var serverIds = JSON.parse( document.getElementById( "eventServerIds" ).value.trim().replace( /'/g, '"' ) );
        if( serverIds.length )
            serverIds = serverIds.filter( serverId => serverId != currServerContext );

        document.getElementById( "eventServerIds" ).value = JSON.stringify( serverIds ).replace(/"/g, "'" );
        servers.map( server => {
            if( server.id == currServerContext ) {
                serverData = server;
            }
        });

        hideContextMenu();
        sendMessage( "getDetailsForServer", { serverId: serverData.id, isOpen: false, isHaveData:0, refreshServer: true } );
    }
}

function insertObject( type ) {
    var tmpServer = filterData( servers, "id", currServerContext );
    var tmpComponent = filterData( tmpServer.allRootComponents, "id", currCFCContext );

    // Get component data with package
    if( currPackageContext.length ) {
        var tmpPackage = filterData( tmpServer.allPackages, "id", currPackageContext );
        tmpComponent = filterData( tmpPackage.components, "id", currCFCContext );
    }

    // Get extend component
    if( currExtendCFCContext.length ){
        tmpComponent = tmpComponent.extends;
    }

    vscode.postMessage({
        action: "insertObject",
        objectName: tmpComponent.name,
        type: type
    });
}

function showContextMenu( type, event, isExtends ) {
    event.preventDefault();

    // Hide all previous context menus
    hideContextMenu();
    // To highlight the element on right-click
    setCurrentElem( $( event.target ).closest( "span.label" ) );
    const { clientX: mouseX, clientY: mouseY } = event;
    if( type != "server" && !activeEditor ) {
        return false;
    }

    currServerContext = $( event.target ).parents( "li.serverLI" ).attr( "id" ).replace( "serverLI_", "" );
    if( type == "cfc" || type == "func" ) {
        if( $( event.target ).parents( "li.packageLI" ).attr( "id" ) != undefined ) {
            currPackageContext = $( event.target ).parents( "li.packageLI" ).attr( "id" ).replace( "packageLI_", "" );
        } else {
            // For root components
            currPackageContext = "";
        }
        if( isExtends ){
            currCFCContext = $( event.target ).parents( "li.componentLI" ).attr( "id" ).replace( "componentLI_", "" );
            currExtendCFCContext = $(event.target).parents("li.extendsComponentLI").attr("id").replace( "componentLI_", "" );
        } else {
            currCFCContext = $( event.target ).parents( "li.componentLI" ).attr( "id" ).replace( "componentLI_", "" );
            currExtendCFCContext = "";
        }
    }

    if( type == "func" ) {
        currFuncContext = $( event.target ).parents( "li.functionsLI" ).attr( "id" ).replace( "functionsLI_", "" );
    }

    // update position for #contextMenu
    // $( "#contextMenu" ).css( "top", mouseY + 5 + "px" ).css( "left", mouseX + 10 + "px" );
    $( "#contextMenu" ).css( "top", event.pageY + 5 + "px" ).css( "left", event.pageX + 10 + "px" );
    // show options inside #contextMenu
    $( "#contextMenu > div." + type ).addClass( "visible" );
}

function hideContextMenu() {
    $( "#contextMenu > div" ).removeClass( "visible" );
}

function getActiveEditorResult( data ) {
    activeEditor = data;
}

function insertObjectForFunction( type ) {
    var tmpServer = filterData( servers, "id", currServerContext );
    var tmpComponent = filterData( tmpServer.allRootComponents, "id", currCFCContext );

    if( currPackageContext != "" ) {
        // For components inside package
        var tmpPackage = filterData( tmpServer.allPackages, "id", currPackageContext );
        tmpComponent = filterData( tmpPackage.components, "id", currCFCContext );
    }

    // Get extend component
    if( currExtendCFCContext.length ) {
        tmpComponent = tmpComponent.extends;
    }

    var tmpFunction = filterData( tmpComponent.functions, "id", currFuncContext );

    vscode.postMessage({
        action: "insertObjectForFunction",
        component: tmpComponent.name,
        function: tmpFunction,
        type: type
    });
}

function setFilter( name, value ) {
    window[ name ] = value;
}

function toggleFilter( name ) {
    setFilter( name, !window[ name ] );
    applyFilter( name );
}

function applyFilter( name ) {
    var buttonElem = $( "#" + name);
    buttonElem.toggleClass( "active" );
    if( name == "showRemote" ) {
        $( ".componentLI .functionsLI.remote" ).toggle( window[ name ] );
    } else if( name == "showPublic" ) {
        $( ".componentLI .functionsLI.public" ).toggle( window[ name ] );
    } else if( name == "showPackage" ) {
        $( ".componentLI .functionsLI.package" ).toggle( window[ name ] );
    } else if( name == "showPrivate" ) {
        $( ".componentLI .functionsLI.private" ).toggle( window[ name ] );
    } else if( name = "showSystemCFCs" ) {
        $( ".packageLI.showSystemCFCs" ).toggle( window[ name ] );
    }
}

// highlight the specific element
function setCurrentElem( elem ) {
    $( "span.label" ).removeClass( "active" );
    $( elem ).addClass( "active" );
}

function createComponentsHTML( CFCs, serverId, packageId, isExtends ) {
    let componentsUL = document.createElement( "ul" );

    // If CFC from extends
    if( !Array.isArray( CFCs ) ) {
        let extendsCFC = [];
        extendsCFC.push( CFCs );
        CFCs = extendsCFC;
    }
    if( CFCs.length ) {
        $( componentsUL ).addClass( "nested" );
        if( packageId === "" || isExtends ) {
            $( componentsUL ).addClass( "active" );
            componentsUL.setAttribute( "id", "allRootComponentsUL_" + serverId );
        }
        for( let j=0; j<CFCs.length; j++ ) {
            let componentLI = document.createElement( "li" );
            let innerCFCSpan = document.createElement( "span" );
            let innerCFCLabelElem = document.createElement( "span" );
            let innerCFCSpanIcon = document.createElement( "i" );
            let cfcTitleIcon = document.createElement( "span" );

            cfcTitleIcon.setAttribute( "class", "icon components" );

            innerCFCSpanIcon.setAttribute( "class", "fa fa-chevron-right" );
            innerCFCSpanIcon.setAttribute( "onclick", "javascript: expandOrCollapse( this, 'component', '" + serverId + "', '" + packageId + "', '" + CFCs[j].id + "', " + isExtends + ");" );
            innerCFCSpan.appendChild( innerCFCSpanIcon );
            innerCFCLabelElem.setAttribute( "class", "label" );
            // To highlight this element while it is being clicked
            innerCFCLabelElem.setAttribute( "onclick", "javascript: setCurrentElem( this );" );
            innerCFCLabelElem.appendChild( cfcTitleIcon );
            innerCFCLabelElem.appendChild( document.createTextNode( CFCs[j].name ) );
            innerCFCSpan.appendChild( innerCFCLabelElem );
            innerCFCSpan.setAttribute( "oncontextmenu", "javascript: showContextMenu( 'cfc', event, " + isExtends + " );" );

            if( isExtends ){
                componentLI.setAttribute( "class", "extendsComponentLI" );
            } else{
                componentLI.setAttribute( "class", "componentLI" );
            }

            componentLI.setAttribute( "id", "componentLI_" + CFCs[j].id );
            componentLI.appendChild( innerCFCSpan );

            //CFC file path
            let componentInnerUL = document.createElement( "ul" );
            let componentInnerLI = document.createElement( "li" );
            let componentSubIcon = document.createElement( "span" );
            let innerSubCFCSpan = document.createElement( "span" );
            let innerCFCPathSpan = document.createElement( "span" );
            let innerSubCFCLabelElem = document.createElement( "span" );
            innerSubCFCLabelElem.setAttribute( "class", "label" );
            // To highlight this element while it is being clicked
            innerSubCFCLabelElem.setAttribute( "onclick", "javascript: setCurrentElem( this );" );
            componentSubIcon.setAttribute( "class", "icon componentsSub" );
            innerCFCPathSpan.appendChild( document.createTextNode( CFCs[j].path ) );

            // TODO: Need to have serverId & packageId here?
            componentInnerLI.setAttribute( "id", "componentSubLI_" + CFCs[j].id );
            componentInnerUL.setAttribute( "class", "nested" );
            innerSubCFCLabelElem.appendChild( componentSubIcon );
            innerSubCFCLabelElem.appendChild( innerCFCPathSpan );
            innerSubCFCSpan.appendChild( innerSubCFCLabelElem );
            componentInnerLI.appendChild( innerSubCFCSpan );

            componentInnerUL.appendChild( componentInnerLI );
            componentLI.appendChild( componentInnerUL );

            componentsUL.appendChild( componentLI );
        }
    }

    return componentsUL;
}