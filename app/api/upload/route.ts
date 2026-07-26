import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file found" },
        { status: 400 }
      );
    }

    
    const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "study-materials",
       
            public_id: `${originalNameWithoutExt}_${Date.now()}.pdf`, 
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Stream Error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    // Hum ensure kar rahe hain ki return me hamesha secure_url hi jaye
    return NextResponse.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD ROUTE ERROR:", error);
    return NextResponse.json(
      { error: "Upload Failed", details: String(error) },
      { status: 500 }
    );
  }
}