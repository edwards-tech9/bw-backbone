import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export function generateJobQRData(jobId: string, jobNumber: string): string {
  return JSON.stringify({
    type: 'job',
    id: jobId,
    number: jobNumber,
    timestamp: new Date().toISOString(),
  });
}

export function generateStaffQRData(staffId: string, employeeId: string): string {
  return JSON.stringify({
    type: 'staff',
    id: staffId,
    employeeId: employeeId,
    timestamp: new Date().toISOString(),
  });
}

export function generateEquipmentQRData(equipmentId: string, equipmentName: string): string {
  return JSON.stringify({
    type: 'equipment',
    id: equipmentId,
    name: equipmentName,
    timestamp: new Date().toISOString(),
  });
}

export function parseQRData(qrData: string): { type: string; id: string; [key: string]: any } | null {
  try {
    return JSON.parse(qrData);
  } catch {
    return null;
  }
}
