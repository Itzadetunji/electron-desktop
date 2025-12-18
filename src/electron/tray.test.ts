import electron from "electron";
import { expect, type Mock, test, vi } from "vitest";
import { createTray } from "./tray.js";

vi.mock("electron", () => {
	return {
		Tray: vi.fn().mockReturnValue({
			setContextMenu: vi.fn(),
		}),
		app: {
			getAppPath: vi.fn().mockReturnValue("/"),
			dock: {
				show: vi.fn(),
			},
			quit: vi.fn(),
		},
		Menu: {
			buildFromTemplate: vi.fn(),
		},
	};
});

const mainWindow = {
	show: vi.fn(),
} satisfies Partial<electron.BrowserWindow> as any as electron.BrowserWindow;

test("", () => {
	createTray(mainWindow);

	const calls = (electron.Menu.buildFromTemplate as any as Mock).mock.calls;
	const args = calls[0] as Parameters<typeof electron.Menu.buildFromTemplate>;
	const template = args[0];
	expect(template).toHaveLength(2);

	expect(template[0].label).toEqual("Show");
	template[0]?.click?.(null as any, null as any, null as any);
	expect(mainWindow.show).toHaveBeenCalled();
	expect(electron.app.dock?.show).toHaveBeenCalled();

	template[1]?.click?.(null as any, null as any, null as any);
	expect(electron.app.quit).toHaveBeenCalled();
});
