import '../../../css/GameInstructions.css';
import Button from '../../Button';
import TitleSubtitle from '../TitleSubtitle';

interface GameInstructionsProps {
    clickHandler: () => void;
}
export default function GameInstructions({ clickHandler }: GameInstructionsProps) {
    return (
        <div id="game-instructions-screen">
            <a className="back-dashboard-link" href="https://www.ubiquityvx.com/">
                {'← Back to Dashboard'}
            </a>
            <div className="how-to-play-container">
                <TitleSubtitle
                    className="callout-title h2play-title"
                    accentTitle='Instructions'
                    mainTitle='How to Play'
                />
                <div className="card-carousel">
                    <div className="card" />
                    <div className="card" />
                    <div className="card" />
                </div>
            </div>
            <div className="instruction-footer">
                <ul className="instruction-list">
                    <li>Make sure your head, torso, and extended arms are visible in the frame</li>
                    <li>Have a light source in front of you rather than from behind</li>
                    <li>Simplify your surroundings with minimal objects, people, or pets in the background</li>
                </ul>
                <Button content="Ok" onClick={clickHandler} extraClass='wide-button'/>
            </div>
        </div>
    );
}