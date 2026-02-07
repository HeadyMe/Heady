"""
Heady Dev Companion for Sublime Text
AI code assistant — chat, explain, refactor, generate tests and docs.
"""

import sublime
import sublime_plugin
import json
import urllib.request
import urllib.error
import threading


def get_settings():
    return {
        "api_endpoint": sublime.load_settings("HeadyAI.sublime-settings").get(
            "api_endpoint", "http://localhost:3300"
        ),
        "mode": sublime.load_settings("HeadyAI.sublime-settings").get(
            "mode", "hybrid"
        ),
    }


def heady_request(message, context, callback):
    """Send async request to Heady API."""
    settings = get_settings()
    url = f"{settings['api_endpoint']}/api/buddy/chat"
    payload = json.dumps({
        "message": message,
        "context": f"sublime_{context}",
        "source": "ide-sublime",
        "mode": settings["mode"],
        "history": [],
    }).encode("utf-8")

    def _do():
        try:
            req = urllib.request.Request(
                url, data=payload,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                reply = data.get("reply") or data.get("message") or "No response"
        except Exception as e:
            reply = f"Error: {e}"
        sublime.set_timeout(lambda: callback(reply), 0)

    threading.Thread(target=_do, daemon=True).start()


def show_response(reply):
    """Show Heady response in an output panel."""
    window = sublime.active_window()
    panel = window.create_output_panel("heady")
    panel.run_command("append", {"characters": f"\n--- Heady ---\n{reply}\n"})
    window.run_command("show_panel", {"panel": "output.heady"})


class HeadyChatCommand(sublime_plugin.WindowCommand):
    def run(self):
        self.window.show_input_panel(
            "Ask Heady:", "", self.on_done, None, None
        )

    def on_done(self, text):
        if text.strip():
            heady_request(text, "chat", show_response)


class HeadyExplainCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        sel = self.view.sel()
        if not sel or sel[0].empty():
            sublime.status_message("Heady: Select code first")
            return
        code = self.view.substr(sel[0])
        heady_request(f"Explain this code:\n```\n{code}\n```", "explain", show_response)


class HeadyRefactorCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        sel = self.view.sel()
        if not sel or sel[0].empty():
            sublime.status_message("Heady: Select code first")
            return
        code = self.view.substr(sel[0])
        heady_request(f"Refactor this code:\n```\n{code}\n```", "refactor", show_response)


class HeadyTestsCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        code = self.view.substr(sublime.Region(0, min(self.view.size(), 8000)))
        lang = self.view.settings().get("syntax", "").split("/")[-1].replace(".sublime-syntax", "")
        heady_request(f"Generate tests for:\n```{lang}\n{code}\n```", "tests", show_response)


class HeadyDocsCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        code = self.view.substr(sublime.Region(0, min(self.view.size(), 8000)))
        heady_request(f"Generate documentation for:\n```\n{code}\n```", "docs", show_response)


class HeadyHealthCommand(sublime_plugin.WindowCommand):
    def run(self):
        settings = get_settings()
        try:
            req = urllib.request.Request(f"{settings['api_endpoint']}/api/health")
            with urllib.request.urlopen(req, timeout=5) as resp:
                sublime.status_message("Heady: Connected" if resp.status == 200 else "Heady: Error")
        except Exception:
            sublime.status_message("Heady: Offline")
