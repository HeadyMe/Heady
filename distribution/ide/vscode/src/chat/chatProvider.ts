import * as vscode from 'vscode';
import { HeadyClient } from '../api/headyClient';

export class ChatViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private messages: { role: string; text: string }[] = [];

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly client: HeadyClient
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === 'send') {
        this.addMessage('user', msg.text);
        const reply = await this.client.chat(msg.text, 'chat_panel');
        this.addMessage('assistant', reply);
      }
    });
  }

  addMessage(role: string, text: string) {
    this.messages.push({ role, text });
    this._view?.webview.postMessage({ type: 'message', role, text });
  }

  private getHtml(): string {
    return `<!DOCTYPE html>
<html><head><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:var(--vscode-font-family);color:var(--vscode-foreground);background:var(--vscode-sideBar-background);display:flex;flex-direction:column;height:100vh}
  #chat{flex:1;overflow-y:auto;padding:8px}
  .msg{margin:6px 0;padding:8px 12px;border-radius:10px;font-size:13px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap}
  .msg.user{background:var(--vscode-inputValidation-infoBackground,rgba(124,58,237,0.15));margin-left:24px;text-align:right}
  .msg.assistant{background:var(--vscode-editor-inactiveSelectionBackground,rgba(255,255,255,0.04));margin-right:24px}
  .input-area{display:flex;gap:6px;padding:8px;border-top:1px solid var(--vscode-panel-border)}
  textarea{flex:1;padding:8px;border-radius:6px;border:1px solid var(--vscode-input-border);background:var(--vscode-input-background);color:var(--vscode-input-foreground);font-size:13px;resize:none;outline:none;min-height:36px}
  button{padding:8px 14px;border-radius:6px;border:none;background:var(--vscode-button-background);color:var(--vscode-button-foreground);cursor:pointer;font-size:13px}
</style></head><body>
  <div id="chat"><div class="msg assistant">Hi! I'm Heady. Ask me anything about your code.</div></div>
  <div class="input-area"><textarea id="input" rows="1" placeholder="Ask Heady..."></textarea><button id="send">Send</button></div>
  <script>
    const vscode=acquireVsCodeApi();const chat=document.getElementById('chat');const input=document.getElementById('input');
    document.getElementById('send').addEventListener('click',send);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});
    function send(){const t=input.value.trim();if(!t)return;input.value='';vscode.postMessage({type:'send',text:t})}
    window.addEventListener('message',e=>{const m=e.data;if(m.type==='message'){const d=document.createElement('div');d.className='msg '+m.role;d.textContent=m.text;chat.appendChild(d);chat.scrollTop=chat.scrollHeight}});
  </script>
</body></html>`;
  }
}
