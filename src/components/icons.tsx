import type { SVGProps } from "react";

export function UcwLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="My Order Logo"
      {...props}
    >
      <path
        d="M50,4C24.58,4,4,24.58,4,50s20.58,46,46,46s46-20.58,46-46S75.42,4,50,4z M50,90 C27.91,90,10,72.09,10,50S27.91,10,50,10s40,17.91,40,40S72.09,90,50,90z"
        fill="currentColor"
      />
      <path
        d="M62.5,50c0,11.05-8.95,20-20,20H30V30h12.5C53.55,30,62.5,38.95,62.5,50z M56.5,50 c0-7.73-6.27-14-14-14H36v28h6.5C49.98,64,56.5,57.73,56.5,50z"
        fill="currentColor"
      />
      <path 
        d="M65 30 C 65 20, 80 20, 80 30"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
