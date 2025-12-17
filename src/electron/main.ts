import path from "node:path";
import { app, BrowserWindow } from "electron";

type test = string;

app.on("ready", () => {
	const mainWindow = new BrowserWindow();
	mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
});
