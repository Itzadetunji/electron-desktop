const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
	subscribeStatistics: (callback) =>
		ipcOn("statistics", (statisticsData) => {
			callback(statisticsData);
		}),
	getStaticData: () => ipcInvoke("getStaticData"),
	// subscribeChangeView: (callback) => ipcOn("changeView", callback),
	// sendFrameAction: (payload) => ipcSend("sendFrameAction", payload),
} satisfies Window["electron"]);

const ipcInvoke = <Key extends keyof EventPayloadMapping>(
	key: Key,
): Promise<EventPayloadMapping[Key]> => {
	return electron.ipcRenderer.invoke(key);
};

const ipcOn = <Key extends keyof EventPayloadMapping>(
	key: Key,
	callback: (payload: EventPayloadMapping[Key]) => void,
) => {
	const cb = (_: Electron.IpcRendererEvent, payload: any) => {
		callback(payload);
	};
	electron.ipcRenderer.on(key, cb);

	return () => electron.ipcRenderer.off(key, cb);
};
