const vscode                = acquireVsCodeApi();
let selectedOutlineTag      = "";
let selectedColoringElement = "default";
let allFields = [];

const i18n_en = {
    "adobe-cfml.profilePreferences.profileNameErr"      : "Profile name can not be empty",
    "adobe-cfml.profilePreferences.existsProfileName"   : "Profile with name {profileName} already exists."
};

const i18n_ja = {
    "adobe-cfml.profilePreferences.profileNameErr"      : "\u30d7\u30ed\u30d5\u30a1\u30a4\u30eb\u540d\u3092\u7a7a\u306b\u3059\u308b\u3053\u3068\u306f\u3067\u304d\u307e\u305b\u3093",
    "adobe-cfml.profilePreferences.existsProfileName"   : "{profileName}という名前のプロファイルはすでに存在します。"
};


let tabStruct = {
    "#pills-editor"         : "generaleditor",
    "#pills-codeAssist"     : "codeassist",
    "#pills-formatter"      : "formatting",
    "#pills-outline"        : "outline",
    "#pills-syntaxChecking" : "syntaxchecking",
    "#pills-typing"         : "typing",
    "#pills-syntaxColoring" : "colorization"
}

function sendMessage( action, data ) {
    vscode.postMessage( {
        action: action,
        data: data
    } );
}

function disposeWebview() {
    vscode.postMessage( {
        command: "close"
    } );
}

function createNewProfile ( newProfilename ) {
    var getAllProfileList = $( "#activeProfile option" );
    if( validateProfileName( 'newProfileName' ) ){
        var profileNameList = $.map( getAllProfileList, function ( option ) {
            return option.value;
        } );
        
        let currentProfileName = $( "#activeProfile" ).val()
        // create a new profile with name entered
        var newProfileName = $( "#" + newProfilename ).val();
        let activeProfileName = currentProfileName;
        if ( profileNameList.includes( "custom" ) ) {
            activeProfileName = "custom";
        }
        sendMessage( "createNewProfile", { "newProfileName": newProfileName, "activeProfileName" : activeProfileName , currentProfileName: currentProfileName } );
        closeModal( "createNewProfileSection" );
        $( "#error_newProfileName" ).addClass( "d-none" );
    }
}

function validateProfileName( newProfilename ) {
    // create a new profile with name entered
    var newProfileName = $( "#" + newProfilename ).val().trim();
    let profileExists = false;
    let isValid = true;

    $( "#activeProfile option" ).each( function() {
        if( $( this ).val().trim() == newProfileName )
            profileExists = true;
    } );

    if( newProfileName == "" ){
        $( "#error_" +  newProfilename ).removeClass( "d-none" );
        $( "#error_" +  newProfilename ).text( localize( "adobe-cfml.profilePreferences.profileNameErr" ) );
        $( "#createProfileBtn" ).addClass( "disabled" );
        isValid = false
    } else if( profileExists ){
        $( "#error_" +  newProfilename ).removeClass( "d-none" );
        $("#error_" + newProfilename).text(localize("adobe-cfml.profilePreferences.existsProfileName").replace( "{profileName}", newProfileName ) );
        $( "#createProfileBtn" ).addClass( "disabled" );
        isValid = false;
    } else{
        $( "#error_" +  newProfilename ).addClass( "d-none" );
        $( "#createProfileBtn" ).removeClass( "disabled" );
    }
    return isValid;
}

function removeCustomProfile( activeProfile ) {
    // Remove Custom profile XML file
    var selectedCustomProfile = $( "#" + activeProfile ).val();
    sendMessage( "removeCustomProfile", { "selectedCustomProfile": selectedCustomProfile, "activeProfileName": "default" } );
}

