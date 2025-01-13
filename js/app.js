const PRIMARY_COLOR = "#FFFFFF";
const SECOUNDARY_COLOR = "#000000";

const previewFrame = document.getElementById("id-card-preview");
let doc;

window.jsPDF = window.jspdf.jsPDF;
// Landscape export, 2×4 inches
const generateIdCard = async (data) => {
  doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [2.125, 3.375],
  });

  doc.addFileToVFS("SutonnyMJRegular", FONT_BANGLA_SUTONNY_MJ_REGULAR);
  doc.addFont("SutonnyMJRegular", "SutonnyMJ Regular", "normal");
  doc.addFileToVFS("SutonnyMJ-Bold", FONT_BANGLA_SUTONNY_MJ_BOLD);
  doc.addFont("SutonnyMJ-Bold", "SutonnyMJ Bold", "bold");

  for (let index = data.length - 1; index >= 0; index--) {
    if (index !== data.length - 1) doc.addPage();

    doc.addImage(TOP_BACKGOUND_IMAGE_BASE64, 0, 0, 2.125, 0);

    // Company or Organization name
    doc.setFont("SutonnyMJ Bold", "bold");
    doc.setFontSize(11);
    doc.setTextColor(PRIMARY_COLOR);
    doc.text(
      "cviæjKvw›` b~ivbx Zvwjgyj KyiAvb\nGKv‡Wwg nvwdwRqv gv`«vmv",
      1.025,
      0.32,
      null,
      null,
      "center"
    );
    // Set Profile Picture
    doc.setFillColor(PRIMARY_COLOR);
    doc.circle(1.03, 1.03, 0.41, "F");
    const profileUri = await getDataUri(
      `${window.origin}/public/images/${data[index].profile}`,
      400,
      400
    );
    const imgWidth = 0.7418;
    const imgHeight = 0.7418;
    const circleX = 0.66;
    const circleY = 0.66;

    doc.addImage(
      profileUri,
      circleX,
      circleY,
      imgWidth,
      imgHeight,
      undefined,
      "SLOW"
    );

    // Intro Text
    doc.setFillColor("#58595B");
    doc.roundedRect(0.7755, 1.5, 0.5319, 0.1686, 0.05, 0.05, "F");
    doc.setFont("SutonnyMJ Regular", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(PRIMARY_COLOR);
    doc.text("cwiPq cÎ", 1.03, 1.62, null, null, "center");

    // Person Name and information
    doc.setFont("SutonnyMJ Bold", "bold");
    doc.setFontSize(13);
    doc.setTextColor(SECOUNDARY_COLOR);
    doc.text(data[index].fullname, 1.0255, 1.9, null, null, "center");

    // UID Persion Information
    doc.setFont("SutonnyMJ Regular", "normal");
    doc.setFontSize(7);

    const employeeData = [
      {
        label: "‡k«wY",
        value: data[index].stdclass,
      },
      {
        label: "‡ivj",
        value: data[index].roll,
      },
      {
        label: "wk¶vel©",
        value: data[index].validupto,
      },
      {
        label: "wcZv",
        value: data[index].father,
      },
      {
        label: "wVKvbv",
        value: data[index].address,
      },
      {
        label: "‡gvevBj",
        value: data[index].mobile,
      },
    ];

    employeeData.forEach((item, i) => {
      doc.text(item.label, 0.3, 2.13 + 0.13 * i, null, null, "left");
      doc.text(":", 0.6, 2.13 + 0.13 * i, null, null, "left");
      doc.text(item.value, 0.7, 2.13 + 0.13 * i, null, null, "left");
    });

    // QRCODE BOTTOM IMAGE
    doc.addImage(QRCODE_BOTTOM_IMAGE64, 0.35, 2.92, 1.456, 0.2137);
  }

  previewFrame.setAttribute("src", URL.createObjectURL(doc.output("blob")));
};
