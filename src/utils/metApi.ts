// Utility functions for interacting with the Metropolitan Museum of Art API

// Type for a painting returned from the Met API
export interface MetPainting {
  objectID: number;
  title: string;
  artistDisplayName: string;
  primaryImage: string;
  objectDate: string;
  department: string;
}

// Get a random painting from the Met API
export async function getRandomPainting(): Promise<MetPainting> {
  // Step 1: Get a random object ID from the paintings department (11 = Paintings)
  const searchUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting&departmentId=11';
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  
  // Get a random object ID from the results
  const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
  const objectId = searchData.objectIDs[randomIndex];
  
  // Step 2: Get the full object details
  const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
  const objectRes = await fetch(objectUrl);
  const objectData = await objectRes.json();
  
  return objectData as MetPainting;
}

// Get multiple random paintings for answer options
export async function getMultiplePaintings(count: number = 4): Promise<MetPainting[]> {
  // To avoid rate limiting, we'll make requests one at a time
  const paintings: MetPainting[] = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const painting = await getRandomPainting();
      // Make sure we don't get duplicates
      if (!paintings.some(p => p.objectID === painting.objectID)) {
        paintings.push(painting);
      } else {
        // If duplicate, try again
        i--;
      }
    } catch (error) {
      console.error('Failed to fetch painting:', error);
      // If we fail, just try again
      i--;
    }
  }
  
  return paintings;
}

// Get a set of quiz options with one correct answer and others as distractors
export async function getQuizOptions(correctPainting: MetPainting, totalOptions: number = 4): Promise<string[]> {
  // First, get some random paintings for distractors
  let distractors: MetPainting[] = [];
  
  while (distractors.length < totalOptions - 1) {
    try {
      const painting = await getRandomPainting();
      if (painting.objectID !== correctPainting.objectID &&
          !distractors.some(p => p.objectID === painting.objectID)) {
        distractors.push(painting);
      }
    } catch (error) {
      console.error('Failed to fetch distractor:', error);
    }
  }
  
  // Combine all options and shuffle
  const options = [
    correctPainting.title,
    ...distractors.map(p => p.title)
  ];
  
  // Shuffle the options
  return shuffleArray(options);
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}