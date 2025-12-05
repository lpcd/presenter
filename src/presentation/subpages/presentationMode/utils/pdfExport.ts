import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exporte les diapositives en PDF (format présentation 16:9)
 */
export const exportSlidesPDF = async (
  presentationName: string,
  moduleTitle: string,
  totalSlides: number,
  onSlideChange: (index: number) => void
): Promise<void> => {
  try {
    // Format 16:9 en paysage
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4", // 297 x 210 mm en paysage
    });

    let isFirstPage = true;

    // Désactiver temporairement les animations
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      * {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    for (let i = 0; i < totalSlides; i++) {
      // Naviguer vers la slide
      onSlideChange(i);

      // Attendre que la slide soit rendue (augmenté pour être sûr)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Chercher le conteneur de slide
      const slideElement = document.querySelector(".slide-content-container");

      if (!slideElement) continue;

      // Forcer le reflow pour s'assurer que tout est rendu
      void (slideElement as HTMLElement).offsetHeight;

      const canvas = await html2canvas(slideElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        windowWidth: (slideElement as HTMLElement).scrollWidth,
        windowHeight: (slideElement as HTMLElement).scrollHeight,
        width: (slideElement as HTMLElement).scrollWidth,
        height: (slideElement as HTMLElement).scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculer les dimensions pour garder le ratio et remplir la page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      // Centrer l'image
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
    }

    // Restaurer les animations
    document.head.removeChild(styleElement);

    // Télécharger le PDF
    const fileName = `${presentationName}_${moduleTitle}_slides.pdf`
      .replace(/[^a-z0-9_-]/gi, "_")
      .toLowerCase();
    pdf.save(fileName);
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    throw error;
  }
};

/**
 * Exporte le support de cours en PDF (format A4 portrait)
 */
export const exportSupportPDF = async (
  presentationName: string,
  moduleTitle: string
): Promise<void> => {
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

    // Ajouter le titre du module en premier
    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246); // Couleur primary
    const titleLines = pdf.splitTextToSize(moduleTitle, pdfWidth - 2 * margin);
    pdf.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 10 + 10;

    // Désactiver les animations temporairement
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      * {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    // Attendre un peu pour que le style soit appliqué
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Sélectionner toutes les sections
    const sections = document.querySelectorAll(".support-content article");
    if (sections.length === 0) {
      throw new Error("Contenu du support introuvable");
    }

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i] as HTMLElement;

      // Capturer la section avec une meilleure qualité
      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: section.scrollWidth,
        windowHeight: section.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Si l'image ne tient pas sur la page actuelle, créer une nouvelle page
      if (yPosition + imgHeight > pdfHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Si l'image est plus grande que la hauteur d'une page, la découper
      if (imgHeight > pdfHeight - 2 * margin) {
        let remainingHeight = imgHeight;
        let sourceY = 0;

        while (remainingHeight > 0) {
          const availableHeight = pdfHeight - yPosition - margin;
          const sliceHeight = Math.min(availableHeight, remainingHeight);
          const sourceSliceHeight = (sliceHeight / imgWidth) * canvas.width;

          // Créer un canvas temporaire pour la tranche
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
              sourceSliceHeight
            );

            const sliceData = tempCanvas.toDataURL("image/png");
            pdf.addImage(
              sliceData,
              "PNG",
              margin,
              yPosition,
              imgWidth,
              sliceHeight
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

      // Si on approche de la fin de la page et qu'il reste des sections, passer à la suivante
      if (yPosition > pdfHeight - margin - 30 && i < sections.length - 1) {
        pdf.addPage();
        yPosition = margin;
      }
    }

    // Restaurer les animations
    document.head.removeChild(styleElement);

    // Télécharger le PDF
    const fileName = `${presentationName}_${moduleTitle}_support.pdf`
      .replace(/[^a-z0-9_-]/gi, "_")
      .toLowerCase();
    pdf.save(fileName);
  } catch (error) {
    console.error("Erreur lors de l'export PDF du support:", error);
    throw error;
  }
};