function updateActiveProfile( activeProfile, removeBtn, xmlFileName ) {
    var getAllProfileList   = $( "#" + activeProfile+ " option" );
    var profileNameList     = $.map( getAllProfileList, function ( option ) {
        return option.value;
    } );

    // Enable/Disable the Remove button while choosing the Active Profile
    var activeProfileName = $( "#" + activeProfile ).val();
    $( "#" + removeBtn ).removeClass( "disabled" );
    if ( xmlFileName.includes( activeProfileName ) ) {
        $( "#" + removeBtn ).addClass( "disabled" );
    }

    if ( profileNameList.includes( "custom" ) ) {
        sendMessage( "showConfirmationDialog", { "action": "updateCustomProfile" } );
    } else{
        sendMessage( "showConfirmationDialog", { "action": "changeActiveProfile" } );
    }
}

function addProfileOption( data ) {
    if( !$( "#activeProfile option[ value='" + data.filename + "']" ).length > 0 ){
        // adds a new option on the dropdown with the new value
        $( "#activeProfile" ).append(
            $( "<option></option>" ).attr( "value", data.filename ).text( data.filename )
        );
        // Hide the Create New Profile Model Window
        $( "#" + data.createNewProfileSection ).modal( "hide" );
    }

    if ( data.filename.toLowerCase() == "custom" ){
        $( "#activeProfile" ).val( "custom" );
        $( "#removeBtn" ).removeClass( "disabled" );
    }
}

function updateProfileOption( data ) {
    // Update profile file on the dropdown values
    $( "#activeProfile option[value='" + data.profileName+ "']" ).remove();
    // Set the active profile to default.
    $( "#activeProfile" ).val( data.currentActiveProfile );
    if ( data.xmlFileName.includes ( $( "#activeProfile" ).val() ) ) {
        $( "#" + data.removeBtn ).addClass( "disabled" );
    }

    changeActiveProfile( );
}
function reloadDictionary(){
    let currentSelectedDictionary = $( "#dictionaryVersion" ).find(":selected").val();
    sendMessage( "reloadDictionary",{selectedDictionary:currentSelectedDictionary});
}

function applyData( defaultProfiles ){
    // Get the Form data values for Current Active Tab to update the changes
    let activeTab = $( "#pills-tab .nav-link.active" ).attr( "data-bs-target" );
    let activeFormValues = JSON.stringify( ( $( activeTab  ).children().serializeArray() ) );
    let currentActiveProfile = $( "#activeProfile" ).val();
    let currentSelectProfile = $( "#activeProfile" ).val();

    if ( defaultProfiles.includes( currentSelectProfile ) ) {
        currentSelectProfile = "custom";
    }

    sendMessage( "updateProfileData", { "formValues": activeFormValues, "currentSelectProfile": currentSelectProfile, "currentActiveProfile": currentActiveProfile, activeTab : tabStruct[ activeTab ] } );
}

function toggleoutlineView( selectedTag ) {
    if ( selectedTag == "showSelectedTags" ) {
        $( "#outlineTagArea" ).removeAttr( "class" );
    } else {
        $( "#outlineTagArea" ).attr( "class", "disableOutlineView" );
    }
}

function addRemoveTags( action, element, id ) {
    var tagLists    = $( "#" + id + "Lists" ).val().split( "," ).map( data => data.trim() );
    let tags        = [];

    $( "#" + id +" option").each( function () {
        tags.push( $( this ).val() );
    } );

    if( action == "add" ){
        var newtag = $( "#"+ element ).val().trim();
        if ( newtag != "" && !tags.includes( newtag ) ){
            $( "#"+ id ).append(
                $( "<option></option>" ).attr( "value", newtag ).text( newtag )
            );
            tagLists.push( newtag );
        }
        $( "#"+ element ).val( "" );
    } else if( action == "remove" ){
        var selectedTag = $( "#"+ id + " " + "option:selected" );
        selectedTag.remove();
        tagLists = tagLists.filter( tag => tag != selectedTag.text() );
    }

    $( "#" + id + "Lists" ).val( tagLists.toString() );
}

