import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. 📊 APPROVED STUDENTS COUNT
    // Schema ke mutabik 'User' me role nahi hai, bas status 'APPROVED' hona chahiye
    const approvedStudentsCount = await prisma.user.count({
      where: {
        status: "APPROVED",
      },
    });

    // 2. 📢 NOTIFICATIONS COUNT (Dynamic)
    const notificationCount = await prisma.notification.count().catch(() => 0);

    // 3. 📚 STUDY MATERIALS COUNT (Fixed Model Name)
    // Aapke schema me naam 'studyMaterial' hai, isliye ye fix kiya:
    const materialCount = await prisma.studyMaterial.count().catch(() => 0);

    // 4. 📑 LIVE APPROVED STUDENTS ROSTER
    const liveStudentsList = await prisma.user.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
        name: true,
        className: true,
        email: true,
        phone: true,
      },
      orderBy: {
        createdAt: "desc", // Naya approved student sabse upar dikhega
      },
    });

    // Dashboard UI format ke mutabik data mapping
    const formattedRoster = liveStudentsList.map((student, index) => ({
      id: student.id,
      // User model me roll number nahi hai, toh hum temporary roll number sequence bana rahe hain
      rollNo: `VV-${1000 + (liveStudentsList.length - index)}`, 
      name: student.name,
      email: student.email,
      phone: student.phone,
      className: student.className || "Class 10",
      activeExam: "Viraam Vaani Test", 
      status: "Online / Active", 
    }));

    return NextResponse.json(
      {
        metrics: {
          totalStudents: approvedStudentsCount, // 👈 Jasmin ke approve hote hi ye automatic 2 ho jayega
          totalNotifications: notificationCount, // Dynamic data from Notification table
          studyResources: materialCount,         // Dynamic data from StudyMaterial table
        },
        roster: formattedRoster, // 👈 Dono student sath me table me dikhenge
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Metrics DB Sync Error:", error);
    return NextResponse.json(
      { error: "Failed to connect with Viraam Vaani DB stream" },
      { status: 500 }
    );
  }
}