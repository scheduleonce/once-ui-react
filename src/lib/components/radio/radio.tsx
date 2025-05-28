import { FC } from 'react';
import { IOption } from '../../interfaces';

interface RadioProps {
  themeColor?: string;
  name: string;
  checked?: boolean;
  onChange: (option: any) => void;
  option: IOption;
}

export const Radio: FC<RadioProps> = ({ themeColor, name, checked, onChange, option }) => {
  const effectiveThemeColor = themeColor?.toLowerCase() === '#ffffff' ? '#c8c8c8' : themeColor;

  const handleChange = (option: IOption) => {
    onChange(option);
  };

  return (
    <div className="tw-flex tw-flex-col">
      <div className="tw-relative tw-flex tw-items-center">
        <label htmlFor={option.value} className="tw-my-[6px] tw-flex tw-cursor-pointer">
          <div className="tw-relative tw-mr-[10px] tw-size-5">
            <input
              type="radio"
              id={option.value}
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => handleChange(option)}
              className="tw-absolute tw-size-0 tw-opacity-0"
            />
            <span
              className={`tw-relative tw-mt-px tw-inline-block tw-w-5 tw-h-5 tw-rounded-full tw-border tw-border-solid ${
                checked ? 'tw-border-2' : ''
              }`}
              style={{
                borderColor: checked ? effectiveThemeColor : '#C8C8C8',
              }}
            >
              {checked && (
                <span
                  className="tw-absolute tw-left-1/2 tw-top-1/2 tw-ml-[-5px] tw-mt-[-5px] tw-w-[10px] tw-h-[10px] tw-rounded-full"
                  style={{ backgroundColor: effectiveThemeColor }}
                ></span>
              )}
            </span>
          </div>
          {option.avatar && (
            <div className="tw-mr-[9px] tw-max-h-5">
              <img
                aria-hidden={true}
                src={option.avatar}
                width={20}
                height={20}
                alt="Location icon"
                className="tw-mt-px tw-w-5 tw-h-5 tw-min-w-5"
              />
            </div>
          )}
          <div className="tw-text-base tw-text-[16px] tw-leading-[22px]">{option.label}</div>
        </label>
      </div>
    </div>
  );
};

export default Radio;
