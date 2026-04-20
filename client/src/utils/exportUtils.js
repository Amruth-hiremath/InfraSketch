import { toPng } from 'html-to-image';

/**
 * Export the React Flow canvas as a high-resolution PNG
 */
export async function exportCanvasAsPNG() {
  const canvasEl = document.querySelector('.react-flow');
  if (!canvasEl) {
    throw new Error('Canvas element not found');
  }

  const dataUrl = await toPng(canvasEl, {
    backgroundColor: '#000000',
    pixelRatio: 2,
    filter: (node) => {
      // Skip minimap and controls from export
      if (node?.classList?.contains('react-flow__minimap')) return false;
      if (node?.classList?.contains('react-flow__controls')) return false;
      if (node?.classList?.contains('react-flow__attribution')) return false;
      return true;
    },
  });

  const link = document.createElement('a');
  link.download = `infrasketch-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Export diagram state as JSON file
 */
export function exportDiagramAsJSON(diagramData) {
  const json = JSON.stringify(diagramData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `infrasketch-${diagramData.name || 'diagram'}-${Date.now()}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import diagram from JSON file
 */
export function importDiagramFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
