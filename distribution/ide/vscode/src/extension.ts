import * as vscode from 'vscode';
import { HeadyClient } from './api/headyClient';
import { ChatViewProvider } from './chat/chatProvider';

let client: HeadyClient;

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('heady');
  const apiEndpoint = config.get<string>('apiEndpoint', 'http://localhost:3300');
  const mode = config.get<string>('mode', 'hybrid');

  client = new HeadyClient(apiEndpoint, mode);

  // Chat panel
  const chatProvider = new ChatViewProvider(context.extensionUri, client);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('heady.chatView', chatProvider)
  );

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('heady.chat', () => {
      vscode.commands.executeCommand('heady.chatView.focus');
    }),

    vscode.commands.registerCommand('heady.explain', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const selection = editor.document.getText(editor.selection);
      if (!selection) { vscode.window.showWarningMessage('Select code first'); return; }
      const reply = await client.chat(`Explain this code:\n\`\`\`\n${selection}\n\`\`\``, 'explain');
      chatProvider.addMessage('user', `Explain: [selected code]`);
      chatProvider.addMessage('assistant', reply);
    }),

    vscode.commands.registerCommand('heady.refactor', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const selection = editor.document.getText(editor.selection);
      if (!selection) { vscode.window.showWarningMessage('Select code first'); return; }
      const reply = await client.chat(`Refactor this code for clarity and performance:\n\`\`\`\n${selection}\n\`\`\``, 'refactor');
      chatProvider.addMessage('assistant', reply);
    }),

    vscode.commands.registerCommand('heady.tests', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const selection = doc.getText(editor.selection) || doc.getText();
      const reply = await client.chat(`Generate tests for this code:\n\`\`\`${doc.languageId}\n${selection.slice(0, 8000)}\n\`\`\``, 'tests');
      chatProvider.addMessage('assistant', reply);
    }),

    vscode.commands.registerCommand('heady.docs', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const selection = editor.document.getText(editor.selection) || editor.document.getText();
      const reply = await client.chat(`Generate documentation for:\n\`\`\`\n${selection.slice(0, 8000)}\n\`\`\``, 'docs');
      chatProvider.addMessage('assistant', reply);
    }),

    vscode.commands.registerCommand('heady.fix', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
      const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
      if (errors.length === 0) { vscode.window.showInformationMessage('No errors found'); return; }
      const errorText = errors.map(e => `Line ${e.range.start.line + 1}: ${e.message}`).join('\n');
      const code = editor.document.getText();
      const reply = await client.chat(`Fix these errors:\n${errorText}\n\nCode:\n\`\`\`\n${code.slice(0, 8000)}\n\`\`\``, 'fix');
      chatProvider.addMessage('assistant', reply);
    }),

    vscode.commands.registerCommand('heady.agent', async () => {
      const task = await vscode.window.showInputBox({ prompt: 'What should the agent do?', placeHolder: 'e.g., Add error handling to all API routes' });
      if (!task) return;
      chatProvider.addMessage('user', `[Agent] ${task}`);
      const reply = await client.chat(`Agent task: ${task}\n\nWorkspace: ${vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || 'unknown'}`, 'agent');
      chatProvider.addMessage('assistant', reply);
    }),

    vscode.commands.registerCommand('heady.voice', () => {
      vscode.window.showInformationMessage('Voice input: coming soon. Enable in settings.');
    }),

    vscode.commands.registerCommand('heady.login', async () => {
      const token = await vscode.window.showInputBox({ prompt: 'Enter your Heady API token', password: true });
      if (token) {
        await context.secrets.store('heady-token', token);
        client.setToken(token);
        vscode.window.showInformationMessage('Heady: Signed in successfully');
      }
    }),

    vscode.commands.registerCommand('heady.settings', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'heady');
    })
  );

  // Inline completion provider
  if (config.get<boolean>('inlineCompletions', true)) {
    const completionProvider = vscode.languages.registerInlineCompletionItemProvider(
      { pattern: '**' },
      {
        async provideInlineCompletionItems(document, position) {
          const textBefore = document.getText(new vscode.Range(new vscode.Position(Math.max(0, position.line - 20), 0), position));
          try {
            const completion = await client.complete(textBefore, document.languageId);
            if (completion) {
              return [new vscode.InlineCompletionItem(completion, new vscode.Range(position, position))];
            }
          } catch { /* silent */ }
          return [];
        }
      }
    );
    context.subscriptions.push(completionProvider);
  }

  // Status bar
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = '$(hubot) Heady';
  statusBar.command = 'heady.chat';
  statusBar.tooltip = `Heady AI (${mode} mode)`;
  statusBar.show();
  context.subscriptions.push(statusBar);

  // Health check
  client.health().then(ok => {
    statusBar.text = ok ? '$(hubot) Heady' : '$(warning) Heady (offline)';
  });
}

export function deactivate() {}
