const vscode = require('vscode');
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();

const viewType = 'markown-viewer'
const panels = {}

function activate(context) {
	let disposable = vscode.commands.registerCommand('markdown-viewer.openViewer', 
		function ({id, title, content, column}) {
			if (!content)
				return
			
			var panel = panels[id]

			if (!panel) {
				id = new Date().getTime()
				panel = vscode.window.createWebviewPanel(viewType,
					"", column || vscode.ViewColumn.One);
				panels[id] = panel
			}

			panel.webview.html = md.render(content)
			panel.title = title || 'Preview'

			panel.onDidDispose(() => {
				delete panels[id]
			});

			return id
		});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
