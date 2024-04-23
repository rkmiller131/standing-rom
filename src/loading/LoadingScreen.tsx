import '../css/LoadingScreen.css'

interface LoadingScreenProps {
    holisticLoaded: boolean;

}
export default function LoadingScreen({ holisticLoaded }: LoadingScreenProps) {
    return (
        <div id="loading-screen" className={holisticLoaded ? 'fade-out' : ''}>
            <div className="loading-spinner">
                Loading
                <span></span>
            </div>
        </div>
    );
}