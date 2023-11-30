// pages/api/executions/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Assuming a simple key-value pair structure for your JSON data.
// Adapt these types based on your actual data structure.
type ExecutionInput = {
  [key: string]: any;
};

type ExecutionOutput = {
  [key: string]: any;
};

type ExecutionData = {
  id: string;
  input: ExecutionInput;
  output: ExecutionOutput;
};

// Helper function to parse JSON files
const parseJsonFile = (filePath: string) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`Error parsing JSON file ${filePath}:`, error);
    return null;
  }
};

// Process executions
const processExecutions = (executionPath: string) => {
  const executionFolders = fs.readdirSync(executionPath);
  const executions: ExecutionData[] = [];

  executionFolders.forEach(folder => {
    const folderPath = path.join(executionPath, folder);
    const inputFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('inputs.json'));
    const outputFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.json') && !file.endsWith('inputs.json'));

    let inputs: ExecutionInput = {};
    let outputs: ExecutionOutput = {};

    // Assuming there's only one inputs.json file per folder
    if (inputFiles.length === 1) {
      const inputFilePath = path.join(folderPath, inputFiles[0]);
      inputs = parseJsonFile(inputFilePath) || {};
    }

    // Aggregate all output JSON files
    outputFiles.forEach(file => {
      const outputFilePath = path.join(folderPath, file);
      const outputData = parseJsonFile(outputFilePath);
      if (outputData) {
        outputs = { ...outputs, ...outputData };
      }
    });

    executions.push({ id: folder, input: inputs, output: outputs });
  });

  return executions;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extract the dynamic ID from the URL
  const executionPath = path.join(process.cwd(), '../../s3data/executions/executions'+id);
  const executionData = processExecutions(executionPath);

  if (!executionData) {
    res.status(404).json({ error: 'Execution data not found' });
    return;
  }

  res.status(200).json(executionData);
}
