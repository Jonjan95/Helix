type ProgressSubscriber = (progress: number) => void;

let arrivalProgress = 0;
const subscribers = new Set<ProgressSubscriber>();

export function publishArrivalProgress(progress: number) {
  arrivalProgress = Math.min(1, Math.max(0, progress));
  subscribers.forEach((subscriber) => subscriber(arrivalProgress));
}

export function subscribeToArrivalProgress(subscriber: ProgressSubscriber) {
  subscriber(arrivalProgress);
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
}
