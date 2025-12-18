import { app, BrowserWindow } from "electron";
import path from "node:path";
import { getPreloadPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { ipcMainHandle, isDevelopment } from "./utils.js";

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
		},
	});
	if (isDevelopment()) {
		mainWindow.loadURL("http://localhost:5173");
	} else {
		mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
	}

	pollResources(mainWindow);

	ipcMainHandle("getStaticData", getStaticData);
});
