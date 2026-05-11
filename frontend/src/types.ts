export interface ItemData {
  model: string;
  serial: string;
  scanned: boolean;
}

export type AlertType = 'success' | 'error' | 'info';

export interface AlertData {
  id: number;
  title: string;
  message: string;
  type: AlertType;
}
