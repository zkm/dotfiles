# markdown-viewer

VSCode extension to open a markdown viewer from a string instead of an editor.

## Features

Open markdown viewer from a string:

```javascript
vscode.commands.executeCommand("markdown-viewer.openViewer", {
    content: '# My extension'
}).then(id => {
    // id is an identifier of the viewer if you want to update it
    return vscode.commands.("markdown-viewer.openViewer", {
        id: id, // if the viewer has been closed a new viewer will be created
        title: 'My preview', // title of the preview
        column: vscode.ViewColumn.One, // Where to show the webview in the editor
        content: '# My extension' // markdown content
    })
})
```

## Release Notes

### 1.0.0

Initial release of the extension.

**Enjoy!**
