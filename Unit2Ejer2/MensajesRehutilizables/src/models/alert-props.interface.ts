export interface AlertProps {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}
