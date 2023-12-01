I've created a NestJS app under shadcn-app. 

To run, `cd shadcn-app` then `npm run dev`, and check localhost:3000/api/executions/1 and localhost:3000/api/executions/2

Parsed data extraction logic to typescript and added dynamic routing at shadcn-app/src/pages/api/executions/[id].ts

The given data source live under /s3data, and I tricked vercel/nft into taking this static data.

deployed on Vercel
https://exec-history-ekdv3o50u-zuos-projects.vercel.app/app/executions/1








not sure why this fixes id undefined issue
  useEffect(() => {
    if(!id) {
        return;
      }

