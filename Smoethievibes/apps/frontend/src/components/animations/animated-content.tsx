"use client";

import { ReactNode } from "react";
import { ScrollText, AnimatedHeading, AnimatedParagraph } from "./scroll-text";

interface AnimatedContentProps {
  children: ReactNode;
  headingDelay?: number;
  paragraphDelay?: number;
  textDelay?: number;
  staggerDelay?: number;
}

export function AnimatedContent({
  children,
  headingDelay = 0,
  paragraphDelay = 0.2,
  textDelay = 0.1,
  staggerDelay = 0.1,
}: AnimatedContentProps) {
  // Fungsi untuk rekursif memproses children dan menambahkan animasi
  const processChildren = (children: ReactNode, index = 0): ReactNode => {
    if (!children) return children;

    // Handle array of children
    if (Array.isArray(children)) {
      return children.map((child, i) => processChildren(child, index + i));
    }

    // Handle string/number (plain text)
    if (typeof children === "string" || typeof children === "number") {
      return (
        <ScrollText
          key={index}
          delay={textDelay + (index * staggerDelay)}
          className="inline"
        >
          {children}
        </ScrollText>
      );
    }

    // Handle React elements
    if (typeof children === "object" && children !== null && "type" in children) {
      const element = children as React.ReactElement;
      
      // Handle heading elements
      if (element.type && typeof element.type === 'string' && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(element.type)) {
        const level = parseInt(element.type.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6;
        return (
          <AnimatedHeading
            key={index}
            level={level}
            delay={headingDelay + (index * staggerDelay)}
            className={element.props?.className || ""}
          >
            {element.props?.children}
          </AnimatedHeading>
        );
      }

      // Handle paragraph elements
      if (element.type === "p") {
        return (
          <AnimatedParagraph
            key={index}
            delay={paragraphDelay + (index * staggerDelay)}
            className={element.props?.className || ""}
          >
            {element.props?.children}
          </AnimatedParagraph>
        );
      }

      // Handle elements with children - process them recursively
      if (element.props?.children) {
        return {
          ...element,
          props: {
            ...element.props,
            children: processChildren(element.props.children, index),
          },
        };
      }
    }

    return children;
  };

  return <>{processChildren(children)}</>;
}

// Komponen untuk membungkus seluruh halaman
export function AnimatedPage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <AnimatedContent>{children}</AnimatedContent>
    </div>
  );
}