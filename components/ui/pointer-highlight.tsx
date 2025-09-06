"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";

export function PointerHighlight({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
}: {
  children: React.ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  containerClassName?: string;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const [isWebkit, setIsWebkit] = useState(true);

  useEffect(() => {
    // Detect webkit browsers
    const isWebkitBrowser = /webkit/i.test(navigator.userAgent);
    setIsWebkit(isWebkitBrowser);

    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      const parentRect = textRef.current.offsetParent?.getBoundingClientRect();

      if (parentRect) {
        setDimensions({
          width: rect.width,
          height: rect.height,
          left: rect.left - parentRect.left,
          top: rect.top - parentRect.top,
        });
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        const parentRect =
          textRef.current.offsetParent?.getBoundingClientRect();

        if (parentRect) {
          setDimensions({
            width: rect.width,
            height: rect.height,
            left: rect.left - parentRect.left,
            top: rect.top - parentRect.top,
          });
        }
      }
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        resizeObserver.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <>
      <span ref={textRef} className={containerClassName}>
        {children}
      </span>

      {/* Portal the highlight to the parent container - only on webkit browsers */}
      {isWebkit && dimensions.width > 0 && dimensions.height > 0 && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            left: dimensions.left,
            top: dimensions.top,
            width: dimensions.width,
            height: dimensions.height,
            zIndex: -1,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className={cn(
              "absolute inset-0 border border-neutral-800 dark:border-neutral-200",
              rectangleClassName
            )}
            initial={{
              width: 0,
              height: 0,
            }}
            whileInView={{
              width: dimensions.width,
              height: dimensions.height,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.7,
            }}
          />
          <motion.div
            className="pointer-events-none absolute"
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: 1,
              x: dimensions.width + 4,
              y: dimensions.height + 4,
            }}
            style={{
              rotate: -90,
            }}
            transition={{
              opacity: { duration: 0.1, ease: "easeInOut" },
              duration: 1,
              ease: "easeInOut",
              delay: 0.7,
            }}
          >
            <Pointer
              className={cn("h-5 w-5 text-blue-500", pointerClassName)}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Fallback for non-webkit browsers - simple highlight without animation */}
      {!isWebkit && dimensions.width > 0 && dimensions.height > 0 && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: dimensions.left,
            top: dimensions.top,
            width: dimensions.width,
            height: dimensions.height,
            zIndex: -1,
          }}
        >
          <div
            className={cn(
              "absolute inset-0 border border-neutral-800 dark:border-neutral-200",
              rectangleClassName
            )}
          />
          <div
            className="pointer-events-none absolute"
            style={{
              transform: `translate(${dimensions.width + 4}px, ${dimensions.height + 4}px) rotate(-90deg)`,
            }}
          >
            <Pointer
              className={cn("h-5 w-5 text-blue-500", pointerClassName)}
            />
          </div>
        </div>
      )}
    </>
  );
}

const Pointer = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
    </svg>
  );
};
