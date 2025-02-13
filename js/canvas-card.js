class IDCardGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Convert inches to pixels (assuming 300 DPI for print quality)
        const DPI = 300;
        this.width = 2.125 * DPI;  // 2.125 inches = 637.5 pixels
        this.height = 3.375 * DPI; // 3.375 inches = 1012.5 pixels
        
        this.init();
    }

    init() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    async loadFont() {
        const font = new FontFace('Kalpurush', 'url(./fonts/Kalpurush.ttf)');
        await font.load();
        document.fonts.add(font);
    }

    // Helper function to draw rounded rectangle
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    async drawImage(src, x, y, width, height, isCircular = false, isCenterCrop = false) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
                try {
                    if (isCenterCrop) {
                        // Calculate dimensions for center cropping
                        const sourceWidth = img.width;
                        const sourceHeight = img.height;
                        let sourceX = 0;
                        let sourceY = 0;
                        let sizeToUse = 0;

                        // Determine which dimension to use for square crop
                        if (sourceWidth > sourceHeight) {
                            sizeToUse = sourceHeight;
                            sourceX = (sourceWidth - sourceHeight) / 2;
                        } else {
                            sizeToUse = sourceWidth;
                            sourceY = (sourceHeight - sourceWidth) / 4; // Move up to focus on face
                        }

                        if (isCircular) {
                            this.ctx.save();
                            this.ctx.beginPath();
                            this.ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
                            this.ctx.closePath();
                            this.ctx.clip();
                        }

                        // Draw the cropped image
                        this.ctx.drawImage(
                            img,
                            sourceX, sourceY,    // Source X, Y
                            sizeToUse, sizeToUse,// Source Width, Height
                            x, y,                // Destination X, Y
                            width, height        // Destination Width, Height
                        );

                        if (isCircular) {
                            this.ctx.restore();
                        }
                    } else {
                        // Original drawing logic for non-cropped images
                        if (isCircular) {
                            this.ctx.save();
                            this.ctx.beginPath();
                            this.ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
                            this.ctx.closePath();
                            this.ctx.clip();
                        }
                        
                        this.ctx.drawImage(img, x, y, width, height);
                        
                        if (isCircular) {
                            this.ctx.restore();
                        }
                    }
                    resolve();
                } catch (error) {
                    console.error('Error drawing image:', error);
                    reject(error);
                }
            };

            img.onerror = (error) => {
                console.error('Error loading image:', src, error);
                resolve();
            };

            img.src = src;
        });
    }

    async generateCard(data) {
        try {
            await this.loadFont();
            
            // Set white background
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Calculate photo position first (needed for background)
            const photoSize = this.width * 0.35; // 35% of card width
            const photoX = (this.width - photoSize) / 2;
            const photoY = this.height * 0.18;
            const photoBottom = photoY + photoSize - 50; // Bottom of profile image

            // Draw top background image to profile bottom
            if (typeof TOP_BACKGOUND_IMAGE_BASE64 !== 'undefined') {
                await this.drawImage(TOP_BACKGOUND_IMAGE_BASE64, 0, 0, this.width, photoBottom);
            }

            // Organization name (now in white with increased top margin)
            this.ctx.font = 'bold 36px Kalpurush';
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('পারুলকান্দি নূরানি তালিমুল কুরআন', this.width/2, this.height * 0.09); // Increased from 0.06
            this.ctx.fillText('একাডেমি হাফিজিয়া মাদ্রাসা', this.width/2, this.height * 0.14); // Increased from 0.11

            // Profile Picture with error handling
            try {
                const profileUrl = `${window.location.origin}/public/images/${data.profile}`;
                
                // Add white circle background with border
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(this.width/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
                this.ctx.fillStyle = '#fff';
                this.ctx.fill();
                // Add white border
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 20; // 10px border
                this.ctx.stroke();
                this.ctx.restore();
                
                // Added true for center crop
                await this.drawImage(profileUrl, photoX, photoY, photoSize, photoSize, true, true);
            } catch (error) {
                console.error('Profile image error:', error);
            }
            // ID Card Title with rounded corners (centered text in background)
            const titleY = this.height * 0.45;
            const titleWidth = this.width * 0.25;
            const titleHeight = 50;
            const titleX = (this.width - titleWidth) / 2; // Center horizontally
            
            this.ctx.fillStyle = '#58595B';
            this.roundRect(titleX, titleY - 20, titleWidth, titleHeight, 10);

            this.ctx.font = '28px Kalpurush';
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle'; // Center vertically
            this.ctx.fillText('পরিচয় পত্র', this.width/2, titleY + (titleHeight/2) - 15);

            // Student Name (increased size and made bold)
            this.ctx.font = 'bold 40px Kalpurush';  // Increased from 32px to 40px and added bold
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(data.fullname, this.width/2, this.height * 0.55);

            // Student Information with reduced line height
            this.ctx.font = '24px Kalpurush';
            this.ctx.textAlign = 'left';
            const info = [
                { label: 'শ্রেণী', value: data.stdclass },
                { label: 'রোল', value: data.roll },
                { label: 'শিক্ষাবর্ষ', value: data.validupto },
                { label: 'পিতা', value: data.father },
                { label: 'ঠিকানা', value: data.address },
                { label: 'মোবাইল', value: data.mobile }
            ];

            const startY = this.height * 0.62;
            const lineHeight = this.height * 0.042;
            info.forEach((item, i) => {
                const y = startY + (i * lineHeight);
                this.ctx.fillText(item.label, this.width * 0.1, y);
                // Add colon before the value with some spacing
                this.ctx.fillText(`: ${item.value}`, this.width * 0.3, y);
            });

            // Add QR code at the bottom
            if (typeof QRCODE_BOTTOM_IMAGE64 !== 'undefined') {
                const qrHeight = this.height * 0.060;
                await this.drawImage(
                    QRCODE_BOTTOM_IMAGE64, 
                    this.width * 0.1, 
                    this.height - qrHeight - (this.height * 0.05), 
                    this.width * 0.8, 
                    qrHeight
                );
            }

        } catch (error) {
            console.error('Error generating card:', error);
            throw error;
        }
    }

    downloadCard(filename = 'id-card.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    getCardAsBlob() {
        return new Promise(resolve => {
            this.canvas.toBlob(resolve, 'image/png');
        });
    }
} 