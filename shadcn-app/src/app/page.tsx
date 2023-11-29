"use client";
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Execution {
  id: string;
  input: { [key: string]: any };
  output: { [key: string]: any };
}
export default function ExecutionHistory() {
  const [executions, setExecutions] = useState<Execution[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/executions')
      .then(response => response.json())
      .then(data => {
        // Convert IDs to numbers for sorting and then convert back to strings
      const sortedData = data.sort((a: Execution, b: Execution) => parseInt(a.id) - parseInt(b.id));
      setExecutions(data)});
  }, []);

  const renderObjectAsList = (obj: { [key: string]: any }) => (
    <ul>
      {Object.entries(obj).map(([key, value]) => (
        <li key={key}>{key}: {value.toString()}</li>
      ))}
    </ul>
  );

  return (
    <div>
      <h1 className='text-3xl'>Execution History</h1>
      <Accordion type="single" collapsible>
        {executions.map(execution => (
          <AccordionItem key={execution.id} value={execution.id}>
            <AccordionTrigger>Execution ID: {execution.id}</AccordionTrigger>
            <AccordionContent>
              <h3>Input</h3>
              {renderObjectAsList(execution.input)}
              <h3>Output</h3>
              {renderObjectAsList(execution.output)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
