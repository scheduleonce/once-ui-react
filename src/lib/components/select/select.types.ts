export interface IOption {
  value: string;
  label: string;
  avatar?: {
    width: number;
    height: number;
    src: string;
  };
  disable?: boolean;
}
