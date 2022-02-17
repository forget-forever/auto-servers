declare global {
  declare namespace Request {
    type HiveAndSolarRes = {
      value: string;
      highlightValue: string[];
    } [];
  }
}