const PRIMARY_COLOR = "#FFFFFF";
const SECONDARY_COLOR = "#000000";

const previewFrame = document.getElementById("id-card-preview");
let doc;

window.jsPDF = window.jspdf.jsPDF;

// Fix the font loading function
async function loadBanglaFont() {
    const fontUrl = './fonts/Kalpurush.ttf';
    try {
        const fontResponse = await fetch(fontUrl);
        if (!fontResponse.ok) throw new Error('Font file not found');
        
        const fontBuffer = await fontResponse.arrayBuffer();
        const chunks = [];
        const uint8Array = new Uint8Array(fontBuffer);
        const chunkSize = 8192;
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.slice(i, i + chunkSize);
            chunks.push(String.fromCharCode.apply(null, chunk));
        }
        
        const fontBase64 = btoa(chunks.join(''));
        return fontBase64;
    } catch (error) {
        console.error('Font loading error:', error);
        throw error;
    }
}

const generateIdCard = async (data) => {
    try {
        doc = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [2.125, 3.375],
            putOnlyUsedFonts: true,
            floatPrecision: 16
        });

        // Load and add Unicode Bangla font
        const fontBase64 = await loadBanglaFont();
        doc.addFileToVFS('Kalpurush.ttf', fontBase64);
        doc.addFont('Kalpurush.ttf', 'Kalpurush', 'normal');
        doc.setFont('Kalpurush');

        for (let index = data.length - 1; index >= 0; index--) {
            if (index !== data.length - 1) doc.addPage();

            // White background
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, 2.125, 3.375, 'F');

            // Header (Organization name)
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            const orgName = [
                "পারুলকান্দি নূরানি তালিমুল কুরআন",
                "একাডেমি হাফিজিয়া মাদ্রাসা"
            ];
            
            orgName.forEach((line, idx) => {
                doc.text(line, 1.025, 0.25 + (idx * 0.15), {
                    align: "center",
                    baseline: "middle"
                });
            });

            // Profile Picture Section
            try {
                const profileUri = await getDataUri(
                    `${window.location.origin}/public/images/${data[index].profile}`,
                    400,
                    400
                );
                
                // White circle background
                doc.setFillColor(255, 255, 255);
                doc.circle(1.03, 1.03, 0.41, 'F');
                
                // Profile image
                doc.addImage(
                    profileUri,
                    0.66,
                    0.66,
                    0.7418,
                    0.7418,
                    undefined,
                    'SLOW'
                );
            } catch (error) {
                console.error('Error loading profile image:', error);
            }

            // ID Card Title
            doc.setFillColor("#58595B");
            doc.roundedRect(0.7755, 1.5, 0.5319, 0.1686, 0.05, 0.05, "F");
            doc.setFontSize(8.5);
            doc.setTextColor(PRIMARY_COLOR);
            doc.text("পরিচয় পত্র", 1.03, 1.62, {
                align: "center",
                baseline: "middle"
            });

            // Student Name
            doc.setFontSize(13);
            doc.setTextColor(SECONDARY_COLOR);
            doc.text(data[index].fullname, 1.0255, 1.9, {
                align: "center",
                baseline: "middle"
            });

            // Student Information
            doc.setFontSize(7);
            const studentInfo = [
                { label: "শ্রেণী", value: data[index].stdclass },
                { label: "রোল", value: data[index].roll },
                { label: "পিতা", value: data[index].father },
                { label: "ঠিকানা", value: data[index].address },
                { label: "মোবাইল", value: data[index].mobile }
            ];

            studentInfo.forEach((item, i) => {
                const yPos = 2.13 + (0.13 * i);
                // Label
                doc.text(item.label, 0.3, yPos, {
                    baseline: "middle"
                });
                // Separator
                doc.text(":", 0.6, yPos, {
                    baseline: "middle"
                });
                // Value
                doc.text(item.value, 0.7, yPos, {
                    baseline: "middle"
                });
            });

            // Bottom QR Code
            if (typeof QRCODE_BOTTOM_IMAGE64 !== 'undefined') {
                doc.addImage(QRCODE_BOTTOM_IMAGE64, 0.35, 2.92, 1.456, 0.2137);
            }
        }

        // Set the preview
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        previewFrame.setAttribute("src", pdfUrl);
        
    } catch (error) {
        console.error('Error generating ID card:', error);
        throw error;
    }
};
