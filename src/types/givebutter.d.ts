import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "givebutter-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          id?: string;
        },
        HTMLElement
      >;
      "givebutter-giving-form": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          campaign?: string;
          "show-goal-bar"?: string;
          "max-width"?: string;
        },
        HTMLElement
      >;
    }
  }
}