/**
 * Determines the type of the user's device based on the window's innerWidth.
 * @returns {'Desktop' | 'Tablet' | 'Mobile'} The type of the user's device.
 */
export default function checkUserDevice(): 'Desktop' | 'Tablet' | 'Mobile' {
    let device: 'Desktop' | 'Tablet' | 'Mobile';
    
    if (window.innerWidth > 820) {
        device = 'Desktop';
    } else if (window.innerWidth <= 820 && window.innerWidth > 500) {
        device = 'Tablet';
    } else {
        device = 'Mobile';
    }
    
    return device;
}
