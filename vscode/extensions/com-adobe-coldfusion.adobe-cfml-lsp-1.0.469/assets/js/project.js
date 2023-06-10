function isValid( key ) {
	if ( key == "addProject" ) {
		var form_required_data = [
			{ Id: "label", ErrId: "errorProjectName" },
			{ Id: "path", ErrId: "errorProjectLocation" },
		];
	} else if (key == "addLinkedFolder") {
		var form_required_data = [
			{ Id: "label", ErrId: "errorlinkedFolderName" },
			{ Id: "path", ErrId: "errorLinkedFolderLocation" }
		];
	}
	let isValid = true;
	form_required_data.forEach( data => {
		if( document.getElementById( data.Id ).value.length == 0 ) {
			document.getElementById( data.ErrId ).style.display = "block";
			isValid = false;
		} else {
			document.getElementById( data.ErrId ).style.display = "none";
		}
	});
	return isValid;
}

const vscode = acquireVsCodeApi();

function storeData( key ) {
	if ( isValid( key ) ) {
		let config ={};
		if ( key == "addProject" ) {
			config = {
				"id": document.forms[0].id.value,
				"label": document.forms[0].label.value,
				"path": document.forms[0].path.value,
				"server": document.forms[0].server.value,
				"cfmlDict": document.forms[0].cfmlDict.value,
				"linkedFolders":[],
				"folders": [ {"path": document.forms[0].path.value } ],
                "linkedFolders" : linkedFolderData(),
                "imported": document.forms[0].imported.value || false
			};
		} else if (key == "addLinkedFolder") {
			config = {
				"id": document.forms[0].id.value,
				"label": document.forms[0].label.value,
				"path": document.forms[0].path.value
			};
		}

		let value = [];
		value = [...value, config];
		let configJSON = JSON.stringify(value);

		vscode.postMessage({
			command: "save",
			text: configJSON
		});

		// clear all values from form
		document.getElementById( key ).reset();
	}
}

function openFolderPicker( key ) {
	if( key == "addLinkedFolder" ) {
		config = {
			"id": document.forms[0].id.value,
			"label": document.forms[0].label.value,
			"path": document.forms[0].path.value
		};
	} else if( key == "addProject" ) {
		config = {
			"id": document.forms[0].id.value,
			"label": document.forms[0].label.value,
			"path": document.forms[0].path.value,
			"server": document.forms[0].server.value,
			"cfmlDict": document.forms[0].cfmlDict.value
		};
    } else if ( key == "addLinkedFolderPath" ) {
		config = {
            "id": "linkedFolderPath",
            "label": $( "#linkedFolderName" ).val(),
            "path": $( "#linkedFolderPath" ).val()
        };
	}

	vscode.postMessage({
		command: "openFolderPicker",
		text: config
	});
}

function storeImportData (key) {
	let config = {};
	config = {
		"id": document.forms[0].id.value,
		"workSpacePath": document.forms[0].workSpacePath.value,
		"projectPath": document.forms[0].projectPath.value
	}
	vscode.postMessage({
		command: key,
		text: JSON.stringify(config)
	});
}

function disposeWebview() {
	vscode.postMessage({
		command: "close"
	});
}

