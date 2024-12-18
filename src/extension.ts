import * as vscode from 'vscode';

const clipboardHistory: string[] = [];
const MAX_HISTORY = 10;

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.addClipboardToHistory', async () => {
            const clipboardText = await vscode.env.clipboard.readText();
            if (clipboardText && !clipboardHistory.includes(clipboardText)) {
                clipboardHistory.unshift(clipboardText);
                if (clipboardHistory.length > MAX_HISTORY) {
                    clipboardHistory.pop();
                }
                vscode.window.showInformationMessage('Текст добавлен в историю.');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.selectFromClipboardHistory', async () => {
            const selected = await vscode.window.showQuickPick(clipboardHistory, {
                placeHolder: 'Выберите текст для вставки',
            });
            if (selected) {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.active, selected);
                    });
                }
            }
        })
    );
}

export function deactivate() {}