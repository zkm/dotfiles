const vscode = acquireVsCodeApi();
const formElement = document.getElementById("editRDSConfig");
let desc = document.getElementById("description");
let host = document.getElementById("host");
let port = document.getElementById("port");
let enableSSL = document.getElementById("enableSSL");
let contextRoot = document.getElementById("contextRoot");
let userName = document.getElementById("userName");
let password = document.getElementById("password");
let editConfigId = document.getElementById("editConfigId");
let requiredField = document.querySelectorAll(".requiredRDS");

function postData(edit) {
	let formValues = {
		id: editConfigId.value,
		name: desc.value,
		host: host.value,
		port: port.value,
		enableSSL: enableSSL.checked ? true : false,
		contextRoot: contextRoot.value,
		RDSUsername: userName.value,
		RDSPassword: password.value,
		RDSOnly:true,
		RDSShow:true,
	}
	if (!edit) {
		formValues = {
			id: editConfigId.value,
			name: desc.value,
			host: host.value,
			port: port.value,
			enableSSL: enableSSL.checked ? true : false,
			contextRoot: contextRoot.value,
			RDSUsername: userName.value,
			RDSPassword: password.value,
			RDSOnly:true,
			description: "",
			appServer: "",
			appServerName: "",
			version: "",
			enableSSL: false,
			autoStart: false,
			autoStop: false,
			type: "local",
			serverHome: "",
			documentRoot: "",
			adminPort: 8995,
			userName: "",
			password: "",
			context: "AdminServlet",
			mappings: [],
			RDSShow: true,
		}
	} else {
        let servers = document.getElementById( "servers" ).value;
        let serverId = document.getElementById( "editConfigId" ).value;
        servers = servers.replace(/'/g, '\"');
        servers = JSON.parse( servers );
        let response = servers.filter( function ( data ) {
            if ( data.id == serverId ) {
                return data;
            }
        });
        formValues.RDSOnly = response[ 0 ].RDSOnly;
    }
	document.getElementById("errordescription").style.display = "none";
	document.getElementById("errorhost").style.display = "none";
    document.getElementById("errorRDSUsername").style.display = "none";
    document.getElementById("errorRDSPassword").style.display = "none";
	document.getElementById("requiredDescriprtion").style.display = "inline";
	document.getElementById("errorport").style.display = "none";

    changeRequiredOption("none");

	if (desc.value.toString().trim() == "")
		document.getElementById("errordescription").style.display = "block";
	if (host.value.toString().trim() == "")
		document.getElementById("errorhost").style.display = "block";
	if (port.value.toString().trim() == "")
		document.getElementById("errorport").style.display = "block";

	if (desc.value.toString().trim() != "" && port.value.toString().trim() != "" && host.value.toString().trim() != "") {
		vscode.postMessage({
			type:"send",
			data: formValues
		});
	}
}

function closeWebView() {
	vscode.postMessage({
		type: "close",
		data:{}
	});
}

function validate(current) {
	document.getElementById("error" + current.getAttribute("id")).style.display = "none";
	if(current.value.toString().trim() == "") {
		document.getElementById("error" + current.getAttribute("id")).style.display = "block";
	}
}

function checkRDSConnection() {
    let checkField = ["host", "port", "userName", "password", "contextRoot"];
    let ssl = document.getElementById("enableSSL").checked;

    vscode.postMessage({
        type: "verifyRDSConnection",
        host: document.getElementById(checkField[0]).value.trim(),
        port: document.getElementById(checkField[1]).value.trim(),
        RDSUsername: document.getElementById(checkField[2]).value.trim(),
        RDSPassword: document.getElementById(checkField[3]).value.trim(),
        contextRoot: document.getElementById(checkField[4]).value.trim(),
        enableSSL: ssl
    });
}

function changeRequiredOption(current) {
    for (let i = 0; i < requiredField.length; i++) {
        requiredField[i].style.display = current;
    }
}

function checkServerExists(id) {
    let servers = document.getElementById("servers").value.trim();
    document.getElementById("errordescription").style.display = "";
    document.getElementById("isServerExists").style.display = "";
    document.getElementById("submitBtn").disabled = false;
    servers = servers.replace(/'/g, '\"');
    servers = JSON.parse(servers);
    let name = document.getElementById("description").value.trim().toUpperCase();

    let response = servers.filter(function( data ) {
        if (data.id == id) {
            return data;
        }
    });

    if (response.length) {
        if (name != "") {
            let checkName = servers.filter(function( data ) {
                if (data.name.toUpperCase() == name) {
                    return data;
                }
            });
            if (checkName.length) {
                if (checkName[0].id != id) {
                    document.getElementById("errordescription").style.display = "none";
                    document.getElementById("isServerExists").style.display = "block";
                    document.getElementById("submitBtn").disabled = true;
                    return;
                }
            }
        }
    } else {
        if (name != "") {
            servers.map(data => {
                if (data.name.toUpperCase() == name) {
                    document.getElementById("errordescription").style.display = "none";
                    document.getElementById("isServerExists").style.display = "block";
                    document.getElementById("submitBtn").disabled = true;
                    return;
                }
            });
        }
    }
    return;
}

function validatePort(Id, ErrId, inValidErrorPort) {
    let isValid = false;
    var numbers = /^[-+]?[0-9]+$/g;
    if (document.getElementById(Id).value.length == 0) {
        document.getElementById(ErrId).style.display = "block";
        document.getElementById(inValidErrorPort).style.display = "none";
        isValid = false
    } else {
        if (numbers.test(document.getElementById(Id).value)) {
            document.getElementById(ErrId).style.display = "none";
            document.getElementById(inValidErrorPort).style.display = "none";
            isValid = true;
        } else {
            document.getElementById(ErrId).style.display = "none";
            document.getElementById(inValidErrorPort).style.display = "block";
            isValid = false;
        }
    }
    return isValid;
}