function checkProjectExists(id) {
    let projects = document.getElementById("projects").value.trim();
    document.getElementById("isProjectExists").style.display = "";
    document.getElementById("submitBtn").disabled = false;
    projects = projects.replace(/'/g, '\"');
    projects = JSON.parse(projects);
    let label = document.getElementById("label").value.trim().toUpperCase();

    let response = projects.filter(function (data) {
        if (data.id == id) {
            return data;
        }
    });

    if (response.length) {
        if (label != "") {
            let checkLabel = projects.filter(function (data) {
                if (data.label.toUpperCase() == label) {
                    return data;
                }
            });
            if (checkLabel.length) {
                if (checkLabel[0].id != id) {
                    document.getElementById("errorProjectName").style.display = "none";
                    document.getElementById("isProjectExists").style.display = "block";
                    document.getElementById("submitBtn").disabled = true;
                    return;
                }
            }
        }
    } else {
        if (label != "") {
            projects.map(data => {
                if (data.label.toUpperCase() == label) {
                    document.getElementById("errorProjectName").style.display = "none";
                    document.getElementById("isProjectExists").style.display = "block";
                    document.getElementById("submitBtn").disabled = true;
                    return;
                }
            });
        }
    }
    return;
}

function checkLFExists(id) {
    let linkedFolders = document.getElementById("linkedFolders").value.trim();
    document.getElementById("isLFExists").style.display = "";
    document.getElementById("submitBtn").disabled = false;
    linkedFolders = linkedFolders.replace(/'/g, '\"');
    linkedFolders = JSON.parse(linkedFolders);
    let label = document.getElementById("label").value.trim().toUpperCase();

    let response = linkedFolders.filter(function (data) {
        if (data.id == id) {
            return data;
        }
    });

    if (response.length) {
        if (label != "") {
            let checkLabel = linkedFolders.filter(function (data) {
                if (data.label.toUpperCase() == label) {
                    return data;
                }
            });
            if (checkLabel.length) {
                if (checkLabel[0].id != id) {
                    document.getElementById("errorlinkedFolderName").style.display = "none";
                    document.getElementById("isLFExists").style.display = "block";
                    document.getElementById("submitBtn").disabled = true;
                    return;
                }
            }
        }
    } else {
        if (label != "") {
            linkedFolders.map(data => {
                if (data.label.toUpperCase() == label) {
                    document.getElementById("errorlinkedFolderName").style.display = "none";
                    document.getElementById("isLFExists").style.display = "block";
                    document.getElementById("submitBtn").disabled = true;
                    return;
                }
            });
        }
    }
    return;
}

function delete_row(no) {
    document.getElementById("row" + no + "").outerHTML = "";
}

function closeModal( id ) {
    $( id ).modal( "hide" );
    $( "#error_linkedFolderName" ).addClass( "d-none" );
    $( "#error_linkedFolderPath" ).addClass( "d-none" );
}

function openModal( id ) {
    $( id ).modal( "show" );
    $( "#linkedFolderName" ).val( "" )
    $( "#linkedFolderPath" ).val( "" )
    $( "#linkedFolderName" ).removeAttr( "disabled", false );
    $( "#linkedFolderUpdateButton" ).html( "Add" );
}

function addLinkedFolder(){
    var linkedFolderName = $( "#linkedFolderName" ).val();
    var linkedFolderPath = $( "#linkedFolderPath" ).val();
    if( validate() ){
        var table = $( "#LinkedFolder_data_table tr" );
        var table_len = ( table.length ) - 1;
        var uuid = this.createUUID();
        var tbodyContent = "";

        tbodyContent = "<tr class='linkedFolderDatas' id='row" + table_len + "'><td data-id= '" + uuid + "' id='folderName_row" + table_len + "'>" + linkedFolderName + "</td><td id='folderPath_row" + table_len + "'>" + linkedFolderPath + "</td><td><button type='button' onclick = 'delete_row(" + table_len + ")' class='delete btn' > <i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>";

        $( "#LinkedFolder_data_table" ).append( tbodyContent );

        closeModal( "#LinkedFolderModal" );
        return true;
    }
    return false;
}

function validate(){
    var fields = [ "linkedFolderName", "linkedFolderPath" ];
    var valid = true;

    fields.map( data => {
        let value = $( "#" + data ).val();
        let projectPath = $( "#path" ).val();
        if(  value == "" ){
            valid = false;
            $( "#error_" +  data ).removeClass( "d-none" );
            $( "#error_" +  data ).text( localize( "adobe-cfml.project.linkedFolder.errorLinkedFolderLocation" ) );
        } else if ( data === "linkedFolderPath" && projectPath ===  value ){
            valid = false;
            $( "#error_" +  data ).removeClass( "d-none" );
            $( "#error_" +  data ).text( localize( "adobe-cfml.project.linkedFolder.error" ).replace( "{path}", "' " + projectPath + "'" ) );
        } else{
            $( "#error_" +  data ).addClass( "d-none" );
        }
    });

    return valid;
}

function linkedFolderData(){
    var list = document.getElementsByClassName( "linkedFolderDatas" );
	var linkedFolders = [];
	for ( var item of list ) {
		var struct = {};
        struct[ "id" ]     = item.children[0].getAttribute( "data-id" );
        struct[ "label" ]  = item.children[0].innerHTML;
        struct[ "path" ] = item.children[1].innerHTML;

		linkedFolders.push( struct );
	}
	return linkedFolders;
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