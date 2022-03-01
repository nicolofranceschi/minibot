export default async function dowloadZip(files: any) {
  const response = await fetch('/api/dowload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(files),
  });
  const blob = await response.blob();
  downloadBlob(blob, 'output.zip');
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  link.click();
}
