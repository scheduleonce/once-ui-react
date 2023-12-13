import { CSSProperties, ComponentPropsWithRef, FC, ReactNode, forwardRef } from 'react';
import styles from './button.module.scss';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** The content of the button */
  children: ReactNode;
  /** A color scheme to use for the button, defaults to `#006bb1` */
  themeColor?: string;
  /** The style of the button, defaults to `primary` */
  variant?: 'primary' | 'secondary';
  /** The size of the button, defaults to `small` */
  size?: 'small' | 'medium' | 'large';
  /** Shape of the corners, defaults to `rounded` */
  shape?: 'rounded' | 'squared';
}

/** Primary UI component for user interaction */
export const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ComponentPropsWithRef<'button'> & ButtonProps>(
  (
    {
      themeColor = '',
      variant = 'primary',
      size = 'small',
      shape = 'rounded',
      children,
      className = '',
      style = {},
      ...rest
    }: ButtonProps,
    ref,
  ) => {
    let buttonStyleObj: CSSProperties = {};
    if (themeColor) {
      const theme = luminance(themeColor);
      themeColor = ColorsService.convert3HexTo6(themeColor);
      if (theme === 'dark' || theme === 'light') {
        const backgroundColor = variant === 'primary' ? themeColor : '#ffffff';
        const color =
          variant === 'primary'
            ? theme === 'dark'
              ? '#ffffff'
              : '#333333'
            : theme === 'light'
            ? '#333333'
            : themeColor;
        const borderColor = themeColor === '#ffffff' ? '#c8c8c8' : themeColor;
        buttonStyleObj = {
          backgroundColor: backgroundColor,
          color: color,
          outlineColor: borderColor,
          borderColor: borderColor,
        };
      }
    }
    const buttonClasses = [styles.button, styles[variant], styles[size], styles[shape], className]
      .filter(Boolean)
      .join(' ');
    return (
      <>
        <button ref={ref} style={{ ...buttonStyleObj, ...style }} className={`${buttonClasses}`} {...rest}>
          {children}
        </button>
      </>
    );
  },
);

Button.displayName = 'Button';
