export function downloadFile (fileName:string, download_link:string){
  const link = document.createElement("a");
      link.href = download_link;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
}