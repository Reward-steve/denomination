interface iNotification {
    title: string;
    body: string;
}
export function sendNotification(data: iNotification) {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                const notif = new Notification(data.title, {
                    body: data.body,
                    icon: '/logo.png' //192x192 icon i guess
                });

                notif.onclick = () => {
                    window.location.href = `${window.location.origin}/dashboard/home`;
                }

            } else {
                console.log('Notification permission denied.');
            }
        });
    }
}