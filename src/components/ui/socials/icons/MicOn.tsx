interface MicOnProps {
  color: string;
  width: number;
}

export default function MicOn({ color, width }: MicOnProps) {
  return (
    <svg width={`${width}px`} height={`${width}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}