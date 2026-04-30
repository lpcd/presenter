import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { appConfig } from "../../../../config";

const getCodeBlockExportStyles = (scopeSelector: string): string => {
  if (appConfig.pdf.codeBlockRenderMode === "scale") {
    return `
      ${scopeSelector} pre,
      ${scopeSelector} code,
      ${scopeSelector} .hljs {
        white-space: pre !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
      }

      ${scopeSelector} pre {
        width: max-content !important;
        max-width: none !important;
      }
    `;
  }

  return `
    ${scopeSelector} pre,
    ${scopeSelector} code,
    ${scopeSelector} .hljs {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-wrap: anywhere !important;
    }
  `;
};

export const exportSlidesPDF = async (
  presentationName: string,
  moduleTitle: string,
  totalSlides: number,
  onSlideChange: (index: number) => void,
): Promise<void> => {
  let styleElement: HTMLStyleElement | null = null;
  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    let isFirstPage = true;

    styleElement = document.createElement("style");
    styleElement.innerHTML = `
      * {
        animation: none !important;
        transition: none !important;
      }

      .slide-content-container,
      .slide-content-container * {
        overflow: visible !important;
      }

      ${getCodeBlockExportStyles(".slide-content-container")}
    `;
    document.head.appendChild(styleElement);

    for (let i = 0; i < totalSlides; i++) {
      onSlideChange(i);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const slideElement = document.querySelector(".slide-content-container");

      if (!slideElement) continue;

      void (slideElement as HTMLElement).offsetHeight;

      const canvas = await html2canvas(slideElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        windowWidth: Math.max(
          (slideElement as HTMLElement).scrollWidth,
          (slideElement as HTMLElement).clientWidth,
        ),
        windowHeight: Math.max(
          (slideElement as HTMLElement).scrollHeight,
          (slideElement as HTMLElement).clientHeight,
        ),
        width: Math.max(
          (slideElement as HTMLElement).scrollWidth,
          (slideElement as HTMLElement).clientWidth,
        ),
        height: Math.max(
          (slideElement as HTMLElement).scrollHeight,
          (slideElement as HTMLElement).clientHeight,
        ),
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
    }
    const fileName = `${presentationName}_${moduleTitle}_slides.pdf`
      .replace(/[^a-z0-9_-]/gi, "_")
      .toLowerCase();
    pdf.save(fileName);
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    throw error;
  } finally {
    if (styleElement && document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }
  }
};

export const exportSupportPDF = async (
  presentationName: string,
  moduleTitle: string,
): Promise<void> => {
  let styleElement: HTMLStyleElement | null = null;
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246);
    const titleLines = pdf.splitTextToSize(moduleTitle, pdfWidth - 2 * margin);
    pdf.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 10 + 10;

    styleElement = document.createElement("style");
    styleElement.innerHTML = `
      * {
        animation: none !important;
        transition: none !important;
      }

      .support-content,
      .support-content * {
        overflow: visible !important;
      }

      ${getCodeBlockExportStyles(".support-content")}
    `;
    document.head.appendChild(styleElement);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const sections = document.querySelectorAll(".support-content article");
    if (sections.length === 0) {
      throw new Error("Contenu du support introuvable");
    }

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i] as HTMLElement;

      const sectionWidth = Math.max(section.scrollWidth, section.clientWidth);
      const sectionHeight = Math.max(
        section.scrollHeight,
        section.clientHeight,
      );

      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: sectionWidth,
        windowHeight: sectionHeight,
        width: sectionWidth,
        height: sectionHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yPosition + imgHeight > pdfHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      if (imgHeight > pdfHeight - 2 * margin) {
        let remainingHeight = imgHeight;
        let sourceY = 0;

        while (remainingHeight > 0) {
          const availableHeight = pdfHeight - yPosition - margin;
          const sliceHeight = Math.min(availableHeight, remainingHeight);
          const sourceSliceHeight = (sliceHeight / imgWidth) * canvas.width;

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceSliceHeight;
          const tempCtx = tempCanvas.getContext("2d");

          if (tempCtx) {
            tempCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              sourceSliceHeight,
              0,
              0,
              canvas.width,
              sourceSliceHeight,
            );

            const sliceData = tempCanvas.toDataURL("image/png");
            pdf.addImage(
              sliceData,
              "PNG",
              margin,
              yPosition,
              imgWidth,
              sliceHeight,
            );
          }

          remainingHeight -= sliceHeight;
          sourceY += sourceSliceHeight;

          if (remainingHeight > 0) {
            pdf.addPage();
            yPosition = margin;
          } else {
            yPosition += sliceHeight + 5;
          }
        }
      } else {
        pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 5;
      }

      if (yPosition > pdfHeight - margin - 30 && i < sections.length - 1) {
        pdf.addPage();
        yPosition = margin;
      }
    }
    const fileName = `${presentationName}_${moduleTitle}_support.pdf`
      .replace(/[^a-z0-9_-]/gi, "_")
      .toLowerCase();
    pdf.save(fileName);
  } catch (error) {
    console.error("Erreur lors de l'export PDF du support:", error);
    throw error;
  } finally {
    if (styleElement && document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }
  }
};
