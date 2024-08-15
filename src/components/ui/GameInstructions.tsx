import '../../css/GameInstructions.css';
import Button from '../Button';

interface GameInstructionsProps {
    clickHandler: () => void;
}
export default function GameInstructions({ clickHandler }: GameInstructionsProps) {
    return (
        <div id="game-instructions-screen">
            <div className="instructions-container">
                <ul>
                    <li>Enable sound in your browser</li>
                    <li>Make sure you have enough space</li>
                    <li>Make sure you have a web camera hooked up to your PC</li>
                    <li>more setup/how to play instructions...</li>
                </ul>
            </div>
            <Button content="I'm Ready!" onClick={clickHandler} extraClass="callout-button consent-button"/>
        </div>
    );
}