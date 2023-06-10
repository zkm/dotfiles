const vscode = acquireVsCodeApi();
const i18n_en = {
    "adobe-cfml.debugMappings.updateBtn"      : "Update",
    "adobe-cfml.debugMappings.addBtn"         : "Add"
};
const i18n_ja = {
    "adobe-cfml.debugMappings.updateBtn"      : "アップデート",
    "adobe-cfml.debugMappings.addBtn"         : "\u8ffd\u52a0"
};

function disposeWebview() {
    vscode.postMessage({
        command : "close"
    });
}

function sendMessage( action, data ) {
    vscode.postMessage({
        action  : action,
        data    : data
    });
}

function openFolderPicker( key ) {
    vscode.postMessage({
        action  : "openFolderPicker",
        data    : key
    });
}

function addMappings() {
    if( !validateDebugMappings() )
        return false;

    var eclipsePath     = $( "#eclipsePath" ).val().trim();
    var coldfusionPath  = $( "#coldfusionPath" ).val().trim();
    var table           = $( "#debugMapping_data_table tr" );
    var table_len       = ( table.length ) - 1;
    var uuid            = this.createUUID();
    var mapId           = $( "#mapId" ).val();

    if( mapId.length && mapId != "" && mapId != undefined ) {
        var list = $( ".debugMappingData" );

        for( var item of list ) {
            if( item.children[0].getAttribute( "data-id" ) === mapId ) {
                $( "#eclipsePath_row" + mapId ).html( eclipsePath );
                $( "#coldfusionPath_row" + mapId ).html( coldfusionPath );
            }
        }
    } else{
        var tbodyContent = "";

        tbodyContent = "<tr class='debugMappingData' id='row" + table_len + "'><td data-id= '" + uuid + "' id='eclipsePath_row" + uuid + "'>" + eclipsePath + "</td><td id='coldfusionPath_row" + uuid + "'>" + coldfusionPath + "</td><td class='text-center'> <button type='button' id='edit_button" + table_len + "' class='edit btn btn-sm mr-md-2 mb-3'  data-bs-toggle='modal' data-bs-target='#AddEditDebugMappings' onclick='editMappings(`" + uuid + "`)'><i class='fa fa-pencil' aria-hidden='true'></i></button> <button type='button' onclick = 'delete_row(" + table_len + ")' class='delete btn btn-sm mb-3' > <i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>";
        $( "#debugMapping_data_table" ).append( tbodyContent );
    }

    closeModal( "#AddEditDebugMappings" );

    return true;
}

function editMappings( mapId ) {
    var eclipsePath         = $( "#eclipsePath_row" + mapId );
    var coldfusionPath      = $( "#coldfusionPath_row" + mapId );
    var eclipsePath_data    = eclipsePath.html();
    var coldfusionPath_data = coldfusionPath.html();

    $( "#mapId" ).val( mapId );

    isModalOpened           = true;
    currModalId             = "#AddEditDebugMappings";

    $( "#eclipsePath" ).val( eclipsePath_data );
    $( "#coldfusionPath" ).val( coldfusionPath_data );

    $( "#addDebugMappingBtn" ).html( localize( "adobe-cfml.debugMappings.updateBtn" ) );
}

function createUUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);

        return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}

function closeModal( id ) {
    isModalOpened   = false;
    currModalId     = "";

    $( "#eclipsePath" ).val("");
    $( "#coldfusionPath" ).val("");
    $( "#mapId" ).val("");
    $( "#addDebugMappingBtn" ).html( localize( "adobe-cfml.debugMappings.addBtn" ) );
    $( id ).modal( "hide" );
}

function delete_row( no ) {
    $( "#row" + no ).remove();
}

function localize( message ) {
    var type    = $( "#languageID" ).val();
    message     = message || "en";
    let result;

    if( type == "en" && i18n_en.hasOwnProperty( message ) ) {
        result = i18n_en[ message ];
    } else if( type == "ja" && i18n_ja.hasOwnProperty( message ) ) {
        result = i18n_ja[ message ];
    }

    return result;
}

function storeData() {
    var serverId = $( "#RDSServer" ).val();
    var mappings = [];

    $( ".debugMappingData" ).each(function () {
        var struct = {};
        var $tds = $(this).find( "td" );

        struct[ "mappingId" ] = $tds.data( "id" );
        struct[ "client" ] = $tds.eq(0).text();
        struct[ "server" ] = $tds.eq(1).text();

        mappings.push( struct );
    });

    vscode.postMessage({
        action: "UpdateData",
        data: { "mappings": mappings, "serverId" : serverId }
    });
}

function getData(){
    let serverId = $( "#RDSServer" ).val();

    vscode.postMessage({
        action: "getServerDebugMapping",
        data: { "serverId": serverId }
    });
}

function validateDebugMappings( ) {
    let eclipsePath     = $( "#eclipsePath" ).val();
    let coldfusionPath  = $( "#coldfusionPath" ).val();
    let allowSubmit     = true;

    allowSubmit         = ( eclipsePath == "" || coldfusionPath == "" ) ? false : true ;

    if( !allowSubmit )
        $( "#addDebugMappingBtn" ).addClass( "disabled" );
    else
        $( "#addDebugMappingBtn" ).removeClass( "disabled" );

    return allowSubmit;
}