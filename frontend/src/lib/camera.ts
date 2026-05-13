export const secureContextRequired = () => {
  const hostname = window.location.hostname;
  return window.isSecureContext || hostname === "localhost" || hostname === "127.0.0.1";
};

export function getCameraErrorMessage(error: unknown) {
  if (!(error instanceof DOMException)) {
    return "Unexpected camera error.";
  }

  switch (error.name) {
    case "NotAllowedError":
      return "Camera permission was denied by the user or browser settings.";
    case "NotFoundError":
      return "No camera device was detected on this device.";
    case "NotReadableError":
      return "The camera is already in use by another application.";
    case "SecurityError":
      return "Camera access requires HTTPS or localhost.";
    default:
      return error.message || "Unable to access the camera.";
  }
}

