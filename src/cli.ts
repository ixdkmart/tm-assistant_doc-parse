#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import path from "node:path";
import { convertFolder } from "./pipeline/convert.js";

const program = new Command();
program.name("km-kb").description("Convert store docs to atomic Q&A Markdown chunks").version("0.1.0");

program
  .command("convert")
  .argument("<inDir>", "Input directory with PDFs/Docs/Images")
  .option("-o, --out <dir>", "Output directory", "out")
  .action(async (inDir, opts) => {
    const outDir = path.resolve(process.cwd(), opts.out);
    const res = await convertFolder(path.resolve(inDir), outDir);
    console.log(JSON.stringify(res, null, 2));
  });

program.parse(process.argv);
