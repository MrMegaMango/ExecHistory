from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        execution_path = '../../s3data/executions2/executions2'
        app_path = '../../s3data/app2.json'

        # Load application JSON
        with open(app_path) as f:
            app_json = json.load(f)

        # Helper functions
        def unroll(output):
            if not isinstance(output, list):
                return list(output.items())
            return [(k, v) for o in output for k, v in o.items()]

        def get_values_at_end_of_execution(execution_dir):
            all_files = sorted([file for file in os.listdir(execution_dir) if ".json" in file])
            all_inputs = {}
            for file in all_files:
                with open(os.path.join(execution_dir, file), "r") as f:
                    data = json.load(f)
                    for name, val in unroll(data):
                        all_inputs[name] = val
            return all_inputs

        def get_input_and_outputs(execution_folder, app_json):
            filenames = os.listdir(execution_folder)
            input_filename = [filename for filename in filenames if filename.endswith('inputs.json')][0]
            with open(os.path.join(execution_folder, input_filename)) as f:
                inputs = json.load(f)

            outputs = get_values_at_end_of_execution(execution_folder)
            return inputs, outputs

        # Process executions
        executions = []
        for folder in os.listdir(execution_path):
            inputs, outputs = get_input_and_outputs(execution_path+"/"+folder, app_json)
            execution_data = {
                "id": folder,  # Assuming folder name is the execution ID
                "input": inputs,
                "output": outputs
            }
            executions.append(execution_data)

        # Send response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(executions).encode())

# doesn't freakin work