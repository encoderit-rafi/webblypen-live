import React, { useState } from "react";
import { Button } from "../ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Download } from "lucide-react";

export default function AppDownloadButton({
  url,
  ...props
}: React.ComponentProps<typeof Button> & {
  url: string;
}) {
  const [loading, setLoading] = useState(false);
  const handelDownload = async () => {
    try {
      setLoading(true);
      const res = await api.get(url);
      const { url: download_link, file_name } = res.data.data;

      if (download_link) {
        const link = document.createElement("a");
        link.href = download_link;
        link.target = "_blank";
        link.setAttribute("download", file_name || "download.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.error("Download link not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to download file");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      loading={loading}
      onClick={handelDownload}
      {...props}
    >
      <Download />
      {/* Download */}
    </Button>
  );
}
