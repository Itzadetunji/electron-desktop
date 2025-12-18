import { pathToFileURL } from "node:url";
import { ipcMain, type WebContents, type WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";

export function isDevelopment() {
	return process.env.NODE_ENV === "development";
}

export const ipcMainHandle = <Key extends keyof EventPayloadMapping>(
	key: Key,
	handler: () => EventPayloadMapping[Key],
) => {
	ipcMain.handle(key, (event) => {
		validateEventFrame(event.senderFrame as WebFrameMain);
		return handler();
	});
};

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
	key: Key,
	handler: (payload: EventPayloadMapping[Key]) => void,
) {
	ipcMain.on(key, (event, payload) => {
		validateEventFrame(event.senderFrame as WebFrameMain);
		return handler(payload);
	});
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
	key: Key,
	webContents: WebContents,
	payload: EventPayloadMapping[Key],
) {
	webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
	console.log(frame.url);
	if (isDevelopment() && new URL(frame.url).host === "localhost:5173") {
		return;
	}
	if (frame.url !== pathToFileURL(getUIPath()).toString()) {
		throw new Error("Malicious event");
	}
}