function addRemoveOutlineTags( action, element, id, modalId ) {
    var taglistLists    = $( "#taglistLists" ).val().split(",").map( data => data.trim() );
    let existsDatas     = [];
    $( "#taglist li" ).each( function () {
        existsDatas.push( $( this )[0].innerText );
    } );

    if( action == "add" ){
        var newtag = $( "#"+ element ).val().split( "," ).map( tag => tag.trim() );
        if( newtag != "" ) {
            newtag.forEach( function( tag ) {
                if( !existsDatas.includes( tag ) ){
                    $( "#"+ id ).append(
                        '<li><span class="label cursor-pointer" onclick="javascript: setCurrentElem( this, \'outline\' );" id="' + tag + '" ><span class="outlineTagIcon">' + tag + '</span></span></li>'
                    );
                    taglistLists.push( tag );
                }
            })
            $( "#"+ element ).val("");
        }

        $( "#"+ modalId ).modal( "hide" );
    } else if( action == 'remove' && selectedOutlineTag !== '' ){
        $( '#' + $.escapeSelector( selectedOutlineTag ) ).remove();
        taglistLists = taglistLists.filter( tag => tag != selectedOutlineTag );
        selectedOutlineTag = "";
    }

    $( "#taglistLists" ).val( taglistLists.toString() );
}

function restoreData() {
    // Get the Form data values for Current Active Tab to update the changes
    let activeTab               = $( "#pills-tab .nav-link.active" ).attr( "data-bs-target" );
    let currentSelectProfile    = $( "#activeProfile" ).val();

    sendMessage( "restoreData", { activeTab: tabStruct[ activeTab ], currentSelectProfile: currentSelectProfile } );
}

function setCurrentElem( elem, tab ) {
    if( tab == "outline" ){
        selectedOutlineTag = elem.id;
    } else if( tab == "colorization" ) {
        selectedColoringElement = elem.id;
    }

    $( "span.label" ).removeClass( "active" );
    $( elem ).addClass( "active" );
}

