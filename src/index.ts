#! /usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import figlet from "figlet";

const program = new Command();

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-l, --ls [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

console.log(figlet.textSync("Dir Manager"));

const listDirContents = async (filepath: string) => {
  try {
    const files = await fs.promises.readdir(filepath);

    const detailedFilesPromises = files.map(async (file: string) => {
      let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
      const { size, birthtime } = fileDetails;

      return { filename: file, "size(KB)": size, create_at: birthtime };
    });

    const detailedFiles = await Promise.all(detailedFilesPromises);
    console.table(detailedFiles);
  } catch (err) {
    console.error("Error occured while reading this directory!", err);
  }
};

const createDirectory = (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
    console.log("The Directory has been created Successfully!");
  }
};

const createFile = (filepath: string) => {
  fs.openSync(filepath, "w");
  console.log("An empty file has been created!");
};

if (options.ls) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;
  listDirContents(filepath);
}

if (options.mkdir) {
  createDirectory(path.resolve(__dirname, options.mkdir));
}

if (options.touch) {
  createFile(path.resolve(__dirname, options.touch));
}

if(!process.argv.slice(2).length){
    program.outputHelp();
}