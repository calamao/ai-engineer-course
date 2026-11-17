import { readFileSync } from "node:fs";

export type TaskName = "summarizer" | "classifier" | "extractor";
export type SampleName = "short" | "medium" | "long";

export interface CliOptions {
  task: TaskName;
  model: string;
  maxTokens: number;
  temperature: number;
  inputText?: string;
  file?: string;
  sample?: SampleName;
  showHelp: boolean;
}

export function printUsage(): void {
  console.log(`Usage (from the project root):
  npm run practice-2 -- "your text"
  npm run practice-2 -- --file ./notes.txt
  npm run practice-2 < ./notes.txt
  npm run practice-2 -- --sample medium
  npm run practice-2 -- --task classifier --model fast "hello"
  npm run practice-2 -- --help

  The "--" after "practice-2" is required to pass options to the app.
  For example, use "npm run practice-2 -- --task classifier \"your text\"".

Options:
  --task <summarizer|classifier|extractor>
  --model <model-name>
  --max-tokens <number>
  --temperature <number>
  --file <path>
  --sample <short|medium|long>
  --help, -h

Arguments after "--" are passed to the practice-2 script.
If no text argument or --file is provided, the tool reads from stdin when piped in.
`);
}

export function parseCliArgs(argv: string[]): CliOptions {
  const defaults: CliOptions = {
    task: "summarizer",
    model: process.env.MODELO ?? "fast",
    maxTokens: Number(process.env.MAX_TOKENS ?? 256),
    temperature: Number(process.env.TEMPERATURE ?? 0.2),
    showHelp: false,
  };

  const result: CliOptions = { ...defaults };

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];

    switch (flag) {
      case "--help":
      case "-h":
        result.showHelp = true;
        break;
      case "--task": {
        const value = argv[index + 1];
        if (!value) throw new Error("Missing value for --task");
        const normalized = String(value).toLowerCase();
        if (normalized !== "summarizer" && normalized !== "classifier" && normalized !== "extractor") {
          throw new Error("Unsupported task. Choose summarizer, classifier, or extractor.");
        }
        result.task = normalized as TaskName;
        index += 1;
        break;
      }
      case "--model": {
        const value = argv[index + 1];
        if (!value) throw new Error("Missing value for --model");
        result.model = value;
        index += 1;
        break;
      }
      case "--max-tokens": {
        const value = argv[index + 1];
        if (!value) throw new Error("Missing value for --max-tokens");
        result.maxTokens = Number(value);
        index += 1;
        break;
      }
      case "--temperature": {
        const value = argv[index + 1];
        if (!value) throw new Error("Missing value for --temperature");
        result.temperature = Number(value);
        index += 1;
        break;
      }
      case "--file": {
        const value = argv[index + 1];
        if (!value) throw new Error("Missing value for --file");
        result.file = value;
        index += 1;
        break;
      }
      case "--sample": {
        const value = argv[index + 1];
        if (!value) throw new Error("Missing value for --sample");
        const normalized = String(value).toLowerCase();
        if (normalized !== "short" && normalized !== "medium" && normalized !== "long") {
          throw new Error("Unsupported sample. Choose short, medium, or long.");
        }
        result.sample = normalized as SampleName;
        index += 1;
        break;
      }
      default: {
        if (!result.inputText) {
          result.inputText = flag;
        }
      }
    }
  }

  return result;
}

export function getSystemPrompt(task: TaskName): string {
  const prompts: Record<TaskName, string> = {
    summarizer:
      "Eres un resumidor: devuelve tres puntos clave de un texto largo.",
    classifier:
      "Eres un clasificador: etiqueta un mensaje con una categoría (por ejemplo, la de un ticket de soporte).",
    extractor:
      "Eres un asistente de extracción de datos: devuelve un dato concreto de un texto (un nombre, una fecha o un importe).",
  };

  return prompts[task];
}

export async function readInputText(options: CliOptions): Promise<string> {
  if (options.file) {
    return readFileSync(options.file, "utf8");
  }

  if (options.sample) {
    return getSampleText(options.sample);
  }

  if (options.inputText) {
    return options.inputText;
  }

  if (!process.stdin.isTTY) {
    const chunks: string[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(typeof chunk === "string" ? chunk : chunk.toString("utf8"));
    }
    return chunks.join("");
  }

  return "";
}

export function getSampleText(sample: SampleName): string {
  return readFileSync(new URL(`../examples/${sample}.txt`, import.meta.url), "utf8");
}
