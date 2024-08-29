![output-onlinepngtools](https://github.com/user-attachments/assets/63897e5e-dc57-4d87-b230-bccfdddd2af5) 
# QxR Torrents Web Application

This project is a web application designed to gather and display all QxR torrents, providing a user-friendly interface for browsing and searching torrent files. The application is built using HTML, CSS, JavaScript, and Python, and is deployed on GitHub Pages.

To see the page go to [sharelocks.github.io](https://sharelocks.github.io/)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Automated Updates](#automated-updates)
- [License](#license)

## Features

- **Search Functionality**: Search for torrents based on title, supporting intelligent search that matches the beginning of each word.
- **Series and Movies Pages**: Separate pages to display series and movies torrents based on specific criteria.
- **Automated Data Update**: The JSON data file containing torrent information is updated every 10 hours using a Python script.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/sharelocks.github.io.git
   cd sharelocks.github.io

2. **Install the necessary Python packages:**
   ```bash
   pip install -r requirements.txt

3. **Run the web application:**
   Open index.html in your preferred web browser to view the site.

## Usage

**Home Page:** Displays all available torrents. You can search for specific torrents using the search bar.
**Movies Page:** Displays torrents that are identified as movies. Torrents with the word "season" in their title are excluded.
**Series Page:** Displays torrents that contain the word "season" in their title.

## Running the Data Update Script

To manually update the JSON data file:

1. **Run the Python script:**
   ```bash
   python update-data.py


2. **Push the updated data to GitHub:**
   ```bash
   git add QxR_Torrents.json
   git commit -m "Update JSON data"
   git push origin main

## Automated Updates
To automate the process of running the update-data.py script and pushing the updates to your GitHub repository every 10 hours, you can use a combination of scheduled tasks and scripts.

**1. Create a Script to Automate the Process:**\
For Windows (Batch Script):\
Create a batch script, update_and_push.bat, with the following content:
```bash
@echo off
cd /d "C:\\path\\to\\your\\project"

:: Run the Python script
python update-data.py

:: Get the current date and time
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b

:: Format the date and time to be used in the commit message
set commitMessage="Automated update - %mydate% at %mytime%"

:: Stage all changes
git add .

:: Commit with the formatted message
git commit -m %commitMessage%

:: Push the changes to the main branch
git push origin main

```
Replace `"C:\\path\\to\\your\\project"` with the actual path to your GitHub repository on your local machine.

For Linux (Shell Script):\
Create a shell script, update_and_push.sh, with the following content:
```bash
#!/bin/bash
cd /path/to/your/project
python3 update-data.py
git add .
git commit -m "Automated update of JSON data"
git push origin main
```
Replace `"/path/to/your/project"` with the actual path to your GitHub repository on your local machine. Ensure the script is executable by running `chmod +x update_and_push.sh`.

**2. Set Up a Scheduled Task to Run the Script Every 10 Hours:**
On Windows:
1. Open Task Scheduler.
2. Click on Create Basic Task.
3. Name the task (e.g., "Update JSON and Push to GitHub").
4. Set the Trigger to "Daily," and configure the Repeat task every option to 10 hours.
5. Set the Action to "Start a program" and browse to the location of update_and_push.bat.
6. Complete the task setup.

On Linux:
1. Open a terminal.
2. Edit your crontab file by running `crontab -e`.
3. Add the following line to run the script every 10 hours:
  ```bash
0 */10 * * * /path/to/update_and_push.sh
```
This will run the script every 10 hours.

## License
This project is licensed under the MIT License.
