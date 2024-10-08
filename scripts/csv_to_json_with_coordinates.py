import csv
import json
import sys

def csv_to_json_with_coordinates(csv_file_path, coords_json_path, output_json_path):
    # Read CSV data (main trail data)
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        csv_data = list(reader)

    # Read coordinates data from the JSON file
    with open(coords_json_path, mode='r', encoding='utf-8') as json_file:
        coords_data = json.load(json_file)

    # Check if the number of entries match
    if len(csv_data) != len(coords_data) and len(coords_data) < len(csv_data):
        print("Error: The number of entries in the CSV file and the JSON coordinates file do not match.")
        sys.exit(1)

    # List to hold the combined data
    combined_data = []

    for i, row in enumerate(csv_data):
        try:
            # Extract data from CSV
            trail = {
                'FID': int(row['FID']),
                'AccessName': row['AccessName'].strip(),
                'Address': row['Address'].strip(),
                'BikeTrail': row['BikeTrail'].strip(),
                'FISHING': row['FISHING'].strip(),
                'ADAtrail': row['ADAtrail'].strip(),
                'Latitude': None,
                'Longitude': None
            }

            # Get coordinates from the JSON data
            coord = coords_data[i]
            trail['Latitude'] = coord['Latitude']
            trail['Longitude'] = coord['Longitude']

            combined_data.append(trail)
        except (ValueError, KeyError) as e:
            print(f"Warning: Skipping invalid entry at index {i}: {e}")
            continue

    # Write combined data to JSON file
    try:
        with open(output_json_path, 'w', encoding='utf-8') as json_file:
            json.dump(combined_data, json_file, indent=4)
        print(f"Data successfully written to '{output_json_path}'.")
    except IOError as e:
        print(f"Error writing to file '{output_json_path}': {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Ensure correct usage
    if len(sys.argv) != 4:
        print("Usage: python csv_to_json_with_coordinates.py input.csv trail_data_locations.json output.json")
        sys.exit(1)

    input_csv = sys.argv[1]
    coords_json = sys.argv[2]
    output_json = sys.argv[3]

    csv_to_json_with_coordinates(input_csv, coords_json, output_json)
