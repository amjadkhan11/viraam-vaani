import { prisma } from "@/lib/prisma";
import StudentApprovalTable from "@/components/admin/StudentApprovalTable";

export const dynamic = "force-dynamic";

export default async function StudentApprovalsPage() {
  const students = await prisma.user.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <StudentApprovalTable students={students} />
    </div>
  );
}