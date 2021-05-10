import * as vscode from 'vscode';
import get from 'axios';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('tchitos-findsyn.findSyn', async () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('Editor not exist');
			return;
		}
		const text = editor.document.getText(editor.selection);
		try {
			const response = await get(`https://api.datamuse.com/words?ml=${text.replace(" ", "+")}`);
			const synonyms: any[] = response.data;

			const quickPick = vscode.window.createQuickPick();
			quickPick.items = synonyms.map((x: any) => ({ label: x.word }));
			quickPick.onDidChangeSelection(([item]) => {
				if (item) {
					// vscode.window.showInformationMessage(item.label);
					editor.edit(edit => {
						edit.replace(editor.selection, item.label);
					});
					quickPick.dispose();
				}
			});
			quickPick.onDidHide(() => quickPick.dispose());
			quickPick.show();
		} catch (error) {
			console.log(error);
			vscode.window.showInformationMessage('Ann error in Api');
		}


	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
