import csv
import json
import sys

def csv_to_json(csv_data_string):
    data = []
    reader = csv.DictReader(csv_data_string.strip().split('\n'))

    for row in reader:
        trail = {
            'FID': int(row['FID']),
            'AccessName': row['AccessName'].strip(),
            'Address': row['Address'].strip(),
            'BikeTrail': row['BikeTrail'].strip(),
            'FISHING': row['FISHING'].strip(),
            'ADAtrail': row['ADAtrail'].strip()
            # Latitude and Longitude are excluded
        }
        data.append(trail)
    return data

if __name__ == "__main__":
    # Ensure correct usage
    if len(sys.argv) != 3:
        print("Usage: python csv_to_json.py input.csv output.json")
        sys.exit(1)
   
    input_csv = sys.argv[1]
    output_json = sys.argv[2]
    # Read CSV data from the input file
   
    with open(input_csv, 'r', encoding='utf-8') as f:
        csv_data_string = f.read()

    trails = csv_to_json(csv_data_string)

    # Write data to the output JSON file
    with open(output_json, 'w', encoding='utf-8') as json_file:
        json.dump(trails, json_file, indent=4)

    print(f"Conversion complete. Data saved to '{output_json}'.")
