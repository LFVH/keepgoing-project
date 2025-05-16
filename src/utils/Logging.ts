export function logNow(message: string): void {
    const currentDate = new Date();
    console.log(`${currentDate.toISOString()} - ${message}`);
}