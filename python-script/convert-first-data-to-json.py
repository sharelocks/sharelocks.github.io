import pandas as pd
import json


def convert_data():
    # Define the path to your Excel file
    excel_path = 'QxR Torrents.xlsx'

    # Read the Excel file
    df = pd.read_excel(excel_path)

    # Convert the DataFrame to a list of dictionaries
    data = df.to_dict(orient='records')

    # Define the path for the output JSON file
    json_path = '../sharelocks.github.io/QxR_Torrents.json'

    # Write the data to a JSON file with proper indentation
    with open(json_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

    print(f"Data successfully converted to JSON and saved to {json_path}")


convert_data()
