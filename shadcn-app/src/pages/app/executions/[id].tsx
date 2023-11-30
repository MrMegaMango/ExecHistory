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


import { useRouter } from 'next/router';

export default function ExecutionHistory() {
  const [executions, setExecutions] = useState<Execution[]>([]);

  const router = useRouter();
  const id  = router.query.id;
  console.log("id is "+router.query.id)
  
  useEffect(() => {
    if(!id) {
        return;
      }
    fetch('../../api/executions/'+id)
      .then(response => response.json())
      .then(data => {
        // Convert IDs to numbers for sorting and then convert back to strings
      const sortedData = data.sort((a: Execution, b: Execution) => parseInt(a.id) - parseInt(b.id));
      setExecutions(data)});
  }, [id]);

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

// import type { NextApiRequest, NextApiResponse } from 'next';
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log(req.query)

//   //const { id } = req.query;
//   res.status(200).json("ok");
// }