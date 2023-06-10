const vscode                = acquireVsCodeApi();

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

function storeData(){
    let formValues = JSON.stringify( ( $( "#debugSettingsForm"  ).serializeArray() ) );
    sendMessage( "save", { "formData": formValues } );
}

function restoreData(){
    let defaultDebugConfigurations = {
        "homeURL"               : "about:blank",
        "validExtensions"       : "cfm, cfml, cfc",
        "scopes"                : ["arguments", "cgi", "request", "variables"],
        "breakOnException"      : false,
    };

    for( var item in defaultDebugConfigurations ) {
        if( item == "scopes" ){
            $( "#debugSettingsForm input:checkbox" ).each( function() {
                if( defaultDebugConfigurations[ item ].includes( this.name ) )
                    $( "#" + this.name ).prop( "checked", true );
                else
                    $( "#" + this.name ).prop( "checked", false );
            });
        }

        if( $( "#" + item ).attr( "type" ) == "text" )
            $( "#" + item ).val(  defaultDebugConfigurations[ item ] );
        else if( $( "#" + item ).attr( "type" ) == "checkbox" )
            $( "#" + item ).prop( "checked", defaultDebugConfigurations[ item ] );
    }
}