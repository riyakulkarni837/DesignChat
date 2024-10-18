import json
import os
from datetime import datetime
import pytz


def extract_nested_field(file_path, output_file_path):
    try:
        with open(file_path, 'r') as file:
            # Load JSON array from the file
            json_array = json.load(file)

            # Create a list to store the subset of JSON objects
            subset_json_objects = []

            # Process each JSON object in the array
            for json_object in json_array:
                # Check if the nested field exists in the 'details' key
                if 'jsonPayload' in json_object and 'prompts' in json_object['jsonPayload']:
                    # Create a new dictionary for the subset of fields
                    subset_json = {
                        'prompt': json_object['jsonPayload']['prompts']['newPrompt'],
                        'timestamp': json_object.get('timestamp', None),
                        'prompt_history': len(json_object['jsonPayload']['prompts']['promptHistory'])
                    }
                    subset_json_objects.append(subset_json)

                if 'jsonPayload' in json_object and 'response' in json_object['jsonPayload']:
                    # Create a new dictionary for the subset of fields
                    subset_json = {
                        'response': json_object['jsonPayload']['response'],
                        'timestamp': json_object.get('timestamp', None),
                        'tokens': json_object['jsonPayload']['tokens']
                    }
                    subset_json_objects.append(subset_json)

            # Write the subset JSON objects to a new file
            with open(output_file_path, 'w') as output_file:
                json.dump(subset_json_objects, output_file, indent=2)

            print(f"Subset JSON file created: {output_file_path}")

    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except json.JSONDecodeError:
        print(f"Error decoding JSON in file: {file_path}")


def process_files_in_directory(directory):
    try:
        # List all files in the directory
        files = os.listdir(directory)

        # Iterate over each file
        for file_name in files:
            print(get_participant_number(file_name))
            file_path = os.path.join(directory, file_name)

            # Check if the item is a file (not a subdirectory)
            if os.path.isfile(file_path):
                # Call the processing function for each file

                new_filename = os.path.join(
                    directory, f"clean_{file_name}")
                extract_nested_field(file_path, new_filename)

    except FileNotFoundError:
        print(f"Directory not found: {directory}")


def convert_datestring_to_pt(date_string):

    # Converts a date string in UTC to PT
    # date_string = "2023-12-07T21:42:05.090189Z"

    # Convert string to datetime object
    datetime_object = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%fZ")

    # Set the UTC time zone for the datetime object
    datetime_object_utc = datetime_object.replace(tzinfo=pytz.utc)

    # Convert to Pacific Time (PT)
    timezone_pt = pytz.timezone('America/Los_Angeles')
    datetime_object_pt = datetime_object_utc.astimezone(timezone_pt)

    # Print the result
    print("Original UTC time:", datetime_object_utc)
    print("Converted to PT:", datetime_object_pt)


def get_minutes_between(t1, t2):
    # assume t1 and t2 are date times already

    # Calculate the time difference
    time_difference = t2 - t1
    # Convert the time difference to minutes
    minutes_difference = time_difference.total_seconds() / 60

    return minutes_difference


def get_participant_number(s):
    # assumes the string is of the form Pxx-zzzz so returns the substring before the first -
    return s[0:s.find("-")]


def main():
   # Example usage:
    # Replace with your JSON file path
    # input_file_path = 'P6-Design Challenge ChatGPT Log.json'
    # Replace with the desired output file path
    # output_file_path = 'subset_output.json'
    # extract_nested_field(input_file_path, output_file_path)

    # Example usage:
    directory_path = './files'  # Replace with the actual directory path
    process_files_in_directory(directory_path)


if __name__ == "__main__":
    main()
