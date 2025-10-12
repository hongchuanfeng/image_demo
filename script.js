// 检测当前语言
const currentLang = document.documentElement.lang || 'zh';

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化页面
    showPage('home');
}

function bindEventListeners() {
    // 导航按钮
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            showPage(page);
        });
    });
    
    // 功能卡片
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            const page = this.dataset.page;
            showPage(page);
        });
    });
    
    
    // 图片放大功能
    initializeEnlargeFeature();
    
    // 添加文字功能
    initializeTextFeature();
}

function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    document.getElementById(pageId).classList.add('active');
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
}


// 图片放大功能
function initializeEnlargeFeature() {
    const uploadArea = document.getElementById('enlargeUploadArea');
    const fileInput = document.getElementById('enlargeFileInput');
    const controls = document.getElementById('enlargeControls');
    const processBtn = document.getElementById('enlargeProcess');
    const result = document.getElementById('enlargeResult');
    const canvas = document.getElementById('enlargeCanvas');
    const downloadBtn = document.getElementById('enlargeDownload');
    
    let currentImage = null;
    
    // 上传区域点击事件
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    // 文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    // 处理按钮
    processBtn.addEventListener('click', processImage);
    
    // 下载按钮
    downloadBtn.addEventListener('click', downloadImage);
    
    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert(currentLang === 'zh' ? '请选择图片文件' : 'Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImage = new Image();
            currentImage.onload = () => {
                controls.style.display = 'block';
                uploadArea.style.display = 'none';
            };
            currentImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    function processImage() {
        if (!currentImage) return;
        
        processBtn.disabled = true;
        processBtn.innerHTML = '<span class="loading"></span> ' + (currentLang === 'zh' ? '处理中...' : 'Processing...');
        
        setTimeout(() => {
            const scale = parseInt(document.getElementById('scaleSelect').value);
            const newWidth = currentImage.width * scale;
            const newHeight = currentImage.height * scale;
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(currentImage, 0, 0, newWidth, newHeight);
            
            result.style.display = 'block';
            processBtn.disabled = false;
            processBtn.textContent = currentLang === 'zh' ? '开始放大' : 'Start Enlarging';
        }, 1000);
    }
    
    function downloadImage() {
        if (!canvas.width || !canvas.height) return;
        
        const link = document.createElement('a');
        link.download = 'enlarged_image.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}

// 添加文字功能
function initializeTextFeature() {
    const uploadArea = document.getElementById('textUploadArea');
    const fileInput = document.getElementById('textFileInput');
    const controls = document.getElementById('textControls');
    const canvas = document.getElementById('textCanvas');
    const canvasContainer = document.getElementById('textCanvasContainer');
    const result = document.getElementById('textResult');
    const resultCanvas = document.getElementById('textResultCanvas');
    const processBtn = document.getElementById('textProcess');
    const downloadBtn = document.getElementById('textDownload');
    
    const textInput = document.getElementById('textInput');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const fontColorPicker = document.getElementById('fontColorPicker');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    
    let currentImage = null;
    let textPosition = { x: 0, y: 0 };
    let isPositionSelected = false;
    
    // 上传区域点击事件
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    // 文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    // 字体大小滑块
    fontSizeSlider.addEventListener('input', (e) => {
        fontSizeValue.textContent = e.target.value + 'px';
    });
    
    // 画布点击事件
    canvas.addEventListener('click', (e) => {
        if (!currentImage) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        textPosition.x = (e.clientX - rect.left) * scaleX;
        textPosition.y = (e.clientY - rect.top) * scaleY;
        isPositionSelected = true;
        
        // 在画布上显示位置标记
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
        
        // 绘制位置标记
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(textPosition.x, textPosition.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // 处理按钮
    processBtn.addEventListener('click', processTextImage);
    
    // 下载按钮
    downloadBtn.addEventListener('click', downloadTextImage);
    
    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert(currentLang === 'zh' ? '请选择图片文件' : 'Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImage = new Image();
            currentImage.onload = () => {
                // 计算画布尺寸，保持宽高比
                const maxWidth = 600;
                const maxHeight = 400;
                let { width, height } = currentImage;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(currentImage, 0, 0, width, height);
                
                controls.style.display = 'block';
                canvasContainer.style.display = 'block';
                uploadArea.style.display = 'none';
            };
            currentImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    function processTextImage() {
        if (!currentImage || !textInput.value.trim()) {
            alert(currentLang === 'zh' ? '请输入要添加的文字' : 'Please enter text to add');
            return;
        }
        
        if (!isPositionSelected) {
            alert(currentLang === 'zh' ? '请点击图片选择文字位置' : 'Please click on image to select text position');
            return;
        }
        
        processBtn.disabled = true;
        processBtn.innerHTML = '<span class="loading"></span> ' + (currentLang === 'zh' ? '处理中...' : 'Processing...');
        
        setTimeout(() => {
            const fontSize = parseInt(fontSizeSlider.value);
            const fontColor = fontColorPicker.value;
            const fontFamily = fontFamilySelect.value;
            const text = textInput.value;
            
            // 设置结果画布尺寸
            resultCanvas.width = currentImage.width;
            resultCanvas.height = currentImage.height;
            
            const ctx = resultCanvas.getContext('2d');
            
            // 绘制原图
            ctx.drawImage(currentImage, 0, 0);
            
            // 计算文字位置（相对于原图）
            const scaleX = currentImage.width / canvas.width;
            const scaleY = currentImage.height / canvas.height;
            const textX = textPosition.x * scaleX;
            const textY = textPosition.y * scaleY;
            
            // 设置文字样式
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.fillStyle = fontColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 添加文字阴影效果
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // 绘制文字
            ctx.fillText(text, textX, textY);
            
            result.style.display = 'block';
            processBtn.disabled = false;
            processBtn.textContent = currentLang === 'zh' ? '添加文字' : 'Add Text';
        }, 1000);
    }
    
    function downloadTextImage() {
        if (!resultCanvas.width || !resultCanvas.height) return;
        
        const link = document.createElement('a');
        link.download = 'text_image.png';
        link.href = resultCanvas.toDataURL();
        link.click();
    }
}