function updateDictionaryVersions(data){
    $( "#dictionaryVersion" ).empty().append(data.htmlContent)
}
function updateCurrentProfileView( data ) {
    if( data.activeTab === "colorization" ){
        let defaultData = JSON.stringify( data.activeDatas ).trim().replace( /"/g, '\'' );

        $( "#syntaxColoringDatas" ).val( defaultData );
        setCurrentElem( $( "#default" ), "colorization" );
        populateDefault();
    } else{
        for ( var item in data.activeDatas ) {
            if( typeof data.activeDatas[ item ] === "object" ){
                let activeTab = "";
                if( item === "colorization" )
                    activeTab = item;
                updateCurrentProfileView( { "activeDatas": data.activeDatas[ item ], activeTab : activeTab } );
            } else if( $("#" + item).attr( "type" ) == "text" || $( "#" + item ).is( "textarea" ) || $( "#" + item ).is( "select" ) ){
                $( "#" + item ).val(  data.activeDatas[ item ] );
            } else if( $( "#" + item ).attr( "type" ) == "checkbox" ) {
                $( "#" + item ).prop( "checked", data.activeDatas[ item ] == "true" ? true : false );
            }  else if(  $( "[name = "+ item +"]" ).attr( "type" ) == "radio" ){
                var $radios = $( "[name = "+ item +"]" );
                let elementValue = data.activeDatas[ item ];

                if( item === "quotecharacter" ){
                    elementValue = data.activeDatas[ item ] == '"' ? "doublequotecharacter" : data.activeDatas[ item ] == "'" ? "singlequotecharacter" : "nonequotecharacter"
                } else if( item === "autoclosetags" ){
                    elementValue = data.activeDatas[ item ] == "autoendwithslash" ? "autocloseendtag" : data.activeDatas[ item ] == "autoendwithbrace" ? "autoclosestarttag" : "neverautoclose"
                }

                $radios.filter( "[value= '" + elementValue + "' ]" ).prop( "checked", true );
            }

            // Show hide for outline tag list
            if ( item === "showAllTags" && data.activeDatas[ item ] ){
                $( "#showAllTags" ).prop( 'checked', data.activeDatas[ item ] );
                toggleoutlineView( "showAllTags" );
            } else if( item === "xmlstyletaglist" || item === "endtagonnewline" || item === "taglist" ){
                $( "#" + item ).empty();
                taglist = data.activeDatas[ item ].split( "," ).map( tag => tag.trim() );
                $( "#" + item + "Lists" ).val( taglist.toString() );
                taglist.forEach( function ( tag ) {
                    $( "#"+ item ).append(
                        function ( e ) {
                            return item === "taglist" ?
                            '<li><span class="label" onclick="javascript: setCurrentElem( this, \'outline\' );" id="' + tag + '" ><span class="outlineTagIcon">' + tag + '</span></span></li>'
                            : $( "<option></option>" ).attr( "value", tag ).text( tag );
                        }
                    );
                })
            }

            if ( $( "#" + item ).hasClass( "validateInput" ) )
                validate( item, '' )
        }

        // re-render the code preview
        renderPreview.updateCode( $( "#v-pills-tab .nav-link.active" ).attr( "data-bs-target" ).replace( "#", "" ) );
        setWrapData();
    }
}

function validate( id, tab ) {
    let element = $( "#"+ id ).val();
    if( element != "" && $.isNumeric( element ) ){
        $( "#"+ id + "Error" ).addClass( "hide" );
        $( "#pills-tab .nav-link.px-2" ).each( function ( index, item ) {
            $( "#" + item.id ).removeClass( 'disabled' );

        } );
        // Disable the apply : error in validation
        $( "#applyData" ).attr( "disabled" , false );
    } else{
        $( "#"+ id + "Error" ).removeClass( "hide" );
        $( "#pills-tab .nav-link.px-2" ).each( function ( index, item ) {
            if ( !$( "#" + item.id ).hasClass( "active" ) )
                $( "#" + item.id ).addClass( 'disabled' );
        } );

        $( "#applyData" ).attr( "disabled" , true );
    }
}

function showInformation( data ) {
    $( "#newProfileName" ).val( "New_Profile" );
    $( "#error_newProfileName" ).addClass( "d-none" );

    if ( $( "#" + data ).val() == "custom" ){
        sendMessage( "showInformationMessage", {} );
    }
}

function importOrExportFormatterTab( action ) {
    let currentSelectProfile = $( "#activeProfile" ).val();

    sendMessage( "importOrExportFormatterData", { action : action, "activeProfile" :  currentSelectProfile } );
}

function toggleSyntaxOptions( elem ) {
    $( elem ).siblings( "ul" ).toggleClass( "hide" );
    $( elem ).toggleClass( "caret-down" );
}

function changeActiveProfile( ) {
    var activeProfileName = $( "#activeProfile" ).val();
    var profileOptions = $( "#activeProfile option" );
    var profileFileList = $.map( profileOptions, function ( option ) {
        return option.value;
    } );

    if ( profileFileList.includes( "custom" )  ){
        $( "#activeProfile" ).val( "custom" );
        activeProfileName = "custom";
    }

    sendMessage( "updateActiveProfile", { "activeProfileName": activeProfileName } );
}

function getPreviousActiveProfile() {
    sendMessage( "updateActiveProfile", { "activeProfileName": "get_Previous_Select" } );
}

function setPreviousActiveProfile( data ) {
    $( "#activeProfile" ).val( data.activeFilename );

    if( data.xmlFileName.includes( data.activeFilename ) ) {
        $( "#removeBtn" ).addClass( "disabled" );
    } else{
        $( "#removeBtn" ).removeClass( "disabled" );
    }
}

function showSyntaxColoringData( data ) {
    setCurrentElem( data, "colorization" );
    let key                     = data.id;
    var syntaxColoringObject    = JSON.parse( $( "#syntaxColoringDatas" ).val().trim().replace( /'/g, '"' ) ) ;

    if( key == "default" || key == "string" ) {
        displaySyntaxColoringData( syntaxColoringObject[ key ] );
    } else{
        Object.keys( syntaxColoringObject ).map( keys => {
            if ( keys == data.id.split( "_" )[0] ) {
                Object.keys( syntaxColoringObject[ keys]  ).map( element => {
                    if ( element == data.id.substring( data.id.indexOf( "_" ) + 1 ) ) {
                        displaySyntaxColoringData( syntaxColoringObject[ keys ][ element ] );
                    }
                } );
            }
        } );
    }
}

function displaySyntaxColoringData( syntaxColoringObject ) {
    var value = "";

    Object.keys( syntaxColoringObject  ).map( item => {
        value = syntaxColoringObject[ item ];
        if( $( "#" + item ).attr( "type" ) == "checkbox" ) {
            $( "#" + item ).prop( "checked", value == "true" ? true : false );
        } else if( item == "foreground" ){
            value = rgbToHex( value.split( "," ) );
            $( "#" + item ).val( value );
        }
    } );
}

function componentToHex( value ) {
    var hex = value.toString( 16 );

    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex( rgb ) {
    return "#" + componentToHex( parseInt( rgb[0] ) ) + componentToHex( parseInt( rgb[1] )) + componentToHex( parseInt( rgb[2] ) );
}

function hexToRgb( hex ) {
    var resultData = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

    if( resultData ){
        var r = parseInt( resultData[1], 16 );
        var g = parseInt( resultData[2], 16 );
        var b = parseInt( resultData[3], 16 );

      return r+","+g+","+b;
    }

    return null;
}

function populateDefault() {
    var syntaxColoringObject = JSON.parse( $( "#syntaxColoringDatas" ).val().trim().replace( /'/g, '"' ) );

    if( $( "#default" ).attr( "class" ).indexOf( "active" ) != -1 ){
        displaySyntaxColoringData( syntaxColoringObject[ "default" ] );
    }
}

function updateSyntaxColoringData( element ) {
    var syntaxColoringObject    = JSON.parse( $( "#syntaxColoringDatas" ).val().trim().replace( /'/g, '"' ) ) ;
    let value                   = ( $( "#" + element.id ).attr( "type" ) == "checkbox" ) ?  ( $( "#" + element.id ).is( ":checked" ) ? "true" : "false" ) : hexToRgb( $( "#" + element.id ).val() );
    selectedColoringElement = selectedColoringElement == undefined ? "default" : selectedColoringElement;

    if( selectedColoringElement == "default" || selectedColoringElement == "string" ){
        syntaxColoringObject[ selectedColoringElement ][ element.id ] = value;
    } else{
        Object.keys( syntaxColoringObject ).map( keys => {
            if ( keys == selectedColoringElement.split( "_" )[0] ) {
                Object.keys( syntaxColoringObject[ keys]  ).map( object => {
                    if ( object == selectedColoringElement.substring( selectedColoringElement.indexOf( "_" ) + 1 ) ) {
                        syntaxColoringObject[ keys ][ object ][ element.id ] = value;
                    }
                } );
            }
        } );
    }

    $( "#syntaxColoringDatas" ).val( JSON.stringify( syntaxColoringObject ).replace( /"/g, "'" ) ) ;
}

function removeCustomOption( data ) {
    $( "#activeProfile option[ value='custom' ]").remove();
    if( !data.isCustom ){
        $( "#activeProfile" ).val( data.activeFilename );
    }
}

function removeCustomFile() {
    sendMessage( "removeCustomProfile", { "selectedCustomProfile": "custom", "activeProfileName": $( "#activeProfile" ).val() } );
}

function renameProfilePreferences() {
    $( "#createNewProfileSection" ).modal( "toggle" );
}

function toggleStyleOptions( add, remove  ) {
    $( ".syntaxColorOption" ).removeClass( remove );
    $( ".syntaxColorOption" ).addClass( add );
}

function populateFomatterProfileData( data ) {
    let profielData = data.formatterProfileData.profile.formatting;

    Object.keys( profielData ).map( tabName => {
        Object.keys( profielData[ tabName ] ).map( fields =>{
            if( $("#" + fields ).attr( "type" ) == "text" || $( "#" + fields ).is( "textarea" ) || $( "#" + fields ).is( "select" ) ){
                if( $( "#" + fields ).is( "select" ) && $( "#" + fields ).attr( "multiple" ) != undefined ){
                    $( "#" + fields ).empty();
                    profielData[ tabName ][ fields ].split( "," ).map( data =>{
                        $( "#" + fields ).append( `<option value="${data}">${data}</option>` )
                    } )
                } else{
                    $( "#" + fields ).val(  profielData[ tabName ][ fields ] );
                }
            } else if( $( "#" + fields ).attr( "type" ) == "checkbox" || $( "#" + fields ).attr( "type" ) == "radio" ) {
                $( "#" + fields ).prop( "checked", profielData[ tabName ][ fields ] == "true" ? true : false );
            }
        } );
    } );
}

function updateProfile( data ){
    var callBack = new Function(
        "return " + data.actionData + "()"
    )();
}

function localize( message ) {
    var type = document.getElementById("languageID").value;
    message = message || "en";
    let result;

    if( type == "en" && i18n_en.hasOwnProperty( message ) ) {
        result = i18n_en[ message ];
    } else if(type == "ja" && i18n_ja.hasOwnProperty( message ) ) {
        result = i18n_ja[ message ];
    }

    return result;
}

function closeModal( id ) {
    $( id ).modal( "hide" );
}

function activeTab( tab ) {
    $( ".moreActions" ).addClass( "active" );
    
    // if ( tab == "editor"|| tab =="formatter" || tab == "codeAssist" ) {
    //     $( ".moreActions" ).removeClass( "active" )
    // }

    $( "#pills-tab .nav-link" ).removeClass( "active" );
    $( "#pills-"+ tab + "-tab" ).addClass( "active" );
    if ( tab =='outline' ) {
        $( ".pills-outline-tab" ).addClass( 'active' );
        $( ".pills-syntaxChecking-tab" ).removeClass( 'active' );
    } else if ( tab == 'syntaxChecking' ) {
        $( ".pills-syntaxChecking-tab" ).addClass( 'active' );
        $( ".pills-outline-tab" ).removeClass(  'active' );
    } else {
        $( ".pills-outline-tab" ).removeClass( 'active' );
        $( ".moreActions" ).removeClass('active');
        $( ".pills-syntaxChecking-tab" ).removeClass( 'active' );
    }
    $( ".tab-pane.parentForm" ).removeClass( "show active" );
    $( "#pills-" + tab ).addClass( "show active" );
}

function activeSubTab( subTab,tab ) {
    $( ".nav-item .sub-menus .dropdown-item" ).removeClass( "active" );
    $( "#pills-" + subTab + "-tab" ).trigger( "click" );
    $( "#pills-" + subTab + "-tab" ).addClass( "active" );
    $( "#" + tab + "-tab" ).trigger( "click" );
    $( "#" + tab + "-tab" ).addClass ( "active" );
    $( "#" + subTab + "-tab" ).trigger( "click" );
    $( "#li-" + subTab + "-tab" ).addClass( "active" );
    if ( $( "#" + subTab + "-tab" ).hasClass( "active" ) ) {
        $( "#li-" + subTab + "-tab" ).addClass( "active" );
    }
}

function searchFilter() {
    let searchKey = $( "#searchkey" );
    $(".scroll").remove();
    if ( searchKey.val().trim() ){
        let divHtml = `<div class="scroll" id="searchBox">`
        const formLabels = fuzzysort.go( searchKey.val(), allFields );
        formLabels.map( results => {
            let heighligts = fuzzysort.highlight( results, open = '<span class="mark">', close = '</span>' );
            const checkIsRegexChar = results.target.includes( "<\\cfoutput>" );
            divHtml += `<label class="findLabels" onclick="targetToTab('${!checkIsRegexChar ? results.target?.toString()?.trim()?.replace(/'/g, "\\\\\\\'") : results.target?.trim()}')">` + heighligts + `</label>`;
        })

        divHtml += `</div>`
        searchKey.after( divHtml )
        $( "#searchBox" ).width( $( "#searchkey" ).outerWidth() )
    }
}

function targetToTab( labelText ) {
    $( ".mark" ).removeClass( "mark" );
    let currentElem = $( ".search:contains('" + labelText?.toString() + "')" );
    if( currentElem.length > 1 ){
        currentElem = currentElem.filter(function () {
            return $(this).text() === labelText;
        });
    }
    if ( labelText?.includes( "<cfoutput>" ) )
        currentElem = $( "#putcfoutputonnewline" ).next()
    if( currentElem?.length ) {
        currentElem.addClass( "mark" );
        activeTab( $( currentElem ).attr( "data-tab" ) );
        if ( !!$( currentElem ).attr( "data-subtab" ) )
            activeSubTab( $( currentElem ).attr( "data-subtab" ), $( currentElem ).attr( "data-tab" ) );
        setTimeout( function () {
            $( currentElem ).removeClass( "mark" );
        }, 5000 );
    }
    $( ".scroll" ).remove();
    $( "#searchkey" ).val( "" );
    const scrollableParent = currentElem.parent().parent( ".scrollBar" );
    if ( scrollableParent?.length )
        $( scrollableParent ).animate( { scrollTop: 0 },"fast" );
    setTimeout( () => {
        if ( scrollableParent?.length ) {
            $( scrollableParent ).animate( {
                scrollTop: currentElem.offset().top - $( scrollableParent ).offset().top
            } );
        }
    }, 1000 );
}


$( document ).ready(function () {
    // get all the search result on initial loading.
    $( ".search" ).each(function () {
        allFields.push( $(this).text().toString() );
    })

    $( "#searchkey").on('change keypress', function ( e ) {
        // After filter search labels click the `enter button`, the page redirect to first search element tab
        if( e.which == 13 && $( ".findLabels" ).length ){
            $( $( ".findLabels" )[0] ).trigger( "click" );
        }
    });

    $( window ).on( 'resize',function(){
        $( "#searchBox" ).width( $( "#searchkey" ).outerWidth() )
    })
});

function innerActiveFields( subTab ) {
    let activeTab = $( subTab ).attr( "data-subtab" );
    $( ".nav-item .sub-menus .dropdown-item" ).removeClass( "active" );
    if ( $( "#" + activeTab + "-tab" ).hasClass( "active" ) ) {
        $( "#li-" + activeTab + "-tab" ).addClass( "active" );
    } else {
        $( "#li-" + activeTab + "-tab" ).removeClass( "active" );
    }
}

function gotoInnerActiveFields( subTab ) {
    let activeTab = $( subTab ).attr( "data-subtab" );
    $( ".nav-item .sub-menus .dropdown-item" ).removeClass( "active" );
    $( "#li-" + activeTab + "-tab" ).addClass( "active" )
    if ( $ ( "#li-" + activeTab + "-tab" ).hasClass( "active" ) ) {
        $( "#v-pills-tab > button.active" ).removeClass( "active" );
        $( `#v-pills-tab #${activeTab}-tab` ).addClass( "active" );
    }
}