import requests
import json
import sys

def fetch_trail_data(output_json_path):
    # API URL to fetch GeoJSON data
    api_url = "https://maps.bouldercounty.org/arcgis/rest/services/ParksOpenSpace/REC_BoulderAreaTrailheads/MapServer/0/query"
    params = {
        'outFields': '*',
        'where': '1=1',
        'f': 'geojson'
    }

    try:
        # Fetch data from the API
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # Raise an error for bad status codes
        geojson_data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from the API: {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response: {e}")
        sys.exit(1)

    # List to hold the processed trail data
    trails = []

    # Iterate over each feature in the GeoJSON data
    for feature in geojson_data['features']:
        properties = feature.get('properties', {})
        geometry = feature.get('geometry', {})

        # Safely extract values, defaulting to empty strings if None
        def get_stripped_property(prop_dict, key):
            value = prop_dict.get(key)
            if value is not None:
                return str(value).strip()
            else:
                return ''

        trail = {
            'FID': properties.get('OBJECTID'),
            'AccessName': get_stripped_property(properties, 'THNAME'),
            'Address': get_stripped_property(properties, 'ADDRESS'),
            'BikeTrail': get_stripped_property(properties, 'BIKETRAIL'),
            'FISHING': get_stripped_property(properties, 'FISHING'),
            'ADAtrail': get_stripped_property(properties, 'ADA'),
            'Latitude': geometry['coordinates'][1] if geometry and 'coordinates' in geometry else None,
            'Longitude': geometry['coordinates'][0] if geometry and 'coordinates' in geometry else None
        }

        trails.append(trail)

    # Write the list of trails to the output JSON file
    try:
        with open(output_json_path, 'w', encoding='utf-8') as json_file:
            json.dump(trails, json_file, indent=4)
        print(f"Data successfully written to '{output_json_path}'.")
    except IOError as e:
        print(f"Error writing to file '{output_json_path}': {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Ensure correct usage
    if len(sys.argv) != 2:
        print("Usage: python fetch_trail_data.py output.json")
        sys.exit(1)

    output_json = sys.argv[1]
    fetch_trail_data(output_json)
