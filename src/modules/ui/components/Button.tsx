import React, { ReactNode, ElementType, forwardRef } from "react";
import classNames from "classnames";
import { motion, HTMLMotionProps } from "framer-motion";
import Link, { LinkProps } from "next/link";

// DaisyUI variants
const VARIANT_MAP = {
  default: "btn",
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  accent: "btn btn-accent",
  outline: "btn btn-outline",
  ghost: "btn btn-ghost hover:bg-transparent",
};
const SIZE_MAP = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

interface CommonProps {
  children?: ReactNode;
  text?: ReactNode;
  Icon?: ElementType<any>;
  RightIcon?: ElementType<any>;
  variant?: keyof typeof VARIANT_MAP;
  size?: keyof typeof SIZE_MAP;
  block?: boolean;
  noAnimation?: boolean;
  disabled?: boolean;
  className?: string;
}

// motion.button variant
type MotionButtonProps = CommonProps & Omit<HTMLMotionProps<"button">, keyof CommonProps | "href" | "as"> & {
  href?: undefined;
  as?: undefined;
};

// motion.a variant
type MotionAnchorProps = CommonProps & Omit<HTMLMotionProps<"a">, keyof CommonProps | "as"> & {
  href: string;
  as?: undefined;
};

// Next.js Link variant (moderno)
type NextLinkProps = CommonProps & Omit<LinkProps, keyof CommonProps | "href"> & {
  href: string;
  as: typeof Link;
};

type ButtonProps = MotionButtonProps | MotionAnchorProps | NextLinkProps;

export const Button = forwardRef<any, ButtonProps>((props, ref) => {
  const {
    Icon,
    RightIcon,
    text,
    children,
    variant = "default",
    size = "md",
    block = false,
    noAnimation = false,
    disabled = false,
    className,
    ...rest
  } = props;

  const classes = classNames(
    VARIANT_MAP[variant] ?? VARIANT_MAP.default,
    SIZE_MAP[size] ?? SIZE_MAP.md,
    block && "w-full",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  const animProps =
    !noAnimation && !disabled
      ? {
          whileHover: { scale: 1.03, transition: { duration: 0.14 } },
          whileTap: { scale: 0.97, transition: { duration: 0.09 } },
        }
      : {};

  // Next.js Link (moderno)
  if ("as" in props && props.as === Link) {
    const { href, as, ...linkProps } = rest as NextLinkProps;
    // Puede ser motion.span, motion.div, etc. pero nunca motion.a
    return (
      <Link href={href} {...linkProps} tabIndex={disabled ? -1 : undefined}>
        <motion.span
          ref={ref}
          className={classes}
          aria-disabled={disabled}
          {...animProps}
        >
          {Icon && <Icon className="inline-block mr-2" />}
          {children ?? text}
          {RightIcon && <RightIcon className="inline-block ml-2" />}
        </motion.span>
      </Link>
    );
  }

  // Anchor
  if ("href" in props && typeof props.href === "string") {
    const { href, ...anchorProps } = rest as MotionAnchorProps;
    return (
      <motion.a
        ref={ref}
        className={classes}
        href={href}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        {...animProps}
        {...anchorProps}
      >
        {Icon && <Icon className="inline-block mr-2" />}
        {children ?? text}
        {RightIcon && <RightIcon className="inline-block ml-2" />}
      </motion.a>
    );
  }

  // Button
  return (
    <motion.button
      ref={ref}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      {...animProps}
      {...(rest as MotionButtonProps)}
    >
      {Icon && <Icon className="inline-block mr-2" />}
      {children ?? text}
      {RightIcon && <RightIcon className="inline-block ml-2" />}
    </motion.button>
  );
});
Button.displayName = "Button";
