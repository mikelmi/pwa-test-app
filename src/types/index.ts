export interface LocationPosition {
  latitude: number;
  longitude: number;
}

export interface SOSMessage {
  uuid: string;
  location: LocationPosition;
  timestamp: number;
  date?: Date;
  clicked?: boolean;
}
