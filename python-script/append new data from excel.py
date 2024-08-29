import pandas as pd
import json


def update_json_with_xlsx(xlsx_path, json_path, output_json_path):
    # Load the XLSX file
    xlsx_data = pd.read_excel(xlsx_path)

    # Load the JSON file
    with open(json_path, 'r') as file:
        json_data = json.load(file)

    # Extract existing titles and magnet links from the JSON data
    existing_titles = {record['Title'] for record in json_data}
    existing_magnet_links = {record['Magnet Link'] for record in json_data}

    # Prepare to append data that does not exist in JSON
    new_records = []

    # Iterate through the XLSX data and check for duplicates
    for index, row in xlsx_data.iterrows():
        title = row['Title']
        magnet_link = row['Magnet Link']

        # Check if the title or magnet link already exists
        if title not in existing_titles and magnet_link not in existing_magnet_links:
            # If not exists, prepare the new record to add
            new_record = {
                "Title": title,
                "No. Seed": row['Seeders'],
                "No. Leechers": row['Leechers'],
                "Size": row['Size'],
                "Date uploaded": row['Time'],
                "Magnet Link": magnet_link
            }
            new_records.append(new_record)

    # Append new records to the existing JSON data
    json_data.extend(new_records)

    # Write the updated JSON data to a new file
    with open(output_json_path, 'w') as file:
        json.dump(json_data, file, indent=4)

    print(f"{len(new_records)} new records added to the JSON file.")


# Example usage
xlsx_file_path = 'QxR Torrents.xlsx'
json_file_path = '../QxR_Torrents.json'
output_json_path = '../QxR_Torrents.json'

update_json_with_xlsx(xlsx_file_path, json_file_path, output_json_path)
