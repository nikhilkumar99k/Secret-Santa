// Exported function to shuffle the array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
    // Iterate over the array in reverse order
    for (let i = array.length - 1; i > 0; i--) {
      // Generate Random Index
      const j = Math.floor(Math.random() * (i + 1));
  
      // Swap elements
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  