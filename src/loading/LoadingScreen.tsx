import '../css/LoadingScreen.css'

interface LoadingScreenProps {
    allLoaded: boolean;
}
export default function LoadingScreen({ allLoaded }: LoadingScreenProps) {
    return (
        <div id="loading-screen" className={allLoaded ? 'fade-out' : ''}>
            <div className="loading-spinner">
                Loading
                <span></span>
            </div>
        </div>
    );
}