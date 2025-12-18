import { app } from "electron";
import path from "path";
import { isDevelopment } from "./utils.js";

export const getPreloadPath = () => {
	return path.join(
		app.getAppPath(),
		isDevelopment() ? "." : "..",
		"/dist-electron/preload.cjs",
	);
};

export function getUIPath() {
	return path.join(app.getAppPath(), "/dist-react/index.html");
}

export function getAssetPath() {
	return path.join(
		app.getAppPath(),
		isDevelopment() ? "." : "..",
		"/src/assets",
	);
}
