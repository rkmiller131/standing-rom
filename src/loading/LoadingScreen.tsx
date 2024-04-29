import '../css/LoadingScreen.css'

export default function LoadingScreen() {
    return (
        <div id="loading-screen">
            <div className="loading-spinner">
                Loading
                <span></span>
            </div>
        </div>
    );
}