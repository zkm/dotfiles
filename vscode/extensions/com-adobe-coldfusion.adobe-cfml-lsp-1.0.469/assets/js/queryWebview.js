const vscode = acquireVsCodeApi();
const serverElement = document.getElementById('server');
const datasourceElement = document.getElementById('datasource');

window.addEventListener("resize", function () {
	toggleOnResize()
});

function init(serverList, datasourceList, activeServer, activeDatasource) {
	loadServer(serverList, activeServer);
	loadDatasource(datasourceList, activeDatasource);
	toggleOnResize();
}

function loadServer(serverList, activeServer){
	serverList.map((data,index) => {
		var option = document.createElement("option");
		option.text = data.name;
		option.value = data.port;
		option.setAttribute('_serverHost', data.host);
		option.setAttribute('_userName', data.RDSUsername);
		option.setAttribute('_password', data.RDSPassword);
		option.setAttribute('_type', data.type);
		option.setAttribute('_id', data.id);
		option.setAttribute('_enableSSL', data.enableSSL);
        option.setAttribute('_contextRoot', data.contextRoot);
		if (activeServer != '' && activeServer == index) {
			option.selected = true;
		}
		if (data.RDSShow != undefined && data.RDSShow)
			serverElement.appendChild(option);
	});
}

function loadDatasource(datasourceList, activeDatasource) {
	datasourceList.map((data) => {
		var option = document.createElement("option");
		option.text = data;
		option.value = data;
		if (activeDatasource != '' && activeDatasource == data){
			option.selected = true;
		}
		datasourceElement.appendChild(option);
	});
}

function changeServer() {
	let temp = {
		headerType:"server",
		...returnConfig()
	}

	vscode.postMessage(temp)
}

function changeDatasource(params) {
	let temp = {
		headerType: "datasource",
		...returnConfig()
	}

	vscode.postMessage(temp)
}

function returnConfig() {
	let temp = {
		id: serverElement.options[serverElement.selectedIndex].getAttribute('_id'),
		label: datasourceElement.value,
		name: serverElement.options[serverElement.selectedIndex].text,
		host: serverElement.options[serverElement.selectedIndex].getAttribute('_serverHost'),
		type: serverElement.options[serverElement.selectedIndex].getAttribute('_type'),
		port: serverElement.value,
		userName: serverElement.options[serverElement.selectedIndex].getAttribute('_userName'),
		password: serverElement.options[serverElement.selectedIndex].getAttribute('_password'),
		activeIndex: serverElement.selectedIndex,
        enableSSL: serverElement.options[serverElement.selectedIndex].getAttribute('_enableSSL') == "false" ? false : true,
        contextRoot: serverElement.options[serverElement.selectedIndex].getAttribute('_contextRoot'),
	}
	return temp;
}

function toggleOnResize() {
	divElement = document.querySelector(".header");
	elemHeight = divElement.offsetHeight;
	var all = document.getElementsByClassName("rdsthead");
	for (var i = 0; i < all.length; i++) {
		all[i].style.top = elemHeight + "px";
	}
	if (window.innerWidth <= 575) {
		document.getElementById("resultContainer").style.paddingTop = "75px";
	} else {
		document.getElementById("resultContainer").style.paddingTop = "45px";
	}
}