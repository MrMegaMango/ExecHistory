import os
import re
import json

execution_path = 'executions2/executions2/2'

app_path = 'app2.json'
with open(app_path) as f:
    app_json = json.load(f)


def unroll(output):
    if not isinstance(output, list):
        return list(output.items())
    return [(k, v) for o in output for k, v in o.items()]


def get_values_at_end_of_execution(execution_dir):
    # List all files and sort them
    all_files = sorted([file for file in os.listdir(execution_dir) if ".json" in file])

    all_inputs = {}
    for file in all_files:
        with open(os.path.join(execution_dir, file), "r") as f:
            data = json.load(f)
            for name, val in unroll(data):
                all_inputs[name] = val

    return all_inputs


def get_input_and_outputs(execution_folder, app_json):
    # there's one file that finishes with `inputs.json`
    filenames = os.listdir(execution_folder)
    input_filename = [filename for filename in filenames if filename.endswith('inputs.json')][0]
    with open(os.path.join(execution_folder, input_filename)) as f:
        inputs = json.load(f)

    outputs = get_values_at_end_of_execution(execution_folder)

    return inputs, outputs



inputs, outputs = get_input_and_outputs(execution_path, app_json)

print(inputs)
print('----')
print(outputs)