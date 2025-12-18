import fs from "node:fs";
import os from "node:os";
import type { BrowserWindow } from "electron";
import osUtils from "os-utils";
import { ipcWebContentsSend } from "./utils.js";

const POLLING_INTERVAL = 500;

export const pollResources = (mainWindow: BrowserWindow) => {
	setInterval(async () => {
		const cpuUsage = await getCpuUsage();
		const ramUsage = getRamUsage();
		const storageData = getStorageUsage();

		ipcWebContentsSend("statistics", mainWindow.webContents, {
			cpuUsage,
			ramUsage,
			storageUsage: storageData.usage,
		});
	}, POLLING_INTERVAL);
};

export const getStaticData = () => {
	const totalStorage = getStorageUsage().total;
	const cpuModel = os.cpus()[0].model;
	const totalMemoryGB = Math.round(osUtils.totalmem() / 1024);

	return {
		totalStorage,
		cpuModel,
		totalMemoryGB,
	};
};

const getCpuUsage = (): Promise<number> => {
	return new Promise((resolve) => {
		osUtils.cpuUsage(resolve);
	});
};

const getRamUsage = (): number => {
	return 1 - osUtils.freememPercentage();
};

const getStorageUsage = () => {
	const stats = fs.statfsSync(process.platform === "win32" ? "C:\\" : "/");
	const total = stats.bsize * stats.blocks;
	const free = stats.bsize * stats.bfree;

	return {
		total: Math.round(total / 1_000_000_000), // in GB
		usage: 1 - free / total,
	};
};
