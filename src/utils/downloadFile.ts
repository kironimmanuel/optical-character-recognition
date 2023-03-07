export const downloadFile = (data: string, name = "converted.txt") => {
  // Since browsers dont display raw binary data, all octet-stream files will be downloaded
  const blob = new Blob([data], { type: "octet-stream" });

  // Using the global URL built into browser
  const href = URL.createObjectURL(blob);

  // The Object.assign() method copies all enumerable own properties from one or more source objects to a target object. It returns the modified target object.
  // Download, to tell browser to download regardless what it is
  const a = Object.assign(document.createElement("a"), {
    href,
    style: "display:none",
    download: name,
  });

  document.body.appendChild(a);

  a.click();
  // To remove url from memory, otherwise it would persist
  URL.revokeObjectURL(href);
  a.remove();
};
