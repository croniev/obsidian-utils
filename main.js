/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CronievObsidianUtils
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var obsidian = require("obsidian");
var CronievObsidianUtils = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
  }
  async onload() {
    console.log("Loading CronievObsidianUtils: Parse Dates");
    this.addCommand({
      id: "parse-dates",
      name: "Parse Dates",
      editorCallback: (editor, view) => {
        this.parseDates(editor);
      }
    });
    console.log("Loading CronievObsidianUtils: Add Page Reference");
    this.isActive = false;
    this.page = 0;
    this.status = this.addStatusBarItem();
    this.statusEl = this.status.createEl("span", { text: "" });
    this.addCommand({
      id: "add-reference",
      name: "Add Page Reference",
      editorCallback: (editor, view) => {
        if (this.isActive) {
          this.addReference(editor);
        } else {
          console.log("Tried to add a reference but no page is set.");
        }
      }
    });
    this.addCommand({
      id: "set-page",
      name: "Set Page",
      callback: () => {
        this.setPage(0);
      }
    });
    this.addCommand({
      id: "increase-page",
      name: "Increase Page",
      callback: () => {
        if (this.isActive) {
          this.setPage(1);
        }
      }
    });
    this.addCommand({
      id: "decrese-page",
      name: "Decrease Page",
      callback: () => {
        if (this.isActive) {
          this.setPage(-1);
        }
      }
    });
  }
  async onunload() {
    console.log("Unloading plugin CronievObsidianUtils...");
  }
  // INFO: FCT - Parse Dates
  async parseDates(editor) {
    let cursor = editor.getCursor();
    editor.setSelection({ line: 0, ch: 0 }, { line: editor.lastLine(), ch: 0 });
    let selectedText = editor.getSelection();
    if (!selectedText.match(/><\/span>/)) {
      editor.setCursor(cursor);
      return;
    }
    try {
      let d1 = selectedText.match(/data-date='.{1,4}-/)[0].slice(11, -1);
      let d2 = selectedText.match(/data-end='.{1,4}-/)[0].slice(10, -1);
      let type = selectedText.match(/data-class='.*'/)[0].slice(12, -1);
      if (type.slice(0, 6) == "person") {
        var newString = "\nGeburtsdatum:: " + d1 + "\n\nTod:: " + d2 + "\n</span>";
      } else if (type.slice(0, 6) == "geschi" || type == "periode") {
        newString = "\nStart:: " + d1 + "\n\nEnde:: " + d2 + "\n</span>";
      }
      selectedText = selectedText.replace("</span>", newString);
      editor.replaceSelection(selectedText, "around");
      cursor.line += 4;
    } catch (e) {
    } finally {
      editor.setCursor(cursor);
    }
  }
  // INFO: FCT - Add Page Reference
  async addReference(editor) {
    if (editor == null) {
      return;
    }
    let insert = ` (S.${this.page})`;
    let pos = editor.getCursor();
    editor.replaceRange(insert, pos);
    pos.ch += insert.length;
    editor.setCursor(pos);
  }
  async setPage(direction) {
    if (direction == 1) {
      this.page++;
      this.statusEl.empty();
      this.statusEl = this.status.createEl("span", { text: ` (S.${this.page})` });
    } else if (direction == -1) {
      this.page--;
      this.statusEl.empty();
      this.statusEl = this.status.createEl("span", { text: ` (S.${this.page})` });
    } else if (direction == 0) {
      let res = parseInt(await InputModal.Prompt(this.app));
      if (isNaN(res)) {
        this.isActive = false;
        this.statusEl.empty();
      } else {
        this.statusEl.empty();
        this.page = res;
        this.isActive = true;
        this.statusEl = this.status.createEl("span", { text: ` (S.${this.page})` });
      }
    }
  }
};
var InputModal = class _InputModal extends import_obsidian.Modal {
  constructor(app) {
    super(app);
    this.didSubmit = false;
    this.submitClickCallback = (evt) => this.submit();
    this.cancelClickCallback = (evt) => this.cancel();
    this.submitEnterCallback = (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        this.submit();
      }
    };
    this.input = "";
    this.waitForClose = new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
    this.display();
    this.open();
  }
  static Prompt(app) {
    const newPromptModal = new _InputModal(app);
    return newPromptModal.waitForClose;
  }
  display() {
    this.contentEl.empty();
    const mainContentContainer = this.contentEl.createDiv();
    this.inputComponent = this.createInputField(mainContentContainer);
  }
  createInputField(container) {
    const textComponent = new obsidian.TextComponent(container);
    textComponent.inputEl.style.width = "100%";
    textComponent.onChange((value) => this.input = value).inputEl.addEventListener("keydown", this.submitEnterCallback);
    return textComponent;
  }
  submit() {
    this.didSubmit = true;
    this.close();
  }
  cancel() {
    this.close();
  }
  resolveInput() {
    if (!this.didSubmit)
      this.rejectPromise("No input given.");
    else
      this.resolvePromise(this.input);
  }
  removeInputListener() {
    this.inputComponent.inputEl.removeEventListener("keydown", this.submitEnterCallback);
  }
  onOpen() {
    super.onOpen();
    this.inputComponent.inputEl.focus();
    this.inputComponent.inputEl.select();
  }
  onClose() {
    super.onClose();
    this.resolveInput();
    this.removeInputListener();
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBFZGl0b3IsIE1hcmtkb3duVmlldywgTW9kYWwsIFBsdWdpbn0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbnZhciBvYnNpZGlhbiA9IHJlcXVpcmUoJ29ic2lkaWFuJyk7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcm9uaWV2T2JzaWRpYW5VdGlscyBleHRlbmRzIFBsdWdpbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgYXN5bmMgb25sb2FkKCkge1xuXG4gICAgICAgIC8vIElORk86IENNRCAtIFBhcnNlIERhdGVzXG4gICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIENyb25pZXZPYnNpZGlhblV0aWxzOiBQYXJzZSBEYXRlcycpO1xuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6ICdwYXJzZS1kYXRlcycsXG4gICAgICAgICAgICBuYW1lOiAnUGFyc2UgRGF0ZXMnLFxuICAgICAgICAgICAgZWRpdG9yQ2FsbGJhY2s6IChlZGl0b3I6IEVkaXRvciwgdmlldzogTWFya2Rvd25WaWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGVzKGVkaXRvcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJTkZPOiBDTUQgLSBBZGQgUGFnZSBSZWZlcmVuY2VcbiAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgQ3Jvbmlldk9ic2lkaWFuVXRpbHM6IEFkZCBQYWdlIFJlZmVyZW5jZScpO1xuICAgICAgICAvLyBWYXJpYWJsZXMgYW5kIHN0YXR1cyBiYXIgZWxlbWVudFxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGFnZSA9IDA7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gdGhpcy5hZGRTdGF0dXNCYXJJdGVtKCk7XG4gICAgICAgIHRoaXMuc3RhdHVzRWwgPSB0aGlzLnN0YXR1cy5jcmVhdGVFbChcInNwYW5cIiwgeyB0ZXh0OiBcIlwiIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogJ2FkZC1yZWZlcmVuY2UnLFxuICAgICAgICAgICAgbmFtZTogJ0FkZCBQYWdlIFJlZmVyZW5jZScsXG4gICAgICAgICAgICBlZGl0b3JDYWxsYmFjazogKGVkaXRvcjogRWRpdG9yLCB2aWV3OiBNYXJrZG93blZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFJlZmVyZW5jZShlZGl0b3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUcmllZCB0byBhZGQgYSByZWZlcmVuY2UgYnV0IG5vIHBhZ2UgaXMgc2V0LicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiAnc2V0LXBhZ2UnLFxuICAgICAgICAgICAgbmFtZTogJ1NldCBQYWdlJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7IHRoaXMuc2V0UGFnZSgwKTsgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiAnaW5jcmVhc2UtcGFnZScsXG4gICAgICAgICAgICBuYW1lOiAnSW5jcmVhc2UgUGFnZScsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4geyBpZiAodGhpcy5pc0FjdGl2ZSkgeyB0aGlzLnNldFBhZ2UoMSk7IH0gfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiAnZGVjcmVzZS1wYWdlJyxcbiAgICAgICAgICAgIG5hbWU6ICdEZWNyZWFzZSBQYWdlJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7IGlmICh0aGlzLmlzQWN0aXZlKSB7IHRoaXMuc2V0UGFnZSgtMSk7IH0gfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBvbnVubG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1VubG9hZGluZyBwbHVnaW4gQ3Jvbmlldk9ic2lkaWFuVXRpbHMuLi4nKTtcbiAgICB9XG5cbiAgICAvLyBJTkZPOiBGQ1QgLSBQYXJzZSBEYXRlc1xuICAgIGFzeW5jIHBhcnNlRGF0ZXMoZWRpdG9yOiBFZGl0b3IpIHtcbiAgICAgICAgbGV0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKVxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0aW9uKHsgbGluZTogMCwgY2g6IDAgfSwgeyBsaW5lOiBlZGl0b3IubGFzdExpbmUoKSwgY2g6IDAgfSlcbiAgICAgICAgbGV0IHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKCFzZWxlY3RlZFRleHQubWF0Y2goLz48XFwvc3Bhbj4vKSl7XG4gICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKGN1cnNvcilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBkMSA9IHNlbGVjdGVkVGV4dC5tYXRjaCgvZGF0YS1kYXRlPScuezEsNH0tLylbMF0uc2xpY2UoMTEsIC0xKVxuICAgICAgICAgICAgbGV0IGQyID0gc2VsZWN0ZWRUZXh0Lm1hdGNoKC9kYXRhLWVuZD0nLnsxLDR9LS8pWzBdLnNsaWNlKDEwLCAtMSlcbiAgICAgICAgICAgIGxldCB0eXBlID0gc2VsZWN0ZWRUZXh0Lm1hdGNoKC9kYXRhLWNsYXNzPScuKicvKVswXS5zbGljZSgxMiwgLTEpXG5cbiAgICAgICAgICAgIC8vIFRyZW5uZSBnZXNjaGksIHBlcnNvblxuICAgICAgICAgICAgaWYgKHR5cGUuc2xpY2UoMCwgNikgPT0gXCJwZXJzb25cIikge1xuICAgICAgICAgICAgICAgIHZhciBuZXdTdHJpbmcgPSAnXFxuR2VidXJ0c2RhdHVtOjogJyArIGQxICsgJ1xcblxcblRvZDo6ICcgKyBkMiArICdcXG48L3NwYW4+J1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlLnNsaWNlKDAsIDYpID09IFwiZ2VzY2hpXCIgfHwgdHlwZSA9PSBcInBlcmlvZGVcIikge1xuICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9ICdcXG5TdGFydDo6ICcgKyBkMSArICdcXG5cXG5FbmRlOjogJyArIGQyICsgJ1xcbjwvc3Bhbj4nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZcdTAwRkNnZSBkZW4gZW50c3ByZWNoZW5kZW4gVGV4dCBhbnMgRW5kZSBhbi5cbiAgICAgICAgICAgIHNlbGVjdGVkVGV4dCA9IHNlbGVjdGVkVGV4dC5yZXBsYWNlKCc8L3NwYW4+JywgbmV3U3RyaW5nKVxuXG4gICAgICAgICAgICAvLyBBZGQgZGF0ZXMgYXQgcmlnaHQgbG9jYXRpb25cbiAgICAgICAgICAgIGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKHNlbGVjdGVkVGV4dCwgJ2Fyb3VuZCcpO1xuICAgICAgICAgICAgY3Vyc29yLmxpbmUgKz0gNFxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlKVxuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvcihjdXJzb3IpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSU5GTzogRkNUIC0gQWRkIFBhZ2UgUmVmZXJlbmNlXG4gICAgYXN5bmMgYWRkUmVmZXJlbmNlKGVkaXRvcjogRWRpdG9yKSB7XG4gICAgICAgIGlmIChlZGl0b3IgPT0gbnVsbCkgeyByZXR1cm47IH1cbiAgICAgICAgbGV0IGluc2VydCA9IGAgKFMuJHsgdGhpcy5wYWdlIH0pYDtcbiAgICAgICAgbGV0IHBvcyA9IGVkaXRvci5nZXRDdXJzb3IoKTtcbiAgICAgICAgZWRpdG9yLnJlcGxhY2VSYW5nZShpbnNlcnQsIHBvcyk7XG4gICAgICAgIHBvcy5jaCArPSBpbnNlcnQubGVuZ3RoO1xuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHBvcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2V0UGFnZShkaXJlY3Rpb246IG51bWJlcikge1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZSsrO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNFbC5lbXB0eSgpXG4gICAgICAgICAgICB0aGlzLnN0YXR1c0VsID0gdGhpcy5zdGF0dXMuY3JlYXRlRWwoXCJzcGFuXCIsIHsgdGV4dDogYCAoUy4ke3RoaXMucGFnZX0pYCB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZS0tO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNFbC5lbXB0eSgpXG4gICAgICAgICAgICB0aGlzLnN0YXR1c0VsID0gdGhpcy5zdGF0dXMuY3JlYXRlRWwoXCJzcGFuXCIsIHsgdGV4dDogYCAoUy4ke3RoaXMucGFnZX0pYCB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT0gMCkge1xuICAgICAgICAgICAgLy9vcGVuIGRpYWxvZyB3aW5kb3dcbiAgICAgICAgICAgIGxldCByZXMgPSBwYXJzZUludChhd2FpdCBJbnB1dE1vZGFsLlByb21wdCh0aGlzLmFwcCkpO1xuICAgICAgICAgICAgaWYgKGlzTmFOKHJlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNFbC5lbXB0eSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0VsLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlID0gcmVzO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzRWwgPSB0aGlzLnN0YXR1cy5jcmVhdGVFbChcInNwYW5cIiwgeyB0ZXh0OiBgIChTLiR7dGhpcy5wYWdlfSlgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBJTkZPOiBJbnB1dCBNb2RhbCAoZm9yIHNldC1wYWdlKVxuY2xhc3MgSW5wdXRNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5kaWRTdWJtaXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdWJtaXRDbGlja0NhbGxiYWNrID0gKGV2dCkgPT4gdGhpcy5zdWJtaXQoKTtcbiAgICAgICAgdGhpcy5jYW5jZWxDbGlja0NhbGxiYWNrID0gKGV2dCkgPT4gdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgdGhpcy5zdWJtaXRFbnRlckNhbGxiYWNrID0gKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2dC5rZXkgPT09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaW5wdXQgPSBcIlwiO1xuICAgICAgICB0aGlzLndhaXRGb3JDbG9zZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgICAgICAgICAgdGhpcy5yZWplY3RQcm9taXNlID0gcmVqZWN0O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgICBzdGF0aWMgUHJvbXB0KGFwcCkge1xuICAgICAgICBjb25zdCBuZXdQcm9tcHRNb2RhbCA9IG5ldyBJbnB1dE1vZGFsKGFwcCk7XG4gICAgICAgIHJldHVybiBuZXdQcm9tcHRNb2RhbC53YWl0Rm9yQ2xvc2U7XG4gICAgfVxuICAgIGRpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgICAgIGNvbnN0IG1haW5Db250ZW50Q29udGFpbmVyID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KCk7XG4gICAgICAgIHRoaXMuaW5wdXRDb21wb25lbnQgPSB0aGlzLmNyZWF0ZUlucHV0RmllbGQobWFpbkNvbnRlbnRDb250YWluZXIpO1xuICAgIH1cbiAgICBjcmVhdGVJbnB1dEZpZWxkKGNvbnRhaW5lcikge1xuICAgICAgICBjb25zdCB0ZXh0Q29tcG9uZW50ID0gbmV3IG9ic2lkaWFuLlRleHRDb21wb25lbnQoY29udGFpbmVyKTtcbiAgICAgICAgdGV4dENvbXBvbmVudC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgIHRleHRDb21wb25lbnQub25DaGFuZ2UodmFsdWUgPT4gdGhpcy5pbnB1dCA9IHZhbHVlKVxuICAgICAgICAgICAgLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuc3VibWl0RW50ZXJDYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0ZXh0Q29tcG9uZW50O1xuICAgIH1cbiAgICBzdWJtaXQoKSB7XG4gICAgICAgIHRoaXMuZGlkU3VibWl0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gICAgcmVzb2x2ZUlucHV0KCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlkU3VibWl0KVxuICAgICAgICAgICAgdGhpcy5yZWplY3RQcm9taXNlKFwiTm8gaW5wdXQgZ2l2ZW4uXCIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVQcm9taXNlKHRoaXMuaW5wdXQpO1xuICAgIH1cbiAgICByZW1vdmVJbnB1dExpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmlucHV0Q29tcG9uZW50LmlucHV0RWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuc3VibWl0RW50ZXJDYWxsYmFjayk7XG4gICAgfVxuICAgIG9uT3BlbigpIHtcbiAgICAgICAgc3VwZXIub25PcGVuKCk7XG4gICAgICAgIHRoaXMuaW5wdXRDb21wb25lbnQuaW5wdXRFbC5mb2N1cygpO1xuICAgICAgICB0aGlzLmlucHV0Q29tcG9uZW50LmlucHV0RWwuc2VsZWN0KCk7XG4gICAgfVxuICAgIG9uQ2xvc2UoKSB7XG4gICAgICAgIHN1cGVyLm9uQ2xvc2UoKTtcbiAgICAgICAgdGhpcy5yZXNvbHZlSW5wdXQoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVyKCk7XG4gICAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUF3RDtBQUV4RCxJQUFJLFdBQVcsUUFBUSxVQUFVO0FBQ2pDLElBQXFCLHVCQUFyQixjQUFrRCx1QkFBTztBQUFBLEVBQ3JELGNBQWM7QUFDVixVQUFNLEdBQUcsU0FBUztBQUFBLEVBQ3RCO0FBQUEsRUFFQSxNQUFNLFNBQVM7QUFHWCxZQUFRLElBQUksMkNBQTJDO0FBQ3ZELFNBQUssV0FBVztBQUFBLE1BQ1osSUFBSTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sZ0JBQWdCLENBQUMsUUFBZ0IsU0FBdUI7QUFDcEQsYUFBSyxXQUFXLE1BQU07QUFBQSxNQUMxQjtBQUFBLElBQ0osQ0FBQztBQUdELFlBQVEsSUFBSSxrREFB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
