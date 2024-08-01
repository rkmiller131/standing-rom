interface TitleSubtitleProps {
  className?: string;
  accentTitle: string;
  mainTitle: string;
}

export default function TitleSubtitle({ className, accentTitle, mainTitle }: TitleSubtitleProps) {
  return (
    <div id="title-subtitle-container" className={className}>
      <h3 className="ui-h3">{accentTitle}</h3>
      <h2 className="ui-h2">{mainTitle}</h2>
    </div>
  );
}