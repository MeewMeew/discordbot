interface DurationResult {
  extractedTime?: string;
  durationTime?: number;
  durationTimeInSeconds?: number;
  error?: string;
}

export function calcDuration(inputStr: string): DurationResult {
  const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)/;
  const match = inputStr.match(regex);
  if (match) {
    const inputTimeStr = match[0];
    const inputTime = new Date(inputTimeStr);
    const currentTime = new Date();
    const duration = inputTime.getTime() - currentTime.getTime();
    return {
      extractedTime: inputTimeStr,
      durationTime: duration,
      durationTimeInSeconds: Math.floor(duration / 1000),
    };
  } else {
    return {
      error: "No valid ISO date found in the input string."
    };
  }
}
