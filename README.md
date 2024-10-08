# Hiking Trail Finder

## Description

Hiking Trail Finder is a web application designed and built with v0 based on data that was generated from my scripts/ folder.


This project is built using Next.js, leveraging the power of React for the frontend and server-side rendering capabilities. It uses shadcn/ui for styling, Leaflet for map visualization, and Lucide icons for a sleek user interface.

## Features

- Interactive map display of hiking trails
- Filtering options for trail difficulty, bike trails, and fishing spots
- Search functionality to find trails by name
- Responsive design for both desktop and mobile views
- Modal for scheduling hikes with animation effects
- Dynamic marker placement on the map based on filtered results

## Technologies Used

- Next.js
- React
- TypeScript
- shadcn/ui
- Leaflet
- Lucide Icons
- Framer Motion

## Setup and Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/hiking-trail-finder.git
   ```
2. Navigate to the project directory:

   ```
   cd hiking-trail-finder
   ```
3. Install dependencies:

   ```
   npm install
   ```
4. Run the development server:

   ```
   npm run dev
   ```
5. Open your browser and visit `http://localhost:3000`

## Usage

1. Use the search bar to find trails by name
2. Toggle the "Bike Trail" and "Fishing" buttons to filter for these features
3. Select difficulty levels using the difficulty cards
4. Click on map markers or use the "Schedule Hike" button on trail cards to open the scheduling modal
5. View trail details in the sidebar and on the map

## Data Source

The application currently uses a sample subset of trail data. In a production environment, this would be replaced with the full dataset from Boulder county's open data.

## Future Enhancements

- Integrate the full Boulder county trail dataset
- Implement user authentication for personalized experiences
- Add more detailed trail information and photos
- Implement real-time weather data for trails
- Create a mobile app version

## Contributing

Contributions to the Hiking Trail Finder project are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
