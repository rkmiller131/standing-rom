interface PlatformProps {
  platformImage: string;
}

export default function Platform({ platformImage }: PlatformProps) {
  return (
    <div className="selection-visuals-container">
      <div className="visual-display">
        {platformImage && <img src={platformImage} alt="User Selection" />}
      </div>
      <div className="platform-top" />
      <div className="platform-bot" />
    </div>
  );
}